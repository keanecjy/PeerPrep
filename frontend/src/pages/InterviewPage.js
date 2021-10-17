import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const chatSocket = io('https://localhost/8082', {
  path: '/',
  forceNew: true,
});

const InterviewPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    chatSocket.on('connect', () =>
      setMessages((oldMessages) => [
        ...oldMessages,
        { sender: 'System', msg: 'You are connected!' },
      ])
    );
    // chatSocket.on('11', (message) => {
    //   setMessages((oldMessages) => [...oldMessages, message]);
    //   const msgContainer = document.getElementById('chat-message-container');
    // });
  }, []);

  return (
    <div>
      <h1>This page will contain the InterviewPage.</h1>
      {messages.map((item) => {
        <div>{item.msg}</div>;
      })}
    </div>
  );
};

export default InterviewPage;
