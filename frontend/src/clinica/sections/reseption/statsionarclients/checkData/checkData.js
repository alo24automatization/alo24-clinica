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

    if (!client.born) {
        return {
            title: t("Diqqat! Mijozning tug'ilgan sanasi kiritilmagan."),
            description: "",
            status: "error",
        };
    }

    if (!client.phone || (client.phone && client.phone.length !== 9)) {
        return {
            title: t("Diqqat! Mijoz telefon raqami kiritilmagan."),
            description: "",
            status: "error",
        };
    }

    if (!client.gender) {
        return {
            title: t("Diqqat! Mijozning jinsi tanlanmagan."),
            description: "",
            status: "error",
        };
    }

    if (!client.national) {
        return {
            title: t('Diqqat! Mijozning fuqorosi tanlanmagan.'),
            description: '',
            status: 'error',
        }
    }

    return false;
};

export const checkServicesData = (services) => {
    for (const service of services) {
        if (service.pieces === "0") {
            return {
                title: `Diqqat! ${service.service.name} xizmati soni 0 ko'rsatilgan.`,
                description: `Iltimos xizmat ko'rsatilmasa uni ro'yxatdan o'chiring yoki xizmat sonini kiriting.`,
                status: "error",
            };
        }
    }
    return false;
};

export const checkProductsData = (products) => {
    for (const product of products) {
        if (product.pieces === "0") {
            return {
                title: `Diqqat! ${product.product.name} mahsuloti soni 0 ko'rsatilgan.`,
                description: `Iltimos mahsulot qo'shilmasa uni ro'yxatdan o'chiring yoki mahsulot sonini kiriting.`,
                status: "error",
            };
        }
    }
    return false;
};

export const checkConnectorData = (connector, client, t) => {
    if (!connector.doctor && !client._id) {
        return {
            title: t("Diqqat! Mijozga shifokor biriktirilmagan."),
            description: "",
            status: "error",
        };
    }
    return false;
};

export const checkRoomData = (room, client, t) => {
    if (!room.roomid && !client._id) {
        return {
            title: t("Diqqat! Mijozga xona biriktirilmagan."),
            description: "",
            status: "error",
        };
    }

    if (!room.beginday && !client._id) {
        return {
            title: t("Diqqat! Mijozning kelgan kuni kiritilmagan."),
            description: "",
            status: "error",
        };
    }
    return false;
};

