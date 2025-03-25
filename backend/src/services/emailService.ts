import { mailjetClient } from "../lib/mailjet";

type EmailOptions = {
  to: string; // E-mail do destinatário
  destName: string; // E-mail do destinatário
  subject: string; // Assunto do e-mail
  text: string; // Corpo do e-mail (texto simples)
  html?: string; // Corpo do e-mail (HTML)
};

export async function sendEmail(options: EmailOptions) {
  try {
    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "srpqrcode@gmail.com", // E-mail do remetente
            Name: "SRP QRCode", // Nome do remetente
          },
          To: [
            {
              Email: options.to, // E-mail do destinatário
              Name: options.destName, // Nome do destinatário
            },
          ],
          Subject: options.subject, // Assunto do e-mail
          TextPart: options.text, // Corpo do e-mail (texto simples)
          HTMLPart: options.html || options.text, // Corpo do e-mail (HTML)
        },
      ],
    });

    const response = await request;
    return response.body;
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }
}
