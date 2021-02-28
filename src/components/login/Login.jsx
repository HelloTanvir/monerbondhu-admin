import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader';
import Classes from './Login.module.css';

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Moner Bondhu
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = () => {
    const history = useHistory();

    const [errorMsg, setErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const classes = useStyles();

    const [state, setState] = useState({
        username: '',
        password: '',
        remember: false
    });

    const changeHandler = e => {
        if (e.target.name === 'remember') return setState({
            ...state,
            remember: !state.remember
        });

        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            const response = await Axios.post('/admin/login', {
                username: state.username,
                password: state.password
            });

            if (response) {
                setErrorMsg('');
                setIsLoading(false);
            }

            localStorage.setItem('token', response.data.token);

            history.push('/dashboard');
        } catch (err) {
            setErrorMsg(err.response.data.message);
            setIsLoading(false);
            alert(err.response.data.message || 'Something went wrong');
        }
    }

    return (
        <>
            <Loader open={isLoading} />
            <Container component="main" maxWidth="xs" className={Classes.loginBox}>
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
            </Typography>
                    <form className={classes.form} noValidate onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoFocus
                            value={state.username}
                            onChange={changeHandler}
                        />
                        {
                            !!errorMsg ? <div className={Classes.error_msg}>{errorMsg}</div> : ''
                        }
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={state.password}
                            onChange={changeHandler}
                        />
                        {
                            !!errorMsg ? <div className={Classes.error_msg}>{errorMsg}</div> : ''
                        }
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    name="remember"
                                    onChange={changeHandler}
                                    checked={state.remember}
                                />
                            }
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Log In
            </Button>
                    </form>
                </div>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </Container>
        </>
    );
}

export default Login;