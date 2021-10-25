import {
  Box,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';

export const HistoryItem = ({ data }) => {
  const { user } = useContext(UserContext);

  const partnerName = useMemo(() => {
    if (data.participants.length < 2) {
      return 'Guest user';
    }

    return data.participants.filter((x) => x !== user.id)[0].name;
  }, [data]);

  return (
    <Paper
      style={{
        maxWidth: 500,
        padding: 20,
        borderRadius: 10,
        flexGrow: 1,
      }}
    >
      <Typography variant="h6">PeerPrepped with {partnerName}!</Typography>
      <TableContainer component={Box}>
        <TableHead>
          <TableRow hover>
            <TableCell padding="none" color="primary" style={{ width: 100 }}>
              Date:
            </TableCell>
            <TableCell
              colSpan="5"
              align="right"
              color="primary"
              style={{ width: 400 }}
            >
              {data.createdAt.toLocaleString('en-us', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell padding="none" color="primary">
              Question:
            </TableCell>
            <TableCell
              colSpan="5"
              align="right"
              color="primary"
              component="a"
              target="_blank"
              rel="noreferrer"
              href={`https://leetcode.com/problems/${data.leetcodeSlug}`}
            >
              {data.questionName}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell padding="none" color="primary">
              Time Taken:
            </TableCell>
            <TableCell colSpan="5" align="right" color="primary">
              {data.timeTaken}
            </TableCell>
          </TableRow>
          <TableRow hover>
            <TableCell padding="none" color="inherit" color="primary">
              Status:
            </TableCell>
            <TableCell colSpan="5" align="right" color="primary">
              {data.isCompleted ? 'Completed' : 'Forfeitted'}
            </TableCell>
          </TableRow>
        </TableHead>
      </TableContainer>
    </Paper>
  );
};
