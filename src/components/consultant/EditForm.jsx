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
import RichTextEditor from './RichTextEditor';

export default function EditForm({ forceUpdate, currentData }) {
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [visitingDay, setVisitingDay] = useState('');
  const [description, setDescription] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setName('');
    setDesignation('');
    setVisitingDay('');
    setDescription('');
  };

  const editButtonHandler = () => {
    handleClickOpen();

    setName(currentData.name);
    setDesignation(currentData.designation);
    setVisitingDay(currentData.visitingDay);
    setDescription(currentData.description);
  }

  const handleEdit = async id => {
    if (!name || !designation || !visitingDay || !description)
      return alert('Please fillup the form');

    setOpen(false);
    setIsLoading(true);

    const updateData = {
      name,
      designation,
      visitingDay,
      description
    }

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.patch(`/consultent/${id}`, updateData, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);

        setName('');
        setDesignation('');
        setVisitingDay('');
        setDescription('');

        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);

      setName('');
      setDesignation('');
      setVisitingDay('');
      setDescription('');

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
            onClick={editButtonHandler}
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
          <DialogTitle id="form-dialog-title">Update Consultant</DialogTitle>
          <DialogContent>

            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
              // style={{ marginBottom: 15 }}
            />

            <TextField
              autoFocus
              margin="dense"
              name="designation"
              label="Designation"
              fullWidth
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              // style={{ marginBottom: 15 }}
            />

            <TextField
              autoFocus
              margin="dense"
              name="visitingDay"
              label="Visiting Day"
              fullWidth
              value={visitingDay}
              onChange={e => setVisitingDay(e.target.value)}
              style={{ marginBottom: 15 }}
            />

            {/* <TextField
              autoFocus
              margin="dense"
              name="content"
              label="Content"
              multiline
              fullWidth
              value={content}
              style={{ marginBottom: 36 }}
              onChange={e => setContent(e.target.value)}
            /> */}

            <RichTextEditor text={description} setText={setDescription} />

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
