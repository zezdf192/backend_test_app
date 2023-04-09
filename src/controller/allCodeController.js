import allCodeService from '../service/allCodeService';

let getAllCode = async (req, res) => {
    try {
        let respon = await allCodeService.getAllCode(req.query.type);
        res.status(200).json(respon);
    } catch (error) {
        res.status(200).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

export default {
    getAllCode,
};
