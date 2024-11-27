import { getEthBlockHeight } from "@/firebase/functions";

export default async function handler(req, res) {
  const response = await fetch("https://api.blockcypher.com/v1/eth/main");
  if (!response.ok) {
    return await getEthBlockHeight();
  }
  const json = await response.json();
  const height = json?.height;
  res.status(200).json({ height });
}
