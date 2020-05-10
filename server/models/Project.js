
/**
 * Create a new Project
 * 
 * @param {Object} client 
 * @param {Object} projObj 
 */
const addProject = async (client, projObj) => {
    try {
        const collection = client.db("edirect").collection("project");
        const result = await collection.insertOne(projObj);

        if (result.insertedId) {
            return { success: true, message: `Project added!`, projectID: result.insertedId };
        } else {
            return { success: false, errCode: 1, message: `Error to create the project.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to create the project: ${error}` };
    }
}

/**
 * Update the project name
 * 
 * @param {Object} client
 * @param {string} userID
 * @param {string} projID
 * @param {Object} projObj
 */
const updateProject = async (client, userID, projID, projObj) => {
    try {
        let ObjectID = require('mongodb').ObjectID;
        const collection = client.db("edirect").collection("project");
        const result = await collection.updateOne({ '_id': ObjectID(projID), user: userID }, { $set: projObj });
        if (result.modifiedCount === 1) {
            return { success: true, message: `Project updated!` };
        } else {
            return { success: false, errCode: 1, message: `Error to update the project.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to update the project: ${error}` };
    }
}

/**
 * Delete some project
 * 
 * @param {Object} client 
 * @param {string} userID 
 * @param {string} projID 
 */
const deleteProject = async (client, userID, projID) => {
    try {
        let ObjectID = require('mongodb').ObjectID;
        const collection = client.db("edirect").collection("project");
        const result = await collection.deleteOne({ '_id': ObjectID(projID), user: userID });
        if (result.deletedCount === 1) {
            return { success: true, message: `Project deleted!` };
        } else {
            return { success: false, errCode: 1, message: `Error to delete the project.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to delete the project: ${error}` };
    }
}

/**
 * Fetch all the projects and their tasks by user ID.
 * 
 * @param {Object} client 
 * @param {string} userID 
 */
const getAllProjects = async (client, userID) => {
    try {
        const collection = client.db("edirect").collection("project");
        const result = await collection.aggregate([
            { $match: { user: userID } },
            {
                "$project": {
                    "_id": {
                        "$toString": "$_id"
                    },
                    name: 1,
                    user: 1
                }
            },
            {
                $lookup: {
                    from: 'task',
                    localField: '_id',
                    foreignField: 'project_id',
                    as: 'tasks'
                }
            }
        ]).toArray();
        if (Array.isArray(result)) {
            return { success: true, result };
        } else {
            return { success: false, errCode: 1, message: `Error to fetch the project.` };
        }
    } catch (error) {
        return { success: false, errCode: 2, message: `Error to fetch the project: ${error}` };
    }
}

module.exports = {
    addProject,
    updateProject,
    deleteProject,
    getAllProjects
}
