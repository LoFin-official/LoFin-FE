// utils/api.ts
import { backendUrl } from '@/config/config';
import axios from 'axios';

export async function getChatMessages() {
  const response = await axios.get('/api/messages');
  return response.data;
}

export async function sendChatMessage(message: { text: string; type: 'sent' | 'received' }) {
  const response = await axios.post('/api/messages', message);
  return response.data;
}

export const uploadEmoji = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${backendUrl}/emoticon/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload emoji');
  }
  const result = await response.json();
  return result;
};
