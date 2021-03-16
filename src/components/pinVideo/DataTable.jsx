import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import Avatar from '../../assets/Avatar.jpg';
import { axios } from '../../axios';
import Loader from '../Loader';
import AddForm from './AddForm';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  media: {
    height: 250,
  },
  dataContainer: {
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

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/pinvideo', {
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
      alert(err?.response?.data?.message ?? 'Something went wrong');
    }
  }

  return (
    <>
      <Loader open={isLoading} />
      <AddForm forceUpdate={forceUpdate} />
      <div className={classes.dataContainer}>
        {
          apiData.map((data, idx) => (
            <Card key={idx} className={classes.root}>
              <CardActionArea>
                {
                  data.ytlink
                    ? <a target="_blank" rel="noreferrer" href={data.ytlink}>
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
                  <Typography gutterBottom variant="h5" component="h2">
                    {data.name}
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
              </CardActions>
            </Card>
          ))
        }
      </div>
    </>
  );
}
