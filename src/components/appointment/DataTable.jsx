import { FormControl, MenuItem, Select } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import ShowFullContent from '../utils/ShowFullContent';
import AddForm from './AddForm';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(id, name, number, consultant, service, appointmentDate, state, story, dob) {
  return { id, name, number, consultant, service, appointmentDate, state, story, dob };
}

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  content: {
    width: 85,
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    '& > *': {
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0
    }
  }
}));

export default function DataTable({ apiData, consultants, forceUpdate }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState('');

  const calcAge = dateString => {
    const birthday = +new Date(dateString);
    return ~~((Date.now() - birthday) / (31557600000));
  }

  const handleClose = () => {
    setIsEditing(false);
    setEditingIdx(-1);
    setState('');
  };

  const editButtonHandler = (editedState, idx) => {
    setIsEditing(true);
    setEditingIdx(idx);
    setState(editedState);
  }

  const handleSubmit = async (id) => {
    if (!state) return alert('Please select a state');

    setIsEditing(false);
    setEditingIdx(-1);
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = axios.patch('/consultent/appointment', { id, state }, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);
        setState('');
        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);
      setState('');
      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  const rows = apiData.map((data, idx) => createData(data._id, data.name, data.givenMobileNumber, data.consultantName, data.service, data.appointmentDate, data.state, data.story, data.dob));

  return (
    <>
      <Loader open={isLoading} />
      <AddForm consultants={consultants} forceUpdate={forceUpdate} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell align="left">Number</StyledTableCell>
              <StyledTableCell align="left">Consultant</StyledTableCell>
              <StyledTableCell align="left">Service</StyledTableCell>
              <StyledTableCell align="left">Appointment Date</StyledTableCell>
              <StyledTableCell align="left">State</StyledTableCell>
              <StyledTableCell align="left">Story</StyledTableCell>
              <StyledTableCell align="left">Age</StyledTableCell>
              <StyledTableCell align="left">Date of birth</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              {/* <StyledTableCell align="right">Delete</StyledTableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="left">{row.number}</StyledTableCell>
                <StyledTableCell align="left">{row.consultant}</StyledTableCell>
                <StyledTableCell align="left">{row.service}</StyledTableCell>
                <StyledTableCell align="left">
                  <span style={{ fontWeight: 'bold' }}>Date: </span>
                  {new Date(row.appointmentDate).toLocaleDateString("en-US")}
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Time: </span>
                    {new Date(row.appointmentDate).toLocaleTimeString("en-US")}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {
                    isEditing && editingIdx === idx
                      ? <FormControl className={classes.formControl}>
                          <Select
                            value={state || row.state}
                            onChange={(e) => setState(e.target.value)}
                            displayEmpty
                            className={classes.selectEmpty}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            <MenuItem value={'pending'}>Pending</MenuItem>
                            <MenuItem value={'done'}>Done</MenuItem>
                            <MenuItem value={'noted'}>Noted</MenuItem>
                            <MenuItem value={'waitingForReview'}>Waiting For Review</MenuItem>
                          </Select>
                        </FormControl>
                      : row.state
                  }
                </StyledTableCell>
                <StyledTableCell align="left">
                  {
                    row.story.length > 12
                        ? <>
                            <div
                              className={classes.content}
                            >
                              {row.story}
                            </div>
                            <ShowFullContent title={'Story'} content={row.story} />
                          </>
                        : <div
                            className={classes.content}
                          >
                            {row.story}
                          </div>
                  }
                </StyledTableCell>
                <StyledTableCell align="left">
                  {calcAge(row.dob)} years
                </StyledTableCell>
                <StyledTableCell align="left">
                  {new Date(row.dob).toLocaleDateString("en-US")}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {
                    (isEditing && editingIdx === idx)
                      ? <div>
                        <ClearIcon
                          style={{ cursor: 'pointer', color: 'red', marginRight: 7 }}
                          onClick={() => handleClose()}
                        />
                        <CheckIcon
                          style={{ cursor: 'pointer', color: 'green' }}
                          onClick={() => handleSubmit(row.id)}
                        />
                      </div>
                      : <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => editButtonHandler(row.state, idx)}
                      />
                  }
                </StyledTableCell>
                {/* <StyledTableCell align="right">
                  <DeleteForeverIcon />
                </StyledTableCell> */}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
