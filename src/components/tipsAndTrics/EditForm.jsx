import { Typography } from '@material-ui/core';
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
  const [isSumbit, setIsSubmit] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const clearAll = () => {
    setTitle('');
    setContent('');
    setIsSubmit(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearAll();
  };

  const editButtonHandler = (updatedTitle, updatedContent) => {
    handleClickOpen();
    setTitle(updatedTitle);
    setContent(updatedContent);
  }

  const handleEdit = async id => {
    setIsSubmit(true);

    if (!title || !content) return;

    setOpen(false);
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.patch('/tipsamdtricks', { id, title, content }, {
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
            onClick={() => editButtonHandler(currentData.title, currentData.content)}
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
          <DialogTitle id="form-dialog-title">Update This Tips & Tricks</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              error={isSumbit && !title}
              helperText={(isSumbit && !title) ? 'Please add a title' : ''}
              margin="dense"
              name="title"
              label="Title"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ marginBottom: 15 }}
            />

            <RichTextEditor text={content} setText={setContent} />
            {
              isSumbit && !content
                ? <Typography
                    color='error'
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.03333em',
                      fontWeight: 400
                    }}
                  >
                    Please add content
                  </Typography>
                : ''
            }

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
