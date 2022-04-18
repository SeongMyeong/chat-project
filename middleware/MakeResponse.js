const makeResponseFormat = (result, data, reason = "success") => {
  switch (result) {
    case "0000":
      return {
        result,
        reason,
        data: data,
      };
    case "4000":
      return {
        result,
        reason: "이미 가입한 회원입니다.",
        data: {},
      };
    case "4001":
      return {
        result,
        reason: "사용자가 없습니다.",
        data: {},
      };
    case "4002":
      return {
        result,
        reason: "비밀번호가 다릅니다.",
        data: {},
      };
    case "8001":
      return {
        result,
        reason: "필수정보가 없습니다.",
        data: data.data.toString(),
      };
    default:
      return {
        result,
        reason,
        data: null,
      };
  }
};

module.exports = { makeResponseFormat };
