import sgMail from "@sendgrid/mail";

export const sendEmails = async (emails = []) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const response = await sgMail.sendMultiple({
    from: "cryptotracker65@gmail.com",
    to: emails,
    subject: "Crypto Tracker Alert",
    templateId: process.env.SENDGRID_TEMPLATE_ID,
  });
  return response;
};
