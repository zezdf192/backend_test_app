import express from 'express';
import examController from '../controller/examController';
import ratingController from '../controller/ratingController';

const router = express.Router();

const initDBExam = (app) => {
    router.post('/create-new-exam', examController.createNewExam);

    router.get('/get-all-exam', examController.getAllExam);

    router.get('/get-detail-exam-by-id', examController.getDetailExamById);

    router.post('/delete-exam-by-id', examController.deleteExamById);

    router.post('/update-exam-by-id', examController.updateExamById);

    // Exam students
    router.post('/create-copy-score-belong-to-user', examController.createCopyScoreBelongToUser);
    router.get('/get-copy-score-by-code', examController.getCopyScoreByCode);

    router.post('/student-do-exam', examController.studentDoExam);

    router.post('/get-detail-do-exam-by-id', examController.getDetailDoExamById);

    // Table Do Exam
    router.post('/get-all-do-exam-by-user-id', examController.getAllDoExamByUserId);

    //filter exam - doexam
    router.post('/search-all-do-exam-by-user-id', examController.searchAllDoExamByUserId);
    router.post('/sort-do-exam-by-key', examController.sortDoExamByKey);

    //filter exam - exam
    router.post('/get-all-exam-by-user-id', examController.getAllExamByUserID);
    router.post('/search-all-exam-by-user-email', examController.searchAllExamByUserEmail);
    router.post('/sort-exam-by-key', examController.sortExamByKey);

    //Ratings
    router.get('/get-less-list-exam-ratings', ratingController.getLessListExamRatings);

    router.get('/get-detail-exam-ratings', ratingController.getDetailExamRatings);
    router.post('/filter-exam-ratings', ratingController.filterExamRatings);
    router.get('/get-all-do-exam-ratings', ratingController.getAllDoExamRatings);

    router.post('/sort-my-ratings-by-type', ratingController.sortMyRatingsByType);

    //exam private
    router.post('/get-exam-private-by-code', examController.getExamPrivateByCode);

    router.post('/get-detail-exam-private-for-verify', examController.getDetailExamPrivateForVerify);

    return app.use('/api', router);
};

export default initDBExam;
