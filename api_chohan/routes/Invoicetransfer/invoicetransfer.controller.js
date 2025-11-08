const {
    INSERT_INVOICE_TRANSFER,
   
  } = require("../../utils/constants");
  const databaseService = require("../../utils/dbClientService");
  
  const createinvoicetransfer = async (req, res) => {
    try {
      console.log(req.body);
      const result = await databaseService.callStoredProcedure(req,
        INSERT_INVOICE_TRANSFER,
        {
          ID: req.body.invoiceNo,
         
         
        }
      );
       res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
      console.error("Error occurred:", error);
    }
  };
  
 
  
 
  
 
 
  
  module.exports = {
    createinvoicetransfer,
  
  };
  