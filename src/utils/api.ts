// /utils/api.ts
import axios from 'axios';

export async function getChatMessages() {
  const response = await axios.get('/api/messages');
  return response.data;
}

export async function sendChatMessage(message: {
  text: string;
  type: 'sent' | 'received';
}) {
  const response = await axios.post('/api/messages', message);
  return response.data;
}
