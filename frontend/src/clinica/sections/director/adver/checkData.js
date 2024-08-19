// Adver
export const checkAdver = (adver) => {
  if (!adver.clinica)
    return {
      title: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      description: "Iltimos bo'limdan chiqib qayta kiriting.",
      status: 'error',
    }
  if (!adver.name)
    return {
      title: "Diqqat! Bo'lim nomi kiritilmagan.",
      description: 'Iltimos reklama nomini kiriting.',
      status: 'error',
    }
  return false
}
