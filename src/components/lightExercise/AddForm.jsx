import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';

export default function AddForm({ forceUpdate }) {

  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSumbit, setIsSubmit] = useState(false);

  const [name, setName] = useState('');
  const [ytlink, setYtlink] = useState('');

  const clearAll = () => {
    setName('');
    setYtlink('');
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

    if (!name || !ytlink) return;

    setOpen(false);

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/lightexercise', { name, ytlink }, {
        headers: {
          Authorization: token
        }
      });
      if (response) {
        setIsLoading(false);

        clearAll();

        forceUpdate();
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
          create new light exercise
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='xs'>
          <DialogTitle id="form-dialog-title">Create New Light Exercise</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill up the form...
          </DialogContentText>
            <TextField
              autoFocus
              error={isSumbit && !name}
              helperText={(isSumbit && !name) ? 'Please add a name' : ''}
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <TextField
              error={isSumbit && !ytlink}
              helperText={(isSumbit && !ytlink) ? 'Please add youtube link' : ''}
              margin="dense"
              name="ytlink"
              label="Youtube Link"
              fullWidth
              value={ytlink}
              onChange={e => setYtlink(e.target.value)}
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
