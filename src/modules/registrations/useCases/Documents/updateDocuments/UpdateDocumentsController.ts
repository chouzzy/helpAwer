import { Request, Response } from "express"
import { checkBody, ErrorValidation } from "./UpdateDocumentsCheck"
import { DocumentsRepository } from "../../../repositories/implementations/DocumentsRepository"
import { Documents } from "../../../entities/Documents"
import { UpdateDocumentsUseCase } from "./UpdateDocumentsUseCase"

interface UpdateDocumentsRequestProps {

    title: Documents["title"],
    downloadLink: Documents["downloadLink"],
}

class UpdateDocumentsController {

    async handle(req: Request, res: Response): Promise<Response> {

        const documentData: UpdateDocumentsRequestProps = req.body
        const documentID: Documents['id'] = req.params.documentID

        /// é responsabilidade do controller validar os dados recebidos na requisição
        const bodyValidation = await checkBody(documentData)

        if (bodyValidation.isValid === false) {
            return res.status(bodyValidation.statusCode).json({
                errorMessage: bodyValidation.errorMessage
            })
        }

        /// instanciação da classe do caso de uso
        const documentsRepository = new DocumentsRepository()
        const updateDocumentsUseCase = new UpdateDocumentsUseCase(documentsRepository)
        const updatedDocument = await updateDocumentsUseCase.execute(documentData, documentID)

        ///
        const updatedDocumentIsValid = await ErrorValidation(updatedDocument)

        if (updatedDocumentIsValid.isValid === false) {
            return res.status(updatedDocumentIsValid.statusCode).json({
                errorMessage: updatedDocumentIsValid.errorMessage
            })
        }

        return res.status(202).json({
            updatedDocument
        })

    }
}

export { UpdateDocumentsController, UpdateDocumentsRequestProps }