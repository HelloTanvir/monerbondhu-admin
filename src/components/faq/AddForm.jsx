import { Typography } from '@material-ui/core';
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
import RichTextEditor from '../utils/RichTextEditor';

export default function AddForm({ forceUpdate }) {
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [ques, setQues] = useState('');
  const [ans, setAns] = useState('');

  const clearAll = () => {
    setQues('');
    setAns('');
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

    if (!ques || !ans)
      return alert('Please fillup the form');

    setOpen(false);

    setIsLoading(true);

    const reqData = {
      title: ques,
      body: ans
    }

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/faq', reqData, {
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

      alert(err.response.data.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          create new faq
      </Button>
        <Dialog
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='md'
        >
          <DialogTitle id="form-dialog-title">Create New FAQ</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill up the form...
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              name="ques"
              label="Question"
              fullWidth
              style={{ marginBottom: 20 }}
              value={ques}
              onChange={e => setQues(e.target.value)}
            />

            <div>
              <Typography
                color='textSecondary'
                style={{ marginBottom: 5 }}
              >
                Answer
              </Typography>
              <RichTextEditor text={ans} setText={setAns} />
            </div>
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
