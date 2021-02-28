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
import OrderedProduct from './OrderedProduct';

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

function createData(id, name, givenNumber, address, paymentMethod, paymentStatus, orderStatus, orderTime, quantity, userNumber, product) {
  return { id, name, givenNumber, address, paymentMethod, paymentStatus, orderStatus, orderTime, quantity, userNumber, product };
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
}));

export default function DataTable({ apiData, forceUpdate }) {
  const classes = useStyles();

  const [isEditing, setIsEditing] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const [orderStatus, setOrderStatus] = useState('');

  const handleClose = () => {
    setIsEditing(false);
    setEditingIdx(-1);
    setOrderStatus('');
  };

  const editButtonHandler = (editedOrderStatus, idx) => {
    setIsEditing(true);
    setEditingIdx(idx);
    setOrderStatus(editedOrderStatus);
  }

  const handleSubmit = async (id) => {
    if (!orderStatus) return alert('Please select a state');

    setIsEditing(false);
    setEditingIdx(-1);
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = axios.patch('/shop/order', { id, orderStatus }, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);
        forceUpdate();
        setOrderStatus('');
      }
    } catch (err) {
      setIsLoading(false);
      setOrderStatus('');
      alert(err.response.data.message || 'Something went wrong');
    }
  };

  const rows = apiData.map((data, idx) => createData(data._id, data.name, data.givenNumber, data.address, data.paymentMethod, data.paymentStatus, data.orderStatus, data.orderTime, data.qty, data.userNumber, data.product));

  return (
    <>
      <Loader open={isLoading} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Product</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Given Number</StyledTableCell>
              <StyledTableCell align="right">Address</StyledTableCell>
              <StyledTableCell align="right">Payment Method</StyledTableCell>
              <StyledTableCell align="right">Payment Status</StyledTableCell>
              <StyledTableCell align="right">Order Status</StyledTableCell>
              <StyledTableCell align="right">Order Time</StyledTableCell>
              <StyledTableCell align="right">QTY</StyledTableCell>
              <StyledTableCell align="right">User Number</StyledTableCell>
              <StyledTableCell align="right">Edit</StyledTableCell>
              {/* <StyledTableCell align="right">Delete</StyledTableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <StyledTableRow key={idx}>
                {/* <StyledTableCell component="th" scope="row"> */}
                <StyledTableCell>
                  <OrderedProduct product={row.product} />
                </StyledTableCell>

                <StyledTableCell align="right">{row.name}</StyledTableCell>

                <StyledTableCell align="right">{row.givenNumber}</StyledTableCell>

                <StyledTableCell align="right">{row.address}</StyledTableCell>

                <StyledTableCell align="right">{row.paymentMethod}</StyledTableCell>

                <StyledTableCell align="right">{row.paymentStatus}</StyledTableCell>

                <StyledTableCell align="right">
                  {
                    isEditing && editingIdx === idx
                      ? <FormControl className={classes.formControl}>
                        <Select
                          value={orderStatus || row.orderStatus}
                          onChange={(e) => setOrderStatus(e.target.value)}
                          displayEmpty
                          className={classes.selectEmpty}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {
                            ['pending', 'picked', 'shipped', 'delivered', 'cancelled']
                              .map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
                          }
                        </Select>
                      </FormControl>
                      : row.orderStatus
                  }
                </StyledTableCell>

                <StyledTableCell align="right">
                  <span style={{ fontWeight: 'bold' }}>Date: </span>
                  {new Date(row.orderTime).toLocaleDateString("en-US")}
                  <div>
                    <span style={{ fontWeight: 'bold' }}>Time: </span>
                    {new Date(row.orderTime).toLocaleTimeString("en-US")}
                  </div>
                </StyledTableCell>

                <StyledTableCell align="right">{row.quantity}</StyledTableCell>

                <StyledTableCell align="right">{row.userNumber}</StyledTableCell>

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
                        onClick={() => editButtonHandler(row.orderStatus, idx)}
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
