const smsSend = async (req, res) => {
    try {
      console.log("^^ SMS ^^", req.body);
    } catch (error) {
      console.log("^^ Error ^^", error);
    }
  };
  
  module.exports = { smsSend };