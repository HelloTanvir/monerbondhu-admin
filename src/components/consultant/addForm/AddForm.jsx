import { FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import React, { useState } from 'react';
import { axios } from '../../../axios';
import Loader from '../../Loader';
import SelectService from './SelectService';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function AddForm({ designations, serviceOptions, forceUpdate }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSumbit, setIsSubmit] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visitingDay, setVisitingDay] = useState('');
  const [visitingTime, setVisitingTime] = useState('');
  const [designation, setDesignation] = useState('');
  const [image, setImage] = useState(null);
  const [services, setServices] = useState([]);

  const clearAll = () => {
    setName('');
    setDescription('');
    setServices([]);
    setVisitingDay('');
    setVisitingTime('');
    setDesignation('');
    setImage(null);
    setIsSubmit(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    clearAll();
  };

  const handleServiceRemove = (idx) => {
    setServices(prev => {
      const prevService = [...prev];
      prevService.splice(idx, 1);
      return [...prevService];
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);

    if (!name || !description || !services.length || !visitingDay || !visitingTime || !designation || !image) return;

    setOpen(false);

    setIsLoading(true);

    const bodyFormData = new FormData();
    bodyFormData.append('name', name);
    bodyFormData.append('description', description);
    bodyFormData.append('visitingDay', visitingDay);
    bodyFormData.append('time', visitingTime);
    bodyFormData.append('designation', designation);
    bodyFormData.append('image', image);
    bodyFormData.append('services', JSON.stringify(services));

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
              error={isSumbit && !name}
              helperText={(isSumbit && !name) ? 'Please provide your name' : ''}
              margin="dense"
              name="name"
              label="Name"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <FormControl fullWidth error={isSumbit && !designation}>
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
              {
                isSumbit && !designation
                  ? <FormHelperText>Please select a designation</FormHelperText>
                  : ''
              }
            </FormControl>

            <TextField
              error={isSumbit && !visitingDay}
              helperText={(isSumbit && !visitingDay) ? 'Please provide your visiting day' : ''}
              margin="dense"
              name="visitingDay"
              label="Visiting Day"
              fullWidth
              value={visitingDay}
              onChange={e => setVisitingDay(e.target.value)}
            />

            <TextField
              error={isSumbit && !visitingTime}
              helperText={(isSumbit && !visitingTime) ? 'Please provide your visiting time' : ''}
              margin="dense"
              name="visitingTime"
              label="Visiting Time"
              fullWidth
              value={visitingTime}
              onChange={e => setVisitingTime(e.target.value)}
            />

            <TextField
              error={isSumbit && !description}
              helperText={(isSumbit && !description) ? 'Please write a description' : ''}
              margin="dense"
              name="description"
              label="Description"
              multiline
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <SelectService
              serviceOptions={serviceOptions}
              services={services}
              setServices={setServices}
            />
            {
              isSumbit && !services.length
                ? <Typography
                    color='error'
                    style={{
                      fontSize: '0.75rem',
                      letterSpacing: '0.03333em',
                      fontWeight: 400
                    }}
                  >
                    Please add service
                  </Typography>
                : ''
            }

            <Typography>
              {
                services.map((service, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      margin: '7px 0'
                    }}
                  >
                    <div>
                      {
                        `${service.name} - ${service.mode} - ${service.duration} - ${service.fee}`
                      }
                    </div>
                    <DeleteIcon
                      color='secondary'
                      fontSize='small'
                      style={{cursor: 'pointer'}}
                      onClick={() => handleServiceRemove(index)}
                    />
                  </div>
                ))
              }
            </Typography>

            <span style={{ display: 'block', marginTop: 15 }}>
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