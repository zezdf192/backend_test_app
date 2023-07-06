import examService from '../service/examService';

let createNewExam = async (req, res) => {
    try {
        let respon = await examService.createNewExam(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllExam = async (req, res) => {
    try {
        let respon = await examService.getAllExam();
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let deleteExamById = async (req, res) => {
    try {
        let respon = await examService.deleteExamById(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getDetailExamById = async (req, res) => {
    try {
        let respon = await examService.getDetailExamById(req.query.id);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let updateExamById = async (req, res) => {
    try {
        let respon = await examService.updateExamById(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let studentDoExam = async (req, res) => {
    try {
        let respon = await examService.studentDoExam(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getDetailDoExamById = async (req, res) => {
    try {
        let respon = await examService.getDetailDoExamById(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllDoExamByUserId = async (req, res) => {
    try {
        let respon = await examService.getAllDoExamByUserId(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let searchAllDoExamByUserId = async (req, res) => {
    try {
        let respon = await examService.searchAllDoExamByUserId(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let sortDoExamByKey = async (req, res) => {
    try {
        let respon = await examService.sortDoExamByKey(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllExamByUserID = async (req, res) => {
    try {
        let respon = await examService.getAllExamByUserID(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let searchAllExamByUserEmail = async (req, res) => {
    try {
        let respon = await examService.searchAllExamByUserEmail(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let sortExamByKey = async (req, res) => {
    try {
        let respon = await examService.sortExamByKey(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let createCopyScoreBelongToUser = async (req, res) => {
    try {
        let respon = await examService.createCopyScoreBelongToUser(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getCopyScoreByCode = async (req, res) => {
    try {
        let respon = await examService.getCopyScoreByCode(req.query.code);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getExamPrivateByCode = async (req, res) => {
    try {
        let respon = await examService.getExamPrivateByCode(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getDetailExamPrivateForVerify = async (req, res) => {
    try {
        let respon = await examService.getDetailExamPrivateForVerify(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

export default {
    createNewExam,
    getAllExam,
    deleteExamById,
    getDetailExamById,
    updateExamById,
    studentDoExam,
    getDetailDoExamById,
    getAllDoExamByUserId,
    searchAllDoExamByUserId,
    sortDoExamByKey,
    searchAllExamByUserEmail,
    getAllExamByUserID,
    sortExamByKey,
    createCopyScoreBelongToUser,
    getCopyScoreByCode,
    getExamPrivateByCode,
    getDetailExamPrivateForVerify,
};
