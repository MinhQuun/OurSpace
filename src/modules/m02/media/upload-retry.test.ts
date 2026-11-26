import { createHash, randomBytes } from "node:crypto";
import sharp from "sharp";
import { expect, test, vi } from "vitest";
import type { createDatabase } from "../../../server/database.server";
import type { PrivateStorage } from "../../../server/private-storage.server";
import { MediaUploadService } from "./upload.server";

vi.mock("server-only", () => ({}));

const uploadId = "10000000-0000-4000-8000-000000000001";
const mediaId = "10000000-0000-4000-8000-000000000002";

test.each([true, false])("a duplicate after validation only permits a concurrently completed retry: %s", async (completed) => {
  const bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: "red" } }).png().toBuffer();
  const status = {
    id: uploadId,
    mime_type: "image/png",
    byte_size: String(bytes.length),
    sha256: createHash("sha256").update(bytes).digest("hex"),
    media_id: null,
    reused: false,
    separate: false,
    cancelled_at: null,
  };
  const query = vi.fn()
    .mockResolvedValueOnce({ rows: [status] })
    .mockResolvedValueOnce({ rows: [status] })
    .mockResolvedValueOnce({ rows: [{ id: mediaId }] })
    .mockResolvedValueOnce({ rows: [{ ...status, media_id: completed ? mediaId : null }] })
    .mockResolvedValueOnce({ rows: [{ id: mediaId }] });
  const write = vi.fn();
  const service = new MediaUploadService(
    { query } as unknown as ReturnType<typeof createDatabase>,
    { write } as unknown as PrivateStorage,
    { maxBytes: 1_000, maxPixels: 100, timeoutSeconds: 5 },
  );
  const result = service.upload(randomBytes(32).toString("base64url"), uploadId, bytes);
  if (completed) {
    await expect(result).resolves.toEqual({ mediaId });
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("finalize_media_upload"), expect.any(Array));
  } else {
    await expect(result).rejects.toMatchObject({ reason: "conflict" });
    expect(query).toHaveBeenCalledTimes(4);
  }
  expect(write).not.toHaveBeenCalled();
});
