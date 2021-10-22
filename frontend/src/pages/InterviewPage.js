import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const chatSocket = io('http://localhost:8082/', {
  //forceNew: true,
  transports: ['websocket', 'polling', 'flashsocket'],
});

const InterviewPage = () => {
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState('Hi');
  const [sessionId, setSessionId] = useState('11');

  useEffect(() => {
    chatSocket.on('connect', () =>
      setMessages((oldMessages) => [
        ...oldMessages,
        { sender: 'System', msg: 'You are connected!' },
      ])
    );
    chatSocket.on(sessionId, (message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
  }, []);

  const handleSend = () => {
    if (sendMessage !== '') {
      chatSocket.emit('newMessage', {
        sessionId,
        payload: {
          sender: 'Ashley',
          msg: sendMessage,
        },
      });
      setSendMessage(sendMessage + 'hi');
    }
  };
  return (
    <div>
      <h1>This page will contain the InterviewPage.</h1>
      {messages.map((item) => (
        <h1>{item.msg}</h1>
      ))}
      <div>length is {messages.length}</div>
      <div
        style={{ height: '50px', width: '50px', backgroundColor: 'grey' }}
        onClick={() => handleSend()}
      >
        {sendMessage}
      </div>
    </div>
  );
};

export default InterviewPage;
