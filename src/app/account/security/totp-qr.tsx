"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

export default function TotpQr({ uri }: { uri: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    const target = canvas.current;
    if (target) {
      QRCode.toCanvas(target, uri, { width: 256, margin: 4, errorCorrectionLevel: "M" })
        .catch(() => { if (active) setFailed(true); });
    }
    return () => {
      active = false;
      if (target) target.getContext("2d")?.clearRect(0, 0, target.width, target.height);
    };
  }, [uri]);
  return <div>
    <p>Quét mã QR bằng ứng dụng xác thực, hoặc nhập khóa bên dưới.</p>
    <canvas ref={canvas} role="img" aria-label="Mã QR thiết lập TOTP"
      data-testid="totp-qr" style={{ maxWidth: "100%", height: "auto" }} />
    {failed && <p role="status">Không thể tạo QR. Hãy dùng khóa nhập tay bên dưới.</p>}
  </div>;
}
