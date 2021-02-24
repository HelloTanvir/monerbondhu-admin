import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { useState } from 'react';
import Loader from '../Loader';

export default function AddForm({ forceUpdate }) {

  const [open, setOpen] = React.useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [ytlink, setYtlink] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setName('');
    setYtlink('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !ytlink)
      return alert('Please fillup the form');

    setOpen(false);

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/api/pinvideo', {name, ytlink}, {
        headers: {
          Authorization: token
        }
      });
      if (response) {
        setIsLoading(false);

        setName('');
        setYtlink('');

        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);
      
      setName('');
      setYtlink('');

      alert(err.response.data.message || 'Something went wrong');
    }
  };

  return (
    <>
    <Loader open={isLoading} />
    <div style={{display: 'flex', justifyContent: 'flex-end', paddingBottom: 22}}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        create new pin video
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='xs'>
        <DialogTitle id="form-dialog-title">Create New Pin Video</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill up the form...
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <TextField
            autoFocus
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
