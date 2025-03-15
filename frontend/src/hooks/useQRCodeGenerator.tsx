import { saveAs } from "file-saver";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { useState } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";

const useQRCodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (content: string): Promise<string> => {
    // Cria um elemento div temporário no DOM
    const qrCodeElement = document.createElement("div");
    document.body.appendChild(qrCodeElement);

    // Renderiza o QR code dentro do elemento
    ReactDOM.render(
      <QRCode value={content} size={256} level="H" />,
      qrCodeElement
    );

    // Converte o elemento em uma imagem PNG
    const dataUrl = await toPng(qrCodeElement);

    // Remove o elemento temporário do DOM
    document.body.removeChild(qrCodeElement);

    return dataUrl;
  };

  const generateAndDownloadZip = async (amount: number, prefix: string) => {
    setIsGenerating(true);

    const zip = new JSZip();
    const folder = zip.folder("bandejas");

    for (let i = 0; i < amount; i++) {
      const uuid = uuidv4();
      const content = `${prefix}-${uuid}`;
      const qrCodeUrl = await generateQRCode(content);

      // Converte a URL da imagem em um Blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();

      folder?.file(`bandeja-${i + 1}.png`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "bandejas.zip");

    setIsGenerating(false);
  };

  return { generateAndDownloadZip, isGenerating };
};

export default useQRCodeGenerator;
