import { Request, Response } from "express"
import { Documents } from "../../../entities/Documents"
import { DocumentsRepository } from "../../../repositories/implementations/DocumentsRepository"
import { ErrorValidation } from "./DeleteDocumentsCheck"
import { DeleteDocumentsUseCase } from "./DeleteDocumentsUseCase"

class DeleteDocumentsController {
    async handle(req: Request, res: Response): Promise<Response> {

        const documentsID:Documents["id"] = req.params.documentsID

        const documentsRepository = new DocumentsRepository()
        const deleteDocumentsUseCase = new DeleteDocumentsUseCase(documentsRepository)
        const deletedDocuments = await deleteDocumentsUseCase.execute(documentsID)

        const deletedDocumentsIsValid = await ErrorValidation(deletedDocuments)

        if (deletedDocumentsIsValid.isValid === false) {
            return res.status(deletedDocumentsIsValid.statusCode).json({
                errorMessage: deletedDocumentsIsValid.errorMessage
            })
        }

        return res.status(202).json({
            deletedDocuments
        })

    }
}

export {DeleteDocumentsController}