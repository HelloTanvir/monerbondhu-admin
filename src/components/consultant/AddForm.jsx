import { FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
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

export default function AddForm({ designations, forceUpdate }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState(null);
  const [visitingDay, setVisitingDay] = useState('');
  const [visitingTime, setVisitingTime] = useState('');
  const [designation, setDesignation] = useState('');
  const [image, setImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setName('');
    setDescription('');
    setFee(null);
    setVisitingDay('');
    setVisitingTime('');
    setDesignation('');
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !fee || !visitingDay || !visitingTime || !designation || !image)
         return alert('Please fillup the form');

    setOpen(false);

    setIsLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append('name', name);
    bodyFormData.append('description', description);
    bodyFormData.append('fee', fee);
    bodyFormData.append('visitingDay', visitingDay);
    bodyFormData.append('time', visitingTime);
    bodyFormData.append('designation', designation);
    bodyFormData.append('image', image);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.post('/consultent', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        }
      });
      if (response) {
        setIsLoading(false);

        setName('');
        setDescription('');
        setFee(null);
        setVisitingDay('');
        setVisitingTime('');
        setDesignation('');
        setImage(null);

        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);

      setName('');
      setDescription('');
      setFee(null);
      setVisitingDay('');
      setVisitingTime('');
      setDesignation('');
      setImage(null);

      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  return (
    <>
      <Loader open={isLoading} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 22 }}>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          create new consultant
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='xs'>
          <DialogTitle id="form-dialog-title">Create New Consultant</DialogTitle>
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

            <FormControl fullWidth>
              <InputLabel id="demo-controlled-open-select-label">Designation</InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={openSelect}
                onClose={() => setOpenSelect(false)}
                onOpen={() => setOpenSelect(true)}
                value={designation}
                onChange={e => setDesignation(e.target.value)}
              >
                {
                  designations.map((designation, idx) => <MenuItem key={idx} value={designation}>{designation}</MenuItem>)
                }
              </Select>
            </FormControl>

            <TextField
              autoFocus
              type='number'
              InputProps={{ inputProps: { min: 0 } }}
              margin="dense"
              name="fee"
              label="Fee"
              fullWidth
              value={fee}
              onChange={e => setFee(e.target.value)}
            />

            <TextField
              autoFocus
              margin="dense"
              name="visitingDay"
              label="Visiting Day"
              fullWidth
              value={visitingDay}
              onChange={e => setVisitingDay(e.target.value)}
            />

            <TextField
              autoFocus
              margin="dense"
              name="visitingTime"
              label="Visiting Time"
              fullWidth
              value={visitingTime}
              onChange={e => setVisitingTime(e.target.value)}
            />

            <TextField
              autoFocus
              margin="dense"
              name="description"
              label="Description"
              multiline
              fullWidth
              value={description}
              style={{ marginBottom: 36 }}
              onChange={e => setDescription(e.target.value)}
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
