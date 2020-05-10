const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const router = express.Router();
const { validateParams, isLoggedIn }  = require('../utils/validations');
const ProjectModel = require('../models/Project');

const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Get all projects and tasks
router.get('/project', (req, res) => {
    if (isLoggedIn(req)) {
        client.connect(async err => {
            if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
            const userId = req.session.user._id;
            const resProject = await ProjectModel.getAllProjects(client, userId);
            const httpCode = resProject.success? 200 : 500;
            res.status(httpCode).send(resProject);
        });
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

// Create a Project
router.post('/project/add', validateParams([
    { 'param_key': 'name', param_name: 'Name', required: true }
]), (req, res) => {
    if (isLoggedIn(req)) {
        client.connect(async err => {
            if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
            const projectName = req.body.name;
            const userId = req.session.user._id;
            const resProject = await ProjectModel.addProject(client, { name: projectName, user: userId });
            const httpCode = resProject.success? 200 : 500;
            res.status(httpCode).send(resProject);
        });
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

// Update Project Name
router.put('/project/:id', validateParams([
    { 'param_key': 'name', param_name: 'Project Name', required: true }
]), (req, res) => {
    if (isLoggedIn(req)) {
        if (!req.params.id) {
            res.status(500).send({ success: false, message: 'Project is required!' });
        } else {
            client.connect(async err => {
                if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
                const { name } = req.body;
                const session = req.session.user;
                const resUpdate = await ProjectModel.updateProject(client, session._id, req.params.id, { name });
                const httpCode = resUpdate.success? 200 : 500;
                res.status(httpCode).send(resUpdate);
            });
        }
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

// Delete project
router.delete('/project/:id', (req, res) => {
    if (isLoggedIn(req)) {
        if (!req.params.id) {
            res.status(500).send({ success: false, message: 'Project is required!' });
        } else {
            // Delete all tasks of the project
            client.connect(async err => {
                if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
                const TaskModel = require('../models/Task');
                const session = req.session.user;
                await TaskModel.deleteAllTasks(client, req.params.id);
            });

            client.connect(async err => {
                if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
                const session = req.session.user;
                const resDelete = await ProjectModel.deleteProject(client, session._id, req.params.id);
                const httpCode = resDelete.success? 200 : 500;
                res.status(httpCode).send(resDelete);
            });
        }
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

module.exports = router;
