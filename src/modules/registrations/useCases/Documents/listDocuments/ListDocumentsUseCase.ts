import { IDocumentsRepository } from "../../../repositories/IDocumentsRepository"
import { validationResponse } from "../../../../../types"
import { Documents } from "../../../entities/Documents"
import { SchoolClass } from "../../../entities/SchoolClass"
//////

class ListDocumentsUseCase {
    constructor(
        private documentsRepository: IDocumentsRepository) { }

    async execute(schoolClassID: SchoolClass["id"]): Promise<Documents[] | validationResponse> {


        const documents = await this.documentsRepository.listDocumentsBySchoolClassID(schoolClassID)
        
        return documents
    }
}

export { ListDocumentsUseCase }
