import { validationResponse } from "../../../../../types";
import { Documents } from "../../../entities/Documents";
import { IDocumentsRepository } from "../../../repositories/IDocumentsRepository";

class DeleteDocumentsUseCase {
    constructor(
        private documentsRepository: IDocumentsRepository) {}

    async execute(documentsID:Documents["id"]): Promise<Documents | validationResponse> {
        
        const deletedDocuments = await this.documentsRepository.deleteDocumentByID(documentsID)
        
        return deletedDocuments
    }
    
}

export {DeleteDocumentsUseCase}