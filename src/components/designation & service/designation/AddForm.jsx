import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { axios } from '../../../axios';
import Loader from '../../Loader';

export default function AddForm({ forceUpdate }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSumbit, setIsSubmit] = useState(false);

  const [designation, setDesignation] = useState('');

  const clearAll = () => {
    setDesignation('');
    setIsSubmit(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearAll();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!designation) return;

    setOpen(false);

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/consultent/designation', { designation }, {
        headers: { Authorization: token }
      });

      if (response) {
        forceUpdate();
        setIsLoading(false);
        clearAll();
      }
    } catch (err) {
      setIsLoading(false);
      clearAll();
      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          create new designation
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create New Designation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill up the form...
            </DialogContentText>
            <TextField
              autoFocus
              error={isSumbit && !designation}
              helperText={(isSumbit && !designation) ? 'Please provide a designation' : ''}
              margin="dense"
              name="designation"
              label="Designation"
              fullWidth
              value={designation}
              onChange={e => setDesignation(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
