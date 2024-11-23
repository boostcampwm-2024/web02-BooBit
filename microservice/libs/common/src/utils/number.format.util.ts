export function formatFixedPoint(value: number, paddingLength = 15): string {
  const [integerPart, decimalPart = ''] = value.toString().split('.');
  const paddedInteger = integerPart.padStart(paddingLength, '0');
  return decimalPart ? `${paddedInteger}.${decimalPart}` : paddedInteger;
}
