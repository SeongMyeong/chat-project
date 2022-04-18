const resMessage = require("./resMessage");
const statusCode = require("./statusCode");

const asyncWrapper = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch(next);
  };
};

const verifyRequiredParams = (...params) => {
  for (const param of params)
    if (isEmpty(param))
      throw {
        status: statusCode.BAD_REQUEST,
        message: resMessage.OUT_OF_VALUE,
      };
};

const dbErrorHandler = (callback) => {
  try {
    return callback();
  } catch (err) {
    console.log(err);
    throw {
      status: statusCode.DB_ERROR,
      message: resMessage.DB_ERROR,
    };
  }
};

// parameter의 empty여부 확인(object, string 등등)
const isEmpty = (value) => {
  if (
    value === "" ||
    value === "undefined" ||
    value === "null" ||
    value === undefined ||
    value === null ||
    (value !== null &&
      String(typeof value).toLowerCase() === "object" &&
      !Object.keys(value).length)
  ) {
    return true;
  }

  //array
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

// 필수요소 확인 함수
/**
 *
 * @param value mandantory를 체크할 데어 목록 { key: value } 형식의 데이터를 array로 넘김
 * @returns isPass: boolean, nonPassArray: array / pass여부는 true, false로 확인 pass가 안된 내용은 nonPassArray에 string으로 저장
 */
const checkMandatory = (value) => {
  let isPass = true;
  const nonPassArray = [];

  Object.keys(value).map((t) => {
    if (isEmpty(value[t])) {
      nonPassArray.push(t);
      isPass = false;
    }
    return true;
  });

  return {
    isPass,
    nonPassArray,
  };
};

const parseCookies = (cookie = "") => {
  return cookie
    .split(";")
    .map((v) => v.split("="))
    .map(([k, ...vs]) => [k, vs.join("=")])
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});
};

module.exports = {
  asyncWrapper,
  verifyRequiredParams,
  dbErrorHandler,
  isEmpty,
  checkMandatory,
  parseCookies,
};
