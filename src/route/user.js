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
    router.delete('/delete-user', userController.deleteUser);
    router.post('/update-user-by-id', userController.updateUserByID);

    return app.use('/api', router);
};

export default initDBUser;
