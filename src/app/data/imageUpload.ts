/**
 * Shared image-file handler for admin/owner uploads. localStorage caps each
 * origin at ~5 MB total, so a single raw multi-MB photo can torch the whole
 * store. Every upload should run through this:
 *
 *   1. Accept type + size guard (rejects > 5 MB before we even read it).
 *   2. FileReader → base64 source.
 *   3. <canvas> downscale to maxWidth, re-encode JPEG at quality.
 *   4. Fall back to the raw data URL if canvas / decode fails.
 *
 * Output: a data URL string suitable for setting on { image, banner, avatar }
 * fields and persisting through usePersistentState.
 */

export interface ReadImageOptions {
  /** Cap on output width in CSS pixels. Default 1600 (banner-grade). */
  maxWidth?: number;
  /** JPEG quality 0–1. Default 0.85 — invisible diff for photos. */
  quality?: number;
  /** Hard ceiling on the raw file before we even read it. Default 5 MB. */
  maxFileBytes?: number;
}

export type ReadImageResult =
  | { ok: true;  dataUrl: string; downscaled: boolean; sourceBytes: number; outputBytes: number }
  | { ok: false; error: string };

const ACCEPTED_RE = /^image\/(jpeg|png|webp|gif)$/;

export function readImageFile(file: File, opts: ReadImageOptions = {}): Promise<ReadImageResult> {
  const maxWidth = opts.maxWidth ?? 1600;
  const quality  = opts.quality  ?? 0.85;
  const maxFileBytes = opts.maxFileBytes ?? 5 * 1024 * 1024;

  return new Promise((resolve) => {
    if (!ACCEPTED_RE.test(file.type)) {
      resolve({ ok: false, error: "รองรับเฉพาะ JPEG / PNG / WebP / GIF" });
      return;
    }
    if (file.size > maxFileBytes) {
      resolve({ ok: false, error: `ไฟล์ใหญ่เกิน ${Math.round(maxFileBytes / 1024 / 1024)}MB` });
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => resolve({ ok: false, error: "อ่านไฟล์ไม่สำเร็จ" });
    reader.onload = () => {
      const sourceDataUrl = reader.result as string;
      const sourceBytes = sourceDataUrl.length;

      const img = new Image();
      img.onerror = () => resolve({ ok: true, dataUrl: sourceDataUrl, downscaled: false, sourceBytes, outputBytes: sourceBytes });
      img.onload = () => {
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ ok: true, dataUrl: sourceDataUrl, downscaled: false, sourceBytes, outputBytes: sourceBytes });
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL("image/jpeg", quality);
        const downscaled = out.length < sourceDataUrl.length;
        resolve({
          ok: true,
          dataUrl: downscaled ? out : sourceDataUrl,
          downscaled,
          sourceBytes,
          outputBytes: downscaled ? out.length : sourceBytes,
        });
      };
      img.src = sourceDataUrl;
    };
    reader.readAsDataURL(file);
  });
}
