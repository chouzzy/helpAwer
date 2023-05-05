import { Prisma } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { validationResponse } from "../../../../types";
import { Documents } from "../../entities/Documents";
import { SchoolClass } from "../../entities/SchoolClass";
import { CreateDocumentsRequestProps } from "../../useCases/Documents/createDocuments/CreateDocumentsController";
import { UpdateDocumentsRequestProps } from "../../useCases/Documents/updateDocuments/UpdateDocumentsController";
import { IDocumentsRepository } from "../IDocumentsRepository";


class DocumentsRepository implements IDocumentsRepository {

    private documents: Documents[]
    constructor() {
        this.documents = [];
    }


    async createDocuments(documentsData: CreateDocumentsRequestProps, schoolClassID: SchoolClass["id"]): Promise<Documents | validationResponse> {

        try {

            const searchedSchoolClass = await prisma.schoolClass.findFirst({
                where: {
                    id: schoolClassID
                },
            })

            //Checa se email e usuario ja existem
            if (!searchedSchoolClass) {
                return { isValid: false, errorMessage: `🛑 Document already exists 🛑`, statusCode: 403 }
            }

            const documentExists = await prisma.documents.findFirst({
                where: {
                    AND: [
                        { title: documentsData.title },
                        { downloadLink: documentsData.downloadLink },
                        { schoolClassId: schoolClassID }
                    ]
                }
            })

            if (documentExists) {
                return { isValid: false, errorMessage: `🛑 Document already exists 🛑`, statusCode: 403 }
            }
            const createDocument = await prisma.documents.create({
                data: {
                    title: documentsData.title,
                    downloadLink: documentsData.downloadLink,
                    schoolClassId: schoolClassID,
                }
            })

            return createDocument


        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientValidationError) {

                const argumentPosition = error.message.search('Argument')
                const mongoDBError = error.message.slice(argumentPosition)
                return { isValid: false, errorMessage: mongoDBError, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }

    }

    async listDocumentsBySchoolClassID(schoolClassID: SchoolClass["id"]): Promise<validationResponse | Documents[]> {
        try {
            const documents = await prisma.documents.findMany({
                where: { schoolClassId: schoolClassID },
            })

            return documents
        } catch (error: unknown) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async deleteDocumentByID(DocumentID: Documents["id"]): Promise<Documents | validationResponse> {
        
        try {

            const document = await prisma.documents.findUnique({
                where: {
                    id: DocumentID
                }
            })


            if (document != null) {

                try {
                    
                    const document = await prisma.documents.delete({
                        where: {
                            id: DocumentID
                        }
                    })

                    return document

                } catch {

                    return {
                        isValid: false,
                        statusCode: 403,
                        errorMessage: "⛔ An error occurred when trying to delete the document from the database ⛔"
                    }
                }

            } else {

                return {
                    isValid: false,
                    statusCode: 403,
                    errorMessage: "⛔ Document not found in database ⛔"
                }
            }

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async updateDocument(documentData: UpdateDocumentsRequestProps, documentID: Documents["id"]): Promise<Documents | validationResponse> {

        try {
            
            const document = await prisma.documents.findFirst({
                where: {
                    id: documentID
                }
            })
            
            if (!document) {
                return { isValid: false, errorMessage: '🛑 Document not found 🛑', statusCode: 403 }
            }

           

            const updatedDocuments = await prisma.documents.update({
                where: {
                    id: documentID
                },
                data: {
                    title: documentData.title,
                    downloadLink: documentData.downloadLink
                }
            })

            return updatedDocuments

        } catch (error: unknown) {

            if (error instanceof Prisma.PrismaClientValidationError) {
                const argumentPosition = error.message.search('Argument')
                const mongoDBError = error.message.slice(argumentPosition)
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }
            }

            else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }


}

export { DocumentsRepository }
