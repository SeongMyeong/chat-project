const jwt = require("jsonwebtoken");
const { parseCookies } = require("../util/index");


const getUserIdFromRequest = (req) => {
  const token = this.extractTokenFromRequest(req);
  if (!token) {
    return null;
  }
  const jwtPayload = this.decodeJWT(token);
  return jwtPayload?.id || null;
};

const extractTokenFromRequest = (req) => {
  if (req.headers.cookie) {
    const parseCookie = parseCookies(req.headers.cookie);
    return parseCookie.access_token;
  }
  const TOKEN_PREFIX = "Bearer ";
  const auth = req.headers.authorization;
  return auth?.includes(TOKEN_PREFIX)
      ? auth.split(TOKEN_PREFIX)[1]
      : auth;
};

const decodeJWT = (token) => {
  try {
    return jwt.verify(token, "chat_server");
  } catch (error) {
    return null;
  }
};

  // user type정의 필요
const createJWT = (user) => {
  return jwt.sign({id: user.user_id}, "chat_server", {
    expiresIn: user.expire_date,
  });
};

module.exports = {
  getUserIdFromRequest,
  extractTokenFromRequest,
  decodeJWT,
  createJWT
};
