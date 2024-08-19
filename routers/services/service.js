const { Service, validateService } = require("../../models/Services/Service");
const { Clinica } = require("../../models/DirectorAndClinica/Clinica");
const { Department } = require("../../models/Services/Department");
const { ServiceType } = require("../../models/Services/ServiceType");
const { ProductConnector } = require("../../models/Warehouse/ProductConnector");
const ObjectId = require("mongodb").ObjectId;

//Service registerall
module.exports.registerAll = async (req, res) => {
  try {
    const services = req.body;
    const all = [];
    for (const s of services) {
      const { error } = validateService(s);
      if (error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      const {
        name,
        shortname,
        servicetype,
        department,
        clinica,
        price,
        doctorProcient,
        counterAgentProcient,
        counterDoctorProcient,
        serviceroom
      } = s;

      const clinic = await Clinica.findOne({ name: clinica });

      if (!clinic) {
        return res.status(400).json({
          message: "Diqqat! Klinika ma'lumotlari topilmadi.",
        });
      }

      const departmen = await Department.findOne({
        name: department,
        clinica: clinic._id,
      });

      if (!departmen) {
        return res.status(400).json({
          message: `Diqqat! ${department} bo'limi mavjud emas.`,
        });
      }

      const Servicetype = await ServiceType.findOne({
        name: servicetype,
        department: departmen._id,
        clinica: clinic._id,
      });

      if (!Servicetype && servicetype) {
        return res.status(400).json({
          message: `Diqqat! ${department} bo'limida ${servicetype} xizmat turi mavjud emas.`,
        });
      }

      const service = await Service.findOne({
        clinica: clinic._id,
        name,
        department: departmen._id,
      });

      if (service) {
        return res.status(400).json({
          message: `Diqqat! ${name} xizmati avval yaratilgan.`,
        });
      }

      const newService = new Service({
        name,
        shortname,
        department: departmen._id,
        clinica: clinic._id,
        price,
        doctorProcient,
        counterAgentProcient,
        counterDoctorProcient,
        serviceroom
      });

      if (Servicetype) {
        newService.servicetype = Servicetype._id;
      }

      all.push(newService);
    }

    all.map(async (service) => {
      await service.save();

      const updateDepartment = await Department.findByIdAndUpdate(
        service.department._id,
        {
          $push: {
            services: service._id,
          },
        }
      );

      if (service.servicetype) {
        const updateServiceType = await ServiceType.findByIdAndUpdate(
          service.servicetype._id,
          {
            $push: {
              services: service._id,
            },
          }
        );
      }
    });

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateService(req.body);
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    const {
      name,
      servicetype,
      shortname,
      department,
      clinica,
      price,
      doctorProcient,
      counterAgentProcient,
      counterDoctorProcient,
      serviceroom
    } = req.body;

    const service = await Service.findOne({
      clinica,
      name,
      department,
    });

    if (service) {
      return res.status(400).json({
        message: `Diqqat! ${name} xizmati avval yaratilgan.`,
      });
    }

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const departmen = await Department.findById(department);

    if (!departmen) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const Servicetype = await ServiceType.findById(servicetype);

    if (!Servicetype && servicetype) {
      return res.status(400).json({
        message: `Diqqat! ${servicetype} xizmat turi mavjud emas.`,
      });
    }

    const newService = new Service({
      name,
      shortname,
      department: departmen._id,
      clinica: clinic._id,
      price,
      doctorProcient,
      counterAgentProcient,
      counterDoctorProcient,
      serviceroom
    });

    if (Servicetype) {
      newService.servicetype = Servicetype._id;
    }
    await newService.save();

    const updateDepartment = await Department.findByIdAndUpdate(departmen._id, {
      $push: {
        services: newService._id,
      },
    });

    if (Servicetype) {
      const updateServiceType = await ServiceType.findByIdAndUpdate(
        Servicetype._id,
        {
          $push: {
            services: newService._id,
          },
        }
      );
    }

    res.send(newService);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service getall
module.exports.getAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const services = await Service.find({
      clinica,
    })
      .populate("department", "name")
      .populate("clinica", "name")
      .populate("servicetype", "name");

    res.send(services);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service getalldepartment
module.exports.getAllDepartment = async (req, res) => {
  try {
    const { clinica, department } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const departmen = await Department.findById(department);

    if (!departmen) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const services = await Service.find({
      clinica,
      department,
    })
      .populate("department", "name")
      .populate("clinica", "name")
      .populate("servicetype", "name");

    res.send(services);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service update
module.exports.update = async (req, res) => {
  try {
    const {
      _id,
      name,
      shortname,
      department,
      servicetype,
      clinica,
      price,
      doctorProcient,
      counterAgentProcient,
      counterDoctorProcient,
      serviceroom
    } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const departmen = await Department.findById(department);

    if (!departmen) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const service = await Service.findById(_id);

    if (!service) {
      return res.status(400).json({
        message: `Diqqat! ${name} xizmati avval yaratilmagan.`,
      });
    }

    service.name = name;
    service.shortname = shortname;
    service.price = price;
    service.doctorProcient = doctorProcient;
    service.counterAgentProcient = counterAgentProcient;
    service.counterDoctorProcient = counterDoctorProcient;
    service.serviceroom = serviceroom;

    if (!service.servicetype && servicetype) {
      const serviceTypeUpdate1 = await ServiceType.findByIdAndUpdate(
        servicetype,
        {
          $push: {
            services: new ObjectId(service._id),
          },
        }
      );
      service.servicetype = servicetype;
    } else {
      if (
        service.servicetype &&
        servicetype &&
        service.servicetype !== servicetype
      ) {
        const serviceTypeUpdate = await ServiceType.findByIdAndUpdate(
          service.servicetype,
          {
            $pull: {
              services: new ObjectId(service._id),
            },
          }
        );

        const serviceTypeUpdate1 = await ServiceType.findByIdAndUpdate(
          servicetype,
          {
            $push: {
              services: new ObjectId(service._id),
            },
          }
        );
        service.servicetype = servicetype;
      } else {
        if (service.servicetype && !servicetype) {
          service.servicetype = undefined;
        }
      }
    }

    if (!service.department && department) {
      await Department.findByIdAndUpdate(
        department,
        {
          $push: {
            services: new ObjectId(service._id),
          },
        }
      );
      service.department = department;
    } else {
      if (
        service.department &&
        department &&
        service.department !== department
      ) {
        await Department.findByIdAndUpdate(
          service.department,
          {
            $pull: {
              services: new ObjectId(service._id),
            },
          }
        );

        await Department.findByIdAndUpdate(
          department,
          {
            $push: {
              services: new ObjectId(service._id),
            },
          }
        );
        service.department = department;
      } else {
        if (service.department && !department) {
          service.department = undefined;
        }
      }
    }

    await service.save();
    const services = await Service.find({
      clinica,
    })
      .populate("department", "name")
      .populate("clinica", "name")
      .populate("servicetype", "name");

    res.send(services);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service delete
module.exports.delete = async (req, res) => {
  try {
    const { _id, department, clinica, name, servicetype } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const departmen = await Department.findById(department);

    if (!departmen) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const servicetyp = await ServiceType.findById(servicetype);

    if (servicetype && !servicetyp) {
      return res.status(400).json({
        message: "Diqqat! Xizmat turi ma'lumotlari topilmadi.",
      });
    }

    const service = await Service.findByIdAndDelete(_id);

    if (!service) {
      return res.status(400).json({
        message: `Diqqat! ${name} xizmati avval yaratilmagan.`,
      });
    }

    const departmentUpdate = await Department.findByIdAndUpdate(department, {
      $pull: {
        services: new ObjectId(_id),
      },
    });

    const servicetypeUpdate = await ServiceType.findByIdAndUpdate(servicetype, {
      $pull: {
        services: new ObjectId(_id),
      },
    });

    for (const productconnector of service.productconnectors) {
      const del = await ProductConnector.findByIdAndDelete(productconnector);
    }

    const services = await Service.find({
      clinica,
    })
      .populate("department", "name")
      .populate("clinica", "name")
      .populate("servicetype", "name");

    res.send(services);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service deletealldepartment
module.exports.deleteAllDepartment = async (req, res) => {
  try {
    const { department, clinica, servicetype } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const departmen = await Department.findById(department);

    if (!departmen) {
      return res.status(400).json({
        message: "Diqqat! Bo'lim ma'lumotlari topilmadi.",
      });
    }

    const services = await Service.find({
      clinica,
      department,
    });

    let all = [];
    for (const service of services) {
      const del = await Service.findByIdAndDelete(service._id);

      const departmentUpdate = await Department.findByIdAndUpdate(department, {
        $pull: {
          services: new ObjectId(service._id),
        },
      });

      const servicetypeUpdate = await ServiceType.findByIdAndUpdate(
        servicetype,
        {
          $pull: {
            services: new ObjectId(service._id),
          },
        }
      );

      for (const productconnector of service.productconnectors) {
        const del = await ProductConnector.findByIdAndDelete(productconnector);
      }

      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};

//Service deleteall
module.exports.deleteAll = async (req, res) => {
  try {
    const { clinica } = req.body;

    const clinic = await Clinica.findById(clinica);

    if (!clinic) {
      return res.status(400).json({
        message: "Diqqat! Klinika ma'lumotlari topilmadi.",
      });
    }

    const services = await Service.find({
      clinica,
    });

    let all = [];
    for (const service of services) {
      const del = await Service.findByIdAndDelete(service._id);

      const departmentUpdate = await Department.findByIdAndUpdate(
        service.department,
        {
          $pull: {
            services: new ObjectId(service._id),
          },
        }
      );

      const servicetypeUpdate = await ServiceType.findByIdAndUpdate(
        service.servicetype,
        {
          $pull: {
            services: new ObjectId(service._id),
          },
        }
      );

      for (const productconnector of service.productconnectors) {
        const del = await ProductConnector.findByIdAndDelete(productconnector);
      }

      all.push(del);
    }

    res.send(all);
  } catch (error) {
    res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
  }
};



