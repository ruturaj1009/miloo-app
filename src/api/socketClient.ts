import { SignalingPayload } from '../types/calling.types';
import { ChatMessage } from '../types/chat.types';
import { USE_MOCK_API, WS_BASE_URL } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MessageHandler = (message: ChatMessage) => void;
type SignalingHandler = (payload: SignalingPayload) => void;
type TypingHandler = (data: { matchId: string; userId: string; isTyping: boolean }) => void;

class SocketClient {
  private messageListeners: Set<MessageHandler> = new Set();
  private signalingListeners: Set<SignalingHandler> = new Set();
  private typingListeners: Set<TypingHandler> = new Set();
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectTimer: any = null;

  async connect() {
    if (USE_MOCK_API) {
      this.isConnected = true;
      console.log('[WebSocket/STOMP] Mock mode active: Connected to virtual broker');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('@auth_token');
      console.log(`[WebSocket/STOMP] Connecting to live broker: ${WS_BASE_URL}`);

      this.ws = new WebSocket(WS_BASE_URL);

      this.ws.onopen = () => {
        console.log('[WebSocket] Underlying TCP connection opened. Sending STOMP CONNECT frame...');
        const connectFrame = [
          'CONNECT',
          'accept-version:1.2',
          'host:localhost',
          token ? `Authorization:Bearer ${token}` : '',
          '\n',
        ].filter(Boolean).join('\n') + '\0';

        this.ws?.send(connectFrame);
      };

      this.ws.onmessage = (event) => {
        const raw = event.data as string;
        this.handleIncomingStomp(raw);
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket] Error:', err);
      };

      this.ws.onclose = () => {
        console.log('[WebSocket] Connection closed. Attempting reconnect in 5s...');
        this.isConnected = false;
        this.reconnectTimer = setTimeout(() => this.connect(), 5000);
      };
    } catch (e) {
      console.warn('[WebSocket] Connect error:', e);
    }
  }

  private handleIncomingStomp(data: string) {
    if (data.startsWith('CONNECTED')) {
      this.isConnected = true;
      console.log('[WebSocket/STOMP] STOMP session established! Subscribing to user queues...');
      this.sendStompSubscribe('/user/queue/messages', 'sub-messages');
      this.sendStompSubscribe('/user/queue/signaling', 'sub-signaling');
      this.sendStompSubscribe('/user/queue/typing', 'sub-typing');
      this.sendStompSubscribe('/user/queue/matches', 'sub-matches');
      return;
    }

    if (data.startsWith('MESSAGE')) {
      const bodyIndex = data.indexOf('\n\n');
      if (bodyIndex !== -1) {
        const body = data.slice(bodyIndex + 2).replace(/\0$/, '');
        try {
          const parsed = JSON.parse(body);
          if (data.includes('destination:/user/queue/messages')) {
            this.messageListeners.forEach((fn) => fn(parsed));
          } else if (data.includes('destination:/user/queue/signaling')) {
            this.signalingListeners.forEach((fn) => fn(parsed));
          } else if (data.includes('destination:/user/queue/typing')) {
            this.typingListeners.forEach((fn) => fn(parsed));
          }
        } catch (e) {
          console.warn('[WebSocket/STOMP] Could not parse frame body:', e);
        }
      }
    }
  }

  private sendStompSubscribe(destination: string, id: string) {
    const frame = `SUBSCRIBE\nid:${id}\ndestination:${destination}\n\n\0`;
    this.ws?.send(frame);
  }

  disconnect() {
    this.isConnected = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    console.log('[WebSocket/STOMP] Disconnected');
  }

  subscribeToMessages(handler: MessageHandler) {
    this.messageListeners.add(handler);
    return () => this.messageListeners.delete(handler);
  }

  subscribeToSignaling(handler: SignalingHandler) {
    this.signalingListeners.add(handler);
    return () => this.signalingListeners.delete(handler);
  }

  subscribeToTyping(handler: TypingHandler) {
    this.typingListeners.add(handler);
    return () => this.typingListeners.delete(handler);
  }

  sendSignaling(payload: SignalingPayload) {
    console.log('[Signaling OUT]', payload);
    if (USE_MOCK_API || !this.ws || !this.isConnected) {
      setTimeout(() => {
        this.signalingListeners.forEach((fn) => fn(payload));
      }, 100);
      return;
    }

    const frame = `SEND\ndestination:/app/call.signal\ncontent-type:application/json\n\n${JSON.stringify(payload)}\0`;
    this.ws.send(frame);
  }

  sendTypingStatus(matchId: string, isTyping: boolean) {
    console.log(`[Typing] Match: ${matchId}, isTyping: ${isTyping}`);
    if (USE_MOCK_API || !this.ws || !this.isConnected) return;

    const frame = `SEND\ndestination:/app/chat.typing\ncontent-type:application/json\n\n${JSON.stringify({ matchId, isTyping })}\0`;
    this.ws.send(frame);
  }

  simulateIncomingMessage(msg: ChatMessage) {
    this.messageListeners.forEach((fn) => fn(msg));
  }
}

export const socketClient = new SocketClient();
