require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var colors = require("colors");
const { LOGIN_PROCEDURE } = require("../../utils/constants");
const databaseService = require("../../utils/dbClientService");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const powerbiservice = require("../../utils/powerbiService");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const params = {
      username: username,
      password: password
      // Add more parameters as needed
    };
    const resultdata = await databaseService.callStoredProcedure(req,
      LOGIN_PROCEDURE,
      params
    );

    const userData = resultdata.data[0];
    if (!userData || Object.keys(userData).length === 0) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    // const passwordMatch = await bcrypt.compare(password, userData.password);
    const passwordMatch = true; // Temporarily change for development purpose

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    let parsedPermissions = [];
    if (userData.Permissions) {
      try {
        parsedPermissions = JSON.parse(userData.Permissions);
      } catch (e) {
        console.error("Error parsing permissions:", e);
      }
    }

    const permissionNames = parsedPermissions.map((perm) => perm.name);
    console.log(permissionNames);
    const token = jwt.sign(
      { sub: userData.id, permissions: permissionNames,companyId: userData.CompanyID },
      secret,
      {
        expiresIn: "124h",
      }
    );
    console.log("TOKEN : ", token.green);

    const { password: _, permissions, ...userWithoutPassword } = userData;
    return res.json({
      ...userWithoutPassword,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const join_date = new Date(req.body.join_date).toISOString().split("T")[0];
    const leave_date = new Date(req.body.leave_date)
      .toISOString()
      .split("T")[0];

    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const createUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hash,
        role: req.body.role,
        email: req.body.email,
        salary: parseInt(req.body.salary),
        join_date: new Date(join_date),
        leave_date: new Date(leave_date),
        id_no: req.body.id_no,
        department: req.body.department,
        phone: req.body.phone,
        address: req.body.address,
        blood_group: req.body.blood_group,
        image: req.body.image,
        status: req.body.status,
        designation: {
          connect: {
            id: Number(req.body.designation_id),
          },
        },
      },
    });
    const { password, ...userWithoutPassword } = createUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getAllUser = async (req, res) => {
  if (req.query.query === "all") {
    try {
      const allUser = await prisma.user.findMany({
        include: {
          saleInvoice: true,
        },
      });
      res.json(
        allUser
          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else if (req.query.status === "false") {
    try {
      const allUser = await prisma.user.findMany({
        where: {
          status: false,
        },
        include: {
          saleInvoice: true,
        },
      });
      res.json(
        allUser
          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  } else {
    try {
      const allUser = await prisma.user.findMany({
        where: {
          status: true,
        },
        include: {
          saleInvoice: true,
        },
      });
      res.json(
        allUser

          .map((u) => {
            const { password, ...userWithoutPassword } = u;
            return userWithoutPassword;
          })
          .sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
};

const getSingleUser = async (req, res) => {
  const singleUser = await prisma.user.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      saleInvoice: true,
    },
  });
  const id = parseInt(req.params.id);

  // only allow admins and owner to access other user records
  // console.log(id !== req.auth.sub && !req.auth.permissions.includes("viewUser"));
  if (id !== req.auth.sub && !req.auth.permissions.includes("viewUser")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. You are not an admin" });
  }

  if (!singleUser) return;
  const { password, ...userWithoutPassword } = singleUser;
  res.json(userWithoutPassword);
};

const updateSingleUser = async (req, res) => {
  const id = parseInt(req.params.id);
  // only allow admins and owner to edit other user records
  // console.log(
  //   id !== req.auth.sub && !req.auth.permissions.includes("updateUser")
  // );
  if (id !== req.auth.sub && !req.auth.permissions.includes("updateUser")) {
    return res.status(401).json({
      message: "Unauthorized. You can only edit your own record.",
    });
  }
  try {
    // admin can change all fields
    if (req.auth.permissions.includes("updateUser")) {
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const join_date = new Date(req.body.join_date)
        .toISOString()
        .split("T")[0];
      const leave_date = new Date(req.body.leave_date)
        .toISOString()
        .split("T")[0];
      const updateUser = await prisma.user.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          username: req.body.username,
          password: hash,
          role: req.body.role,
          email: req.body.email,
          salary: parseInt(req.body.salary),
          join_date: new Date(join_date),
          leave_date: new Date(leave_date),
          id_no: req.body.id_no,
          department: req.body.department,
          phone: req.body.phone,
          address: req.body.address,
          blood_group: req.body.blood_group,
          image: req.body.image,
          status: req.body.status,
          designation: {
            connect: {
              id: Number(req.body.designation_id),
            },
          },
        },
      });
      const { password, ...userWithoutPassword } = updateUser;
      res.json(userWithoutPassword);
    } else {
      // owner can change only password
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      const updateUser = await prisma.user.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          password: hash,
        },
      });
      const { password, ...userWithoutPassword } = updateUser;
      res.json(userWithoutPassword);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteSingleUser = async (req, res) => {
  // const id = parseInt(req.params.id);
  // only allow admins to delete other user records
  if (!req.auth.permissions.includes("deleteUser")) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Only admin can delete." });
  }
  try {
    const deleteUser = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const powerBiLogin = async (req, res) => {
  try {
    const { reportId } = req.body;

    powerbiservice(reportId)
      .then((data) => {
        console.log("Access token:", data);
        0;
        return res.json({
          data,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        return res.json({
          // params,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
  powerBiLogin,
};
