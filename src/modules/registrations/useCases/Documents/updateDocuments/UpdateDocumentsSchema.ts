import { object, string } from "yup";

const updateDocumentSchema = object({
    title: string().required("O título é obrigatório").min(3, "O título precisa ter no mínimo três caracteres"),
    downloadLink: string().required("O link de download é obrigatório").min(3, "link de download precisa ter no mínimo três caracteres"),

})

export { updateDocumentSchema }