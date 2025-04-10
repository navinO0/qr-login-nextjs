"use client"
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const joinRoom = () => {
    if (roomId) {
      socket.emit('join_room', roomId);
    }
  };

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message && roomId) {
      socket.emit('message', { roomId, message });
      setMessages((prev) => [...prev, { sender: 'You', message }]);
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Room Chat App</h1>

      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <button onClick={joinRoom}>Join Room</button>

      <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender || 'Server'}:</strong> {msg.message}
          </p>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
