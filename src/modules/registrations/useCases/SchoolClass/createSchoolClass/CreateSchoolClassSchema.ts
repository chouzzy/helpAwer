import * as yup from "yup" ;
import YupPassword from 'yup-password'
YupPassword(yup)

const createSchoolClassSchema = yup.object({
    title: yup.string().required("O título é obrigatório").min(3, "O título precisa ter no mínimo três caracteres"),
    description: yup.string().required("A descrição é obrigatória").min(5, "A descrição precisa ter no mínimo cinco caracteres"),
    initHour: yup.string().required("O horário de início é obrigatório").min(3, "O horário de início precisa ter no mínimo três caracteres"),
    endHour: yup.string().required("O horário de encerramento é obrigatório").min(3, "O horário de encerramento precisa ter no mínimo três caracteres"),
    daysOfWeek: yup.string().required("A carga semanal é obrigatório").min(1, "A carga semanal precisa ter no mínimo um caractere"),
    registrationStatus: yup.string().required("O status de inscrição é obrigatório").min(3, "O status de inscrição precisa ter no mínimo três caracteres"),
    subscriptionPrice: yup.number().required("O preço de inscrição é obrigatório"),
    semester: yup.string().required("O semestre letivo é obrigatório")
    .min(1, "O semestre letivo precisa ter apenas um caractere, sendo este numérico. Ex: 1")
    .max(1, "O semestre letivo preicsa ter apenas um caractere, sendo este numérico. Ex: 1"),
    year: yup.string().required("O ano letivo é obrigatório").min(4, "O ano letivo precisa 4 caracteres").max(4, 'O ano letivo precisa ter 4 caracteres, Ex: 2024'),

})

export { createSchoolClassSchema }