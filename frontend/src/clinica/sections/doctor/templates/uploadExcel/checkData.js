// Department
export const checkTemplates = (templates) => {
    for (const i in templates) {
        if (!templates[i].name)
            return {
                title: `Diqqat! . ${i} - shablon nomi kiritilmagan.`,
                description: "Iltimos shablon nomini kiriting",
                status: "error",
            };
        if (!templates[i].template)
            return {
                title: `Diqqat! . ${i} - shablon kiritilmagan.`,
                description: "Iltimos shablonni kiriting",
                status: "error",
            };
    }

    return false;
};