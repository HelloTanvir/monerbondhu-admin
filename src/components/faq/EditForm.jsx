import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import RichTextEditor from '../utils/RichTextEditor';

export default function EditForm({ forceUpdate, currentData }) {
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

  const editButtonHandler = (updatedQues, updatedAns) => {
    handleClickOpen();

    setQues(updatedQues);
    setAns(updatedAns);
  }

  const handleEdit = async id => {
    if (!ques || !ans) return alert('Please fillup the form');

    setOpen(false);
    setIsLoading(true);

    const reqData = {
      title: ques,
      body: ans
    }

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.put(`/faq/${id}`, reqData, {
        headers: { Authorization: token }
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => editButtonHandler(currentData.title, currentData.body)}
        >
            edit
        </Button>
        <Dialog
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth='md'
        >
          <DialogTitle id="form-dialog-title">Update This FAQ</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              name="ques"
              label="Question"
              fullWidth
              value={ques}
              onChange={e => setQues(e.target.value)}
              style={{ marginBottom: 15 }}
            />

            <RichTextEditor text={ans} setText={setAns} />

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
            <Button onClick={() => handleEdit(currentData.id)} color="primary">
              Submit
          </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
