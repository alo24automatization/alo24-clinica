// Department
export const checkDepartment = (department, t) => {


  if (!department.clinica)
    return {
      title: t("Diqqat! Avtorzatsiyadan o'tilmagan."),
      description: "Iltimos bo'limdan chiqib qayta kiriting.",
      status: "error",
    };
  if (!department.name)
    return {
      title: t("Diqqat! Bo'lim nomi kiritilmagan."),
      description: t("Iltimos bo'lim nomini kiriting."),
      status: "error",
    };
  return false;
};

// ServiceType
export const checkServiceType = (servicetype, t) => {
  if (!servicetype.clinica)
    return {
      title: t("Diqqat! Avtorzatsiyadan o'tilmagan."),
      description: t("Iltimos bo'limdan chiqib qayta kiriting."),
      status: "error",
    };

  if (!servicetype.department)
    return {
      title: t("Diqqat! Bo'lim tanlanmagan."),
      description: t("Iltimos bo'lim tanlang."),
      status: "error",
    };

  if (!servicetype.name)
    return {
      title: t("Diqqat! Xizmat turi kiritilmagan."),
      description: t("Iltimos xizmat turini kiriting."),
      status: "error",
    };
  return false;
};

export const checkService = (service, t) => {
  if (!service.clinica)
    return {
      title: t("Diqqat! Avtorzatsiyadan o'tilmagan."),
      description: t("Iltimos bo'limdan chiqib qayta kiring."),
      status: "error",
    };
  if (!service.department)
    return {
      title: t("Diqqat! Bo'lim tanlanmagan."),
      description: t("Iltimos bo'lim tanlang."),
      status: "error",
    };
  if (!service.servicetype)
    return {
      title: t("Diqqat! Xizmat turi kiritilmagan."),
      description: t("Iltimos xizmat turini kiriting."),
      status: "error",
    };

  if (!service.name)
    return {
      title: t("Diqqat! Xizmat nomi kiritilmagan."),
      description: t("Iltimos xizmat nomini kiriting."),
      status: "error",
    };

  if (!service.price)
    return {
      title: t("Diqqat! Xizmat narxi kiritilmagan."),
      description: t("Iltimos xizmat narxi kiriting."),
      status: "error",
    };
  return false;
};

