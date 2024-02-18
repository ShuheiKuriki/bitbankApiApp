const roundToSignificantDigits = (
  num: number,
  significantDigits: number
): number => {
  if (num === 0) return 0;
  const int_len = String(Math.round(num)).length;
  const multiplier = Math.pow(
    10,
    Math.max(significantDigits, int_len) -
      Math.floor(Math.log10(Math.abs(num))) -
      1
  );
  return Math.round(num * multiplier) / multiplier;
};

export const convertNaNAndInf = (
  value: number | string,
  digit: number,
  pre: string = "",
  post: string = ""
) => {
  value = roundToSignificantDigits(Number(value), digit);
  return isNaN(value) || !isFinite(value) ? "-" : pre + String(value) + post;
};
