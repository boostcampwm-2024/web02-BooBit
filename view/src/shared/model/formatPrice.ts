const formatPrice = (price: string | number) => {
  const value = typeof price === 'number' ? price.toString() : price;
  const [intPart, decimalPart] = value.split('.');
  return Number(intPart).toLocaleString() + (decimalPart !== undefined ? `.${decimalPart}` : '');
};

export default formatPrice;
