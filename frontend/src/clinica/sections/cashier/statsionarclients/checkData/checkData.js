export const checkData = (totalpayment, payment, discount, services, products) => {

    for (const service of services) {
        if (service.refuse && !service.comment) {
            return {
                title: `Diqqat! Xizmat rad etilgani sababini ko'rsating.`,
                description: ".",
                status: 'error',
            }
        }

        if (service.refuse && service.comment.length < 5) {
            return {
                title: "Diqqat! Xizmat rad etilgani sababi kamida belgidan iborat bo'lishi lozim.",
                description: ".",
                status: 'error',
            }
        }
    }

    for (const product of products) {
        if (product.refuse && !product.comment) {
            return {
                title: "Diqqat! Mahsulot rad etilgani sababini ko'rsating.",
                description: "",
                status: 'error',
            }
        }

        if (product.refuse && product.comment.length < 5) {
            return {
                title: "Diqqat! Mahsulot rad etilgani sababi kamida belgidan iborat bo'lishi lozim.",
                description: ".",
                status: 'error',
            }
        }
    }

    if (discount.discount > 0 && !discount.comment) {
        return {
            title: "Diqqat! Chegirma uchun izohni belgilang.",
            description: "",
            status: 'error',
        }
    }

    if (payment.debt > 0 && !payment.comment) {
        return {
            title: "Diqqat! Qarz uchun izohni kiriting.",
            description: "",
            status: 'error',
        }
    }

    if (payment.debt > 0 && payment.comment.length < 5) {
        return {
            title: "Diqqat! Qarz uchun izoh ka,oda 5 belgidan iborat bo'lishi kerak.",
            description: "",
            status: 'error',
        }
    }

    if (payment.type === '' || !payment.type) {
        return {
            title: "Diqqat! Iltimos to'lov turini ko'rsating.",
            description: "",
            status: 'error',
        }
    }

    if (parseInt(payment.payment) !== parseInt(payment.cash) + parseInt(payment.card) + parseInt(payment.transfer)
    ) {
        return {
            title: "Diqqat! To'lov summasida xatolik yuz berdi.",
            description: "Iltimos to'lov summalarini qayta ko'rib chiqing.",
            status: 'error',
        }
    }

    return false
}

export const checkServices = (services, products) => {
    for (const service of services) {
        if (service.refuse && !service.comment) {
            return {
                title: `Diqqat! Xizmat rad etilgani sababini ko'rsating.`,
                description: ".",
                status: 'error',
            }
        }

        if (service.refuse && service.comment.length < 5) {
            return {
                title: "Diqqat! Xizmat rad etilgani sababi kamida belgidan iborat bo'lishi lozim.",
                description: ".",
                status: 'error',
            }
        }
    }

    for (const product of products) {
        if (product.refuse && !product.comment) {
            return {
                title: "Diqqat! Mahsulot rad etilgani sababini ko'rsating.",
                description: "",
                status: 'error',
            }
        }

        if (product.refuse && product.comment.length < 5) {
            return {
                title: "Diqqat! Mahsulot rad etilgani sababi kamida belgidan iborat bo'lishi lozim.",
                description: ".",
                status: 'error',
            }
        }
    }
    return false
}
