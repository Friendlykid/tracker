export const delay = async (wait) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
};
