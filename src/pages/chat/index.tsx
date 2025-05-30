import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Emoji {
  _id: string;
  imageUrl: string;
  createdAt: string;
}

const Index = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/emoticon')
      .then((res) => res.json())
      .then((data) => setEmojis(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>이모티콘 목록</h1>
      <button onClick={() => navigate('/emoji/create')}>이모티콘 생성</button>
      <ul>
        {emojis.map((emoji) => (
          <li key={emoji._id}>
            <img src={emoji.imageUrl} alt='emoji' width={50} />
            <span>{new Date(emoji.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
