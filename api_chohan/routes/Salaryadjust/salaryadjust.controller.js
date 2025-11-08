const databaseService = require("../../utils/dbClientService");
const {
    INSERT_SALARY_ADJUST
} = require("../../utils/constants");



const getAllSalaryadjust = async (req, res) => {
    try {
        console.log(req.params);
        const { id,Month } = req.params;
        const decodedId = id;
         const decodeMonth=Month;
        const params = {
          type: decodedId,
          // Month:decodeMonth
          // PageNo: req.query.page,
          // PageSize: req.query.count,
        };
    
    
        const resultdata = await databaseService.callStoredProcedure(req,
            "",
          params
        );
    
        res.json(resultdata);
      } catch (error) {
        res.status(400).json(error.message);
        console.log(error.message);
      }
};

const updateSalaryadjust = async (req, res) => {
  try {
    console.log(req.body,"8877876");
    const params = {
        
          AdvanceAmt:req.body.AdvanceAmt,
         AdvanceID: req.body.AdvanceID,
         SalaryDetl_ID: req.body.SalaryDetl_ID,
         AdjustAmt: req.body.advAmount,
         UserID:req.body.UserID
      
      };
      
    const result =
      await databaseService.callStoredProcedure(req,
        INSERT_SALARY_ADJUST,
        params
      );
      console.log(result,"fyrt");
    res.json(result);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};




module.exports = {
    getAllSalaryadjust,
    updateSalaryadjust,
  
};
