import { validationResponse } from "../../../../../types";
import { Documents } from "../../../entities/Documents";
import { SchoolClass } from "../../../entities/SchoolClass";
import { IDocumentsRepository } from "../../../repositories/IDocumentsRepository";
import { CreateDocumentsRequestProps } from "./CreateDocumentsController";


class CreateDocumentsUseCase {
    constructor(
        private documentsRepository: IDocumentsRepository) {}

    async execute(documentsData: CreateDocumentsRequestProps, schoolClassID: SchoolClass["id"]): Promise<Documents | validationResponse> {
        
        const createdDocuments = await this.documentsRepository.createDocuments(documentsData, schoolClassID)
        
        return createdDocuments
    }
    
}

export {CreateDocumentsUseCase}