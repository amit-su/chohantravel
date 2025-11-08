const { getPagination } = require("../../../utils/query");
const { PrismaClient } = require("@prisma/client");
const { query } = require("express");
const prisma = new PrismaClient();

const databaseService = require("../../../utils/dbClientService");
const {
  DELETE_PROCEDURE,

  INSERT_OR_UPDATE_STATE_PROCEDURE,
  GET_PARTY_SITE_PROCEDURE,
  INSERT_OR_UPDATE_SITE_PROCEDURE,
  GET_PARTY_SITE_BY_USERID_PROCEDURE,
  MANAGE_ROLE
} = require("../../../utils/constants");

const createSingleRole = async (req, res) => {
  try {
    // Delete many roles
    if (req.query.query === "deletemany") {
      const deletedRole = await prisma.role.deleteMany({
        where: {
          id: {
            in: req.body,  // Ensure this is an array of role IDs
          },
        },
      });
      return res.json(deletedRole);
    }

    // Create many roles
    else if (req.query.query === "createmany") {
      console.log(
        req.body.map((role) => {
          return { name: role.name };
        })
      );
      console.log(req.body);

      // Ensure req.body is an array of role objects with `name` field
      if (!Array.isArray(req.body) || !req.body.every(role => role.name)) {
        return res.status(400).json({ message: "Invalid role data format" });
      }

      const createdRole = await prisma.role.createMany({
        data: req.body,
        skipDuplicates: true,
      });
      return res.status(200).json(createdRole);
    }

    // Create a single role
    else {
      const createdRole = await prisma.role.create({
        data: {
          name: req.body.name,
          status: "true",  // Default to 'true' if no status provided
        },
      });
      return res.status(200).json({
        status: 1,
        data: createdRole
      });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ message: error.message });
  }
};

const getAllRole = async (req, res) => {
  if (req.query.query === "all") {
    // Fetch all roles without status filter
    try {
      const allRole = await prisma.role.findMany({
        orderBy: [
          {
            id: "asc",
          },
        ],
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      res.json(allRole);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  } else if (req.query.status === "false") {
    // Fetch roles with status: false
    try {
      const { skip, limit } = getPagination(req.query);
      const allRole = await prisma.role.findMany({
        where: {
          status: "false", // assuming status is stored as a string
        },
        orderBy: [
          {
            id: "asc",
          },
        ],
        skip: Number(skip),
        take: Number(limit),
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      res.json(allRole);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  } else {
    // Fetch roles with status: true
    try {
      const { skip, limit } = getPagination(req.query);
      const allRole = await prisma.role.findMany({
        where: {
          status: "true", // assuming status is stored as a string
        },
        orderBy: [
          {
            id: "asc",
          },
        ],
        skip: Number(skip),
        take: Number(limit),
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
      });
      res.json(allRole);
    } catch (error) {
      res.status(400).json(error.message);
      console.log(error.message);
    }
  }
};

// const getAllRole = async (req, res) => {
//   try {
//     const params = {
//       Action: 'GETALL', // Important!
//     };

//     const AllRoles = await databaseService.callStoredProcedure(
//       req,
//       MANAGE_ROLE,
//       params
//     );

//     res.json(AllRoles);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };


// const getSingleRole = async (req, res) => {
//   try {
//     const singleRole = await prisma.role.findUnique({
//       where: {
//         id: Number(req.params.id),
//       },
//       include: {
//         rolePermission: {
//           include: {
//             permission: true,
//           },
//         },
//       },
//     });
//     res.json(singleRole);
//   } catch (error) {
//     res.status(400).json(error.message);
//     console.log(error.message);
//   }
// };


const getSingleRole = async (req, res) => {
  try {
    const singleRole = await prisma.role.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        rolePermissions: {  // Use the plural relation name
          include: {
            permission: true,  // This will fetch related permissions
          },
        },
      },
    });
    res.json(singleRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  }
};


const updateSingleRole = async (req, res) => {
  try {
    const updatedRole = await prisma.role.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: req.body.name,
      },
    });
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

const deleteSingleRole = async (req, res) => {
  try {
    const deletedRole = await prisma.role.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: req.body.status,
      },
    });
    res.status(200).json(deletedRole);
  } catch (error) {
    res.status(400).json(error.message);
    console.log(error.message);
  }
};

module.exports = {
  createSingleRole,
  getAllRole,
  getSingleRole,
  updateSingleRole,
  deleteSingleRole,
};
