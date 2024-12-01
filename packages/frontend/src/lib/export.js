export const saveJSON = (json) => {
  const fileData = JSON.stringify(json);
  const blob = new Blob([fileData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "transactions.json";
  link.href = url;
  link.click();
};
