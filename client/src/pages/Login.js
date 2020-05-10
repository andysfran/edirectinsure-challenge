import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class Login extends Component {

    state = {
        email: '',
        pass: '',
        loading: false
    }

    componentDidMount() {
        let data = sessionStorage.getItem('user');
		if (data) {
			this.props.history.push('/');
		}
    }

    login = () => {
        const { email, pass } = this.state;
        const fields = [email, pass].filter(Boolean);
        if (fields.length < 2) {
            Swal.fire('E-mail and password are required.');
        } else {
            this.setState({ loading: true });
            axios.post('http://localhost:3001/api/login', { email: email, password: pass })
                .then((res) => {
                    this.setState({ loading: false });
                    if(res.status === 200 && res.data.success) {
                        sessionStorage.setItem('user', JSON.stringify(res.data.user));
                        this.props.updateUser({ loggedIn: true, user: res.data.user });
                        this.props.history.push('/');
                    } else {
                        Swal.fire(res.data.message);
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    render() {
        return (
            <div style={{ paddingTop: 32 }}>
                <Grid container justify="center" alignItems="center" space={2}>
                    <Grid item xs={4}>
                        <Typography variant="h4">Login:</Typography>
                        <Paper>
                            <div style={{ padding: 16 }}>
                                <TextField
                                    type="email"
                                    fullWidth
                                    label="E-mail"
                                    onChange={(event) => this.setState({ email: event.target.value })}
                                />
                                <TextField 
                                    type="password"
                                    fullWidth
                                    label="Password"
                                    onChange={(event) => this.setState({ pass: event.target.value })}
                                />
                                <div style={{ paddingTop: 10, justifyContent: 'center' }}>
                                    <Button variant="contained" fullWidth color="primary" onClick={this.login} disabled={this.state.loading}>
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Login;
