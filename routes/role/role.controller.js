const { GET_ROLE } = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");

const getAllRoles = async (req, res) => {
  try {
    const params = {
      PageNumber: 1,
      PageSize: 10000, // fetch all roles
    };

    const allRoles = await databaseService.callStoredProcedure(
      req,
      GET_ROLE,
      params
    );

    res.json(allRoles);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllRoles,
};
