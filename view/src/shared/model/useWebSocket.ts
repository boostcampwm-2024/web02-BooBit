import { useEffect, useState } from 'react';
import { WebSocketMessage } from '../types/socket/WebSocketMessageType';

const useWebSocket = (url: string, handleMessage: (message: WebSocketMessage) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onopen = () => {
      console.log('웹소켓 연결 완료');
      const initMessage = {
        event: 'CANDLE_CHART_INIT',
        timeScale: '1sec', // 원하는 시간 단위로 변경 가능
      };
      ws.send(JSON.stringify(initMessage));
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      handleMessage(receivedData); // Pass the message to the parent component or handler directly
    };

    return () => {
      ws.close();
    };
  }, [url, handleMessage]);

  // WebSocket에 메시지 보내기
  const sendMessage = (msg: string) => {
    if (socket) {
      socket.send(msg);
    }
  };

  return { sendMessage };
};

export default useWebSocket;
