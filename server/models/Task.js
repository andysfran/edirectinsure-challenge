
/**
 * 
 * @param {Object} client 
 * @param {Object} taskObj 
 */
const addTask = async (client, taskObj) => {
    try {
        const collection = client.db("edirect").collection("task");
        const result = await collection.insertOne(taskObj);

        if (result.insertedId) {
            return { success: true, message: `Task added!`, projectID: result.insertedId };
        } else {
            return { success: false, errCode: 1, message: `Error to create the task.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to create the task: ${error}` };
    }
}

const deleteAllTasks = async (client, projectID) => {
    try {
        const collection = client.db("edirect").collection("task");
        const result = await collection.deleteMany({ 'project_id': projectID });
        if (result.deletedCount > 0) {
            return { success: true, message: `Tasks deleted!` };
        } else {
            return { success: false, errCode: 1, message: `Error to delete the task.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to delete the task: ${error}` };
    }
}

/**
 * Delete specific task
 * 
 * @param {Object} client 
 * @param {string} taskID 
 */
const deleteTask = async (client, taskID) => {
    try {
        let ObjectID = require('mongodb').ObjectID;
        const collection = client.db("edirect").collection("task");
        const result = await collection.deleteOne({ '_id': ObjectID(taskID) });
        if (result.deletedCount === 1) {
            return { success: true, message: `Task deleted!` };
        } else {
            return { success: false, errCode: 1, message: `Error to delete the task.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to delete the task: ${error}` };
    }
}

/**
 * Complete some task
 * @param {Object} client 
 * @param {string} taskID 
 */
const completeTask = async (client, taskID) => {
    try {
        let ObjectID = require('mongodb').ObjectID;
        const collection = client.db("edirect").collection("task");
        const result = await collection.updateOne({ '_id': ObjectID(taskID) }, { $set: { finish_date: Date.now() } });
        if (result.modifiedCount === 1) {
            return { success: true, message: `Task completed!` };
        } else {
            return { success: false, errCode: 1, message: `Error to complete the task.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to complete the task: ${error}` };
    }
}

/**
 * 
 * @param {Object} client 
 * @param {string} projectID 
 */
const getAllTasksByProject = async (client, projectID) => {
    try {
        const collection = client.db("edirect").collection("task");
        const result = await collection.find({ 'project_id': projectID }).toArray();
        if (result) {
            return { success: true, message: `Task completed!` };
        } else {
            return { success: false, errCode: 1, message: `Error to fetch the tasks.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error fetch the tasks: ${error}` };
    }
}

module.exports = {
    addTask,
    deleteAllTasks,
    deleteTask,
    completeTask,
    getAllTasksByProject
}
