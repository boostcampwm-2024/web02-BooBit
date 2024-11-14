const generateCandleData = (
  existingData: {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[]
) => {
  const lastDate = existingData[existingData.length - 1].date;
  const newData = [];

  for (let i = 1; i <= 5; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i); // 날짜를 하루씩 증가시킴

    const open = Math.floor(Math.random() * 150) + 100;
    const high = open + Math.floor(Math.random() * 20) + 5;
    const low = open - Math.floor(Math.random() * 20) - 5;
    const close = open + Math.floor(Math.random() * (high - low)) - (high - low) / 2;
    const volume = Math.floor(Math.random() * 2000) + 1000;

    newData.push({ date, open, high, low, close, volume });
  }

  return [...existingData, ...newData]; // 기존 데이터에 새 데이터를 추가하여 반환
};
export default generateCandleData;
