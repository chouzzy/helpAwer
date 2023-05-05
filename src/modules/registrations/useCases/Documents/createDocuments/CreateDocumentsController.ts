import { Request, Response } from "express"
import { checkBody, ErrorValidation } from "./CreateDocumentsCheck"
import { CreateDocumentsUseCase } from "./CreateDocumentsUseCase"
import { DocumentsRepository } from "../../../repositories/implementations/DocumentsRepository"
import { Documents } from "../../../entities/Documents"

interface CreateDocumentsRequestProps {
    title: Documents["title"],
    downloadLink: Documents["downloadLink"],
}

class CreateDocumentsController {
    async handle(req: Request, res: Response): Promise<Response> {

        const documentsData: CreateDocumentsRequestProps = req.body
        const {schoolClassID} = req.params

        /// é responsabilidade do controller validar os dados recebidos na requisição
        const bodyValidation = await checkBody(documentsData)

        if (bodyValidation.isValid === false) {
            return res.status(bodyValidation.statusCode).json({
                errorMessage: bodyValidation.errorMessage
            })
        }

        /// instanciação da classe do caso de uso
        const documentsRepository = new DocumentsRepository()
        const createDocumentsUseCase = new CreateDocumentsUseCase(documentsRepository)
        const createdDocuments = await createDocumentsUseCase.execute(documentsData, schoolClassID)

        ///
        const createdDocumentsIsValid = await ErrorValidation(createdDocuments)

        if (createdDocumentsIsValid.isValid === false) {
            return res.status(createdDocumentsIsValid.statusCode).json({
                errorMessage: createdDocumentsIsValid.errorMessage
            })
        }

        return res.status(202).json({
            createdDocuments
        })

    }
}

export { CreateDocumentsController, CreateDocumentsRequestProps }