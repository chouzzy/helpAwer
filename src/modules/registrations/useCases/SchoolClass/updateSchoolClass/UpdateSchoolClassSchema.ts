import { number, object, string } from "yup";

const updateSchoolClassSchema = object({
    title: string().min(3, "O título precisa ter no mínimo três caracteres"),
    description: string().required("A descrição é obrigatória").min(5, "A descrição precisa ter no mínimo cinco caracteres"),
    initHour: string().min(3, "O horário de início precisa ter no mínimo três caracteres"),
    endHour: string().min(3, "O horário de encerramento precisa ter no mínimo três caracteres"),
    daysOfWeek: string().min(1, "A carga semanal precisa ter no mínimo um caractere"),
    registrationStatus: string().min(3, "O status de inscrição precisa ter no mínimo três caracteres"),
    subscriptionPrice: number().required("O preço de inscrição é obrigatório"),
    semester: string().required("O semestre letivo é obrigatório")
    .min(1, "O semestre letivo precisa ter apenas um caractere, sendo este numérico. Ex: 1")
    .max(1, "O semestre letivo preicsa ter apenas um caractere, sendo este numérico. Ex: 1"),
    year: string().required("O ano letivo é obrigatório").min(4, "O ano letivo precisa 4 caracteres").max(4, 'O ano letivo precisa ter 4 caracteres, ex: 2024'),

})

export { updateSchoolClassSchema }