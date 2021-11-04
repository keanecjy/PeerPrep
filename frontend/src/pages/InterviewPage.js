import React, { useState, useEffect, useContext } from 'react';
import StopWatch from '../components/StopWatch';
import GeneralModal from '../components/GeneralModal';
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
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/keymap/sublime';
import '@convergencelabs/codemirror-collab-ext/css/codemirror-collab-ext.css';
import CodeMirror from 'codemirror';
import * as CodeMirrorCollabExt from '@convergencelabs/codemirror-collab-ext';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Chip } from '@material-ui/core';
import { apiKeys } from '../services/config';
import { API_URL } from '../shared/variables';
import { toast } from 'react-toastify';
import { createInterviewHistory } from '../services/profile';


const CustomChip = ({ message }) => {
  return (
    <div className="custom-chip">
      <span className="chip-msg"> {message} </span>
    </div>
  );
};

const getLanguageMode = (language) => {
  if (language == 'python' || language == 'java') {
    return `text/x-${language}`;
  }
  return 'javascript';
};

const InterviewPage = () => {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState({
    content: 'Loading Question...',
    hints: [],
    topics: [],
  });
  const [initialCode, setInitialCode] = useState('');
  const [time, setTime] = useState(0); // To send to backend to get the total time taken
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
  const { user } = useContext(UserContext);
  const { sessionId } = useParams('sessionId');
  const [sessionParams, setSessionParams] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const [editorSocket, setEditorSocket] = useState(null);
  const history = useHistory();
  const [dirty, setDirty] = useState(false);
  const [isForfeitModalOpen, setIsForfeitModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    const sessionDetails = sessionStorage.getItem(sessionId);
    if (sessionDetails) {
      const data = JSON.parse(sessionDetails);
      setSessionParams(data);
    } else if (sessionStorage.length == 0) {
      // Security checks to ensure only authorized personel in the room
      history.push('/home');
      toast.warn('You are not in an existing session!');
    } else {
      history.push('/home');
      toast.warn('You are not authorized to enter this session!');
    }
  }, [sessionId]);

  useEffect(() => {
    // editor client socket
    const editorSocket = io(`${API_URL}${apiKeys.interview.socket}`, {
      path: '/interview/new',
    });
    setEditorSocket(editorSocket);
    return () => editorSocket.disconnect(); //cleanup, avoid memory leak
  }, []);

  useEffect(() => {
    if (sessionParams && editorSocket) {
      editorSocket.on('connect', () => {
        console.log('connect');
        editorSocket.emit('CONNECT_TO_ROOM', {
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
        history.push('/home');
        toast.success('You have successfully completed the interview!');
      });

      let timer = setInterval(() => {
        setTime((oldTime) => oldTime + 1);
      }, 1000);

      editorSocket.once('ROOM:CONNECTION', ({ code, question, time }) => {
        console.log(code, question, time);
        setQuestion({
          ...question,
          content: question.content?.replace(/&nbsp;/g, ' '),
        });
        setInitialCode(code);
        setTime(Math.floor(new Date().getTime() / 1000) - parseInt(time, 10));
        setLoading(false);
      });

      return () => clearInterval(timer);
    }
  }, [sessionParams, editorSocket]);

  // code editor hook
  useEffect(() => {
    if (!sessionParams) {
      return;
    }
    // Basic CodeMirror editor
    const editor = CodeMirror.fromTextArea(
      document.getElementById('code-editor'),
      {
        lineNumbers: true,
        keyMap: 'sublime',
        theme: 'mdn-like',
        mode: getLanguageMode(sessionParams.language),
        lineWrapping: true,
        scrollBarStyle: 'null',
      }
    );
    editor.setValue(initialCode);
    if (!editorSocket || !sessionParams) {
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
      'You'
    );
    const targetUserCursor = remoteCursorManager.addCursor(
      'partner',
      'blue',
      'Partner'
    );

    const remoteSelectionManager =
      new CodeMirrorCollabExt.RemoteSelectionManager({ editor: editor });
    const sourceUserSelection = remoteSelectionManager.addSelection(
      'partner',
      'orange'
    );
    const targetUserSelection = remoteSelectionManager.addSelection(
      'partner',
      'blue'
    );

    editorSocket.on('CODE_CHANGED', (code) => {
      console.log('CODE_CHANGED');
      if (dirty) {
        editor.setValue(code);
        setDirty(false);
      }
    });

    var isUserActivity = false;

    editor.on('mousedown', function () {
      isUserActivity = true;
    });

    editor.on('cursorActivity', () => {
      const data = {
        cursor: editor.getCursor(),
        from: editor.getCursor('from'),
        to: editor.getCursor('to'),
      };

      if (isUserActivity || editor.getSelection()) {
        isUserActivity = false;
        setTimeout(() => {
          editorSocket.emit('CURSOR_CHANGED', {
            origin: user.id,
            sessionId: sessionId,
            cursor: data.cursor,
            from: data.from,
            to: data.to,
          });
        }, 0);
      }

      setTimeout(() => {
        sourceUserCursor.setPosition(data.cursor);

        sourceUserSelection.setPositions(data.from, data.to);
      }, 0);
    });

    editor.on('keydown', () => {
      isUserActivity = true;
    });

    editor.on('beforeChange', () => {
      isUserActivity = false;
    });

    editorSocket.on('CURSOR_CHANGED', ({ origin, cursor, from, to }) => {
      console.log('CURSOR_CHANGED', origin);
      try {
        targetUserCursor.setPosition(cursor);
        targetUserSelection.setPositions(from, to);
      } catch (err) {
        // not important to ensure real-time collab
        console.log(err);
      }
    });

    const sourceContentManager = new CodeMirrorCollabExt.EditorContentManager({
      editor, // sourceContentManager + basic editor = jacked-up collab editor
      id: 'source',
      onInsert(index, text) {
        editorSocket.emit('CODE_INSERTED', {
          sessionId,
          index,
          text,
        });
      },
      onReplace(index, length, text) {
        editorSocket.emit('CODE_REPLACED', { sessionId, index, length, text });
      },
      onDelete(index, length) {
        editorSocket.emit('CODE_DELETED', { sessionId, index, length });
      },
    });

    editorSocket.on('CODE_INSERTED', ({ index, text }) => {
      console.log('insert');
      try {
        sourceContentManager.insert(index, text);
      } catch (err) {
        console.log(err);
        setDirty(true);
      }
    });

    editorSocket.on('CODE_REPLACED', ({ index, length, text }) => {
      console.log('replace');
      try {
        sourceContentManager.replace(index, length, text);
      } catch (err) {
        console.log(err);
        setDirty(true);
      }
    });

    editorSocket.on('CODE_DELETED', ({ index, length }) => {
      console.log('delete');
      try {
        sourceContentManager.delete(index, length);
      } catch (err) {
        console.log(err);
        setDirty(true);
      }
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
      targetUserCursor.dispose();
      targetUserSelection.dispose();
    };
  }, [sessionParams, loading, editorSocket]);

  // Chat hook
  useEffect(() => {
    // chat client socket
    const chatSocket = io(`${API_URL}${apiKeys.chat.socket}`, {
      path: '/chat/new',
    });
    setChatSocket(chatSocket);

    chatSocket.on('connect', () => {
      chatSocket.emit('newMessage', {
        sessionId,
        payload: {
          id: 'System',
          sender: 'System',
          msg: `${user.name} has joined the room!`,
        },
      });
    });

    chatSocket.on('disconnect', () => {
      chatSocket.emit('newMessage', {
        sessionId,
        payload: {
          id: 'System',
          sender: 'System',
          msg: `${user.name} has left the room.`,
        },
      });
    });

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

  const handleForfeit = () => {
    editorSocket.emit('FORFEIT', {
      sessionId: sessionId,
      userId: user.id,
    });

    createInterviewHistory(
      {leetcodeSlug: question.title,
      question: question.title,
      partner:user.id,
      timeTaken:time.toString(),
      completed:Boolean(true)
    })

    sessionStorage.removeItem(sessionId);
    editorSocket.disconnect(); // cleanup, avoid memory leak
    history.push('/home'); // route back to home landing
  };

  const handleSubmit = () => {
    // routing is handled by the event listener on top
    editorSocket.emit('COMPLETE_SESSION', {
      sessionId: sessionId,
      userId: user.id,
    });
    editorSocket.disconnect(); // cleanup, avoid memory leak
  }; // TODO

  if (!sessionStorage.getItem(sessionId)) {
    return <></>;
  }

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
                  {question.title || 'Question'}{' '}
                  {question.titleSlug && (
                    <Typography
                      color="secondary"
                      component={'a'}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://leetcode.com/problems/${question.titleSlug}`}
                    >
                      Link
                    </Typography>
                  )}
                </span>
                <div className="question-container-content">
                  <Chip
                    label={question.difficulty || 'difficulty'}
                    color="secondary"
                    size="small"
                    style={{
                      textTransform: 'capitalize',
                      marginRight: '0.5em',
                    }}
                  />
                  <Chip
                    label={sessionParams?.language || 'difficulty'}
                    color="secondary"
                    size="small"
                    style={{ textTransform: 'capitalize' }}
                  />
                  <br />
                  {parse(question.content)}
                  {question?.hints.length > 0 && (
                    <>
                      <p>
                        <strong>Hints:</strong>
                      </p>
                      <ul>
                        {question.hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {question?.topics.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                      }}
                    >
                      <strong>Topics:</strong>
                      {question.topics.map((topic, index) => (
                        <Chip
                          key={index}
                          label={topic}
                          style={{ margin: '0.5em' }}
                          color="secondary"
                          size="small"
                        />
                      ))}
                    </div>
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
            <GeneralModal
              displayText={
                'Are you sure you want to quit? Your partner will be left alone...'
              }
              isOpen={isForfeitModalOpen}
              handleConfirm={handleForfeit}
              handleCloseModal={() => setIsForfeitModalOpen(false)}
            />
            <GeneralModal
              displayText={
                'Are you sure you want to submit your answer? This room will be closed!'
              }
              isOpen={isSubmitModalOpen}
              handleConfirm={handleSubmit}
              handleCloseModal={() => setIsSubmitModalOpen(false)}
            />
            <StopWatch time={time} />
            <Button
              onClick={() => setIsForfeitModalOpen(true)}
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
              onClick={() => setIsSubmitModalOpen(true)}
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
