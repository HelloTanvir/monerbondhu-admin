import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import AddForm from './AddForm';
import MusicCard from './MusicCard';

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

function createData(id, image, category, subType, name, mp3, musicKey) {
  return { id, image, category, subType, name, mp3, musicKey };
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

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/music', {
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

  return (
    <>
      <Loader open={isLoading} />
      <AddForm forceUpdate={forceUpdate} />
      {
        Object.keys(apiData).map((category) => {
          if (!apiData[category].length) return null;

          const rows = apiData[category].map((data) => createData(data._id, data.image, data.category, data.subType, data.name, data.mp3, data.musicKey));

          return (
            <TableContainer component={Paper} key={category} style={{ marginBottom: 50 }}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{category.toUpperCase()}</StyledTableCell>
                    <StyledTableCell align="right">Delete</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, idx) => (
                    <StyledTableRow key={idx}>
                      <StyledTableCell component="th" scope="row">
                        <MusicCard
                          image={row.image}
                          subType={row.subType}
                          name={row.name}
                          mp3={row.mp3}
                        />
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <DeleteForeverIcon
                          color='secondary'
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(row.id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        })
      }
    </>
  );
}
