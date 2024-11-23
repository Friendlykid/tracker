export const percChange = (a, b) => {
  let percent;
  if (b !== 0) {
    if (a !== 0) {
      percent = ((b - a) / a) * 100.0;
    } else {
      percent = b * 100.0;
    }
  } else {
    percent = -a * 100.0;
  }

  return Math.round((percent + Number.EPSILON) * 100) / 100;
};
