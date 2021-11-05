import {
  Box,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { styles } from '../theme';

export const HistoryItem = ({ data }) => {
  const { user } = useContext(UserContext);

  const partnerName = useMemo(() => {
    if (data.participants.length < 2) {
      return 'Guest user';
    }

    return data.participants.filter((x) => x !== user.id)[0].name;
  }, [data]);

  const getTimeString = (timeInSeconds) => {
    console.log(timeInSeconds);
    const dateObj = new Date(timeInSeconds * 1000);
    const hours = dateObj.getUTCHours().toString();
    const minutes = dateObj.getUTCMinutes().toString();
    const seconds = dateObj.getSeconds().toString();

    return (
      hours.padStart(2, '0') +
      ':' +
      minutes.padStart(2, '0') +
      ':' +
      seconds.padStart(2, '0')
    );
  };

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
        <Table>
          <TableHead>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ width: 100, borderBottom: 'none', color: styles.BLUE }}
              >
                Date:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                padding="none"
                style={{ width: 400, borderBottom: 'none', color: styles.BLUE }}
              >
                {new Date(data.createdAt).toLocaleString('en-us', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell
                padding="none"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE }}
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
                  href={`https://leetcode.com/problems/${data.leetcodeSlug}`}
                >
                  {data.questionName}
                </Table>
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
                {getTimeString(data.timeTaken)}
              </TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell
                padding="none"
                color="inherit"
                color="primary"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                Status:
              </TableCell>
              <TableCell
                colSpan="5"
                align="right"
                color="primary"
                padding="none"
                style={{ borderBottom: 'none', color: styles.BLUE }}
              >
                {data.isCompleted ? 'Completed' : 'Forfeitted'}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </Paper>
  );
};
