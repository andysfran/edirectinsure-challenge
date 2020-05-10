import React, { Component } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class Signup extends Component {

    state = {
        name: '',
        email: '',
        pass: '',
        passConfirm: '',
        loading: false
    }

    componentDidMount() {
        let data = sessionStorage.getItem('user');
		if (data) {
			this.props.history.push('/');
		}
    }

    signUp = () => {
        const { name, email, pass, passConfirm } = this.state;
        const fields = [name, email, pass, passConfirm].filter(Boolean);
        if (fields.length < 4) {
            Swal.fire('All fields are required!');
        } else {
            if (pass.length < 6 || passConfirm.length < 6) {
                Swal.fire('Password: It must be at least 6 characters in length.');
            } else {
                if (pass === passConfirm) {
                    this.setState({ loading: true });
                    axios.post('http://localhost:3001/api/signup', { name: name, email: email, password: pass })
                        .then((res) => {
                            this.setState({ loading: false }, () => {
                                Swal.fire(res.data.message);
                                if(res.status === 200 && res.data.success) {
                                    this.props.history.push('/login');
                                }
                            });
                            
                        })
                        .catch((err) => Swal.fire(`Failed to signup: ${err}`));
                } else {
                    Swal.fire('The password is not equal!');
                }
            }
        }
    }

    render() {
        return (
            <div style={{ paddingTop: 32 }}>
                <Grid container justify="center" alignItems="center" space={2}>
                    <Grid item xs={4}>
                        <Typography variant="h4">Signup:</Typography>
                        <Paper>
                            <div style={{ padding: 16 }}>
                                <TextField
                                    fullWidth
                                    label="Full name"
                                    onChange={(event) => this.setState({ name: event.target.value })}
                                />
                                <TextField
                                    type="email"
                                    fullWidth
                                    label="E-mail"
                                    onChange={(event) => this.setState({ email: event.target.value })}
                                />
                                <TextField type="password" fullWidth label="Password" onChange={(event) => this.setState({ pass: event.target.value })} />
                                <TextField type="password" fullWidth label="Confirm" onChange={(event) => this.setState({ passConfirm: event.target.value })} />
                                <div style={{ paddingTop: 10, justifyContent: 'center' }}>
                                    <Button variant="contained" fullWidth color="primary" onClick={this.signUp} disabled={this.state.loading}>
                                        Signup
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

export default Signup;
