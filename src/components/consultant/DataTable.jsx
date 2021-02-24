import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import React, { useState } from 'react';
import Avatar from '../../assets/Avatar.jpg';
import Loader from '../Loader';
import AddForm from './AddForm';
import FullDescription from './FullDescription';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

export default function MediaCard({ apiData, designations, forceUpdate }) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  
  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
        const response = await axios.delete('/api/consultent', {
            headers: {Authorization: token},
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
    <AddForm designations={designations} forceUpdate={forceUpdate} />
    <div className={classes.consultantContainer}>
      {
        apiData.map((data, idx) => (
          <Card key={idx} className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={data.image || Avatar}
                title="Consultant"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {data.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <Typography variant="h6" color='textPrimary' style={{fontSize: 16, display: 'inline-block'}}>
                    Designation:
                  </Typography> {data.designation} <br />

                  <Typography variant="h6" color='textPrimary' style={{fontSize: 16, display: 'inline-block'}}>
                    Visiting Day:
                  </Typography> {data.visitingDay} <br />

                  <Typography variant="h6" color='textPrimary' style={{fontSize: 16, display: 'inline-block'}}>
                    Review:
                  </Typography> {data.review} <br />

                  <Typography variant="h6" color='textPrimary' style={{fontSize: 16, display: 'inline-block'}}>
                    Review Count:
                  </Typography> {data.reviewCount} <br />

                  <Typography variant="h6" color='textPrimary' style={{fontSize: 16, display: 'inline-block',}}>
                    Description:
                  </Typography> {
                            data.description.length > 50
                              ? <>
                                  {`${data.description.slice(0, 49)}...`}
                                  <FullDescription description={data.description} />
                                </>
                              : data.description
                          }
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
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
