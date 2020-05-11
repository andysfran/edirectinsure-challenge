import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const renderTask = ({ tasks, onCheck, onDelete, finished = false }) => {
    let taskFiltered = [];
    if (finished) {
        taskFiltered = tasks.filter((task) => task.finish_date);
    } else {
        taskFiltered = tasks.filter((task) => !task.finish_date);
    }

    if (taskFiltered.length === 0 && !finished) {
        return (
            <ListItem disabled={true} dense button>
                <ListItemText id={1} primary="Try to add some task." />
            </ListItem>
        )
    }

    return taskFiltered.map((task) => {
        const labelId = `checkbox-list-label-${task._id}`;
        const completed = task.finish_date !== null;
        const finishDate = completed ? new Date(task.finish_date).toUTCString() : null;

        return (
            <ListItem key={task._id} dense button onClick={() => finished? Swal.fire(`Completed at: ${finishDate}`) : onCheck(task._id)}>
                <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={completed}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    disabled={completed}
                />
                </ListItemIcon>
                <ListItemText id={labelId} primary={task.description} />
                { task.finish_date === null && (
                    <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => onDelete(task._id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                )}
            </ListItem>
        );
    });
}

const Tasks = ({ classes, project, tasks, onCheck, onSubmitTask, onDeleteTask }) => {

    const [taskName, setTaskName] = useState('');

    const addTask = () => {
        onSubmitTask(project, taskName);
        setTaskName('');
    }

    return (
        <List className={classes.root}>
            {renderTask({ tasks, onCheck, onDelete: onDeleteTask})}
            <Divider />
            {renderTask({ tasks, onCheck, finished: true })}
            <Divider />
            <div style={{ padding: '12px 12px', display: 'flex' }}>
                <TextField id="standard-basic" label="Description" onChange={(evt) => setTaskName(evt.target.value)} />
                <Button color="primary" size="small" onClick={addTask}>
                    Add Task
                </Button>
            </div>
        </List>
    );
}

const useStyles = {
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#ffffff',
    },
};

export default withStyles(useStyles)(Tasks);
