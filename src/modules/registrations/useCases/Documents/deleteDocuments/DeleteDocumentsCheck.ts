import { validationResponse } from "../../../../../types";
import { Documents } from "../../../entities/Documents";

async function ErrorValidation(createdDocuments: Documents | validationResponse): Promise<validationResponse> {
    
    function checkIfIsAError(createdDocuments: any): createdDocuments is validationResponse {
        return 'isValid' in createdDocuments;
    }

    if (checkIfIsAError(createdDocuments)) {
        //É um erro
        return createdDocuments

    } else {
        // não é um erro
        return {            
            isValid: true,
            statusCode: 202,
            successMessage:'Não foi encontrado nenhum tipo de erro.'
        }
    }

}
export {ErrorValidation}



