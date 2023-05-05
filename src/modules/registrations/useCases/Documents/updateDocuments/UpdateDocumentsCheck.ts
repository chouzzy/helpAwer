import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { UpdateDocumentsRequestProps } from "./UpdateDocumentsController";
import { Students } from "../../../entities/Students";
import { Documents } from "../../../entities/Documents";
import { updateDocumentSchema } from "./UpdateDocumentsSchema";




async function checkBody(documentData: UpdateDocumentsRequestProps): Promise<validationResponse> {
    // check body properties
    try {
        const yupValidation = await updateDocumentSchema.validate(documentData, {
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




async function ErrorValidation(updatedDocuments: Documents | validationResponse): Promise<validationResponse> {

    function checkIfIsAError(updatedDocuments: any): updatedDocuments is validationResponse {
        return 'isValid' in updatedDocuments;
    }

    if (checkIfIsAError(updatedDocuments)) {

        //É um erro
        return updatedDocuments
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



