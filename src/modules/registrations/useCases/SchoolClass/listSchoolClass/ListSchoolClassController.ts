import { Request, Response } from "express";
import { SchoolClass } from "../../../entities/SchoolClass";
import { SchoolClassRepository} from "../../../repositories/implementations/SchoolClassRepository";
import { ErrorValidation } from "./ListSchoolClassCheck";
import { ListSchoolClassUseCase } from "./ListSchoolClassUseCase";

class ListSchoolClassController {
    async handle(req: Request, res: Response): Promise<Response> {

        // Instanciando o useCase no repositório com as funções
        const schoolClassRepository = new SchoolClassRepository()

        const listSchoolClassUseCase = new ListSchoolClassUseCase(schoolClassRepository);

        const schoolClass = await listSchoolClassUseCase.execute()
        
        const schoolClassAreValid = await ErrorValidation(schoolClass)
        
        if (schoolClassAreValid.isValid === false) {
            return res.status(schoolClassAreValid.statusCode).json({
                errorMessage: schoolClassAreValid.errorMessage
            })
        }

        return res.status(202).json({
            schoolClass
        })

    }
}

export { ListSchoolClassController }