import { saveAs } from "file-saver";
import { toJpeg, toPng, toSvg } from "html-to-image";
import JSZip from "jszip";
import { useState } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { v4 as uuidv4 } from "uuid";

export type FormatTypesProps = "png" | "svg" | "jpeg";

type QRCodeProps = {
  format: FormatTypesProps;
  amount: number;
  prefix: string;
  fileName: string;
  folderName: string;
  content?: string;
};

const useQRCodeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async (
    content: string,
    format: FormatTypesProps
  ): Promise<string> => {
    // Cria um elemento div temporário no DOM
    const qrCodeElement = document.createElement("div");
    document.body.appendChild(qrCodeElement);

    // Renderiza o QR code dentro do elemento
    ReactDOM.render(
      <QRCode value={content} size={256} level="H" />,
      qrCodeElement
    );

    // Converte o elemento em uma imagem
    let dataUrl;

    switch (format) {
      case "png":
        dataUrl = await toPng(qrCodeElement);
        break;
      case "jpeg":
        dataUrl = await toJpeg(qrCodeElement);
        break;
      case "svg":
        dataUrl = await toSvg(qrCodeElement);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Remove o elemento temporário do DOM
    document.body.removeChild(qrCodeElement);

    if (!dataUrl) {
      throw new Error("Failed to generate QR code image.");
    }

    return typeof dataUrl === "string" ? dataUrl : "";
  };

  const generateAndDownloadZip = async ({
    amount,
    fileName,
    folderName,
    format,
    prefix,
    content,
  }: QRCodeProps) => {
    setIsGenerating(true);

    const zip = new JSZip();
    const folder = zip.folder(folderName);

    for (let i = 0; i < amount; i++) {
      const subContent = content ? content : uuidv4();
      const rawContent = `${prefix}-${subContent}`;
      const qrCodeUrl = await generateQRCode(rawContent, format);

      // Converte a URL da imagem em um Blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();

      folder?.file(
        `${fileName}-${
          content ? content : `${i + 1}-${subContent.slice(0, 8)}`
        }.${format}`,
        blob
      );
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, fileName);

    setIsGenerating(false);
  };

  return { generateAndDownloadZip, isGenerating };
};

export default useQRCodeGenerator;
