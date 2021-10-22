import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import PeerPrepLogo from '../common-components/PeerPrepLogo';

const chatSocket = io('http://localhost:8082/', {
  //forceNew: true,
  transports: ['websocket', 'polling', 'flashsocket'],
});

const CustomChip = ({ message }) => {
  return (
    <div className="custom-chip">
      <span className="chip-msg"> {message} </span>
    </div>
  );
};

const InterviewPage = () => {
  const [question, setQuestion] = useState('This is a sample question....');
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
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
      const ref = document.getElementById('chat-box');
      ref.scrollTo(0, ref.scrollHeight);
    });
  }, []);

  const handleSend = () => {
    if (currMessage !== '') {
      chatSocket.emit('newMessage', {
        sessionId,
        payload: {
          sender: 'Ashley',
          msg: currMessage,
        },
      });
      setCurrMessage('');
    }
  };

  return (
    <div className="interview-page">
      <PeerPrepLogo />
      <div className="interview-container">
        <div className="collab-container">
          <div className="code-editor-container">
            <span className="interview-pg-title"> Editor </span>
            <div className="code-editor"></div>
          </div>
          <div className="chat-question-container">
            <div className="question-container">
              <span className="interview-pg-title"> Question </span>
              <span> {question} </span>
            </div>
            <div className="chat-container">
              <span className="interview-pg-title"> Chat </span>
              <div className="chat">
                <div id="chat-box">
                  {messages.map((data, key) => (
                    <div
                      key={key}
                      className={
                        data.sender === 'Ashley'
                          ? 'chat-bubble-right'
                          : 'chat-bubble-left'
                      }
                    >
                      <Typography variant="caption" color="textSecondary">
                        {data.sender}
                      </Typography>
                      <CustomChip message={data.msg} />
                    </div>
                  ))}
                </div>
                <div className="chat-text-field">
                  <TextField
                    fullWidth
                    value={currMessage}
                    type="text"
                    name="message"
                    placeholder=" Enter Message!"
                    onChange={(e) => setCurrMessage(e.target.value)}
                    onKeyUp={(e) => (e.key === 'Enter' ? handleSend() : null)}
                  />
                  <Button onClick={handleSend} variant="outlined">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="interview-submit-container">
        <Button
          onClick={handleSend}
          variant="outlined"
          style={{
            position: 'absolute',
            right: '10%',
            backgroundColor: 'white',
          }}
        >
          Submit answer
        </Button>
      </div>
    </div>
  );
};

export default InterviewPage;
