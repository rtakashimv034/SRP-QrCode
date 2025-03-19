import mailjet from "node-mailjet";

export const mailjetClient = mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY! // Sua Secret Key do Mailjet
);
