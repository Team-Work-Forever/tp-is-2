import React, { useEffect, useState } from 'react';

import Pagination from '@mui/material/Pagination';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Close from '@mui/icons-material/Close';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Row(props) {
  const { row, aux, title, notify } = props;
  const [open, setOpen] = React.useState(false);

  const arrayKey = Object.keys(row).find((key => Array.isArray((row[key]))));
  const secondArray = arrayKey ? row[arrayKey] : undefined;

  function hasSecondArray() {
    return secondArray !== undefined && secondArray.length > 0;
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {
          hasSecondArray() ?
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell> :
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => notify()}
              >
                <Close />
              </IconButton>
            </TableCell>
        }
        {
          Object.keys(row).map((key, columnIndex) => (
            !Array.isArray((row[key])) &&
            <TableCell key={columnIndex} align="left">{row[key]}</TableCell>
          ))
        }
      </TableRow>
      {
        hasSecondArray() > 0
        &&
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {title}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {
                        aux &&
                        aux.map((element, index) => (
                          <TableCell key={index} align="left">{element}</TableCell>
                        ))
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      secondArray &&
                      secondArray.map((data, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          {
                            Object.keys(data).map((key, columnIndex) => (
                              <TableCell key={columnIndex} align="left">{data[key]}</TableCell>
                            ))
                          }
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      }
    </React.Fragment>
  );
}

export default function ShowDataTable({ isLoading, content, aux, onSelectionChanged }) {
  const hasPagination = onSelectionChanged !== undefined;
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (onSelectionChanged) {
      onSelectionChanged(page);
    }
  }, [page]);

  const { columns, rows: data } = content
  const { rows: auxRows, title, errorMessage } = aux ?? {}

  const [state, setState] = React.useState({ open: false, text: '' });

  const handleNotify = (message) => {
    setState({ open: true, text: errorMessage });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setState(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      {
        hasPagination &&
        <Pagination style={{ marginBottom: 10 }} count={10} page={page} onChange={(_, value) => { setPage(value); }} />
      }
      {
        isLoading ?
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
          :
          <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  {
                    columns.map((element, index) => (
                      <TableCell key={index} align="left">{element}</TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <Row key={index} row={row} aux={auxRows} title={title} notify={handleNotify} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
      }
      <Snackbar open={state.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {state.text}
        </Alert>
      </Snackbar>
    </>
  );
}