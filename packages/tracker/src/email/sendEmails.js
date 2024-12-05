import sgMail from "@sendgrid/mail";
import { db } from "../config/firebase.js";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 10 * 60 });

export const mailToUsers = async (address, coll, property = "emails") => {
  const docSnap = await db.collection(coll).doc(address).get();
  await sendEmails(docSnap.data()[property]);
};

export const sendEmails = async (emails = []) => {
  const validEmails = emails?.filter(Boolean);
  if (validEmails.length === 0 || !emails) return;
  const emailsToSend = validEmails.filter((email) => !cache.has(email));
  if (emailsToSend.length === 0) return;
  cache.mset(emailsToSend.map((email) => ({ key: email, value: email })));
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const response = await sgMail.sendMultiple({
      from: "cryptotracker65@gmail.com",
      to: emailsToSend,
      subject: "Crypto Tracker Alert",
      templateId: process.env.SENDGRID_TEMPLATE_ID,
    });
    return response;
  } catch (e) {
    console.error("Sending emails failed\n", e);
    return;
  }
};
