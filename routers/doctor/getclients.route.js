const { Service } = require("../../models/Services/Service");
const { OfflineClient } = require("../../models/OfflineClient/OfflineClient");
const {
  OfflineConnector,
} = require("../../models/OfflineClient/OfflineConnector");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const {
  OfflineService,
  validateOfflineService,
} = require("../../models/OfflineClient/OfflineService");
const { Template } = require("../../models/Templates/Template");
const { ProductConnector } = require("../../models/Warehouse/ProductConnector");
const { Product } = require("../../models/Warehouse/Product");
const { TableColumn } = require("../../models/Services/TableColumn");
const { ServiceTable } = require("../../models/Services/ServiceTable");
const { ServiceType } = require("../../models/Services/ServiceType");
const {
  StatsionarService,
  validateStatsionarService,
} = require("../../models/StatsionarClient/StatsionarService");
const {
  StatsionarConnector,
} = require("../../models/StatsionarClient/StatsionarConnector");
const { AddedService } = require("../../models/Services/AddedService");
require("../../models/StatsionarClient/StatsionarConnector");
require("../../models/StatsionarClient/StatsionarClient");
require("../../models/StatsionarClient/StatsionarRoom");
require("../../models/Services/Department");
require("../../models/Cashier/OfflinePayment");
require("../../models/Cashier/StatsionarPayment");

//Clients getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica, beginDay, endDay, department, clientborn, name } =
      req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    let clients = [];

    let connectors = [];

    if (clientborn) {
      connectors = await OfflineConnector.find({
        clinica,
      })
        .sort({ createdAt: -1 })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image ")
        .populate("client", "lastname bronTime firstname born id phone address isDisability clientMoreDetails")
        .populate({
          path: "services",
          select:
            "service clientMoreDetails serviceid accept createdAt reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails serviceid accept createdAt reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails serviceid accept createdAt reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails serviceid accept createdAt reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter(
            (connector) =>
              connector.services.some(
                (service) =>
                  service.department &&
                  String(service.department._id) === String(department._id)
              ) &&
              connector.client &&
              new Date(
                new Date(connector.client.born).setUTCHours(0, 0, 0, 0)
              ).toISOString() ===
              new Date(
                new Date(clientborn).setUTCHours(0, 0, 0, 0)
              ).toISOString()
          )
        );
    } else if (name) {
      connectors = await OfflineConnector.find({
        clinica,
      })
        .sort({ createdAt: -1 })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname bronTime firstname born id phone address fullname isDisability clientMoreDetails")
        .populate({
          path: "services",
          select:
            "service clientMoreDetails serviceid createdAt accept reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service  clientMoreDetails  serviceid createdAt accept reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service  clientMoreDetails serviceid createdAt accept reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails  serviceid createdAt accept reseption refuse column payment tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter(
            (connector) =>
              connector.services.some(
                (service) =>
                  String(service.department && service.department._id) ===
                  String(department)
              ) &&
              connector.client &&
              (connector.client.firstname + " " + connector.client.lastname)
                .toLowerCase()
                .includes(name.toLowerCase())
          )
        );
    } else {
      connectors = await OfflineConnector.find({
        createdAt: {
          $gte: beginDay,
          $lte: endDay,
        },
        clinica,
      })
        .sort({ createdAt: -1 })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname bronTime firstname born id phone address isDisability clientMoreDetails")
        .populate({
          path: "services",
          select:
            "service clientMoreDetails createdAt serviceid reseption accept refuse column payment tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails createdAt serviceid reseption accept refuse column payment tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails createdAt serviceid reseption accept refuse payment column tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service clientMoreDetails createdAt serviceid reseption accept payment refuse column tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter((connector) => {
            return connector.services.some(
              (service) =>
                String(service?.department?._id) === String(department) &&
                !service.refuse 
                // &&
                // service.payment
            );
          })
        );
    }

    if (connectors.length > 0) {
      for (const connector of connectors) {
        clients.push({
          client: connector.client,
          connector: {
            clinica: connector.clinica,
            accept: connector.accept,
            createdAt: connector.createdAt,
            probirka: connector.probirka,
            _id: connector._id,
          },
          services: [...connector.services].filter(
            (service) => service.refuse === false
          ),
          payments: connector.payments,
        });
      }
    }

    res.status(200).send(clients);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
