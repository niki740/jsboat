const filterResp = (obj) => {
  const { statusCode, ...resp } = obj;
  return resp;
};

module.exports = { filterResp };
