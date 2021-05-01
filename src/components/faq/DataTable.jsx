import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import { axios } from '../../axios';
import Loader from '../Loader';
import ShowFullContent from '../utils/ShowFullContent';
import AddForm from './AddForm';
import EditForm from './EditForm';

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
    // gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gridTemplateColumns: '1fr',
    gridRowGap: 50,
    gridColumnGap: 50,
  },
  content: {
    height: 22,
    maxWidth: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    '& > *': {
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      boxSizing: 'border-box',
      margin: 0,
      padding: 0
    }
  }
});

export default function MediaCard({ apiData, forceUpdate }) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/faq', {
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
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {data.title}
                  </Typography>
                  <Typography>
                    <Typography
                      variant="h6"
                      color='textPrimary'
                      style={{ fontSize: 16, display: 'inline-block', }}
                    >
                      Answer:
                    </Typography> {
                      data.body.length > 35
                        ? <>
                            <div
                              className={classes.content}
                            >
                              {parse(data.body)}
                            </div>
                            <ShowFullContent
                              title={'Answer'}
                              content={parse(data.body)}
                            />
                          </>
                        : <div
                            className={classes.content}
                          >
                            {parse(data.body)}
                          </div>
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
                <EditForm
                  forceUpdate={forceUpdate}
                  currentData={{id: data._id, title: data.title, body: data.body}}
                />
              </CardActions>
            </Card>
          ))
        }
      </div>
    </>
  );
}
