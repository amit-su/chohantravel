const databaseService = require("../../utils/dbClientService");
const {
  INSERT_BUS_DOCUMENTS,
  GET_BUS_DOCUMENTS_DETALS,
  DELETE_PROCEDURE,
  GET_ALL_PANDING_DOCUMENTS,
} = require("../../utils/constants");

const { getUserIdFromToken } = require("../../utils/dbClientService");
const sql = require("mssql");
const path = require("path");
const fs = require("fs");

const getbusdocuments = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const decodedId = id;
    const params = {
      ID: decodedId,
      // Month:decodeMonth
      // PageNo: req.query.page,
      // PageSize: req.query.count,
    };

    const resultdata = await databaseService.callStoredProcedure(
      req,
      GET_BUS_DOCUMENTS_DETALS,
      params
    );

    res.json(resultdata);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

// const updatebusdocumentsdetails = async (req, res) => {
//   // try {
//   //   const TaskName = req.body.TaskName;
//   //   res.status(200).json({
//   //     message: 'File uploaded successfully',
//   //     file: req.file,
//   //     TaskName: TaskName,
//   //   });
//     // console.log(req.body,"8877876");
//     const params = {
//         id: req.body.ID,
//         ExpiryDate:req.body.ExpiryDate,
//         BusID:req.body.BusID,
//         TaskName:req.body.TaskName,
//         IntimateDays:req.body.IntimateDays,
//         NextDueDate:req.body.NextDueDate,
//         EntryDate:req.body.EntryDate,
//         UserID:req.body.UserID,
//         DocumentPath:req.body.UploadDocument,

//     //   };

//     // const result =
//     //   await databaseService.callStoredProcedure(req,
//     //     INSERT_BUS_DOCUMENTS,
//     //     params
//     //   );
//     //   console.log(result,"fyrt");
//     // res.json(result);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };

// const updatebusdocumentsdetails = async (req, res) => {
//   console.log(req.body, "8877876");

//   try {
//     // Extracting parameters from the request body
//     const params = {
//       id: req.body.ID,
//       ExpiryDate: req.body.ExpiryDate,
//       BusID: req.body.BusID,
//       TaskName: req.body.TaskName,
//       IntimateDays: req.body.IntimateDays,
//       NextDueDate: req.body.NextDueDate,
//       EntryDate: req.body.EntryDate,
//       UserID: req.body.UserID,
//       DocumentPath: req.body.UploadDocument,
//       doctype: req.body.doctype,
//       ReturnID: 0,
//       // file: req.body.file
//     };

//     // Calling the stored procedure to insert bus documents
//     const result = await databaseService.callStoredProcedure(
//       req,
//       INSERT_BUS_DOCUMENTS, // Replace with the actual stored procedure name
//       params
//     );
//     console.log("result", result);
//     // Responding with the result of the operation
//     res.status(200).json({
//       file: req.file,

//       message: "File uploaded successfully",
//       result: result,
//     });
//   } catch (error) {
//     // Handling errors
//     res.status(400).json({ message: error.message });
//     console.error(error.message);
//   }
// };

// const updatebusdocumentsdetails = async (req, res) => {
//   console.log(req.body, "8877876");

//   try {
//     const file = req.file;

//     const params = {
//       id: req.body.ID,
//       ExpiryDate: req.body.ExpiryDate,
//       BusID: req.body.BusID,
//       TaskName: req.body.TaskName,
//       IntimateDays: req.body.IntimateDays,
//       NextDueDate: req.body.NextDueDate,
//       EntryDate: req.body.EntryDate,
//       UserID: req.body.UserID,
//       DocumentPath: file ? file.filename : null,
//       doctype: req.body.doctype,
//       ReturnID: 0,
//     };

//     const result = await databaseService.callStoredProcedure(
//       req,
//       INSERT_BUS_DOCUMENTS,
//       params
//     );

//     const returnedData = result?.data?.[0];
//     const insertedId = returnedData?.id;

//     if (!insertedId) throw new Error("No ID returned from stored procedure");

