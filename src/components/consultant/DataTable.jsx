import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import Avatar from '../../assets/Avatar.jpg';
import { axios } from '../../axios';
import Loader from '../Loader';
import AddForm from './AddForm';
import EditForm from './EditForm';
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
  description: {
    height: 20,
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

export default function MediaCard({ apiData, designations, forceUpdate }) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id) => {
    setIsLoading(true);

    const token = `Bearer ${localStorage.getItem('token')}`;

    try {
      const response = await axios.delete('/consultent', {
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
                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Designation:
                  </Typography> {data.designation} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Visiting Day:
                  </Typography> {data.visitingDay} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Review:
                  </Typography> {data.review} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block' }}>
                      Review Count:
                  </Typography> {data.reviewCount} <br />

                    <Typography variant="h6" color='textPrimary' style={{ fontSize: 16, display: 'inline-block', }}>
                      Description:
                  </Typography> {
                    data.description.length > 35
                    ? <>
                        <div
                          className={classes.description}
                        >
                          {parse(data.description)}
                        </div>
                        <FullDescription description={parse(data.description)} />
                      </>
                    : <div
                        className={classes.description}
                      >
                        {parse(data.description)}
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
                  currentData={{
                    id: data._id,
                    name: data.name,
                    designation: data.designation,
                    visitingDay: data.visitingDay,
                    description: data.description,
                  }}
                />
              </CardActions>
            </Card>
          ))
        }
      </div>
    </>
  );
}
