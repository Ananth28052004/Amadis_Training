export const calculateShowPrice = (
  basePrice: number,
  showDate: string,
  showTime: string
) => {
  let price = basePrice;

  const date = new Date(showDate);

  const day = date.getDay();

  // Friday
  if (day === 5) {
    price += 50;
  }

  // Saturday
  if (day === 6) {
    price += 100;
  }

  // Sunday
  if (day === 0) {
    price += 100;
  }

  // Evening show
  const hour = Number(showTime.split(":")[0]);

  if (hour >= 18) {
    price += 50;
  }

  return price;
};