import { Box, Paper, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { getInterviewHistory } from '../services/profile';
import { HistoryItem } from '../components/HistoryItem';
import theme from '../theme';
import { useHistory } from 'react-router';

const mockData = [
  {
    id: 'number',
    leetcodeSlug: 'two-sum',
    questionName: 'Two Sum',
    participants: [
      { id: '10c7e0a8-120b-45e0-a37f-be92170bfb8d', name: 'Keane' },
    ],
    timeTaken: 180,
    isCompleted: true,
    createdAt: new Date(),
  },
];

const HistorySection = () => {
  const [interviewHistory, setInterviewHistory] = useState([]);
  const { user } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (user && !user.isGuest) {
      getInterviewHistory(user.id)
        .then((data) => {
          setInterviewHistory(data);
        })
        .catch((error) => console.log(error));
    }
  }, [user]);

  if (user?.isGuest) {
    return (
      <Box style={{ paddingTop: theme.spacing(2) }}>
        <Paper
          style={{
            maxWidth: 500,
            padding: 20,
            borderRadius: 10,
            flexGrow: 1,
          }}
        >
          <Typography color="primary">
            <Typography
              color="primary"
              component="a"
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => history.push('/login')}
            >
              Login
            </Typography>{' '}
            to start tracking your PeerPrep History
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (interviewHistory.length === 0) {
    return (
      <Box style={{ color: 'white', paddingTop: theme.spacing(2) }}>
        <Paper
          style={{
            maxWidth: 500,
            padding: 20,
            borderRadius: 10,
            flexGrow: 1,
          }}
        >
          <Typography color="primary">
            No history yet! Start PeerPrepping today!~
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      {interviewHistory.map((data) => (
        <Box
          key={data.id}
          style={{ color: 'white', paddingTop: theme.spacing(2) }}
        >
          <HistoryItem data={data} />
        </Box>
      ))}
    </>
  );
};

export default HistorySection;
