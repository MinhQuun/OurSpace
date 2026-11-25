import { createHash } from "node:crypto";
import sharp from "sharp";
import { expect, test } from "vitest";
import { validateImage, InvalidMediaError } from "./validate-image";
const limits = { maxBytes: 100_000, maxPixels: 10_000, timeoutSeconds: 5 };
for (const format of ["jpeg", "png", "webp"] as const) {
  test(`validates actual ${format} bytes and rejects corruption and forged MIME`, async () => {
    const bytes = await sharp({ create: { width: 32, height: 24, channels: 3, background: "red" } })
      .toFormat(format).toBuffer();
    const result = await validateImage(bytes, `image/${format}`, limits);
    expect(result).toMatchObject({ width: 32, height: 24, frames: 1, byteSize: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex") });
    expect(result.bytes).toEqual(bytes);
    expect(result.bytes).not.toBe(bytes);
    await expect(validateImage(bytes, "text/html", limits)).rejects.toThrow(InvalidMediaError);
    await expect(validateImage(bytes.subarray(0,Math.floor(bytes.length/2)), `image/${format}`, limits)).rejects.toThrow(InvalidMediaError);
    await expect(validateImage(bytes, `image/${format}`, {...limits,maxPixels:100})).rejects.toThrow(InvalidMediaError);
    await expect(validateImage(bytes, `image/${format}`, {...limits,maxBytes:bytes.length-1})).rejects.toThrow(InvalidMediaError);
  });
}
test("rejects unsupported or spoofed payloads and invalid configuration", async () => {
  for (const bytes of [Buffer.alloc(0), Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
    Buffer.from([137,80,78,71,13,10,26,10]), Buffer.from('RIFF0000WEBPgarbage')]) {
    await expect(validateImage(bytes, "image/png", limits)).rejects.toThrow(InvalidMediaError);
  }
  const bytes = await sharp({ create: { width: 1,height: 1,channels: 3,background: "red" } }).png().toBuffer();
  for (const maxPixels of [0,-1,NaN,Infinity,1.5])
    await expect(validateImage(bytes,"image/png",{...limits,maxPixels})).rejects.toThrow(InvalidMediaError);
});
