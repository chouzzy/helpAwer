import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { CreateDocumentsRequestProps } from "./CreateDocumentsController";
import { createDocumentsSchema } from "./CreateDocumentsSchema";
import { Students } from "../../../entities/Students";
import { Documents } from "../../../entities/Documents";




async function checkBody(documentsData: CreateDocumentsRequestProps): Promise<validationResponse> {
    // check body properties
    try {
        const yupValidation = await createDocumentsSchema.validate(documentsData, {
            abortEarly: false,
        })
        return { isValid: true, statusCode: 202 }
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return { errorMessage: error.errors, statusCode: 403, isValid: false }
        }
    }
    return { isValid: true, statusCode: 202 }
}




async function ErrorValidation(createdDocuments: Documents | validationResponse): Promise<validationResponse> {

    function checkIfIsAError(createdDocuments: any): createdDocuments is validationResponse {
        return 'isValid' in createdDocuments;
    }

    if (checkIfIsAError(createdDocuments)) {

        //É um erro
        return createdDocuments
    } else {

        //Não é um erro
        return {
            isValid: true,
            statusCode: 202,
            successMessage: 'Não foi encontrado nenhum tipo de erro.'
        }
    }

}
export { checkBody, ErrorValidation }



