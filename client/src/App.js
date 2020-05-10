import React, { Component, Fragment } from 'react';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Header from './components/Header';
import Container from '@material-ui/core/Container';

// Pages
import Projects from './pages/Projects';
import Login from './pages/Login';
import Signup from './pages/Signup';

axios.defaults.withCredentials = true;

class App extends Component {

	state = {
		user: { loggedIn: false, user: {} },
	}

	componentDidMount() {
		let data = sessionStorage.getItem('user');
		if (data) {
			this.setState({
				user: {
					loggedIn: true,
					user: JSON.parse(data)
				}
			});
		}
	}

	updateUser = (data) => {
		this.setState({ user: data });
	}

	render() {
		const { user } = this.state;
		return (
			<Fragment>
				{ user &&
				<Router>
					<Header userData={user} updateUser={this.updateUser} />
					<Container fixed>
						<Switch>
							<Route
								path="/"
								exact
								render={(routeProps) => <Projects userData={user} {...routeProps} />}
							/>
							<Route
								path="/login"
								exact
								render={(routeProps) => <Login userData={user} updateUser={this.updateUser} {...routeProps} />}
							/>
							<Route
								path="/signup"
								exact
								render={(routeProps) => <Signup updateUser={this.updateUser} {...routeProps} />}
							/>
						</Switch>
					</Container>
				</Router>
			}
			</Fragment >
		);
	}
}

export default App;
