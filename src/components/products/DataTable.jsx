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

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [dis, setDis] = useState('');

  const handleClose = () => {
    setIsEditing(false);
    setEditingIdx(-1);

    setName('');
    setPrice('');
    setDis('');
  };

  const editButtonHandler = (updatedName, updatedPrice, updatedDis, idx) => {
    setIsEditing(true);
    setEditingIdx(idx);
    setName(updatedName);
    setPrice(updatedPrice);
    setDis(updatedDis);
  }

  const handleEdit = async id => {
    if (!name || !price || !dis) return alert('Please fillup the form');

    setIsEditing(false);
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;
    try {
      const response = axios.patch('/shop', { id, dis, price, name }, {
        headers: { Authorization: token }
      });

      if (response) {
        setIsLoading(false);
        forceUpdate();
        setEditingIdx(-1);
        setName('');
        setPrice('');
        setDis('');
      }
    } catch (err) {
      setIsLoading(false);
      setEditingIdx(-1);
      setName('');
      setPrice('');
      setDis('');
      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/shop', {
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
              <CardActionArea style={{ cursor: 'auto' }}>
                <CardMedia
                  className={classes.media}
                  image={data.image || Avatar}
                  title="Product"
                />

                <CardContent>
                  {
                    (isEditing && editingIdx === idx)
                      ? <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                      : <Typography gutterBottom variant="h5" component="h2">
                        {data.name}
                      </Typography>
                  }

                  <Typography>
                    {
                      (isEditing && editingIdx === idx)
                        ? <TextField
                          id="price"
                          label="Price"
                          variant="outlined"
                          style={{ margin: '8px 0' }}
                          fullWidth
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                        />
                        : <>
                          <Typography
                            variant="h6"
                            color='textPrimary'
                            style={{ fontSize: 16, display: 'inline-block', }}
                          >
                            Price:
                          </Typography> {data.price} <br />
                        </>
                    }

                    {
                      (isEditing && editingIdx === idx)
                        ? <TextField
                          id="description"
                          label="Description"
                          variant="outlined"
                          multiline
                          fullWidth
                          value={dis}
                          onChange={e => setDis(e.target.value)}
                        />
                        : <>
                          <Typography
                            variant="h6"
                            color='textPrimary'
                            style={{ fontSize: 16, display: 'inline-block', }}
                          >
                            Description:
                          </Typography> {
                            data.dis.length > 50
                              ? <>
                                {`${data.dis.slice(0, 49)}...`}
                                <FullContent content={data.dis} />
                              </>
                              : data.dis
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
                      onClick={() => editButtonHandler(data.name, data.price, data.dis, idx)}
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
