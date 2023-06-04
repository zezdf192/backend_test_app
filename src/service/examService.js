import { connectToDB, getDB } from '../config/connectDB';
import { ObjectId } from 'mongodb';

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

let checkMissingParams = (data) => {
    let fileds = [];
    let value = '';
    Object.keys(data).forEach((key) => fileds.push(key));

    for (let i = 0; i < fileds.length; i++) {
        if (!data[fileds[i]] && data[fileds[i]] !== 0) {
            value = fileds[i];
            break;
        }
    }
    return value;
};

let createNewExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                let user = await db
                    .collection('users')
                    .find({ _id: new ObjectId(data.userID) })
                    .toArray();

                await db.collection('exam').insertOne({
                    data,
                    user: user[0],
                });

                resolve({
                    errCode: 0,
                    message: 'Tạo mới bài thi thành công',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllExam = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let exam = await db.collection('exam').find().toArray();

            resolve({
                errCode: 0,
                data: exam,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailExamById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                let exam = await db
                    .collection('exam')
                    .find({ _id: new ObjectId(id) })
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam[0],
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteExamById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(data.id)) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                await db.collection('exam').deleteOne({ _id: new ObjectId(data.id) });
                resolve({
                    errCode: 0,
                    message: 'Xóa bài thi thành công',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateExamById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                await db.collection('exam').updateOne({ _id: new ObjectId(data.examID) }, { $set: { data: data } });

                resolve({
                    errCode: 0,
                    message: 'Thay đổi bài thi thành công',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let studentDoExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                console.log(data);
                let doExam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.userID': data.userID },
                            {
                                'data.examID': data.examID,
                            },
                        ],
                    })
                    .toArray();

                if (doExam.length > 0) {
                    data.quantityJoin = +doExam[0].data.quantityJoin + 1;

                    if (doExam[0].data.maxScore >= data.maxScore) {
                        data.maxScore = doExam[0].data.maxScore;
                        if (doExam[0].data.valueTimeDoExamGreatest < data.valueTimeDoExamGreatest) {
                            data.valueTimeDoExamGreatest = doExam[0].data.valueTimeDoExamGreatest;
                            data.dateDoExam = doExam[0].data.dateDoExam;
                            data.timeVi = doExam[0].data.timeVi;
                            data.timeEn = doExam[0].data.timeEn;
                        }
                    }

                    await db.collection('doExam').updateOne(
                        {
                            $and: [
                                { 'data.userID': data.userID },
                                {
                                    'data.examID': data.examID,
                                },
                            ],
                        },
                        { $set: { data } },
                    );
                } else {
                    await db.collection('doExam').insertOne({
                        data,
                    });
                }

                // let exam = await db
                //     .collection('exam')
                //     .find({ _id: new ObjectId(data.examID) })
                //     .toArray();

                // await db
                //     .collection('exam')
                //     .updateOne(
                //         { _id: new ObjectId(data.examID) },
                //         { $set: { 'data.quantityJoin': exam[0].data.quantityJoin + 1 } },
                //     );

                let user = await db
                    .collection('users')
                    .find({ _id: new ObjectId(data.userID) })
                    .toArray();

                if (user.length > 0) {
                    let isCheck = true;

                    for (let i = 0; i < user[0].userExamID.length; i++) {
                        if (user[0].userExamID[i] === data.examID) {
                            isCheck = false;
                            break;
                        }
                    }

                    if (isCheck) {
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(data.userID) },
                            {
                                $set: {
                                    userExamID: [...user[0].userExamID, data.examID],
                                },
                            },
                        );
                    }
                }

                resolve({
                    errCode: 0,
                    message: 'Bạn đã hoàn thành bài thi, xin chúc mừng',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailDoExamById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                let exam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.userID': data.userID },
                            {
                                'data.examID': data.examID,
                            },
                        ],
                    })
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: exam[0],
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let searchAllDoExamByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userID) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                console.log(data);

                let exam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.userID': { $eq: data.userID } },
                            { 'data.nameExam': { $regex: data.name, $options: 'i' } },
                            data.score
                                ? data.typeScore === 'greater'
                                    ? { 'data.maxScore': { $gte: +data.score } }
                                    : { 'data.maxScore': { $lte: +data.score } }
                                : {},
                            data.turns
                                ? data.typeTurns === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.turns } }
                                    : { 'data.quantityJoin': { $lte: +data.turns } }
                                : {},
                            data.time
                                ? data.typeTime === 'greater'
                                    ? { 'data.valueTimeDoExamGreatest': { $gte: +data.time } }
                                    : { 'data.valueTimeDoExamGreatest': { $lte: +data.time } }
                                : {},
                            data.dayStart
                                ? {
                                      'data.dateDoExam': { $gte: data.dayStart },
                                  }
                                : {},
                            data.dayEnd
                                ? {
                                      'data.dateDoExam': { $lte: data.dayEnd },
                                  }
                                : {},
                        ],
                    })
                    .toArray();
                console.log(data);
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

let getAllDoExamByUserId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userID) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                let exam = await db
                    .collection('doExam')
                    .find({ 'data.userID': data.userID })
                    .sort({ ['data.nameExam']: 1 })
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

let sortDoExamByKey = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!request.userID || !request.type || !request.typeSort) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu, vui lòng bổ sung`,
                });
            } else {
                //console.log(request);
                let typeSort = request.typeSort === 'up' ? 1 : -1;
                let data = request.dataSearch;
                let exam = await db
                    .collection('doExam')
                    .find({
                        $and: [
                            { 'data.userID': { $eq: data.userID } },
                            { 'data.nameExam': { $regex: data.name, $options: 'i' } },
                            data.score
                                ? data.typeScore === 'greater'
                                    ? { 'data.maxScore': { $gte: +data.score } }
                                    : { 'data.maxScore': { $lte: +data.score } }
                                : {},
                            data.turns
                                ? data.typeTurns === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.turns } }
                                    : { 'data.quantityJoin': { $lte: +data.turns } }
                                : {},
                            data.time
                                ? data.typeTime === 'greater'
                                    ? { 'data.valueTimeDoExamGreatest': { $gte: +data.time } }
                                    : { 'data.valueTimeDoExamGreatest': { $lte: +data.time } }
                                : {},
                            data.dayStart
                                ? {
                                      'data.dateDoExam': { $gte: data.dayStart },
                                  }
                                : {},
                            data.dayEnd
                                ? {
                                      'data.dateDoExam': { $lte: data.dayEnd },
                                  }
                                : {},
                        ],
                    })

                    .sort({ ['data.' + data.type]: typeSort })
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

let searchAllExam = (keyword) => {
    return new Promise(async (resolve, reject) => {
        try {
            let exam = await db
                .collection('exam')
                .find({
                    $and: [{ 'data.title': { $regex: keyword, $options: 'i' } }],
                })
                .toArray();

            resolve({
                errCode: 0,
                message: 'Lấy thông tin bài thi thành công',
                data: exam,
            });
        } catch (error) {
            reject(error);
        }
    });
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
    searchAllExam,
};
