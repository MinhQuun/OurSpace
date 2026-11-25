import { createHash } from "node:crypto";
import sharp from "sharp";

export class InvalidMediaError extends Error {
  constructor() { super("Invalid or unsupported media"); }
}
export type ImageLimits = { maxBytes: number; maxPixels: number; timeoutSeconds: number };

/** Server-side validation only; never trust a filename or declared MIME alone.
 * Limits are mandatory deployment configuration, not approved business quotas.
 */
export async function validateImage(input: Uint8Array, declaredMime: string, limits: ImageLimits) {
  try {
    if (![limits.maxBytes, limits.maxPixels, limits.timeoutSeconds].every(
      (n) => Number.isSafeInteger(n) && n > 0,
    ) || input.byteLength === 0 || input.byteLength > limits.maxBytes) throw new Error();
    const bytes = Buffer.from(input);
    const format = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? "png"
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? "jpeg"
      : bytes.toString("ascii",0,4) === "RIFF" && bytes.toString("ascii",8,12) === "WEBP" ? "webp" : null;
    if (!format || declaredMime !== `image/${format}`) throw new Error();
    const decoder = sharp(bytes, { failOn: "warning", limitInputPixels: limits.maxPixels, animated: true })
      .timeout({ seconds: limits.timeoutSeconds });
    const metadata = await decoder.metadata();
    if (metadata.format !== format || !metadata.width || !metadata.height ||
        metadata.width * metadata.height > limits.maxPixels) throw new Error();
    // Force full decoding, including all animation frames. Metadata alone can
    // accept a file whose image data is truncated or corrupt.
    await decoder.stats();
    return {
      bytes, mimeType: `image/${format}`, byteSize: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      width: metadata.width, height: metadata.pageHeight ?? metadata.height,
      frames: metadata.pages ?? 1,
    };
  } catch { throw new InvalidMediaError(); }
}
