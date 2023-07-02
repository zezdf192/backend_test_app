import { connectToDB, getDB } from '../config/connectDB';
import { ObjectId } from 'mongodb';
import _ from 'lodash';

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

                let users = await db
                    .collection('doExam')
                    .find({ 'data.examID': id })
                    .sort({ ['data.maxScore']: -1, ['data.valueTimeDoExam']: 1, ['data.quantityJoin']: 1 })
                    .toArray();

                resolve({
                    errCode: 0,
                    message: 'Lấy thông tin bài thi thành công',
                    data: {
                        exam: exam[0],
                        users: users,
                    },
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
                let isUpdateDoExam = false;
                let isFirstDoExam = false;

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

                    if (doExam[0].data.maxScore < data.currentScore) {
                        isUpdateDoExam = true;
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
                    } else if (doExam[0].data.maxScore === data.currentScore) {
                        if (doExam[0].data.valueTimeDoExam > data.currentValueTimeDoExam) {
                            isUpdateDoExam = true;
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
                            await db.collection('doExam').updateOne(
                                {
                                    $and: [
                                        { 'data.userID': data.userID },
                                        {
                                            'data.examID': data.examID,
                                        },
                                    ],
                                },
                                {
                                    $set: {
                                        'data.quantityJoin': data.quantityJoin,
                                        'data.currentScore': data.currentScore,
                                        'data.currentQuantityAnswerTrue': data.currentQuantityAnswerTrue,
                                        'data.currentValueTimeDoExam': data.currentValueTimeDoExam,
                                        'data.currentTimeEn': data.currentTimeEn,
                                        'data.currentTimeVi': data.currentTimeVi,
                                    },
                                },
                            );
                        }
                    } else {
                        await db.collection('doExam').updateOne(
                            {
                                $and: [
                                    { 'data.userID': data.userID },
                                    {
                                        'data.examID': data.examID,
                                    },
                                ],
                            },
                            {
                                $set: {
                                    'data.quantityJoin': data.quantityJoin,
                                    'data.currentScore': data.currentScore,
                                    'data.currentQuantityAnswerTrue': data.currentQuantityAnswerTrue,
                                    'data.currentValueTimeDoExam': data.currentValueTimeDoExam,
                                    'data.currentTimeEn': data.currentTimeEn,
                                    'data.currentTimeVi': data.currentTimeVi,
                                },
                            },
                        );
                    }
                } else {
                    isFirstDoExam = true;
                    await db.collection('doExam').insertOne({
                        data,
                    });
                }

                //Cập nhập số lượt thi trong collection exam
                let exam = await db
                    .collection('exam')
                    .find({ _id: new ObjectId(data.examID) })
                    .toArray();

                await db
                    .collection('exam')
                    .updateOne(
                        { _id: new ObjectId(data.examID) },
                        { $set: { 'data.quantityJoin': exam[0].data.quantityJoin + 1 } },
                    );

                //cap nhat danh sach bai thi da lam

                let user = await db.collection('users').findOne({ _id: new ObjectId(data.userID) });

                if (user) {
                    let isCheck = true;

                    for (let i = 0; i < user.userExamID.length; i++) {
                        if (user.userExamID[i] === data.examID) {
                            isCheck = false;
                            break;
                        }
                    }

                    if (isCheck) {
                        await db.collection('users').updateOne(
                            { _id: new ObjectId(data.userID) },
                            {
                                $set: {
                                    userExamID: [...user.userExamID, data.examID],
                                },
                            },
                        );
                    }
                }

                // Cập nhật cơ sở dữ liệu ratings
                let ratings = await db.collection('ratings').findOne({ 'data.examID': data.examID });

                if (!_.isEmpty(ratings)) {
                    if (isFirstDoExam) {
                        let raingsUpdate = await db.collection('ratings').findOne({ 'data.examID': data.examID });

                        let copyUsers = raingsUpdate.users;

                        copyUsers.push(data);
                        copyUsers.sort((a, b) => {
                            if (a.maxScore !== b.maxScore) {
                                return b.maxScore - a.maxScore; // Sắp xếp theo field1
                            } else if (a.valueTimeDoExam !== b.valueTimeDoExam) {
                                return a.valueTimeDoExam - b.valueTimeDoExam; // Sắp xếp theo field2 (kiểu chuỗi)
                            } else {
                                return a.quantityJoin - b.quantityJoin; // Sắp xếp theo field3
                            }
                        });

                        raingsUpdate.users = [...copyUsers];

                        await db
                            .collection('ratings')
                            .updateOne({ 'data.examID': data.examID }, { $set: { users: raingsUpdate.users } });
                    } else {
                        if (isUpdateDoExam) {
                            let raingsUpdate = await db.collection('ratings').findOne({ 'data.examID': data.examID });

                            if (raingsUpdate) {
                                let copyUsers = raingsUpdate.users;

                                for (let i = 0; i < copyUsers.length; i++) {
                                    if (copyUsers[i].userID === data.userID) {
                                        copyUsers[i] = data;
                                        break;
                                    }
                                }

                                //sap xep truoc khi dua vao database
                                copyUsers.sort((a, b) => {
                                    if (a.maxScore !== b.maxScore) {
                                        return b.maxScore - a.maxScore; // Sắp xếp theo field1
                                    } else if (a.valueTimeDoExam !== b.valueTimeDoExam) {
                                        return a.valueTimeDoExam - b.valueTimeDoExam; // Sắp xếp theo field2 (kiểu chuỗi)
                                    } else {
                                        return a.quantityJoin - b.quantityJoin; // Sắp xếp theo field3
                                    }
                                });

                                raingsUpdate.users = [...copyUsers];

                                await db
                                    .collection('ratings')
                                    .updateOne({ 'data.examID': data.examID }, { $set: { users: raingsUpdate.users } });
                            }
                        } else {
                            let raingsUpdate = await db.collection('ratings').findOne({ 'data.examID': data.examID });

                            let copyUsers = raingsUpdate.users;

                            for (let i = 0; i < copyUsers.length; i++) {
                                if (copyUsers[i].userID === data.userID) {
                                    copyUsers[i] = { ...copyUsers[i], quantityJoin: data.quantityJoin };
                                    break;
                                }
                            }

                            raingsUpdate.users = [...copyUsers];

                            await db
                                .collection('ratings')
                                .updateOne({ 'data.examID': data.examID }, { $set: { users: raingsUpdate.users } });
                        }
                    }
                } else {
                    exam[0].data.examID = data.examID;
                    await db.collection('ratings').insertOne({
                        data: exam[0] && exam[0].data,
                        users: [data],
                    });
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
                // console.log(data);
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
                let exam = [];
                const isEmpty = _.isEmpty(data);

                if (!isEmpty) {
                    exam = await db
                        .collection('doExam')
                        .find({
                            $and: [
                                { 'data.userID': { $eq: request.userID } },
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
                        .sort({ ['data.' + request.type]: typeSort })
                        .toArray();
                } else {
                    exam = await db
                        .collection('doExam')
                        .find({
                            $and: [{ 'data.userID': { $eq: request.userID } }],
                        })

                        .sort({ ['data.' + request.type]: typeSort })
                        .toArray();
                }

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

let getAllExamByUserID = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userID) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                let exam = await db
                    .collection('exam')
                    .find({ 'user._id': new ObjectId(data.userID) })
                    .sort({ ['data.title']: 1 })
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

let searchAllExamByUserID = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userID) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                //console.log(data);
                let exam = await db
                    .collection('exam')
                    .find({
                        $and: [
                            { 'user._id': { $eq: new ObjectId(data.userID) } },
                            { 'data.title': { $regex: data.nameExam, $options: 'i' } },
                            data.currentJoin
                                ? data.typeCurrentJoin === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.currentJoin } }
                                    : { 'data.quantityJoin': { $lte: +data.currentJoin } }
                                : {},
                            data.maxScore !== 'S' ? { 'data.score.value': { $eq: data.maxScore } } : {},

                            data.maxTime !== 'T' ? { 'data.time.value': { $eq: data.maxTime } } : {},
                            data.maxQuantity !== 'L' ? { 'data.limit.value': { $eq: data.maxQuantity } } : {},
                            data.typeExam !== 'ALL' ? { 'data.typeExam': { $eq: data.typeExam } } : {},

                            data.dayStart
                                ? {
                                      'data.dateExam': { $gte: data.dayStart },
                                  }
                                : {},
                            data.dayEnd
                                ? {
                                      'data.dateExam': { $lte: data.dayEnd },
                                  }
                                : {},
                        ],
                    })
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

let sortExamByKey = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!request.userID || !request.type || !request.typeSort) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu, vui lòng bổ sung`,
                });
            } else {
                let typeSort = request.typeSort === 'up' ? 1 : -1;
                let data = request.dataSearch;
                // console.log(request);
                let exam = await db
                    .collection('exam')
                    .find({
                        $and: [
                            { 'user._id': { $eq: new ObjectId(data.userID) } },
                            data.nameExam ? { 'data.title': { $regex: data.nameExam, $options: 'i' } } : {},
                            data.currentJoin
                                ? data.typeCurrentJoin === 'greater'
                                    ? { 'data.quantityJoin': { $gte: +data.currentJoin } }
                                    : { 'data.quantityJoin': { $lte: +data.currentJoin } }
                                : {},
                            data.maxScore !== 'S' ? { 'data.score.value': { $eq: data.maxScore } } : {},

                            data.maxTime !== 'T' ? { 'data.time.value': { $eq: data.maxTime } } : {},
                            data.maxQuantity !== 'L' ? { 'data.limit.value': { $eq: data.maxQuantity } } : {},
                            data.typeExam !== 'ALL' ? { 'data.typeExam': { $eq: data.typeExam } } : {},

                            data.dayStart
                                ? {
                                      'data.dateExam': { $gte: data.dayStart },
                                  }
                                : {},
                            data.dayEnd
                                ? {
                                      'data.dateExam': { $lte: data.dayEnd },
                                  }
                                : {},
                        ],
                    })

                    .sort({ ['data.' + request.type]: typeSort })
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
    searchAllExamByUserID,
    getAllExamByUserID,
    sortExamByKey,
};
