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
                        gender: data.gender,
                        password: hashPassword(data.password),
                        address: data.address,
                        roleID: data.roleID,
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
                        delete users[0].password;

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

export default {
    createNewUser,
    login,
    getAllUsers,
    deleteUser,
    updateUserByID,
};
