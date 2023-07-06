import ratingService from '../service/ratingService';

let getLessListExamRatings = async (req, res) => {
    try {
        let respon = await ratingService.getLessListExamRatings(req.query.keyword);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getDetailExamRatings = async (req, res) => {
    try {
        let respon = await ratingService.getDetailExamRatings(req.query.examID);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let filterExamRatings = async (req, res) => {
    try {
        let respon = await ratingService.filterExamRatings(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let getAllDoExamRatings = async (req, res) => {
    try {
        let respon = await ratingService.getAllDoExamRatings(req.query.email);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let sortMyRatingsByType = async (req, res) => {
    try {
        let respon = await ratingService.sortMyRatingsByType(req.body);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

export default {
    getLessListExamRatings,
    getDetailExamRatings,
    filterExamRatings,
    getAllDoExamRatings,
    sortMyRatingsByType,
};
