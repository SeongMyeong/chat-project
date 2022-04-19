const { redisClient } = require("../../../middleware/RedisConnection");
const util = require("util");

exports.setMessage = async (req, res) => {
    return res.json({
        message: "test",
    });
};

exports.getMessageFromRoom = async (req, res) => {
    return res.json({
        message: "success",
    });
};
