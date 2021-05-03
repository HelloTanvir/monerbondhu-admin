import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect } from 'react';
import SelectService from './addForm/SelectService';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function EditService({ services, serviceOptions, newServices, setNewServices }) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setNewServices(services);
  }, [services, setNewServices]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleServiceRemove = (idx) => {
    setNewServices(prev => {
      const prevService = [...prev];
      prevService.splice(idx, 1);
      return [...prevService];
    });
  }

  return (
    <div>
      <Button
        color="primary"
        size='small'
        variant='text'
        style={{paddingLeft: 0, paddingRight: 0, textTransform: 'none'}}
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id="alert-dialog-slide-title">Services</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <SelectService
              serviceOptions={serviceOptions}
              services={newServices}
              setServices={setNewServices}
            />
            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Fee</StyledTableCell>
                        <StyledTableCell align="right">Mode</StyledTableCell>
                        <StyledTableCell align="right">Duration</StyledTableCell>
                        <StyledTableCell align="right">Remove</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {newServices.map((service, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {service.name}
                            </StyledTableCell>
                            <StyledTableCell>
                                {service.fee}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {service.mode}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {service.duration}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <DeleteIcon
                                    color='secondary'
                                    fontSize='small'
                                    style={{cursor: 'pointer'}}
                                    onClick={() => handleServiceRemove(index)}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}