export const checkUserData = (user) => {
  if (!user.type)
    return {
      title: "Diqqat! Bo'lim tanlanmagan.",
      description: "Iltimos bo'limni tanlang.",
      status: "error",
    };
  if (!user.password)
    return {
      title: "Diqqat! Parol kiritilmagan.",
      description: "Iltimos parolni kiriting.",
      status: "error",
    };
  if (user.password.length < 6)
    return {
      title: "Diqqat! Parol noto'g'ri",
      description: "Iltimos parolni qayta kiriting.",
      status: "error",
    };
  return false;
};

export const checkDirectorData = (director) => {
  if (!director.firstname) {
    return {
      title: "Diqqat! Direktor ismi kiritilmagan.",
      description: "Iltimos direktor ismini kiriting.",
      status: "error",
    };
  }

  if (!director.lastname) {
    return {
      title: "Diqqat! Direktor familiyasi kiritilmagan.",
      description: "Iltimos direktor familiyasini kiriting.",
      status: "error",
    };
  }

  if (!director.phone) {
    return {
      title: "Diqqat! Direktor telefon raqami kiritilmagan.",
      description: "Iltimos direktor telefon raqami kiriting.",
      status: "error",
    };
  }

  if (director.phone.length !== 9) {
    return {
      title:
        "Diqqat! Direktor telefon raqami kiritishda xatolikka yo'l qo'yilgan.",
      description: "Iltimos direktor telefon raqamini to'g'ri kiriting.",
      status: "error",
    };
  }

  if (!director.password) {
    return {
      title: "Diqqat! Direktor paroli kiritilmagan.",
      description: "Iltimos direktor parolini kiriting.",
      status: "error",
    };
  }

  if (!director.password) {
    return {
      title: "Diqqat! Direktor paroli kiritilmagan.",
      description: "Iltimos direktor parolini kiriting.",
      status: "error",
    };
  }

  if (director.password < 6) {
    return {
      title: "Diqqat! ",
      description: "Parol uzunligi 6 belgidan kam bo'lmasligi kerak.",
      status: "error",
    };
  }

  if (!director.confirmPassword) {
    return {
      title: "Diqqat! Parolni tasdiqlash qismini to'ldirilmagan.",
      description:
        "Iltimos parolni tasdiqlash bo'limiga parolni qayta kiriting.",
      status: "error",
    };
  }
  if (director.password !== director.confirmPassword) {
    return {
      title: "Diqqat! Parolni qayta kiritishda xatolikka yo'l qo'yilgan.",
      description: "Iltimos parolni to'g'ri tasdiqlang.",
      status: "error",
    };
  }
  if (!director.image) {
    return {
      title: "Diqqat! Director surati yuklanmagan.",
      description: "Iltimos direktor suratini yuklang.",
      status: "error",
    };
  }
  return false;
};

export const checkDirectorUpdateData = (director) => {
  if (!director.firstname) {
    return {
      title: "Diqqat! Direktor ismi kiritilmagan.",
      description: "Iltimos direktor ismini kiriting.",
      status: "error",
    };
  }

  if (!director.lastname) {
    return {
      title: "Diqqat! Direktor familiyasi kiritilmagan.",
      description: "Iltimos direktor familiyasini kiriting.",
      status: "error",
    };
  }

  if (!director.phone) {
    return {
      title: "Diqqat! Direktor telefon raqami kiritilmagan.",
      description: "Iltimos direktor telefon raqami kiriting.",
      status: "error",
    };
  }

  if (!director.image) {
    return {
      title: "Diqqat!  Direktor surati yuklanmagan.",
      description: "Iltimos direktor suratini yuklang.",
      status: "error",
    };
  }
  return false;
};

export const checkClinicaData = (clinica) => {
  if (!clinica.name) {
    return {
      title: "Diqqat! Shifoxona nomi kiritilmagan.",
      description: "Iltimos shifoxona nomini kiriting.",
      status: "error",
    };
  }

  if (!clinica.phone1) {
    return {
      title: "Diqqat! Shifoxona telefon raqami kiritilmagan.",
      description: "Iltimos telefon raqamini kiriting.",
      status: "error",
    };
  }

  if (!clinica.image) {
    return {
      title: "Diqqat! Shifoxona logotipi yoki surati yuklanmagan.",
      description: "Iltimos shifoxona logotipi yoki surati yuklang.",
      status: "error",
    };
  }

  return false;
};

export const checkDirectorUpdatePassword = (director) => {
  if (
    director.oldpassword.length < 6 ||
    director.newpassword.length < 6 ||
    director.confirmpassword.length < 6
  ) {
    return {
      title: "Diqqat! Parol 6 belgidan kam bo'lmasligi kerak.",
      description: "Iltimos parolni to'g'ri kiriting.",
      status: "error",
    };
  }

  if (director.newpassword !== director.confirmpassword) {
    return {
      title:
        "Diqqat! Yangi parol va uni qayta kiritishdagi nusxasi mos kelmadi.",
      description: "Iltimos parolni to'g'ri kiriting.",
      status: "error",
    };
  }

  return false;
};
