export const checkClientData = (client, t) => {
  if (!client.firstname) {
    return {
      title: t("Diqqat! Mijoz ismi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (!client.lastname) {
    return {
      title: t("Diqqat! Mijoz familiyasi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (!client.brondate) {
    return {
      title: t("Diqqat! Mijozning kelgan vaqti kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (client.phone && client.phone.length !== 9) {
    return {
      title: t("Diqqat! Mijoz telefon raqami 9 raqamdan iborat bo'lishi kerak."),
      description: "",
      status: "error",
    };
  }

  return false;
};

