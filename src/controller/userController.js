//import { connectToDB, getDB } from '../config/connectDB';
import mailService from '../service/mailService';
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

let createNewUserBySocial = async (req, res) => {
    try {
        let respon = await userService.createNewUserBySocial(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getDetailUser = async (req, res) => {
    try {
        let respon = await userService.getDetailUser(req.query);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let updateUserByEmail = async (req, res) => {
    try {
        let respon = await userService.updateUserByEmail(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let editPassword = async (req, res) => {
    try {
        let respon = await userService.editPassword(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getUserLikeExam = async (req, res) => {
    try {
        let respon = await userService.getUserLikeExam(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let userLikeExam = async (req, res) => {
    try {
        let respon = await userService.userLikeExam(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllExamUserLike = async (req, res) => {
    try {
        let respon = await userService.getAllExamUserLike(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let forgotPassword = async (req, res) => {
    try {
        let respon = await mailService.forgotPassword(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let changePassword = async (req, res) => {
    try {
        let respon = await mailService.changePassword(req.body);
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
    createNewUserBySocial,
    getDetailUser,
    updateUserByEmail,
    editPassword,
    getUserLikeExam,
    userLikeExam,
    getAllExamUserLike,
    forgotPassword,
    changePassword,
};
