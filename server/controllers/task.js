const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const router = express.Router();
const { validateParams, isLoggedIn }  = require('../utils/validations');
const TaskModel = require('../models/Task');

const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Add task
router.post('/task/add', validateParams([
    { 'param_key': 'description', param_name: 'Description', required: true },
    { 'param_key': 'project_id', param_name: 'Project', required: true }
]), (req, res) => {
    if (isLoggedIn(req)) {
        client.connect(async err => {
            if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
            const { description, project_id } = req.body;
            const resTask = await TaskModel.addTask(client, {
                description,
                project_id,
                create_date: Date.now(),
                finish_date: null
            });
            const httpCode = resTask.success? 200 : 500;
            res.status(httpCode).send(resTask);
        });
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

// Delete task
router.delete('/task/:id', (req, res) => {
    if (isLoggedIn(req)) {
        client.connect(async err => {
            if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
            const resDel = await TaskModel.deleteTask(client, req.params.id);
            const httpCode = resDel.success? 200 : 500;
            res.status(httpCode).send(resDel);
        });
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
});

// Complete the task
router.put('/task/:id', (req, res) => {
    if (isLoggedIn(req)) {
        if (!req.params.id) {
            res.status(500).send({ success: false, message: 'Task is required!' });
        } else {
            client.connect(async err => {
                if (err) res.status(500).send({ success: false, message: 'Cannot connect with database.' });
                const resUpt = await TaskModel.completeTask(client, req.params.id);
                const httpCode = resUpt.success? 200 : 500;
                res.status(httpCode).send(resUpt);
            });
        }
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized!' });
    }
})

module.exports = router;
