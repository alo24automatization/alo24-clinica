const { CounterDoctor } = require("../../models/CounterDoctor/CounterDoctor");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { OfflineService } = require("../../models/OfflineClient/OfflineService");
const {
  StatsionarRoom,
} = require("../../models/StatsionarClient/StatsionarRoom");
require("../../models/StatsionarClient/StatsionarConnector");
require("../../models/StatsionarClient/StatsionarClient");
require("../../models/OfflineClient/OfflineClient");
const { User } = require("../../models/Users");

module.exports.create = async (req, res) => {
  try {
    const {
      _id,
      clinica,
      firstname,
      lastname,
      counter_agent,
      clinica_name,
      phone,
      statsionar_profit,
    } = req.body;

    const clinic = await Clinica.findById(clinica);
    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    if (_id) {
      await CounterDoctor.findByIdAndUpdate(_id, {
        firstname: firstname,
        lastname: lastname,
        clinica_name: clinica_name,
        phone: phone,
        statsionar_profit: statsionar_profit,
      });
      const counterDoctor = await CounterDoctor.findById(_id).lean();
      return res.status(201).json(counterDoctor);
    } else {
      let firstCounterAgent = counter_agent;

      if (!firstCounterAgent) {
        firstCounterAgent = await User.findOne({
          clinica,
          type: "CounterAgent",
        });
        console.log(firstCounterAgent);

        if (!firstCounterAgent) {
          return res.status(400).json({
            message: "Diqqat! Kounter Agent ma'lumotlari topilmadi.",
          });
        }

        firstCounterAgent = firstCounterAgent._id;
      }

      const counterDoctor = new CounterDoctor({
        firstname,
        lastname,
        clinica,
        clinica_name,
        counter_agent: firstCounterAgent,
        phone,
        statsionar_profit,
      });

      await counterDoctor.save();
      return res.status(201).json(counterDoctor);
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

const customAlphabetCompare = (a, b) => {
  const alphabet = [
    ...'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ', // Russian
    ...'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЪЫЬЭЮЯЎҚҒҲ', // Uzbek Cyrillic
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ' // English
  ];

  const aName = a.lastname + a.firstname;
  const bName = b.lastname + b.firstname;

  for (let i = 0; i < Math.max(aName.length, bName.length); i++) {
    const aChar = aName[i] || '';
    const bChar = bName[i] || '';

    const aIndex = alphabet.indexOf(aChar.toUpperCase());
    const bIndex = alphabet.indexOf(bChar.toUpperCase());

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
  }
  return 0;
};
module.exports.getDoctorClients = async (req, res) => {
  try {
    const { id: counterdoctor } = req.params;
    const { clinica, beginDay, endDay } = req.body;

    if (!counterdoctor || !clinica) {
      return res.status(400).json({ error: "counterdoctor and clinica are required." });
    }

    const query = {
      clinica,
      counterdoctor,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    };

    const services = await OfflineService.find(query)
      .select("service createdAt counterdoctor pieces client payment")
      .populate({
        path: "counterdoctor",
        select: "firstname lastname phone",
      })
      .populate({
        path: "client",
        select: "firstname lastname createdAt phone",
      })
      .populate({
        path: "service",
      })
      .lean();

    // Filter out services that are refused
    const validServices = services.filter(service => !service.refuse&&service.payment);
    // Group clients and calculate doctor and agent profit
    const clients = validServices.map(service => {
      const totalprice = service.service.price * service.pieces;
      const counterdoctor_profit = service.service.counterDoctorProcient <= 100
        ? (totalprice / 100) * service.service.counterDoctorProcient
        : service.service.counterDoctorProcient;
      const counteragent_profit = service.service.counterAgentProcient <= 100
        ? (totalprice / 100) * service.service.counterAgentProcient
        : service.service.counterAgentProcient;

      return {
        firstname: service.client.firstname,
        lastname: service.client.lastname,
        phone: service.client.phone,
        createdAt: service.client.createdAt,
        serviceName: service.service.name,
        totalprice: totalprice,
        counterdoctor_profit: counterdoctor_profit,
        counteragent_profit: counteragent_profit,
      };
    });

    // Sort clients by name using the custom alphabet compare function
    clients.sort(customAlphabetCompare);

    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
module.exports.get = async (req, res) => {
  try {
    const { counterdoctor, counter_agent, beginDay, endDay, clinica } = req.body;

    const query = {
      clinica,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    };

    if (counterdoctor) {
      query.counterdoctor = counterdoctor;
    }

    const services = await OfflineService.find(query)
      .select("service createdAt counterdoctor pieces refuse client")
      .populate({
        path: "counterdoctor",
        select: "firstname lastname clinica_name counter_agent phone",
        match: counter_agent ? { counter_agent } : {},
      })
      .populate("client", "firstname lastname")
      .lean();

    // Filter out services that are refused or do not have a counterdoctor (if counterdoctor was not specified)
    const validServices = services.filter(service => !service.refuse && (counterdoctor || service.counterdoctor));

    // Group services by counterdoctor and count unique clients
    const groupedByCounterdoctor = validServices.reduce((acc, service) => {
      if (!acc[service.counterdoctor._id]) {
        acc[service.counterdoctor._id] = {
          counterdoctor: service.counterdoctor,
          totalprice: 0,
          counterdoctor_profit: 0,
          counteragent_profit: 0,
          clients: new Set(),
        };
      }
      const totalprice = service.service.price * service.pieces;
      const counterdoctor_profit = service.service.counterDoctorProcient <= 100
        ? (totalprice / 100) * service.service.counterDoctorProcient
        : service.service.counterDoctorProcient;
      const counteragent_profit = service.service.counterAgentProcient <= 100
        ? (totalprice / 100) * service.service.counterAgentProcient
        : service.service.counterAgentProcient;

      acc[service.counterdoctor._id].totalprice += totalprice;
      acc[service.counterdoctor._id].counterdoctor_profit += counterdoctor_profit;
      acc[service.counterdoctor._id].counteragent_profit += counteragent_profit;
      acc[service.counterdoctor._id].clients.add(service.client._id);

      return acc;
    }, {});

    // Convert grouped data to an array and count clients
    const result = Object.values(groupedByCounterdoctor).map(doc => ({
      counterdoctor: doc.counterdoctor,
      totalprice: doc.totalprice,
      counterdoctor_profit: doc.counterdoctor_profit,
      counteragent_profit: doc.counteragent_profit,
      client_count: doc.clients.size,
    }));
    // Sort clients by name using the custom alphabet compare function
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getStatsionarProfit = async (req, res) => {
  try {
    const { counterdoctor, counter_agent, beginDay, endDay, clinica } =
      req.body;

    let statsionarrooms = [];

    if (!counterdoctor) {
      statsionarrooms = await StatsionarRoom.find({
        clinica,
        createdAt: {
          $gte: beginDay,
          $lt: endDay,
        },
      })
        .select("-__v -updatedAt -isArchive")
        .populate("connector")
        .populate("client", "firstname lastname createdAt")
        .populate({
          path: "counterdoctor",
          select: "-__v -updatedAt -isArchive",
          match: { counter_agent: counter_agent },
        })
        .lean()
        .then((rooms) => {
          return rooms.filter((room) => room.counterdoctor);
        });
    } else {
      statsionarrooms = await StatsionarRoom.find({
        clinica,
        createdAt: {
          $gte: beginDay,
          $lt: endDay,
        },
      })
        .select("-__v -updatedAt -isArchive")
        .populate("counterdoctor")
        .populate("client", "firstname lastname")
        .lean()
        .then((rooms) =>
          rooms.filter(
            (room) =>
              room.counterdoctor &&
              String(room.counterdoctor._id) === String(counterdoctor)
          )
        );
    }

    res.status(200).json(statsionarrooms);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getDcotors = async (req, res) => {
  try {
    const { clinica, counter_agent } = req.body;

    const clinic = await Clinica.findById(clinica);
    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    if (counter_agent) {
      const counterDoctors = await CounterDoctor.find({
        clinica,
        counter_agent,
      })
        .select("-__v -isArchive -updatedAt")
        .lean();

      return res.status(200).json(counterDoctors);
    } else {
      const counterDoctors = await CounterDoctor.find({
        clinica,
      })
        .select("-__v -isArchive -updatedAt")
        .populate("counter_agent", "firstname lastname")
        .lean();

      return res.status(200).json(counterDoctors);
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

module.exports.getCounterAgents = async (req, res) => {
  try {
    const { clinica, beginDay, endDay } = req.body;

    const clinic = await Clinica.findById(clinica);
    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const counteragents = await User.find({
      clinica,
      type: "CounterAgent",
    })
      .select("firstname lastname clinica")
      .lean();

    for (const counteragent of counteragents) {
      const counterdoctors = await CounterDoctor.find({
        clinica,
        counter_agent: counteragent._id,
      })
        .select("-__v -isArchive -updatedAt")
        .lean();

      counteragent.totalprice = 0;
      counteragent.counteragent_profit = 0;
      counteragent.counterdoctor_profit = 0;
      counteragent.clients = 0;
      counteragent.counterdoctors = 0;

      for (const counterdoctor of counterdoctors) {
        const offlineservices = await OfflineService.find({
          clinica,
          createdAt: {
            $gte: beginDay,
            $lte: endDay,
          },
          counterdoctor: counterdoctor._id,
        })
          .select("service pieces client createdAt")
          .lean();

        if (offlineservices.length > 0) {
          counteragent.counterdoctors += 1;
        }

        counteragent.totalprice += offlineservices.reduce(
          (prev, el) => prev + el.service.price * el.pieces,
          0
        );
        counteragent.counteragent_profit += offlineservices.reduce(
          (prev, el) => {
            if (el.service.counterAgentProcient <= 100) {
              prev +=
                ((el.service.price * el.pieces) / 100) *
                el.service.counterAgentProcient;
            } else {
              prev += el.service.counterAgentProcient;
            }
            return prev;
          },
          0
        );
        counteragent.counterdoctor_profit += offlineservices.reduce(
          (prev, el) => {
            if (el.service.counterDoctorProcient <= 100) {
              prev +=
                ((el.service.price * el.pieces) / 100) *
                el.service.counterDoctorProcient;
            } else {
              prev += el.service.counterDoctorProcient;
            }
            return prev;
          },
          0
        );

        let clientsid = [];
        counteragent.clients += offlineservices.reduce((prev, el) => {
          if (!clientsid.includes(String(el.client))) {
            prev += 1;
            clientsid.push(String(el.client));
          }
          return prev;
        }, 0);
      }
    }

    res.status(200).json(counteragents);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};
