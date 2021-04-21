import { FormControl, MenuItem, Select, TextField } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DeleteForever } from '@material-ui/icons';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import AddForm from './addForm/AddForm';
import EditDescription from './EditDescription';
import FullDescription from './FullDescription';
import Image from './Image';
import ShowService from './ShowService';

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

function createData(id, image, name, designation, visitingDay, review, reviewCount, description, service) {
  return { id, image, name, designation, visitingDay, review, reviewCount, description, service };
}

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 700,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    '& > *': {
      marginTop: '0px !important'
    }
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textField: {
    '& > *': {
      fontSize: 13
    }
  },
  description: {
    width: 80,
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

export default function DataTable({ apiData, designations, services, forceUpdate }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [visitingDay, setVisitingDay] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setIsEditing(false);
    setEditingIdx(-1);
  };

  const clearAll = () => {
    setName('');
    setDesignation('');
    setVisitingDay('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/consultent', {
        headers: { Authorization: token },
        data: {
          id
        }
      });

      if (response) {
        setIsLoading(false);
        alert('Deleted Successfully');
        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);
      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  }

  const handleEdit = async (id) => {
    if (!name || !designation || !visitingDay || !description)
      return alert('Please select a state');

    setIsEditing(false);
    setEditingIdx(-1);
    setIsLoading(true);

    const updateData = {
      name,
      designation,
      visitingDay,
      description
    };

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = axios.patch(`/consultent/${id}`, updateData, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);
        forceUpdate();

        clearAll();
      }
    } catch (err) {
      setIsLoading(false);

      clearAll();

      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  const editButtonHandler = (editedData, idx) => {
    setIsEditing(true);
    setEditingIdx(idx);

    setName(editedData.name);
    setDesignation(editedData.designation);
    setVisitingDay(editedData.visitingDay);
    setDescription(editedData.description);
  }

  const rows = apiData.map((data, idx) => createData(data._id, data.image, data.name, data.designation, data.visitingDay, data.review, data.reviewCount, data.description, data.service));

  return (
    <>
      <Loader open={isLoading} />

      <AddForm
        designations={designations}
        serviceOptions={services}
        forceUpdate={forceUpdate}
      />

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Designation</StyledTableCell>
              <StyledTableCell>Visiting Day</StyledTableCell>
              <StyledTableCell>Review</StyledTableCell>
              <StyledTableCell>Review Count</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Services</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              <StyledTableCell align="right">Delete</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <StyledTableRow key={idx}>
                <StyledTableCell>
                  <Image name={row.name} image={row.image} />
                </StyledTableCell>

                <StyledTableCell>
                  {
                    isEditing && editingIdx === idx
                      ? <TextField
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={classes.textField}
                        />
                      : row.name
                  }
                </StyledTableCell>

                <StyledTableCell>
                  {
                    isEditing && editingIdx === idx
                      ? <FormControl className={classes.formControl}>
                          <Select
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            displayEmpty
                            className={classes.selectEmpty}
                            inputProps={{ 'aria-label': 'Without label' }}
                            style={{fontSize: 13}}
                          >
                            {
                              designations.map(des => (
                                <MenuItem key={des} value={des}>{des}</MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      : row.designation
                  }
                </StyledTableCell>

                <StyledTableCell>
                  {
                    isEditing && editingIdx === idx
                      ? <TextField
                          value={visitingDay}
                          onChange={(e) => setVisitingDay(e.target.value)}
                          className={classes.textField}
                        />
                      : row.visitingDay
                  }
                </StyledTableCell>

                <StyledTableCell>
                  {row.review}
                </StyledTableCell>

                <StyledTableCell>
                  {row.reviewCount}
                </StyledTableCell>

                <StyledTableCell>
                  {
                    isEditing && editingIdx === idx
                      ? <EditDescription
                          description={description}
                          setDescription={setDescription}
                        />
                      : row.description?.length > 12
                          ? <>
                              <div
                                className={classes.description}
                              >
                                {parse(row.description || '')}
                              </div>
                              <FullDescription
                                description={parse(row.description || '')}
                              />
                            </>
                          : <div
                              className={classes.description}
                            >
                              {parse(row.description || '')}
                            </div>
                  }
                </StyledTableCell>

                <StyledTableCell>
                  <ShowService services={row.service} />
                </StyledTableCell>

                <StyledTableCell align="right">
                  {
                    (isEditing && editingIdx === idx)
                      ? <div style={{display: 'flex', alignItems: 'center'}}>
                        <ClearIcon
                          style={{ cursor: 'pointer', color: 'red', marginRight: 7 }}
                          onClick={() => handleClose()}
                        />
                        <CheckIcon
                          style={{ cursor: 'pointer', color: 'green' }}
                          onClick={() => handleEdit(row.id)}
                        />
                      </div>
                      : <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => editButtonHandler({
                          name: row.name,
                          designation: row.designation,
                          visitingDay: row.visitingDay,
                          description: row.description,
                        }, idx)}
                      />
                  }
                </StyledTableCell>
                <StyledTableCell align="right">
                  <DeleteForever
                    color='secondary'
                    style={{cursor: 'pointer'}}
                    onClick={() => handleDelete(row.id)} 
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
