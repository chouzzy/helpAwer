import { Request, Response } from "express";
import { Documents } from "../../../entities/Documents";
import { DocumentsRepository} from "../../../repositories/implementations/DocumentsRepository";
import { ErrorValidation } from "./ListDocumentsCheck";
import { ListDocumentsUseCase } from "./ListDocumentsUseCase";

class ListDocumentsController {
    async handle(req: Request, res: Response): Promise<Response> {

        const {schoolClassID} = req.params

        // Instanciando o useCase no repositório com as funções
        const documentsRepository = new DocumentsRepository()

        const listDocumentsUseCase = new ListDocumentsUseCase(documentsRepository);

        const documents = await listDocumentsUseCase.execute(schoolClassID)
        
        const documentsAreValid = await ErrorValidation(documents)
        
        if (documentsAreValid.isValid === false) {
            return res.status(documentsAreValid.statusCode).json({
                errorMessage: documentsAreValid.errorMessage
            })
        }

        return res.status(202).json({
            documents
        })

    }
}

export { ListDocumentsController }