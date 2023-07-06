import { connectToDB, getDB } from '../config/connectDB';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

const saltRounds = 10;

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

//kiem tra co thieu truong nhap vao khong
let checkMissingParams = (data) => {
    let fileds = [];
    let value = '';
    Object.keys(data).forEach((key) => fileds.push(key));

    for (let i = 0; i < fileds.length; i++) {
        if (!data[fileds[i]] && !data[fileds[i]] !== 0) {
            value = fileds[i];
            break;
        }
    }
    return value;
};

//Bam mat khau
let hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

let checkPassword = (password, hashPassword) => {
    let isCheckPassword = bcrypt.compareSync(password, hashPassword);

    return isCheckPassword;
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                let users = [];
                await db
                    .collection('users')
                    .find({ email: data.email })
                    .forEach((user) => users.push(user));

                if (users.length > 0) {
                    resolve({
                        errCode: 2,
                        message: 'Email đã tồn tại, vui lòng chọn email khác',
                    });
                } else {
                    await db.collection('users').insertOne({
                        name: data.name,
                        email: data.email,
                        password: hashPassword(data.password),
                        listLikeExam: [],
                        avatar: '',
                        roleID: 'R2',
                        userCreateID: [],
                        userExamID: [],
                    });

                    resolve({
                        errCode: 0,
                        message: 'Tạo mới người dùng thành công',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let login = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                let users = [];
                await db
                    .collection('users')
                    .find({ email: data.email })
                    .forEach((user) => users.push(user));

                if (users.length > 0) {
                    let checkPs = checkPassword(data.password, users[0].password);
                    if (checkPs) {
                        users[0].password = true;

                        resolve({
                            errCode: 0,
                            data: users[0],
                            message: 'Đăng nhập thành công',
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            message: 'Mật khẩu nhập vào chưa chính xác, vui lòng nhập lại',
                        });
                    }
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Email chưa tồn tại, bạn hãy kiểm tra lại hoặc tạo tài khoản mới tại phần đăng ký',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db
                .collection('users')
                .find({ roleID: { $ne: 'R1' } }, { projection: { password: 0 } })
                .toArray();

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(data.id)) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                await db.collection('users').deleteOne({ _id: new ObjectId(data.id) });
                resolve({
                    errCode: 0,
                    message: 'Xóa người dùng thành công',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserByID = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(data.id)) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu id, vui lòng bổ sung',
                });
            } else {
                let ischeck = checkMissingParams(data);
                if (ischeck) {
                    resolve({
                        errCode: 1,
                        message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                    });
                } else {
                    await db.collection('users').updateOne(
                        { email: data.email },
                        {
                            $set: {
                                name: data.name,
                                address: data.address,
                                gender: data.gender,
                                roleID: data.roleID,
                            },
                        },
                    );

                    resolve({
                        errCode: 0,
                        message: 'Cập nhật thông tin người dùng thành công',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUserBySocial = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = [];
            await db
                .collection('users')
                .find({ email: data.email })
                .forEach((user) => users.push(user));

            let userInfor = {
                name: data.displayName,
                email: data.email,
                avatar: data.photoURL,
                listLikeExam: [],
                roleID: 'R2',
                userCreateID: [],
                userExamID: [],
            };

            if (users.length === 0) {
                await db.collection('users').insertOne(userInfor);
            }

            resolve({
                errCode: 0,
                message: 'Tạo mới người dùng thành công',
                data: userInfor,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getDetailUser = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!email) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu email, vui lòng bổ sung',
                });
            }

            let users = await db.collection('users').find({ email: email.email }).toArray();

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserByEmail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu email, vui lòng bổ sung',
                });
            } else {
                console.log(data);
                await db.collection('users').updateOne(
                    { email: data.email },
                    {
                        $set: {
                            [data.key]: data.payload,
                        },
                    },
                );

                if (data.key === 'name') {
                    await db.collection('ratings').updateMany(
                        { 'users.email': data.email }, // Điều kiện truy vấn
                        { $set: { 'users.$.nameUser': data.payload } }, // Dữ liệu cập nhật
                    );
                    console.log(data.email);
                }

                resolve({
                    errCode: 0,
                    message: 'Cập nhật thông tin người dùng thành công',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let editPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                let users = [];
                await db
                    .collection('users')
                    .find({ email: data.email })
                    .forEach((user) => users.push(user));

                if (users.length > 0) {
                    let checkPs = checkPassword(data.oldPassword, users[0].password);
                    console.log('data', checkPs);
                    if (checkPs) {
                        await db.collection('users').updateOne(
                            { email: data.email },
                            {
                                $set: {
                                    password: hashPassword(data.password),
                                },
                            },
                        );

                        resolve({
                            errCode: 0,
                            message: 'Thay đổi mật khẩu thành công',
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            message: 'Mật khẩu nhập vào không chính xác',
                        });
                    }
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Email không tồn tại',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getUserLikeExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ischeck = checkMissingParams(data);
            if (ischeck) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu ${ischeck}, vui lòng bổ sung`,
                });
            } else {
                const likeExam = await db
                    .collection('users')
                    .find({
                        email: data.email,
                        listLikeExam: {
                            $elemMatch: {
                                $eq: data.examId,
                            },
                        },
                    })
                    .toArray();

                resolve({
                    errCode: 0,
                    data: likeExam.length > 0,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let userLikeExam = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.examId) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu field, vui lòng bổ sung`,
                });
            } else {
                if (data.isLike) {
                    await db
                        .collection('users')
                        .updateOne({ email: data.email }, { $push: { listLikeExam: data.examId } });

                    await db
                        .collection('exam')
                        .updateOne({ _id: new ObjectId(data.examId) }, { $push: { 'data.quantityLike': data.email } });
                } else {
                    await db
                        .collection('users')
                        .updateOne({ email: data.email }, { $pull: { listLikeExam: data.examId } });

                    await db
                        .collection('exam')
                        .updateOne({ _id: new ObjectId(data.examId) }, { $pull: { 'data.quantityLike': data.email } });
                }

                resolve({
                    errCode: 0,
                    message: 'Update successful',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllExamUserLike = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 1,
                    message: `Bạn đang nhập thiếu email, vui lòng bổ sung`,
                });
            } else {
                let users = await db.collection('users').find({ email: data.email }).toArray();

                let favorites = users[0].listLikeExam;

                const objectIds = favorites.map((id) => new ObjectId(id));

                let listExam = await db
                    .collection('exam')

                    .find({
                        _id: { $in: objectIds },
                        'data.typeExam': 'PUBLIC',
                    })
                    .toArray();

                resolve({
                    errCode: 0,
                    data: listExam,
                    message: 'Get data successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    createNewUser,
    login,
    getAllUsers,
    deleteUser,
    updateUserByID,
    createNewUserBySocial,
    getDetailUser,
    editPassword,
    updateUserByEmail,
    getUserLikeExam,
    userLikeExam,
    getAllExamUserLike,
};
