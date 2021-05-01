import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import React from 'react';
import RichTextEditor from '../utils/RichTextEditor';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditDescription = ({ description, setDescription }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="primary"
        size='small'
        variant='text'
        style={{paddingLeft: 0, paddingRight: 0, textTransform: 'none'}}
        onClick={handleClickOpen}
      >
        Edit
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id="alert-dialog-slide-title">Description</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">

            <RichTextEditor
                text={description}
                setText={setDescription}
            />

          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditDescription;