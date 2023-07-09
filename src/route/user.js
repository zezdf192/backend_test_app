import express from 'express';
import userController from '../controller/userController';
import allCodeController from '../controller/allCodeController';

const router = express.Router();

const initDBUser = (app) => {
    router.post('/create-new-user', userController.createNewUser);
    router.post('/login', userController.login);

    //allcode
    router.get('/get-allCode', allCodeController.getAllCode);

    //user
    router.get('/get-all-users', userController.getAllUsers);
    router.get('/get-detail-user', userController.getDetailUser);
    router.delete('/delete-user', userController.deleteUser);
    router.post('/update-user-by-id', userController.updateUserByID);

    router.post('/update-user-by-email', userController.updateUserByEmail);

    router.post('/create-user-by-social', userController.createNewUserBySocial);
    router.post('/get-exam-user-like', userController.getUserLikeExam);

    router.post('/user-like-exam', userController.userLikeExam);

    router.post('/edit-password', userController.editPassword);
    router.post('/get-all-exam-user-like', userController.getAllExamUserLike);

    router.post('/get-code-forgot-password', userController.forgotPassword);
    router.post('/change-password', userController.changePassword);

    router.post('/filter-user-by-admin', userController.filterUserByAdmin);

    return app.use('/api', router);
};

export default initDBUser;
