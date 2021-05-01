import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Close, Edit, Send } from '@material-ui/icons';
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import RichTextEditor from '../utils/RichTextEditor';

const PrivacyAndPolicy = () => {
  const [initialData, setInitialData] = useState(null);
  const [apiData, setApiData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [update, setUpdate] = useState(0);
  const forceUpdate = () => setUpdate(i => i + 1);

  useEffect(() => {
    const apiResponse = async () => {
        const token = `Bearer ${localStorage.getItem('token')}`;

        setIsLoading(true);

        try {
            const response = await axios.get('/privacy', {
                headers: { Authorization: token }
            });

            if (response) setIsLoading(false);

            setApiData(response.data.data.content);
            setInitialData(response.data.data.content);
        } catch (err) {
            setIsLoading(false);
            alert(err?.response?.data?.message ?? 'Something went wrong');
        }
      }
      apiResponse();
  }, [update]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiData)
      return alert('Please fillup the form');

    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.put('/privacy', { content: apiData }, {
        headers: {
          Authorization: token
        }
      });
      if (response) {
        setIsLoading(false);

        setIsEditing(false);

        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);

      setIsEditing(false);

      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  const handleCancel = () => {
    setApiData(initialData);
    setIsEditing(false);
  }

  return (
    <>
      <Loader open={isLoading} />
      <Dialog
        open
        aria-labelledby="form-dialog-title"
        scroll='paper'
        fullWidth
        maxWidth='md'
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
        <DialogTitle id="form-dialog-title">Privacy and policy</DialogTitle>
        <DialogContent>
          <div>
            {
              isEditing
                ? <RichTextEditor
                    text={apiData}
                    setText={setApiData}
                  />
                : <Typography gutterBottom variant="h6" component="h2">
                    {parse(apiData || '')}
                  </Typography>
            }
          </div>
        </DialogContent>
        <DialogActions>
          {
            isEditing
              ? <>
                  <Button
                    color="primary"
                    endIcon={<Close />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    endIcon={<Send />}
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </>
              : <Button
                    size="small"
                    color="secondary"
                    startIcon={<Edit />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                </Button>
          }
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PrivacyAndPolicy;