//     if (file) {
//       const uploadsDir = path.join(process.cwd(), "uploads");
//       const ext = path.extname(file.originalname);
//       const newFilename = `${insertedId}${ext}`;
//       const newPath = path.join(uploadsDir, newFilename);
//       const oldPath = path.join(uploadsDir, file.filename);

//       if (fs.existsSync(newPath)) {
//         fs.unlinkSync(newPath); // delete old if exists
//       }

//       fs.renameSync(oldPath, newPath);
//       returnedData.DocumentPath = newFilename;
//     }

//     res.status(200).json({
//       message: "Bus document updated successfully",
//       file: file ? returnedData.DocumentPath : null,
//       result,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

const updatebusdocumentsdetails = async (req, res) => {
  console.log(req.body, "8877876");

  try {
    const file = req.file;
    const userId = getUserIdFromToken(req);
    console.log("userId", userId, req.file);
    const params = {
      id: req.body.ID,
      ExpiryDate: req.body.ExpiryDate,
      BusID: req.body.BusID,
      TaskName: req.body.TaskName,
      IntimateDays: req.body.IntimateDays,
      NextDueDate: req.body.NextDueDate,
      EntryDate: req.body.EntryDate,
      UserID: userId,
      DocumentPath: file ? file.filename : null,
      doctype: req.body.doctype,
      ReturnID: 0,
    };

    console.log("params", req.body, params, req);

    const result = await databaseService.callStoredProcedure(
      req,
      INSERT_BUS_DOCUMENTS,
      params
    );

    const returnedData = result?.data?.[0];
    const insertedId = returnedData?.id;

    if (!insertedId) throw new Error("No ID returned from stored procedure");
    console.log("in", file);

    if (file) {
      console.log("in");
      const uploadsDir = path.join(process.cwd(), "uploads");
      const ext = path.extname(file.originalname);
      const newFilename = `${insertedId}${ext}`;
      const oldPath = path.join(uploadsDir, file.filename);
      const newPath = path.join(uploadsDir, newFilename);

      // ✅ First rename the uploaded file
      fs.renameSync(oldPath, newPath);

      // ✅ Then check for other files with the same base ID but different extensions
      const files = fs.readdirSync(uploadsDir);
      console.log("in", insertedId, file);

      for (const f of files) {
        console.log("new file", newFilename);
        if (f.startsWith(`${insertedId}.`) && f !== newFilename) {
          fs.unlinkSync(path.join(uploadsDir, f)); // Delete older versions
        }
      }

      returnedData.DocumentPath = newFilename;
    }

    res.status(200).json({
      message: "Bus document updated successfully",
      file: file ? returnedData.DocumentPath : null,
      result,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: error.message });
  }
};

const deleteBusdoc = async (req, res) => {
  try {
    // delete productcategory
    const params = {
      table_name: "BusCheckList",
      column_name: "ID",
      column_value: req.params.id,
    };
    const deletedProductBrand = await databaseService.callStoredProcedure(
      req,
      DELETE_PROCEDURE,
      params
    );
    res.json(deletedProductBrand);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const gateFile = (req, res) => {
  console.log("call");
  const id = req.params.id;

  const uploadsDir = path.join(process.cwd(), "uploads");

  // Search for a file that starts with `${id}.` in uploads/
  fs.readdir(uploadsDir, (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Failed to read uploads directory" });

    const matchedFile = files.find((file) => file.startsWith(id + "."));

    if (!matchedFile) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadsDir, matchedFile);
    res.sendFile(filePath);
  });
};

// gate all panding bus documents
const gateAllPendingBusDocuments = async (req, res) => {
  try {
    // delete productcategory
    const params = {};
    const deletedProductBrand = await databaseService.callStoredProcedure(
      req,
      GET_ALL_PANDING_DOCUMENTS,
      params
    );
    res.json(deletedProductBrand);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  getbusdocuments,
  updatebusdocumentsdetails,
  deleteBusdoc,
  gateFile,
  gateAllPendingBusDocuments,
};
