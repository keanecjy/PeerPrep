import React, { useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { Grid } from '@material-ui/core';
import { UserContext } from '../context/UserContext';
//import { Editor } from './EditorSection';
import { toast } from 'react-toastify';
import { randomQuestion } from '../services/interview';
import parse from 'html-react-parser';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
import CodeMirror from 'codemirror';
import {Editor, EditorChangeCancellable, EditorChangeLinkedList} from "codemirror";


// chat client socket
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
  const [code, setCode] = useState(`console.log('hello world');`);
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
  const [sessionId, setSessionId] = useState('11');
  const { user } = useContext(UserContext);
  const [codeEditor, setCodeEditor] = useState(null);

  // editor client socket
  const editorSocket = io('http://localhost:8083');

// code editor hook
useEffect(() => {
  const editor = CodeMirror.fromTextArea(
    document.getElementById('codeEditor'),
    {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'javascript',
    }
  );
  setCodeEditor(editor);
  
  editorSocket.on('CODE_CHANGED', (code) => {
    const cursor = editor.getCursor();
    editor.setValue(code);
    editor.setCursor(cursor);
  });
  editorSocket.on('connect', () => {
    console.log('connect');
    editorSocket.emit('CONNECTED_TO_ROOM', {
      sessionId: sessionId,
      userId: user.id,
    });
  });
  editorSocket.on('disconnect', () => {
    console.log('client disconnect');
    editorSocket.emit('DISCONNECT_FROM_ROOM', {
      sessionId: sessionId,
      userId: user.id,
    });
  });

  //Codemirror
  editor.on('change', (instance, changes) => {
    console.log(changes);
    const { origin } = changes;
    // if (origin === '+input' || origin === '+delete' || origin === 'cut') {
    if (origin !== 'setValue') {
      editorSocket.emit('CODE_CHANGED', {
        sessionId,
        code: instance.getValue(),
      });
    }
  });
  editor.on('cursorActivity', (instance) => {
    console.log(instance.cursorCoords());
  });

  //leetcodeQns hook
  randomQuestion('easy', 'javascript')
    .then((res) => {
      const leetcodeQn = res.data;
      editor?.getDoc().setValue(leetcodeQn.code || '');
      setQuestion(leetcodeQn.content || '');
    })
    .catch((error) => toast.error(error.message));
}, []);

  //chat hook
  useEffect(() => {
    chatSocket.on('connect', () =>
      setMessages((oldMessages) => [
        ...oldMessages,
        { id: '0', sender: 'System', msg: 'You are connected!' },
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
          id: user.id,
          sender: user.name,
          msg: currMessage,
        },
      });
      setCurrMessage('');
    }
  };

  return (
    <div className="interview-page">
      <Grid item className="interview-container">
        <Grid
          container
          spacing={5}
          className="collab-editor-container"
          justifyContent="space-around"
          alignItems="stretch"
        >
          <Grid item xs={12} md={6} className="code-editor-container">
            <span className="interview-pg-title"> Editor </span>
            <div className="code-editor">
              <textarea id="codeEditor" />
            </div>
          </Grid>
          <Grid item xs={12} md={6} className="chat-question-container">
            <Grid
              container
              direction="column"
              justifyContent="space-between"
              alignItems="stretch"
              style={{ height: '100%' }}
            >
              <Grid item className="question-container">
                <span className="interview-pg-title"> Question123 </span>
                <div className="question-container-content">
                  {parse(question)}
                </div>
              </Grid>
              <Grid item className="chat-container">
                <span className="interview-pg-title"> Chat </span>
                <div className="chat">
                  <div id="chat-box">
                    {messages.map((data, key) => (
                      <div
                        key={key}
                        className={
                          data.id === user.id
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
              </Grid>
            </Grid>
          </Grid>
          <Grid item container xs={12} justifyContent="flex-end">
            <Button
              onClick={handleSend}
              variant="outlined"
              style={{
                backgroundColor: 'white',
              }}
            >
              Submit answer
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default InterviewPage;
