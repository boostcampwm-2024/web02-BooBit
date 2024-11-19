import { useEffect, useState } from 'react';
import { WebSocketMessage } from '../types/socket/WebSocketMessageType';

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<WebSocketMessage | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log('웹소켓 연결 완료');
      // WebSocket 연결 후 CANDLE_CHART_INIT 요청 보내기 (예: "1min" timeScale)
      const initMessage = {
        event: 'CANDLE_CHART_INIT',
        timeScale: '1day', // 원하는 시간 단위로 변경 가능
      };
      ws.send(JSON.stringify(initMessage));
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setMessage(receivedData); // 서버에서 받은 데이터를 상태에 저장
    };

    // WebSocket 연결 종료 시
    return () => {
      ws.close();
    };
  }, [url]);

  // WebSocket에 메시지 보내기
  const sendMessage = (msg: string) => {
    if (socket) {
      socket.send(msg);
    }
  };

  return { message, sendMessage };
};

export default useWebSocket;
