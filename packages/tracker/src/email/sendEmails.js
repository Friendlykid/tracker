import sgMail from "@sendgrid/mail";
import { db } from "../config/firebase.js";

export const mailToUsers = async (address, coll, property = "emails") => {
  const docSnap = await db.collection(coll).doc(address).get();
  await sendEmails(docSnap.data()[property]);
};

export const sendEmails = async (emails = []) => {
  if (emails.length === 0) return;
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const response = await sgMail.sendMultiple({
      from: "cryptotracker65@gmail.com",
      to: emails,
      subject: "Crypto Tracker Alert",
      templateId: process.env.SENDGRID_TEMPLATE_ID,
    });
    return response;
  } catch (e) {
    console.error("Sending emails failed\n", e);
    return;
  }
};
