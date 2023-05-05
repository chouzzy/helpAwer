import { Request, Response } from "express"
import { SchoolClass } from "../../../entities/SchoolClass"
import { SchoolClassRepository } from "../../../repositories/implementations/SchoolClassRepository"
import { ErrorValidation } from "./DeleteSchoolClassCheck"
import { DeleteSchoolClassUseCase } from "./DeleteSchoolClassUseCase"

class DeleteSchoolClassController {
    async handle(req: Request, res: Response): Promise<Response> {

        const schoolClassID:SchoolClass["id"] = req.params.schoolClassID

        const schoolClassRepository = new SchoolClassRepository()
        const deleteSchoolClassUseCase = new DeleteSchoolClassUseCase(schoolClassRepository)
        const deletedSchoolClass = await deleteSchoolClassUseCase.execute(schoolClassID)

        const deletedSchoolClassIsValid = await ErrorValidation(deletedSchoolClass)

        if (deletedSchoolClassIsValid.isValid === false) {
            return res.status(deletedSchoolClassIsValid.statusCode).json({
                errorMessage: deletedSchoolClassIsValid.errorMessage
            })
        }

        return res.status(202).json({
            deletedSchoolClass
        })

    }
}

export {DeleteSchoolClassController}