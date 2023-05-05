import { SchoolClass } from "@prisma/client"
import { validationResponse } from "../../../types"
import { Documents } from "../entities/Documents"
import { CreateDocumentsRequestProps } from "../useCases/Documents/createDocuments/CreateDocumentsController"
import { UpdateDocumentsRequestProps } from "../useCases/Documents/updateDocuments/UpdateDocumentsController"


interface IDocumentsRepository {

    createDocuments(documentsData: CreateDocumentsRequestProps, schoolClassID: SchoolClass["id"]): Promise<Documents|validationResponse>
    
    listDocumentsBySchoolClassID(schoolClassID: SchoolClass["id"]): Promise<validationResponse | Documents[]> 

    deleteDocumentByID(DocumentID: Documents["id"]): Promise<Documents | validationResponse>

    updateDocument(documentData: UpdateDocumentsRequestProps, documentID: Documents["id"]): Promise<Documents | validationResponse>
}

export {IDocumentsRepository}