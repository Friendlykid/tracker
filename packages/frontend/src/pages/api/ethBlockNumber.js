//TODO: replace with etherscan api
export default async function handler(req, res) {
  const response = await fetch("https://api.blockcypher.com/v1/eth/main");
  if (!response.ok) {
    res.status(500);
  }
  const json = await response.json();
  const height = json?.height;
  console.log(json);
  res.status(200).json({ height });
}
