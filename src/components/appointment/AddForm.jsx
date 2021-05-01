import { Divider, FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, Select, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

export default function AddForm({ consultants, forceUpdate }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [consultant, setConsultant] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [service, setService] = useState(null);
  const [name, setName] = useState(null);
  const [number, setNumber] = useState(null);
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState(null);
  const [story, setStory] = useState(null);

  const [isSumbit, setIsSubmit] = useState(false);

  const [idx, setIdx] = useState(null);

  const clearAll = () => {
      setConsultant(null);
      setDate(null);
      setTime(null);
      setService(null);
      setName(null);
      setNumber(null);
      setGender(null);
      setDob(null);
      setStory(null);
      setIdx(null);
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

    if (!consultant || !date || !time || !service || !name || !number || !gender || !dob || !story) return;

    setOpen(false);

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    const reqData = {
        name,
        givenMobileNumber: number,
        appointmentDate: date,
        appointmentTime: time,
        gender,
        dob,
        story,
        consultantName: consultant,
        service
    };

    try {
      const response = await axios.post('/consultent/appointment', reqData, {
        headers: { Authorization: token }
      });

      if (response) {
        forceUpdate();
        setIsLoading(false);
        clearAll();
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
          make new appointment
      </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Make New Appointment</DialogTitle>
          <DialogContent>
            <Typography>
                Appointment Details
            </Typography>

            <FormControl fullWidth error={isSumbit && !consultant}>
              <InputLabel>
                  Select Consultant
              </InputLabel>
              <Select
                autoFocus
                value={consultant}
                onChange={e => {
                    setIdx(+e.currentTarget.dataset.id);
                    setConsultant(e.target.value);
                }}
              >
                {
                    consultants?.map((c, index) => (
                        <MenuItem key={index} data-id={index} value={c.name}>
                            {c.name}
                        </MenuItem>
                    ))
                }
              </Select>
              {
                isSumbit && !consultant
                  ? <FormHelperText>Please select a consultant</FormHelperText>
                  : ''
              }
            </FormControl>

            <FormControl fullWidth error={isSumbit && !service}>
              <InputLabel>
                  Select Service
              </InputLabel>
              <Select
                value={service}
                onChange={e => setService(e.target.value)}
              >
                {
                    consultants[idx]?.service.map((s, index) => (
                        <MenuItem key={index} value={s}>
                            {`${s.name}-${s.mode}-${s.duration}-${s.fee}`}
                        </MenuItem>
                    ))
                }
              </Select>
              {
                isSumbit && !service
                  ? <FormHelperText>Please select a consultant</FormHelperText>
                  : ''
              }
            </FormControl>

            <form className={classes.container} noValidate>
                <TextField
                    id="date"
                    label="Select Date"
                    type="date"
                    // defaultValue="2017-05-24"
                    error={isSumbit && !date}
                    helperText={(isSumbit && !date) ? 'Please provide a date' : ''}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>

            <form className={classes.container} noValidate>
                <TextField
                    id="time"
                    label="Select Time"
                    type="time"
                    // defaultValue="07:30"
                    error={isSumbit && !time}
                    helperText={(isSumbit && !time) ? 'Please provide a date' : ''}
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 60, // 1 min
                    }}
                />
            </form>

            <Divider style={{margin: '20px 0'}} />
            
            <Typography>
                Personal Details
            </Typography>

            <TextField
              error={isSumbit && !name}
              helperText={(isSumbit && !name) ? 'Please provide your name' : ''}
              margin="dense"
              name="name"
              label="Full Name"
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <TextField
              error={isSumbit && !number}
              helperText={(isSumbit && !number) ? 'Please provide your mobile number' : ''}
              margin="dense"
              type='tel'
              name="number"
              label="Mobile Number"
              fullWidth
              value={number}
              onChange={e => setNumber(e.target.value)}
            />

            <FormControl fullWidth error={isSumbit && !gender}>
              <InputLabel>
                  Select Gender
              </InputLabel>
              <Select
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <MenuItem value={'male'}>Male</MenuItem>
                <MenuItem value={'female'}>Female</MenuItem>
              </Select>
              {
                isSumbit && !gender
                  ? <FormHelperText>Please select your gender</FormHelperText>
                  : ''
              }
            </FormControl>

            <form className={classes.container} noValidate>
                <TextField
                    id="date"
                    label="Date of Birth"
                    type="date"
                    // defaultValue="2017-05-24"
                    error={isSumbit && !dob}
                    helperText={(isSumbit && !dob) ? 'Please provide your date of birth' : ''}
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>

            <TextField
              error={isSumbit && !story}
              helperText={(isSumbit && !story) ? 'Please a short story' : ''}
              margin="dense"
              name="story"
              label="Short Story"
              multiline
              fullWidth
              value={story}
              onChange={e => setStory(e.target.value)}
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
