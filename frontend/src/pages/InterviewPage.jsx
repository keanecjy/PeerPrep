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
import { Chip, Table, TableRow, TableCell, TableHead } from '@material-ui/core';
import { apiKeys } from '../services/config';
import { API_URL, SUBMISSION_STATUS } from '../shared/variables';
import { toast } from 'react-toastify';
import { createInterviewHistory } from '../services/profile';
import LoadingProgress from '../match/LoadingIndicator';
import { parseSecondsToDuration } from '../shared/functions';
import { styles } from '../theme';

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
  const [currentCode, setCurrentCode] = useState('');
  const [time, setTime] = useState(0); // To send to backend to get the total time taken
  const [timer, setTimer] = useState(0);
  const [messages, setMessages] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
  const { user } = useContext(UserContext);
  const { sessionId } = useParams('sessionId');
  const [partner, setPartner] = useState(null);
  const [sessionParams, setSessionParams] = useState(null);
  const [chatSocket, setChatSocket] = useState(null);
  const [editorSocket, setEditorSocket] = useState(null);
  const history = useHistory();
  const [dirty, setDirty] = useState(false);
  const [isForfeitModalOpen, setIsForfeitModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(
    SUBMISSION_STATUS.None
  );

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

  // editor client socket
  useEffect(() => {
    const editorSocket = io(`${API_URL}${apiKeys.interview.socket}`, {
      path: '/interview/new',
    });
    setEditorSocket(editorSocket);
    return () => editorSocket.disconnect(); //cleanup, avoid memory leak
  }, []);

  // code editor hook
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

        editorSocket.emit('GREET', {
          sessionId: sessionId,
          ...user,
        });
      });

      editorSocket.on('disconnect', () => {
        console.log('client disconnect');
        editorSocket.emit('DISCONNECT_FROM_ROOM', {
          sessionId: sessionId,
          userId: user.id,
        });
      });

      editorSocket.on('partnerForfeited', (sessionId, forfeiterUserId) => {
        console.log('your partner has forfeited', sessionId, forfeiterUserId);
        toast.success(
          'Your partner has forfeited the interview! You are alone'
        );
      });

      let timer = setInterval(() => {
        setTime((oldTime) => oldTime + 1);
      }, 1000);
      setTimer(timer);

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

      // greet each other and exchange details
      editorSocket.once('GREET', (details) => {
        setPartner(details);
        editorSocket.emit('GREET', {
          sessionId: sessionId,
          ...user,
        });
      });

      editorSocket.on('COMPLETE_SESSION_REQUEST', () => {
        setSubmissionStatus(SUBMISSION_STATUS.Prompted);
        editorSocket.once('COMPLETE_SESSION_CANCEL', () => {
          if (submissionStatus === SUBMISSION_STATUS.Prompted) {
            setSubmissionStatus(SUBMISSION_STATUS.None);
          }
        });
      });

      return () => clearInterval(timer);
    }
  }, [sessionParams, editorSocket]);

  // code mirror hook
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
      setCurrentCode(code);
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

  const createRecord = (timeTaken, isCompleted) => {
    sessionStorage.removeItem(sessionId);
    if (user.isGuest) {
      // no record
      return;
    }
    createInterviewHistory({
      leetcodeSlug: question.titleSlug,
      questionName: question.title,
      partnerName: partner?.name,
      timeTaken: timeTaken,
      isCompleted: Boolean(isCompleted),
    });
  };

  const handleForfeit = () => {
    editorSocket.emit('FORFEIT_SESSION', {
      sessionId: sessionId,
      userId: user.id,
    });
    createRecord(time, false);

    // At this point, other users in room should have been notified
    // that I left the room and I receive my InterviewHistory
    sessionStorage.removeItem(sessionId);
    editorSocket.disconnect();
  };

  const handleSubmitRequest = () => {
    editorSocket.emit('COMPLETE_SESSION_REQUEST', {
      sessionId: sessionId,
      userId: user.id,
      time: time,
    });
    setSubmissionStatus(SUBMISSION_STATUS.Requesting);

    editorSocket.once(
      'COMPLETE_SESSION_CONFIRM',
      ({ time: confirmationTime }) => {
        setSubmissionStatus(SUBMISSION_STATUS.Accepted);

        confirmationTime = confirmationTime || time;
        createRecord(confirmationTime, true);
        clearInterval(timer);
        setTime(confirmationTime);

        setTimeout(() => {
          setSubmissionStatus(SUBMISSION_STATUS.Summary);
          setIsSubmitModalOpen(false);
        }, 1500);

        // stop listening to reject event
        editorSocket.off('COMPLETE_SESSION_REJECT');
      }
    );
    editorSocket.once('COMPLETE_SESSION_REJECT', () => {
      // stop listening to accept event
      console.log('COMPLETE_SESSION_REJECT');
      setSubmissionStatus(SUBMISSION_STATUS.Rejected);
      setTimeout(() => {
        setSubmissionStatus(SUBMISSION_STATUS.None);
        setIsSubmitModalOpen(false);
      }, 1500);

      // stop listening to reject event
      editorSocket.off('COMPLETE_SESSION_CONFIRM');
    });
  };

  const handleSubmitAccept = () => {
    clearInterval(timer);
    editorSocket.emit('COMPLETE_SESSION_CONFIRM', {
      sessionId: sessionId,
      userId: user.id,
      time: time,
    });
    createRecord(time, true);
    setSubmissionStatus(SUBMISSION_STATUS.Summary);
  };

  const handleSubmitReject = () => {
    editorSocket.emit('COMPLETE_SESSION_REJECT', {
      sessionId: sessionId,
      userId: user.id,
    });
    setSubmissionStatus(SUBMISSION_STATUS.None);
  };

  const cancelSubmitRequest = () => {
    editorSocket.emit('COMPLETE_SESSION_CANCEL', {
      sessionId: sessionId,
      userId: user.id,
      time: time,
    });
    editorSocket.off('COMPLETE_SESSION_REJECT');
    editorSocket.off('COMPLETE_SESSION_CONFIRM');
    setSubmissionStatus(SUBMISSION_STATUS.None);
    setIsSubmitModalOpen(false);
  };

  if (!sessionParams) {
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
                    label={question.difficulty || 'easy'}
                    color="secondary"
                    size="small"
                    style={{
                      textTransform: 'capitalize',
                      marginRight: '0.5em',
                    }}
                  />
                  <Chip
                    label={sessionParams?.language || 'javascript'}
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

      <GeneralModal
        isOpen={submissionStatus === SUBMISSION_STATUS.Summary}
        handleConfirm={() => {
          setIsSubmitModalOpen(false);
          history.push('/home');
        }}
        confirmText={'Return to Dashboard'}
      >
        <Typography color="primary" variant="h6">
          Your interview statistics
        </Typography>
        <Typography style={{ margin: '10px 0px' }}>
          Congratulations on completing your peer interview!
        </Typography>
        <Table>
          <TableHead>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE, width: 100 }}
              >
                Question:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                color="primary"
                padding="none"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                <Table
                  component="a"
                  target="_blank"
                  padding="none"
                  rel="noreferrer"
                  href={`https://leetcode.com/problems/${question.titleSlug}`}
                >
                  {question.title}
                </Table>
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                Difficulty:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                color="primary"
                padding="none"
                style={{
                  borderBottom: 'none',
                  color: styles.BLUE,
                  textTransform: 'capitalize',
                }}
              >
                {question.difficulty}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                Language:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                color="primary"
                padding="none"
                style={{
                  borderBottom: 'none',
                  color: styles.BLUE,
                  textTransform: 'capitalize',
                }}
              >
                {sessionParams.language}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                Time Taken:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                color="primary"
                padding="none"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                {parseSecondsToDuration(time)}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        <Typography style={{ margin: '40px 0px 0px 0px' }} align="justify">
          Feel free to copy your code and run it on LeetCode to check for
          correctness Do note that we do not save a copy of your code!
        </Typography>
        <Button
          align="center"
          color="primary"
          disableElevation={true}
          disableRipple={true}
          variant="text"
          color="primary"
          onClick={() => {
            navigator.clipboard.writeText(currentCode);
            toast.info('Copied to clipboard');
          }}
        >
          Copy my code
        </Button>
      </GeneralModal>

      <GeneralModal
        isOpen={submissionStatus === SUBMISSION_STATUS.Prompted}
        confirmText={'Yes'}
        handleConfirm={handleSubmitAccept}
        cancelText={'No'}
        handleCancel={handleSubmitReject}
      >
        <Typography color="primary" align="center">
          Your partner has requested to submit the answer. Are you ready to
          submit?
        </Typography>
      </GeneralModal>

      <GeneralModal
        isOpen={[
          SUBMISSION_STATUS.Requesting,
          SUBMISSION_STATUS.Accepted,
          SUBMISSION_STATUS.Rejected,
        ].includes(submissionStatus)}
        handleCancel={cancelSubmitRequest}
      >
        <LoadingProgress
          loading={submissionStatus === SUBMISSION_STATUS.Requesting}
          success={submissionStatus === SUBMISSION_STATUS.Accepted}
        />

        <Typography color="primary" align="center">
          {submissionStatus === SUBMISSION_STATUS.Requesting
            ? 'Requesting confirmation from partner...'
            : submissionStatus === SUBMISSION_STATUS.Accepted
            ? 'Partner accepted submission request'
            : 'Partner rejected submission request'}
        </Typography>
      </GeneralModal>

      <GeneralModal
        isOpen={isForfeitModalOpen}
        handleConfirm={handleForfeit}
        handleCancel={() => setIsForfeitModalOpen(false)}
      >
        <Typography color="primary" align="center">
          Are you sure you want to quit? Your partner will be left alone...
        </Typography>
      </GeneralModal>

      <GeneralModal
        isOpen={isSubmitModalOpen}
        handleConfirm={handleSubmitRequest}
        handleCancel={() => setIsSubmitModalOpen(false)}
      >
        <Typography color="primary" align="center">
          Are you sure you want to submit your answer? Confirmation is required
          from your partner
        </Typography>
      </GeneralModal>
    </div>
  );
};

export default InterviewPage;
