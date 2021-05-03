import { FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
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
  const [openCategory, setOpenCategory] = React.useState(false);
  const [openSubType, setOpenSubType] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSumbit, setIsSubmit] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [image, setImage] = useState(null);
  const [music, setMusic] = useState(null);

  const clearAll = () => {
    setName('');
    setCategory('');
    setSubType('');
    setImage(null);
    setMusic(null);
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

    if (!image || !name || !category || !subType || !music) return;

    setOpen(false);

    setIsLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append('image', image);
    bodyFormData.append('name', name);
    bodyFormData.append('category', category);
    bodyFormData.append('music', music);
    bodyFormData.append('subType', subType);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/music', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
          create new music
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create New Music</DialogTitle>
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

            <FormControl fullWidth error={isSumbit && !category}>
              <InputLabel id="demo-controlled-open-select-label">Category</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={openCategory}
                onClose={() => setOpenCategory(false)}
                onOpen={() => setOpenCategory(true)}
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {
                  ['meditation', 'music', 'stress', 'sleep'].map((category, idx) => <MenuItem key={idx} value={category}>{category}</MenuItem>)
                }
              </Select>
              {
                isSumbit && !category
                  ? <FormHelperText>Please select a category</FormHelperText>
                  : ''
              }
            </FormControl>

            <FormControl fullWidth error={isSumbit && !subType} style={{ marginBottom: 36 }}>
              <InputLabel id="demo-controlled-open-select-label-2">Sub Type</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label-2"
                id="demo-controlled-open-select-2"
                open={openSubType}
                onClose={() => setOpenSubType(false)}
                onOpen={() => setOpenSubType(true)}
                value={subType}
                onChange={e => setSubType(e.target.value)}
              >
                {
                  ['free', 'paid'].map((subType, idx) => <MenuItem key={idx} value={subType}>{subType}</MenuItem>)
                }
              </Select>
              {
                isSumbit && !subType
                  ? <FormHelperText>Please select a type</FormHelperText>
                  : ''
              }
            </FormControl>

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
            {
              isSumbit && !image
                ? <Typography
                    color='error'
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.03333em',
                      fontWeight: 400
                    }}
                  >
                    Please add an image
                  </Typography>
                : ''
            }

            <div style={{ marginTop: 10 }}>
              <input
                color="primary"
                accept='audio/*'
                type="file"
                onChange={e => setMusic(e.target.files[0])}
                id="icon-button-file-2"
                hidden
              />
              <label htmlFor="icon-button-file-2">
                <Button
                  variant="contained"
                  component="span"
                  className={classes.button}
                  size="large"
                  fullWidth
                  color='secondary'
                  endIcon={<MusicNoteIcon />}
                  style={{ textTransform: 'capitalize', margin: 'unset' }}
                >
                  Music
              </Button>
              </label>
            </div>
            {
              isSumbit && !music
                ? <Typography
                    color='error'
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.03333em',
                      fontWeight: 400
                    }}
                  >
                    Please add a music
                  </Typography>
                : ''
            }

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
