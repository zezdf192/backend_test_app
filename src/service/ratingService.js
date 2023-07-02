import { connectToDB, getDB } from '../config/connectDB';

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

let getLessListExamRatings = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            //console.log(keyword);
            if (!keyword) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu keyword, vui lòng bổ sung',
                });
            } else {
                let exam = await db
                    .collection('exam')
                    .find({ 'data.title': { $regex: keyword, $options: 'i' } })
                    .limit(4)
                    .toArray();

                //console.log(exam);

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailExamRatings = (examID) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!examID) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu examID, vui lòng bổ sung',
                });
            } else {
                let exam = await db.collection('ratings').findOne({ 'data.examID': examID });

                //console.log(exam);

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let filterExamRatings = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.examID) {
                resolve({ errCode: 1, message: 'Nhập thiếu id bài thi' });
            } else {
                console.log(data);
                let exam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.examID': { $eq: data.examID } },

                            data.score
                                ? data.typeScore === 'greater'
                                    ? { 'data.maxScore': { $gte: +data.score } }
                                    : { 'data.maxScore': { $lte: +data.score } }
                                : {},
                            data.currentJoin
                                ? data.typeCurrentJoin === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.currentJoin } }
                                    : { 'data.quantityJoin': { $lte: +data.currentJoin } }
                                : {},
                            data.time
                                ? data.typeTime === 'greater'
                                    ? { 'data.valueTimeDoExam': { $gte: +data.time * 60 } }
                                    : { 'data.valueTimeDoExam': { $lte: +data.time * 60 } }
                                : {},
                            data.dayStart
                                ? {
                                      'data.dateDoExam': { $gte: data.dayStart },
                                  }
                                : {},
                            // data.dayEnd
                            //     ? {
                            //           'data.dateDoExam': { $lte: data.dayEnd },
                            //       }
                            //     : {},
                        ],
                    })
                    .sort(
                        data.typeRatings === 'less'
                            ? { ['data.maxScore']: -1, ['data.valueTimeDoExam']: 1, ['data.quantityJoin']: 1 }
                            : { ['data.maxScore']: 1, ['data.valueTimeDoExam']: -1, ['data.quantityJoin']: -1 },
                    )
                    .toArray();
                //console.log(exam);

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllDoExamRatings = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userID) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu userID, vui lòng bổ sung',
                });
            } else {
                let ratings = await db.collection('ratings').find({ 'users.userID': userID }).toArray();

                //console.log(exam);

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: ratings,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let sortMyRatingsByType = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!request.userID || !request.typeSort) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu, vui lòng bổ sung`,
                });
            } else {
                //console.log(request.type);
                let typeSort = request.typeSort === 'up' ? 1 : -1;

                let exam = await db
                    .collection('ratings')
                    .find({ 'users.userID': request.userID })
                    .sort({ ['users.' + request.type]: typeSort })
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getLessListExamRatings,
    getDetailExamRatings,
    filterExamRatings,
    getAllDoExamRatings,
    sortMyRatingsByType,
};
