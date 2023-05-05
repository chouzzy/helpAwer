import * as yup from "yup" ;
import YupPassword from 'yup-password'
YupPassword(yup)

const createDocumentsSchema = yup.object({
    title: yup.string().required("O título é obrigatório").min(3, "O título precisa ter no mínimo três caracteres"),
    downloadLink: yup.string().required("O link de download é obrigatório").min(3, "link de download precisa ter no mínimo três caracteres"),

})

export { createDocumentsSchema }