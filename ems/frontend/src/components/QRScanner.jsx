import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

// onScan receives the decoded QR text (the qr_code_token).
export default function QRScanner({ onScan }) {
  const containerId = "qr-reader";
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => onScan(decodedText),
        () => {} // ignore per-frame decode failures
      )
      .catch((err) => console.error("Camera start failed:", err));

    return () => {
      scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={containerId} style={{ width: "100%", maxWidth: 400 }} />;
}
