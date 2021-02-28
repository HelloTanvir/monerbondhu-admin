import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function AddForm({ forceUpdate }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const [image, setImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setTitle('');
    setContent('');
    setIsVideo(false);
    setVideoLink('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || (isVideo && !videoLink) || !image)
      return alert('Please fillup the form');

    setOpen(false);

    setIsLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append('title', title);
    bodyFormData.append('content', content);
    bodyFormData.append('isVideo', isVideo);
    bodyFormData.append('videoLink', videoLink);
    bodyFormData.append('image', image);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/tipsamdtricks', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });
      if (response) {
        setIsLoading(false);

        setTitle('');
        setContent('');
        setIsVideo(false);
        setVideoLink('');
        setImage(null);

        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);

      setTitle('');
      setContent('');
      setIsVideo(false);
      setVideoLink('');
      setImage(null);

      alert(err.response.data.message || 'Something went wrong');
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          create new tips & tricks
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='xs'>
          <DialogTitle id="form-dialog-title">Create New Tips & Tricks</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill up the form...
          </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isVideo}
                  onChange={e => setIsVideo(e.target.checked)}
                  name="isVideo"
                  color="primary"
                />
              }
              label="Is Video ?"
            />

            <TextField
              autoFocus
              margin="dense"
              name="videoLink"
              label="Video Link"
              fullWidth
              value={videoLink}
              disabled={!isVideo}
              onChange={e => setVideoLink(e.target.value)}
            />

            <TextField
              autoFocus
              margin="dense"
              name="content"
              label="Content"
              multiline
              fullWidth
              value={content}
              style={{ marginBottom: 36 }}
              onChange={e => setContent(e.target.value)}
            />

            <span>
              <input
                color="primary"
                accept="image/*"
                type="file"
                onChange={e => setImage(e.target.files[0])}
                id="icon-button-file"
                hidden
              />
              <label htmlFor="icon-button-file">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                  size="large"
                  fullWidth
                  color="primary"
                  endIcon={<ImageIcon />}
                  style={{ textTransform: 'capitalize', margin: 'unset' }}
                >
                  Image
              </Button>
              </label>
            </span>

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
