const generateCandleData = (baseDate: Date, interval: number, count: number) => {
  let previousClose = Math.floor(Math.random() * 100 + 100); // 초기 값 설정

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(baseDate.getTime() + index * interval);

    // 현재 캔들 데이터 생성
    const open = previousClose; // 이전 종가를 다음 캔들의 시가로 설정
    const high = open + Math.floor(Math.random() * 10); // 시가보다 높음
    const low = open - Math.floor(Math.random() * 10); // 시가보다 낮음
    const close = Math.floor(Math.random() * (high - low) + low); // 고가와 저가 사이
    const volume = Math.floor(Math.random() * 1000 + 500); // 랜덤 거래량

    // 다음 캔들을 위해 종가 업데이트
    previousClose = close;

    return { date, open, high, low, close, volume };
  });
};

export default generateCandleData;