export const checkUploadServices = (departments, clinica, services, servicetypes) => {
  let k = 0;
  for (const service of services) {

    k++;
    // if (clinica.name !== service.clinica) {
    //   return {
    //     title: `Diqqat! ${k}-xizmatda klinika nomi noto'g'ri ko'rsatilgan.`,
    //     description: "Iltimos klinika nomini to'g'ri kiriting.",
    //     status: "error",
    //   };
    // }
    const d = departments.find(
      (department) => department.name === service.department
    );
    if (!d) {
      return {
        title: `Diqqat! ${k}-xizmatda  bo'lim  ko'rsatilmagan yoki to'g'ri kiritilmagan.`,
        description: "Iltimos mavjud bo'lim nomini  kiriting.",
        status: "error",
      };
    }

    const s = servicetypes.find(
      (servicetype) => servicetype.name === service.servicetype
    );

    if (!s) {
      return {
        title: `Diqqat! ${k}-xizmatda  xizmat turi ko'rsatilmagan.`,
        description: "Iltimos mavjud xizmat turini nomini  kiriting.",
        status: "error",
      };
    }

    if (typeof Number(service.price) !== "number") {
      return {
        title: `Diqqat! ${k}-xizmatda xizmat narxi noto'g'ri kiritilmagan.`,
        description:
          "Iltimos xizmat narxini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }

    if (service.doctorProcient && typeof service.doctorProcient !== "number") {
      return {
        title: `Diqqat! ${k}-xizmatda shifokor ulushi noto'g'ri kiritilgan.`,
        description:
          "Iltimos shifokor ulushini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }

    if (
      service.counterAgentProcient &&
      typeof service.counterAgentProcient !== "number"
    ) {
      return {
        title: `Diqqat! ${k}-xizmatda kounteragent ulushi noto'g'ri kiritilgan.`,
        description:
          "Iltimos kounteragent ulushini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }

    if (
      service.counterDoctorProcient &&
      typeof service.counterDoctorProcient !== "number"
    ) {
      return {
        title: `Diqqat! ${k}-xizmatda yo'naltiruvchi shifokor ulushi noto'g'ri kiritilgan.`,
        description:
          "Iltimos yo'naltiruvchi shifokor ulushini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }
  }

  return false;
};

export const checkRoom = (room) => {
  if (!room.clinica)
    return {
      title: "Diqqat! Avtorzatsiyadan o'tilmagan.",
      description: "Iltimos bo'limdan chiqib qayta kiring.",
      status: "error",
    };
  if (!room.type)
    return {
      title: "Diqqat! Xona turi kiritilmagan.",
      description: "Iltimos xona turini kiriting.",
      status: "error",
    };
  if (!room.number)
    return {
      title: "Diqqat! Xona raqami kiritilmagan.",
      description: "Iltimos xona raqamini kiriting.",
      status: "error",
    };

  if (!room.price)
    return {
      title: "Diqqat! Xona narxi kiritilmagan.",
      description: "Iltimos xona narxi kiriting.",
      status: "error",
    };
  return false;
};

export const checkUploadRooms = (clinica, rooms) => {
  let k = 0;
  for (const room of rooms) {
    k++;
    if (clinica.name !== room.clinica) {
      return {
        title: `Diqqat! ${k}-qatorda klinika nomi noto'g'ri ko'rsatilgan.`,
        description: "Iltimos klinika nomini to'g'ri kiriting.",
        status: "error",
      };
    }

    if (typeof room.price !== "number") {
      return {
        title: `Diqqat! ${k}-qatorda xizmat narxi noto'g'ri kiritilmagan.`,
        description:
          "Iltimos xona narxini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }

    if (!room.number) {
      return {
        title: `Diqqat! ${k}-qatorda xona raqami kiritilmagan.`,
        description: "Iltimos xona raqamini kiriting.",
        status: "error",
      };
    }

    if (typeof room.place !== "number") {
      return {
        title: `Diqqat! ${k}-qatorda o'rin to'g'ri kiritilmagan.`,
        description:
          "Iltimos xona o'rnini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }
  }
  return false;
};

// Mahsulotni tekshirish
export const checkProduct = (product) => {
  if (!product.name) {
    return {
      title: `Diqqat! Mahsulot nomi ko'rsatilmagan.`,
      description: "Iltimos mahsulot narxini kiriting.",
      status: "error",
    };
  }

  if (!product.price) {
    return {
      title: `Diqqat! Mahsulot narxi kiritilmagan.`,
      description: "Iltimos mahsulot narxini kiriting.",
      status: "error",
    };
  }

  if (!product.unit) {
    return {
      title: `Diqqat! o'lchov birligi tanlanmagan.`,
      description: "Iltimos o'lchov birligini tanlang.",
      status: "error",
    };
  }

  if (!product.minimum) {
    return {
      title: `Diqqat! minimum qiymat kiritilmagan.`,
      description: "Iltimos minimum qiymat kiriting!",
      status: "error",
    };
  }
  return false;
};

// Mahsulotlarni tekshirish
export const checkUploadProducts = (clinica, products) => {
  let k = 0;
  for (const product of products) {
    k++;
    if (clinica.name !== product.clinica) {
      return {
        title: `Diqqat! ${k}-qatorda klinika nomi noto'g'ri ko'rsatilgan.`,
        description: "Iltimos klinika nomini to'g'ri kiriting.",
        status: "error",
      };
    }

    if (typeof product.price !== "number") {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot narxi noto'g'ri kiritilgan.`,
        description:
          "Iltimos mahsulot narxini son ko'rinishida, mavjud bo'lmasa 0 kiriting.",
        status: "error",
      };
    }

    if (!product.name) {
      return {
        title: `Diqqat! Mahsulot nomi ko'rsatilmagan.`,
        description: "Iltimos mahsulot narxini kiriting.",
        status: "error",
      };
    }

    if (!product.price) {
      return {
        title: `Diqqat! Mahsulot narxi kiritilmagan.`,
        description: "Iltimos mahsulot narxini kiriting.",
        status: "error",
      };
    }

    if (!product.unit) {
      return {
        title: `Diqqat! o'lchov birligi kiritilmagan.`,
        description: "Iltimos o'lchov birligini kiriting.",
        status: "error",
      };
    }
  }
  return false;
};

// Omborxona tekshirish
export const checkWarehouse = (warehouse) => {
  if (!warehouse.product) {
    return {
      title: `Diqqat! Mahsulot nomi tanlanmagan.`,
      description: "Iltimos mahsulot nomini tanlang.",
      status: "error",
    };
  }

  if (!warehouse.price) {
    return {
      title: `Diqqat! Mahsulot narxi kiritilmagan.`,
      description: "Iltimos mahsulot narxini kiriting.",
      status: "error",
    };
  }

  if (!warehouse.total) {
    return {
      title: `Diqqat! Mahsulot soni kiritilmagan.`,
      description: "Iltimos mahsulot sonini kiriting.",
      status: "error",
    };
  }

  if (!warehouse.dateofreciept) {
    return {
      title: `Diqqat! Mahsulot keltirilgan vaqt kiritilmagan.`,
      description: "Iltimos mahsulot keltirilgan vaqtni kiriting.",
      status: "error",
    };
  }
  return false;
};

// Mahsulotlarni tekshirish
export const checkUploadWarehouses = (clinica, warehouses) => {
  let k = 0;
  for (const warehouse of warehouses) {
    k++;
    if (!warehouse.product) {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot nomi kiritilmagan.`,
        description: "Iltimos mahsulot nomini tanlang.",
        status: "error",
      };
    }

    if (typeof warehouse.price !== "number") {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot narxi to'g'ri kiritilmagan.`,
        description: "Iltimos mahsulot narxini to'g'ri kiriting.",
        status: "error",
      };
    }

    if (typeof warehouse.total !== "number") {
      return {
        title: `Diqqat! ${k}-qatord mMahsulot soni to'g'ri kiritilmagan.`,
        description: "Iltimos mahsulot to'g'ri sonini kiriting.",
        status: "error",
      };
    }

    if (!warehouse.dateofreciept) {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot keltirilgan vaqt kiritilmagan.`,
        description: "Iltimos mahsulot keltirilgan vaqtni kiriting.",
        status: "error",
      };
    }

    if (clinica.name !== warehouse.clinica) {
      return {
        title: `Diqqat! ${k}-qatorda klinika nomi noto'g'ri ko'rsatilgan.`,
        description: "Iltimos klinika nomini to'g'ri kiriting.",
        status: "error",
      };
    }
  }
  return false;
};

// Bog'lanishni tekshirish
export const checkProductConnector = (productConnector) => {
  if (!productConnector.product) {
    return {
      title: `Diqqat! Mahsulot nomi tanlanmagan.`,
      description: "Iltimos mahsulot nomini tanlang.",
      status: "error",
    };
  }

  if (!productConnector.service) {
    return {
      title: `Diqqat! Xizmat nomi tanlanmagan.`,
      description: "Iltimos xizmat nomini tanlang.",
      status: "error",
    };
  }

  if (!productConnector.pieces) {
    return {
      title: `Diqqat! Mahsulot soni kiritilmagan.`,
      description: "Iltimos mahsulot sonini kiriting.",
      status: "error",
    };
  }
  return false;
};

// Bog'lanishlarni tekshirish
export const checkUploadProductConnectors = (clinica, productConnectors) => {
  let k = 0;
  for (const productConnector of productConnectors) {
    k++;
    if (productConnector.clinica) {
      return {
        title: `Diqqat! ${k}-qatorda klinika nomi kiritilmagan.`,
        description: "Iltimos mahsulot nomini kiriting.",
        status: "error",
      };
    }

    if (productConnector.clinica !== clinica.name) {
      return {
        title: `Diqqat! ${k}-qatorda klinika nomi kiritilmagan.`,
        description: "Iltimos mahsulot nomini kiriting.",
        status: "error",
      };
    }

    if (!productConnector.product) {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot nomi kiritilmagan.`,
        description: "Iltimos mahsulot nomini kiriting.",
        status: "error",
      };
    }

    if (!productConnector.service) {
      return {
        title: `Diqqat! ${k}-qatorda xizmat nomi kiritilmagan.`,
        description: "Iltimos xizmat nomini kiriting.",
        status: "error",
      };
    }

    if (!productConnector.pieces) {
      return {
        title: `Diqqat! ${k}-qatorda mahsulot soni kiritilmagan.`,
        description: "Iltimos mahsulot sonini kiriting.",
        status: "error",
      };
    }
  }
  return false;
};
