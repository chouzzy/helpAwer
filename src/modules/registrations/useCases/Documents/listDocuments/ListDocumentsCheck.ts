import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { Documents } from "../../../entities/Documents";

async function ErrorValidation(documents: Documents[] | validationResponse): Promise<validationResponse> {

    function checkIfIsAError(documents: any): documents is validationResponse {
        return 'isValid' in documents;
    }

    if (checkIfIsAError(documents)) {
        //É um erro
        return documents
    } else {
        //Não é um erro
        if (documents.length == 0) {
            return {
                isValid: false,
                statusCode: 404,
                errorMessage: '⚠️ Não foi encontrada nenhuma turma. ⚠️'
            }
        }
        return {
            isValid: true,
            statusCode: 202,
            successMessage: 'Não foi encontrado nenhum tipo de erro.'
        }
    }

}

export { ErrorValidation }