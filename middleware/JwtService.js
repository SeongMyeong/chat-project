const jwt = require("jsonwebtoken");
const { parseCookies } = require("../util/index");

class JwtService {
  static getUserIdFromRequest = (req) => {
    const token = this.extractTokenFromRequest(req);
    if (!token) {
      return null;
    }
    const jwtPayload = this.decodeJWT(token);
    return jwtPayload?.id || null;
  };

  static extractTokenFromRequest = (req) => {
    if (req.headers.cookie) {
      const parseCookie = parseCookies(req.headers.cookie);
      const token = parseCookie.access_token;
      return token;
    }
    const TOKEN_PREFIX = "Bearer ";
    const auth = req.headers.authorization;
    const token = auth?.includes(TOKEN_PREFIX)
      ? auth.split(TOKEN_PREFIX)[1]
      : auth;
    return token;
  };

  static decodeJWT = (token) => {
    try {
      const decodedToken = jwt.verify(token, "cvs_guru_token");
      return decodedToken;
    } catch (error) {
      return null;
    }
  };

  // user type정의 필요
  static createJWT = (user) => {
    const token = jwt.sign({ id: user.user_id }, "cvs_guru_token", {
      expiresIn: user.expire_date,
    });

    return token;
  };
}

module.exports = {
  JwtService,
};
