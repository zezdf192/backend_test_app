import express from 'express';
import examController from '../controller/examController';

const router = express.Router();

const initDBExam = (app) => {
    router.post('/create-new-exam', examController.createNewExam);

    router.get('/get-all-exam', examController.getAllExam);

    router.get('/get-detail-exam-by-id', examController.getDetailExamById);

    router.post('/delete-exam-by-id', examController.deleteExamById);

    router.post('/update-exam-by-id', examController.updateExamById);

    // Exam students
    router.post('/student-do-exam', examController.studentDoExam);

    router.post('/get-detail-do-exam-by-id', examController.getDetailDoExamById);

    // Table Do Exam
    router.post('/get-all-do-exam-by-user-id', examController.getAllDoExamByUserId);

    //filter exam - doexam
    router.post('/search-all-do-exam-by-user-id', examController.searchAllDoExamByUserId);
    router.post('/sort-do-exam-by-key', examController.sortDoExamByKey);

    //filter exam - exam
    router.get('/search-all-exam', examController.searchAllExam);

    return app.use('/api', router);
};

export default initDBExam;
