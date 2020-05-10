
/**
 * Insert user in the system
 * 
 * @param {Object} client
 * @param {Object} userObj
 */
const addUser = async (client, params) => {
    try {
        const collection = client.db("edirect").collection("users");

        // Check if the user is already signup
        const userFound = await collection.findOne({ email: params.email });

        if (userFound) {
            return { success: false, errCode: 1, message: `E-mail already in use.` };
        } else {
            const result = await collection.insertOne(params);
            if (result.insertedId) {
                return { success: true, message: `Success!\nNow you can login.`, userID: result.insertedId };
            } else {
                return { success: false, errCode: 2, message: `Error to save the user data.` };
            }
        }
    } catch (e) {
        return { success: false, errCode: 3, message: `Error to save the user data: ${e}` };
    }
}

/**
 * 
 * @param {Object} client 
 * @param {Object} params 
 */
const loginUser = async (client, params) => {
    const collection = client.db("edirect").collection("users");
    const userFound = await collection.findOne(params, { projection: { password: 0 } });
    if (userFound) {
        return { success: true, message: 'Logged in successfully.', user: userFound };
    } else {
        return { success: false, message: 'Login failed, check the credentials.' };
    }
}

module.exports = {
    addUser,
    loginUser
}
