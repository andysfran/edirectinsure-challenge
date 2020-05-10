import React from 'react';
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Header = (props) => {
    const classes = useStyles();

    const logout = () => {
        sessionStorage.removeItem('user');
        props.updateUser({ loggedIn: false, user: {} });
        props.history.push('/');
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title} onClick={() => props.history.push('/')}>
                    EdirectInsure Challenge
                </Typography>
                { props.userData.loggedIn ?
                    [
                        <Typography key={0} className={classes.logoutText}>Hi, {props.userData.user.name}</Typography>,
                        <Button key={1} variant="contained" color="default" onClick={logout}>Logout</Button>
                    ]
                :
                    [
                        <Button key={0} color="inherit" onClick={() => props.history.push('/login')}>Login</Button>,
                        <Button key={1} color="inherit" onClick={() => props.history.push('/signup')}>Signup</Button>
                    ]
                }
            </Toolbar>
        </AppBar>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    logoutText: {
        textTransform: 'uppercase',
        paddingRight: 8
    },
    title: {
        cursor: 'pointer',
        flexGrow: 1,
    },
}));

export default withRouter(Header);
