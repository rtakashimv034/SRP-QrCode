import { useRef } from "react";

export function useDownloadQRCode() {
  const svgRefs = useRef<{ [key: string]: SVGSVGElement | null }>({});
  const downloadQRCode = (id: string) => {
    const qrCodeElement = svgRefs.current[id];

    if (qrCodeElement) {
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 256;
        canvas.height = 256;

        ctx!.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngUrl;
        link.download = `qrcode-${id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  return {downloadQRCode, svgRefs};
}
