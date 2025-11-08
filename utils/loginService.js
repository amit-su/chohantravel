const loginService = async (params) => {
  const [prisma, username, permissionsOutput, statusID, statusMessage] = params;
  
  try {
    const result = await prisma.$queryRaw`EXEC [dbo].[sp_get_user_credentials] 
    @username = ${username},
    @Permissions = ${permissionsOutput} OUTPUT, 
    @StatusID = ${statusID} OUTPUT, 
    @StatusMessage = ${statusMessage} OUTPUT`;
    return result;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = loginService;
