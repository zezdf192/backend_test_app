import { connectToDB, getDB } from '../config/connectDB';

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

let getAllCode = (type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!type) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu loại, vui lòng bổ sung',
                });
            } else {
                if (type === 'ALL') {
                    let allcode = await db
                        .collection('allCode')
                        .find({}, { projection: { _id: 0 } })
                        .toArray();

                    resolve({
                        errCode: 0,
                        data: allcode,
                        message: 'Lấy dữ liệu thành công',
                    });
                } else {
                    let allcode = await db
                        .collection('allCode')
                        .find({ type: type }, { projection: { _id: 0 } })
                        .toArray();

                    resolve({
                        errCode: 0,
                        data: allcode,
                        message: 'Lấy dữ liệu thành công',
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    getAllCode,
};
