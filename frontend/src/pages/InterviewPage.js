import React, { useState, useEffect, useContext } from 'react';
import StopWatch from '../components/StopWatch';
import { io } from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { UserContext } from '../context/UserContext';
import parse from 'html-react-parser';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/keymap/sublime';
import '@convergencelabs/codemirror-collab-ext/css/codemirror-collab-ext.css';
import CodeMirror from 'codemirror';
import * as CodeMirrorCollabExt from '@convergencelabs/codemirror-collab-ext';
import { useParams } from 'react-router';

const CustomChip = ({ message }) => {
  return (
    <div className="custom-chip">
      <span className="chip-msg"> {message} </span>
    </div>
  );
};

const InterviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSlug, setQuestionSlug] = useState('');
  const [hints, setHints] = useState([]);
  const [question, setQuestion] = useState('This is a sample question....');
  const [initialCode, setInitialCode] = useState('');
  const [time, setTime] = useState(0); // To send to backend to get the total time taken
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
  const { user } = useContext(UserContext);
  const { sessionId } = useParams('sessionId');
  const [sessionParams, setSessionParams] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const [editorSocket, setEditorSocket] = useState(null);

  useEffect(() => {
    const sessionDetails = sessionStorage.getItem(sessionId);
    if (sessionDetails) {
      const data = JSON.parse(sessionDetails);
      setSessionParams({
        difficulty: data.difficulty || 'medium',
        language: data.language || 'javascript',
      });
    }
  }, [sessionId]);

  useEffect(() => {
    // editor client socket
    const editorSocket = io('http://localhost:8083');
    setEditorSocket(editorSocket);

    return () => editorSocket.disconnect();
  }, []);

  useEffect(() => {
    if (sessionParams && editorSocket) {
      editorSocket.on('connect', () => {
        console.log('connect');
        editorSocket.emit('CONNECTED_TO_ROOM', {
          sessionId: sessionId,
          userId: user.id,
          difficulty: sessionParams.difficulty,
          language: sessionParams.language,
          time: Math.floor(new Date().getTime() / 1000).toString(),
        });
      });

      editorSocket.on('disconnect', () => {
        console.log('client disconnect');
        editorSocket.emit('DISCONNECT_FROM_ROOM', {
          sessionId: sessionId,
          userId: user.id,
        });
      });

      let timer = setInterval(() => {
        setTime((oldTime) => oldTime + 1);
      }, 1000);

      editorSocket.once('ROOM:CONNECTION', ({ code, question, time }) => {
        console.log(code, question, time);
        setQuestionTitle(question.title);
        setQuestionSlug(question.titleSlug);
        setHints(question.hints);
        setInitialCode(code);
        setTime(Math.floor(new Date().getTime() / 1000) - parseInt(time, 10));
        setQuestion(question.content);
        setLoading(false);
      });

      return () => clearInterval(timer);
    }
  }, [sessionParams, editorSocket]);

  // code editor hook
  useEffect(() => {
    const editor = CodeMirror.fromTextArea(
      document.getElementById('code-editor'),
      {
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'mdn-like',
        mode: sessionParams?.language || 'javascript',
        lineWrapping: true,
        scrollBarStyle: 'null',
      }
    );
    editor.setValue(initialCode);
    if (!editorSocket) {
      return () => {
        editor.toTextArea();
      };
    }
    const remoteCursorManager = new CodeMirrorCollabExt.RemoteCursorManager({
      editor: editor,
      tooltips: true,
      tooltipDuration: 2,
    });

    const sourceUserCursor = remoteCursorManager.addCursor(
      user.id,
      'orange',
      'you'
    );
    const targetUserCursor = remoteCursorManager.addCursor(
      'Partner_Cursor',
      'blue',
      'Partner'
    );
    const remoteSelectionManager =
      new CodeMirrorCollabExt.RemoteSelectionManager({ editor: editor });
    const sourceUserSelection = remoteSelectionManager.addSelection(
      user.id,
      'orange'
    );
    const targetUserSelection = remoteSelectionManager.addSelection(
      'Partner_selection',
      'blue'
    );

    editorSocket.on('CODE_CHANGED', (_code) => {
      console.log('CODE_CHANGED');
    });

    editorSocket.on('CURSOR_CHANGED', ({ cursor, from, to }) => {
      console.log('CURSOR_CHANGED');
      setTimeout(() => {
        targetUserCursor.setPosition(cursor);
        targetUserSelection.setPositions(from, to);
        targetUserCursor.show();
        targetUserSelection.show();
      }, 0);
    });

    editor.on('cursorActivity', () => {
      editorSocket.emit('CURSOR_CHANGED', {
        cursor: editor.getCursor(),
        from: editor.getCursor('from'),
        to: editor.getCursor('to'),
      });

      setTimeout(() => {
        sourceUserCursor.setPosition(editor.getCursor());

        sourceUserSelection.setPositions(
          editor.getCursor('from'),
          editor.getCursor('to')
        );
      }, 0);
    });

    const sourceContentManager = new CodeMirrorCollabExt.EditorContentManager({
      editor,
      id: 'source',
      onInsert(index, text) {
        editorSocket.emit('CODE_INSERTED', { index, text });
      },
      onReplace(index, length, text) {
        editorSocket.emit('CODE_REPLACED', { index, length, text });
      },
      onDelete(index, length) {
        editorSocket.emit('CODE_DELETED', { index, length });
      },
    });

    editorSocket.on('CODE_INSERTED', ({ index, text }) => {
      console.log('insert');
      sourceContentManager.insert(index, text);
    });

    editorSocket.on('CODE_REPLACED', ({ index, length, text }) => {
      console.log('replace');
      sourceContentManager.replace(index, length, text);
    });

    editorSocket.on('CODE_DELETED', ({ index, length }) => {
      console.log('delete');
      sourceContentManager.delete(index, length);
    });

    // Codemirror
    editor.on('change', (instance, { origin }) => {
      if (origin !== 'setValue') {
        editorSocket.emit('CODE_CHANGED', {
          sessionId,
          code: instance.getValue(),
        });
      }
    });

    return () => {
      editor.toTextArea();
      sourceContentManager.dispose();
    };
  }, [sessionParams, loading, editorSocket]);

  // Chat hook
  useEffect(() => {
    // chat client socket
    const chatSocket = io('http://localhost:8082/', {
      //forceNew: true,
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    setChatSocket(chatSocket);

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
    return () => chatSocket.disconnect();
  }, [sessionId]);

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

  const handleForfeit = () => {}; // TODO

  const handleSubmit = () => {}; // TODO

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
              <textarea id="code-editor" />
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
                <span className="interview-pg-title">
                  {' '}
                  {questionTitle || 'Question'}{' '}
                </span>
                <div className="question-container-content">
                  {parse(question)}
                  {hints.length > 0 && (
                    <>
                      <p>
                        <strong>Hints:</strong>
                      </p>
                      <ul>
                        {hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </>
                  )}
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
                          {data.sender == user.name ? 'You' : data.sender}
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
            <StopWatch time={time} />
            <Button
              onClick={handleForfeit}
              variant="outlined"
              style={{
                backgroundColor: '#cc3733',
                color: 'white',
                marginRight: '20px',
              }}
            >
              Forfeit
            </Button>
            <Button
              onClick={handleSubmit}
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
