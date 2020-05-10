import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tasks from '../components/Tasks';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoadingImage from '../resources/loading.svg';

class Home extends Component {

    state = {
        projectName: '',
        loading: false,
        data: []
    }

    componentDidMount() {
        this.getProjects();
    }

    /**
     * Fetch all projects
     */
    getProjects = () => {
        this.setState({ loading: true });
        axios.get('http://localhost:3001/api/project', {withCredentials: true})
            .then((res) => {
                if(res.status === 200 && res.data.success) {
                    this.setState({ loading: false, data: res.data.result })
                }
            })
            .catch((err) => console.log(err));
    }

    /**
     * Complete single task
     */
    completeTask = async (idTask) => {
        const resUpt = await axios.put(`http://localhost:3001/api/task/${idTask}`);
        Swal.fire(resUpt.data.message);
        if (resUpt.data.success) {
            this.getProjects();
        }
    }
    
    /**
     * Add task to specific project
     */
    addTask = async (projectID, description) => {
        const data = {
            project_id: projectID,
            description
        };
        const resAdd = await axios.post('http://localhost:3001/api/task/add', data);
        Swal.fire(resAdd.data.message);
        if (resAdd.data.success) {
            this.getProjects();
        }
    }

    /**
     * Delete some task
     */
    deleteTask = async (taskID) => {
        const resDel = await axios.delete(`http://localhost:3001/api/task/${taskID}`);
        Swal.fire(resDel.data.message);
        if (resDel.data.success) {
            this.getProjects();
        }
    }

    /**
     * Update project name
     */
    editProjectName = (projectID) => {
        Swal.fire({
            title: 'Edit project name:',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Save',
            preConfirm: (name) => {
                return axios.put(`http://localhost:3001/api/project/${projectID}`, { name })
                    .then((res) => {
                        if (!res.data.success) {
                            throw new Error(res.data.message);
                        }
                        return res.data;
                    })
                    .catch((err) => {
                        Swal.showValidationMessage(err);
                    });
            }
        }).then(() => {
            this.getProjects();
        });
    }

    /**
     * Create new project
     */
    addProject = () => {
        if (this.state.projectName.length >= 4) {
            axios.post(`http://localhost:3001/api/project/add`, { name: this.state.projectName })
            .then((res) => {
                if (!res.data.success) {
                    throw new Error(res.data.message);
                } else {
                    Swal.fire(
                        'Success!',
                        res.data.message,
                        'success'
                    );
                    this.setState({ projectName: '' }, () => this.getProjects());
                }
                
            })
            .catch((err) => {
                Swal.showValidationMessage(err);
            });
        } else {
            Swal.fire(
                'Hey!',
                "Project name must be at least 4 characters in length.",
                'warning'
            );
        }
    }

    /**
     * Render the project and their tasks
     */
    renderProject = () => {
        return this.state.data.map((proj) => (
            <Grid key={proj._id} item xs={3} space={2}>
                <Grid container direction="row" alignItems="center">
                    <div style={{ paddingRight: 10 }}>
                        <IconButton edge="end" onClick={() => this.editProjectName(proj._id)}>
                            <EditIcon />
                        </IconButton>
                    </div>
                    <Typography variant="h6">{proj.name}</Typography>
                </Grid>
                <Tasks
                    project={proj._id}
                    tasks={proj.tasks}
                    onCheck={this.completeTask}
                    onSubmitTask={this.addTask}
                    onDeleteTask={this.deleteTask}
                />
            </Grid>
        ));
    }

    render() {
        return (
            <Grid container direction="row">
                { this.state.loading?
                    <Grid container xs={12} justify="center">
                        <img src={LoadingImage} width={64} height={64} alt="Loading please wait..." />
                    </Grid>
                :
                    <Fragment>
                        <div style={{ padding: '12px 12px', display: 'flex' }}>
                            <TextField id="standard-basic" label="Project Name" onChange={(evt) => this.setState({ projectName: evt.target.value})} />
                            <Button color="primary" size="small" onClick={this.addProject}>
                                Add Project
                            </Button>
                        </div>
                        <Grid container direction="row" spacing={2} xs={12}>
                            {this.renderProject()}
                        </Grid>
                    </Fragment>
                }
            </Grid>
            
        );
    }
}

export default (Home);
