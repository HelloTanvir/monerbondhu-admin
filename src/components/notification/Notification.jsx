import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import NotificationsIcon from '@material-ui/icons/Notifications';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);

  const [titile, setTitile] = useState('');
  const [body, setBody] = useState('');
  const [notificationType, setNotificationType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titile || !body || !notificationType)
      return alert('Please fillup the form');

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/fcm', { titile, body }, {
        headers: {
          Authorization: token
        },
        params: {
          notificationType
        }
      });
      if (response) {
        setIsLoading(false);

        setTitile('');
        setBody('');
        setNotificationType('');

        alert(response.data.message || 'Notification sent successfully');
      }
    } catch (err) {
      setIsLoading(false);

      setTitile('');
      setBody('');
      setNotificationType('');

      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <Dialog
        open
        aria-labelledby="form-dialog-title"
        // scroll='body'
        scroll='paper'
        style={{ zIndex: -1, marginTop: 20 }}
        BackdropProps={{
          style: {
            backgroundColor: '#F3F4F6',
            boxShadow: 'none',
          },
        }}
        PaperProps={{
          style: {
            // backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle id="form-dialog-title">Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            value={titile}
            onChange={e => setTitile(e.target.value)}
          />

          <TextField
            autoFocus
            margin="dense"
            id="body"
            label="Body"
            multiline
            fullWidth
            value={body}
            onChange={e => setBody(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-controlled-open-select-label">Notification Type</InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={openSelect}
              onClose={() => setOpenSelect(false)}
              onOpen={() => setOpenSelect(true)}
              value={notificationType}
              onChange={e => setNotificationType(e.target.value)}
            >
              {
                ['all', 'free', 'paid'].map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)
              }
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary" endIcon={<NotificationsIcon />}>
            Send
            </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Notification;