import { validationResponse } from "../../../../../types";
import { Documents } from "../../../entities/Documents";
import { IDocumentsRepository } from "../../../repositories/IDocumentsRepository";
import { UpdateDocumentsRequestProps } from "./UpdateDocumentsController";

class UpdateDocumentsUseCase {
    constructor(
        private documentsRepository: IDocumentsRepository) {}

    async execute(documentData: UpdateDocumentsRequestProps, documentID: Documents["id"]): Promise<Documents | validationResponse> {
        
        const upatedDocument = await this.documentsRepository.updateDocument(documentData, documentID)
        
        return upatedDocument
    }
    
}

export {UpdateDocumentsUseCase}