//import { connectToDB, getDB } from '../config/connectDB';
import userService from '../service/userService';

// let db;
// connectToDB((err) => {
//     if (!err) {
//         db = getDB();
//     }
// });

let createNewUser = async (req, res) => {
    try {
        let data = req.body;
        let respon = await userService.createNewUser(data);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let login = async (req, res) => {
    try {
        let data = req.body;
        let respon = await userService.login(data);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllUsers = async (req, res) => {
    try {
        let respon = await userService.getAllUsers();
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let deleteUser = async (req, res) => {
    try {
        let respon = await userService.deleteUser(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let updateUserByID = async (req, res) => {
    try {
        let respon = await userService.updateUserByID(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

export default {
    createNewUser,
    login,
    getAllUsers,
    deleteUser,
    updateUserByID,
};
