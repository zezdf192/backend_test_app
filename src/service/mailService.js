import { connectToDB, getDB } from '../config/connectDB';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

import nodemailer from 'nodemailer';
require('dotenv').config();

const saltRounds = 10;

let db;
connectToDB((err) => {
    if (!err) {
        db = getDB();
    }
});

let hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
};

function generateRandomCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Tạo một số ngẫu nhiên từ 0 đến 9
        code += randomDigit.toString(); // Chuyển số thành chuỗi và thêm vào code
    }
    return code;
}

let forgotPassword = async (reciverEmail) => {
    console.log(reciverEmail);
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            // Gửi email
            let code = generateRandomCode();

            let mailOptions;
            if (reciverEmail.language === 'en') {
                mailOptions = {
                    from: 'ExamApp send', // Địa chỉ email người gửi
                    to: reciverEmail.email, // Địa chỉ email người nhận
                    subject: 'Verification code ExamApp', // Tiêu đề email
                    text: 'Your verification code', // Nội dung email dạng văn bản thuần
                    html: `<p>${code} is your verification code</p>`, // Nội dung email dạng HTML
                };
            } else {
                mailOptions = {
                    from: 'ExamApp gửi',
                    to: reciverEmail.email,
                    subject: 'Mã xác minh ExamApp',
                    text: 'Mã xác minh của bạn',
                    html: `<p>${code} là mã xác minh của bạn</p>`,
                };
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error occurred:', error.message);
                    resolve({
                        errCode: 1,
                        message: 'Error',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        code: code,
                        message: 'Send email success',
                    });
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

let changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.password || !data.email) {
                resolve({
                    errCode: 1,
                    message: 'Nhập thiếu field, vui lòng bổ sung',
                });
            } else {
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
                    message: 'Update password successfully',
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    forgotPassword,
    changePassword,
};
