import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import TextBlock from '../components/TextBlock';
import Home from './Home';

class Projects extends Component {

    render() {
        return (
            <div style={{ margin: '16px 0px' }}>
                <Grid container space={2}>
                    <Grid item xs={12}>
                        {this.props.userData.loggedIn ?
                            <Home {...this.props} />
                            :
                            <TextBlock
                                title="Welcome to EdirectInsure challenge."
                                subtitle="Login or signup to access your projects."
                            />
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default Projects;
