import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { useState } from 'react';
import Avatar from '../../assets/Avatar.jpg';
import { axios } from '../../axios';
import Loader from '../Loader';
import AddForm from './AddForm';
import FullContent from './FullContent';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  media: {
    height: 250,
  },
  consultantContainer: {
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: 'repeat(auto-fit, 250px)',
    gridRowGap: 50,
    gridColumnGap: 50,
  },
});

export default function MediaCard({ apiData, forceUpdate }) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIdx, setEditingIdx] = useState(-1);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClose = () => {
    setIsEditing(false);
    setEditingIdx(-1);
    setTitle('');
    setContent('');
  };

  const editButtonHandler = (updatedTitle, updatedContent, idx) => {
    setIsEditing(true);
    setEditingIdx(idx);
    setTitle(updatedTitle);
    setContent(updatedContent);
  }

  const handleEdit = async id => {
    if (!title || !content) return alert('Please fillup the form');

    setIsEditing(false);
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;
    try {
      const response = axios.patch('/tipsamdtricks', { id, title, content }, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);
        forceUpdate();
        setEditingIdx(-1);
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setIsLoading(false);
      setEditingIdx(-1);
      setTitle('');
      setContent('');
      alert(err.response.data.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/tipsamdtricks', {
        headers: { Authorization: token },
        data: {
          id
        }
      });

      if (response) {
        setIsLoading(false);
        alert('Deleted Successfully');
        forceUpdate();
      }
    } catch (err) {
      setIsLoading(false);
      alert(err.response.data.message || 'Something went wrong');
    }
  }

  return (
    <>
      <Loader open={isLoading} />
      <AddForm forceUpdate={forceUpdate} />
      <div className={classes.consultantContainer}>
        {
          apiData.map((data, idx) => (
            <Card key={idx} className={classes.root}>
              <CardActionArea>
                {
                  data.videoLink
                    ? <a target="_blank" rel="noreferrer" href={data.videoLink}>
                      <CardMedia
                        className={classes.media}
                        image={data.image || Avatar}
                        title="Consultant"
                      />
                    </a>
                    : <CardMedia
                      className={classes.media}
                      image={data.image || Avatar}
                      title="Consultant"
                      onClick={() => alert('This has no video attached')}
                    />
                }

                <CardContent>
                  {
                    (isEditing && editingIdx === idx)
                      ? <TextField
                        id="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                      />
                      : <Typography gutterBottom variant="h5" component="h2">
                        {data.title}
                      </Typography>
                  }

                  <Typography variant="body2" color="textSecondary" component="p">
                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Date:
                  </Typography> {new Date(data.date).toLocaleDateString("en-US")} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Time:
                  </Typography> {new Date(data.date).toLocaleTimeString("en-US")} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      View Count:
                  </Typography> {data.viewCount} <br />

                    {
                      (isEditing && editingIdx === idx)
                        ? <TextField
                          id="content"
                          label="Content"
                          variant="outlined"
                          multiline
                          fullWidth
                          value={content}
                          onChange={e => setContent(e.target.value)}
                        />
                        : <>
                          <Typography
                            variant="h6"
                            color='textPrimary'
                            style={{ fontSize: 16, display: 'inline-block', }}
                          >
                            Content:
                          </Typography> {
                            data.content.length > 100
                              ? <>
                                {`${data.content.slice(0, 99)}...`}
                                <FullContent content={data.content} />
                              </>
                              : data.content
                          }
                        </>
                    }
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(data._id)}
                >
                  Delete
              </Button>

                {
                  isEditing && editingIdx === idx
                    ? <div>
                      <ClearIcon
                        style={{ cursor: 'pointer', color: 'red', marginRight: 7 }}
                        onClick={() => handleClose()}
                      />
                      <CheckIcon
                        style={{ cursor: 'pointer', color: 'green' }}
                        onClick={() => handleEdit(data._id)}
                      />
                    </div>
                    : <Button
                      size="small"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => editButtonHandler(data.title, data.content, idx)}
                    >
                      edit
                  </Button>
                }
              </CardActions>
            </Card>
          ))
        }
      </div>
    </>
  );
}