module.exports.getClientsByFilter = async (req, res) => {
  const { clinica, beginDay, endDay, department } = req.body;
  const { complaints, diagnostics, from_age, to_age, gender, national, isDisability } = req.body.clientFilterData;

  try {
    // Find clinic by ID
    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }


    // Calculate the start and end birth dates from age range

    let connectors = await OfflineConnector.find({
      createdAt: {
        $gte: beginDay,
        $lte: endDay,
      },
      clinica,
    })
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt -isArchive")
      .populate("clinica", "name phone1 image")
      .populate("client", "lastname firstname born id phone address isDisability gender national")
      .populate({
        path: "services",
        select:
          "service clientMoreDetails createdAt serviceid reseption accept refuse column payment tables turn connector client files department",
        populate: {
          path: "service",
          select: "price",
        },
      })
      .populate({
        path: "services",
        select:
          "service clientMoreDetails createdAt serviceid reseption accept refuse column payment tables turn connector client files department",
        populate: {
          path: "serviceid",
          select: "servicetype",
          populate: {
            path: "servicetype",
            select: "name",
          },
        },
      })
      .populate({
        path: "services",
        select:
          "service clientMoreDetails createdAt serviceid reseption accept refuse payment column tables turn connector client files department",
        populate: {
          path: "templates",
          select: "name template",
        },
      })
      .populate({
        path: "services",
        select:
          "service clientMoreDetails createdAt serviceid reseption accept payment refuse column tables turn connector client files department",
        populate: {
          path: "department",
          select: "probirka",
        },
      })
      .populate("payments")
      .lean()
      .then((connectors) =>
        connectors.filter((connector) => {
          return connector.services.some(
            (service) =>
              String(service?.department?._id) === String(department) &&
              !service.refuse &&
              service.payment
          );
        })
      );
    const clients = [];
    if (connectors.length > 0) {
      for (const connector of connectors) {
        clients.push({
          client: connector.client,
          connector: {
            clinica: connector.clinica,
            accept: connector.accept,
            createdAt: connector.createdAt,
            probirka: connector.probirka,
            _id: connector._id,
          },
          services: [...connector.services].filter(
            (service) => service.refuse === false && service.payment
          ),
          payments: connector.payments,
        });
      }
    }
    const currentDate = new Date();
    const startBirthDate = new Date(currentDate.getFullYear() - to_age, currentDate.getMonth(), currentDate.getDate());
    const endBirthDate = new Date(currentDate.getFullYear() - from_age, currentDate.getMonth(), currentDate.getDate());
    // Apply additional filters
    let filteredClients = connectors.filter((connector) => {
      let isMatch = true;
      let { client, services } = connector;
      // Check diagnostics
      if (diagnostics !== undefined || complaints !== undefined) {
        let hasDiagnos = services?.some(({ clientMoreDetails }) => clientMoreDetails?.diagnostics?.some(d => diagnostics?.some((diagnostic) => {
          return diagnostic.value == d
        })))
        let hasComp = services?.some(({ clientMoreDetails }) => clientMoreDetails?.complaints?.some(d => complaints?.some((complaint) => {
          return complaint.value == d
        })))
        isMatch = isMatch && hasDiagnos || hasComp;
      }
      // Check complaints

      if (from_age && to_age) {
        isMatch = isMatch && client.born >= startBirthDate && client.born <= endBirthDate;
      }
      if (gender) {
        isMatch = isMatch && client.gender == gender;
      }
      if (national) {
        isMatch = isMatch && client.national == national;
      }
      if (isDisability === "true" || isDisability === "false") {
        if (typeof client?.isDisability === "boolean") {
          const isDisabilityBoolean = isDisability === "true";
          console.log(isDisabilityBoolean);
          console.log(client?.isDisability);
          isMatch = isMatch && client?.isDisability === isDisabilityBoolean;
        }
      }
      return isMatch;
    });
    return res.status(200).json(filteredClients);

  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// module.exports.getClientsByFilter = async (req, res) => {
//   const { clinica, beginDay, endDay, department } = req.body;
//   const { complaints, diagnostics, from_age, to_age, gender, national, isDisability } = req.body.clientFilterData;

//   try {
//     // Find clinic by ID
//     const clinic = await Clinica.findById(clinica);

//     if (!clinic) {
//       return res.status(400).json({
//         message: "Diqqat! Klinika ma'lumotlari topilmadi.",
//       });
//     }

//     // Fetch clients by date range
//     const clientsByDateRange = await OfflineClient.find({
//       clinic: clinica,
//       createdAt: { $gte: new Date(beginDay), $lte: new Date(endDay) },
//     });

//     // Calculate the start and end birth dates from age range
//     const currentDate = new Date();
//     const startBirthDate = new Date(currentDate.getFullYear() - to_age, currentDate.getMonth(), currentDate.getDate());
//     const endBirthDate = new Date(currentDate.getFullYear() - from_age, currentDate.getMonth(), currentDate.getDate());
//     // Apply additional filters
//     let filteredClients = clientsByDateRange.filter(client => {
//       let isMatch = true;
//       if (from_age && to_age) {
//         isMatch = isMatch && client.born >= startBirthDate && client.born <= endBirthDate;
//       }
//       if (gender) {
//         isMatch = isMatch && client.gender == gender;
//       }
//       if (national) {
//         isMatch = isMatch && client.national == national;
//       }
//       if (isDisability !== undefined) {
//         isMatch = isMatch && client.isDisability == isDisability;
//       }
//       return isMatch;
//     });
//     return res.status(200).json(filteredClients);
//   } catch (error) {
//     // Handle errors
//     console.log(error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };
module.exports.getStatsionarAll = async (req, res) => {
  try {
    const {
      clinica,
      beginDay,
      endDay,
      department,
      clientborn,
      name,
      clientId,
    } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    let clients = [];

    let connectors = [];

    if (clientborn) {
      connectors = await StatsionarConnector.find({
        clinica,
      })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname firstname born id phone address")
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse createdAt column tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("room", "beginday endday room")
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter(
            (connector) =>
              connector.services.some(
                (service) =>
                  service.department &&
                  String(service.department._id) === String(department._id)
              ) &&
              new Date(
                new Date(connector.client.born).setUTCHours(0, 0, 0, 0)
              ).toISOString() ===
              new Date(
                new Date(clientborn).setUTCHours(0, 0, 0, 0)
              ).toISOString()
          )
        );
    } else if (name) {
      connectors = await StatsionarConnector.find({
        clinica,
      })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname firstname born id phone address fullname")
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse createdAt column tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("room", "beginday endday room")
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter(
            (connector) =>
              connector.services.some(
                (service) =>
                  String(service.department._id) === String(department)
              ) &&
              connector.client &&
              connector.client.fullname
                .toLowerCase()
                .includes(name.toLowerCase())
          )
        );
    } else if (clientId) {
      connectors = await StatsionarConnector.find({
        clinica,
      })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname firstname born id phone address fullname")
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse createdAt column tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("room", "beginday endday room")
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter(
            (connector) =>
              connector.services.some(
                (service) =>
                  String(service.department._id) === String(department)
              ) &&
              connector.client &&
              connector.client.id.toLowerCase().includes(clientId.toLowerCase())
          )
        );
    } else {
      connectors = await StatsionarConnector.find({
        createdAt: {
          $gte: beginDay,
          $lte: endDay,
        },
        clinica,
      })
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname firstname born id phone address")
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("room", "beginday endday room")
        .populate("payments")
        .lean()
        .then((connectors) =>
          connectors.filter((connector) =>
            connector.services.some(
              (service) => String(service.department._id) === String(department)
            )
          )
        );
    }
    if (connectors.length > 0) {
      for (const connector of connectors) {
        clients.push({
          client: connector.client,
          connector: {
            _id: connector._id,
            clinica: connector.clinica,
            accept: connector.accept,
            createdAt: connector.createdAt,
            probirka: connector.probirka,
            room: connector.room,
          },
          services: connector.services,
          payments: connector.payments,
        });
      }
    }

    res.status(200).send(clients);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.gettemplates = async (req, res) => {
  try {
    const { clinica, doctor } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const templates = await Template.find({
      doctor,
      clinica,
    }).select("name template");

    res.status(200).send(templates);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.addservices = async (req, res) => {
  try {
    const { clinica, services, connector, client, user } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const updateOfflineConnector = await OfflineConnector.findById(
      connector._id
    );

    // ===============================================================
    // ===============================================================
    let probirka = 0;
    if (connector.probirka && !updateOfflineConnector.probirka) {
      const lastProbirka = await OfflineConnector.find({
        clinica: connector.clinica,
        probirka: { $ne: 0 },
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() + 1
          ),
        },
      }).sort({ createdAt: -1 });

      probirka = lastProbirka.length > 0 ? lastProbirka[0].probirka + 1 : 1;

      updateOfflineConnector.probirka = probirka;
      await updateOfflineConnector.save();
    }
    // ===============================================================
    // ===============================================================

    let totalprice = 0;
    for (const service of services) {
      const { error } = validateOfflineService(service);

      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      //=========================================================
      // Product decrement
      const productconnectors = await ProductConnector.find({
        clinica: client.clinica,
        service: service.serviceid,
      });

      for (const productconnector of productconnectors) {
        const product = await Product.findById(productconnector.product);
        product.total =
          product.total - productconnector.pieces * service.pieces;
        await product.save();
      }

      //=========================================================
      // TURN
      var turn = 0;
      const clientservice = await OfflineService.findOne({
        clinica: service.clinica,
        client: client._id,
        department: service.department,
        createdAt: {
          $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        },
      });

      if (clientservice) {
        turn = clientservice.turn;
      } else {
        let turns = await OfflineService.find({
          clinica: service.clinica,
          department: service.department,
          createdAt: {
            $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
          },
        })
          .sort({ client: 1 })
          .select("client");

        turns.map((t, i) => {
          if (i === 0) {
            turn++;
          } else {
            if (turns[i - 1].client.toString() !== t.client.toString()) {
              turn++;
            }
          }
        });

        turn++;
      }

      //=========================================================
      //=========================================================
      // Create Service
      const serv = await Service.findById(service.serviceid)
        .populate("column", "col1 col2 col3 col4 col5")
        .populate("tables", "col1 col2 col3 col4 col5");
      const newservice = new OfflineService({
        ...service,
        service: {
          _id: serv._id,
          name: serv.name,
          price: serv.price,
          shortname: serv.shortname,
          doctorProcient: serv.doctorProcient,
          counterAgentProcient: serv.counterAgentProcient,
          counterDoctorProcient: serv.counterDoctorProcient,
        },
        client: client._id,
        connector: updateOfflineConnector._id,
        turn,
        column: { ...serv.column },
        tables: [...JSON.parse(JSON.stringify(serv.tables))],
      });
      await newservice.save();

      const addedservice = new AddedService({
        doctor: user._id,
        service: newservice._id,
      });
      await addedservice.save();

      totalprice += service.service.price;

      updateOfflineConnector.services.push(newservice._id);
    }

    updateOfflineConnector.totalprice =
      updateOfflineConnector.totalprice + totalprice;
    await updateOfflineConnector.save();

    res.status(200).send({ message: "Xizmatlar ro'yxatga olindi" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.addStatsionarService = async (req, res) => {
  try {
    const { clinica, services, connector, client } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    //=========================================================

    const statsionarConnector = await StatsionarConnector.findById(
      connector._id
    );

    // CreateServices
    let totalprice = 0;
    for (const service of services) {
      const { error } = validateStatsionarService(service);

      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      //=========================================================
      // Product decrement
      const productconnectors = await ProductConnector.find({
        clinica: client.clinica,
        service: service.serviceid,
      });

      for (const productconnector of productconnectors) {
        const product = await Product.findById(productconnector.product);
        product.total =
          product.total - productconnector.pieces * service.pieces;
        await product.save();
      }

      //=========================================================
      // Create Service
      const serv = await Service.findById(service.serviceid)
        .populate("column", "col1 col2 col3 col4 col5")
        .populate("tables", "col1 col2 col3 col4 col5");

      let newservice = null;

      if (service.tables && service.tables.length > 0 && service.column) {
        newservice = new StatsionarService({
          ...service,
          service: {
            _id: serv._id,
            name: serv.name,
            price: serv.price,
            shortname: serv.shortname,
            doctorProcient: serv.doctorProcient,
            counterAgentProcient: serv.counterAgentProcient,
            counterDoctorProcient: serv.counterDoctorProcient,
          },
          client: client._id,
          connector: statsionarConnector._id,
          column: service.column,
          tables: service.tables,
        });
      } else {
        newservice = new StatsionarService({
          ...service,
          service: {
            _id: serv._id,
            name: serv.name,
            price: serv.price,
            shortname: serv.shortname,
            doctorProcient: serv.doctorProcient,
            counterAgentProcient: serv.counterAgentProcient,
            counterDoctorProcient: serv.counterDoctorProcient,
          },
          client: client._id,
          connector: statsionarConnector._id,
          column: { ...serv.column },
          tables: [...JSON.parse(JSON.stringify(serv.tables))],
        });
      }

      await newservice.save();

      totalprice += service.service.price * service.pieces;

      statsionarConnector.services.push(newservice._id);
      await statsionarConnector.save();
    }

    statsionarConnector.totalprice = totalprice;
    await statsionarConnector.save();

    res.status(200).send({ message: "Xizmatlar ro'yxatga olindi" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getServices = async (req, res) => {
  try {
    const { clinica, department } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const services = await Service.find({
      clinica,
      department,
    })
      .select("-__v -updatedAt -isArchive")
      .lean();

    res.status(200).json(services);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.adoptClient = async (req, res) => {
  try {
    const { services, connector } = req.body;

    for (const service of services) {
      const offlineService = await OfflineService.findById(service._id);
      offlineService.templates = service.templates;
      offlineService.files = service.files;
      offlineService.accept = true;
      if (service.clientMoreDetails.diagnostics || service.clientMoreDetails.complaints) {
        offlineService.clientMoreDetails = service.clientMoreDetails
      }
      if (service.clientMoreDetails.isDisability) {
        const offlineClient = await OfflineClient.findById(service?.clientMoreDetails?._id)
        offlineClient.isDisability = service.clientMoreDetails.isDisability
        await offlineClient.save()
      }
      if (service.tables && service.tables.length > 0) {
        offlineService.tables = service.tables;
      }
      offlineService.save();
    }

    const offlineConnector = await OfflineConnector.findById(connector);
    offlineConnector.accept = true;
    offlineConnector.save();

    res.status(200).json({ message: "Mijoz qabul qilindi!" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.adoptStatsionarClient = async (req, res) => {
  try {
    const { services, connector, clientMoreDetails } = req.body;

    for (const service of services) {
      const statsionarservice = await StatsionarService.findById(service._id);
      statsionarservice.templates = service.templates;
      statsionarservice.files = service.files;
      statsionarservice.accept = true;
      statsionarservice.clientMoreDetails = clientMoreDetails
      if (service.tables && service.tables.length > 0) {
        statsionarservice.tables = service.tables;
      }
      statsionarservice.save();
    }
    const statsionarconnector = await StatsionarConnector.findById(connector);
    statsionarconnector.accept = true;
    statsionarconnector.save();

    res.status(200).json({ message: "Mijoz qabul qilindi!" });
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getClientHistory = async (req, res) => {
  try {
    const { id } = req.body;

    const connector = await OfflineConnector.findById(id)
      .select("-__v -updatedAt -isArchive")
      .populate("clinica", "name phone1 image")
      .populate("client", "lastname firstname born id phone address")
      .populate({
        path: "services",
        select:
          "service serviceid accept refuse column tables turn connector client files department",
        populate: {
          path: "service",
          select: "price",
        },
      })
      .populate({
        path: "services",
        select:
          "service serviceid accept refuse column tables turn connector client files department",
        populate: {
          path: "serviceid",
          select: "servicetype",
          populate: {
            path: "servicetype",
            select: "name",
          },
        },
      })
      .populate({
        path: "services",
        select:
          "service serviceid accept refuse column tables turn connector client files department",
        populate: {
          path: "templates",
          select: "name template",
        },
      })
      .populate({
        path: "services",
        select:
          "service serviceid accept refuse column tables turn connector client files department",
        populate: {
          path: "department",
          select: "probirka",
        },
      })
      .lean();

    if (!connector) {
      const statsionarconnector = await StatsionarConnector.findById(id)
        .select("-__v -updatedAt -isArchive")
        .populate("clinica", "name phone1 image")
        .populate("client", "lastname firstname born id phone address")
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse createdAt column tables turn connector client files department",
          populate: {
            path: "service",
            select: "price",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "serviceid",
            select: "servicetype",
            populate: {
              path: "servicetype",
              select: "name",
            },
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "templates",
            select: "name template",
          },
        })
        .populate({
          path: "services",
          select:
            "service serviceid accept refuse column createdAt tables turn connector client files department",
          populate: {
            path: "department",
            select: "probirka",
          },
        })
        .populate("room", "beginday endday room")
        .lean();

      return res.status(200).json(statsionarconnector);
    }

    return res.status(200).json(connector);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
