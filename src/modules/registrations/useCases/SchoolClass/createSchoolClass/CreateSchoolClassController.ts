import { Request, Response } from "express"
import { checkBody, ErrorValidation } from "./CreateSchoolClassCheck"
import { CreateSchoolClassUseCase } from "./CreateSchoolClassUseCase"
import { SchoolClassRepository } from "../../../repositories/implementations/SchoolClassRepository"
import { SchoolClass } from "../../../entities/SchoolClass"
import { validationResponse } from "../../../../../types"

interface CreateSchoolClassRequestProps {

    title: SchoolClass["title"],
    description: SchoolClass["description"],
    initHour: SchoolClass["initHour"],
    endHour: SchoolClass["endHour"],
    daysOfWeek: SchoolClass["daysOfWeek"],
    registrationStatus: SchoolClass["registrationStatus"],
    subscriptionPrice: SchoolClass["subscriptionPrice"],
    semester: SchoolClass["semester"],
    year: SchoolClass["year"]
}

class CreateSchoolClassController {
    async handle(req: Request, res: Response): Promise<Response> {

        const schoolClassData: CreateSchoolClassRequestProps = req.body

        /// é responsabilidade do controller validar os dados recebidos na requisição
        const bodyValidation = await checkBody(schoolClassData)

        if (bodyValidation.isValid === false) {
            return res.status(bodyValidation.statusCode).json({
                errorMessage: bodyValidation.errorMessage
            })
        }

        /// instanciação da classe do caso de uso
        const schoolClassRepository = new SchoolClassRepository()
        const createSchoolClassUseCase = new CreateSchoolClassUseCase(schoolClassRepository)
        const createdSchoolClassResponse = await createSchoolClassUseCase.execute(schoolClassData)
        
        return res.status(createdSchoolClassResponse.statusCode)
            .json({
                schoolClass: createdSchoolClassResponse.schoolClass,
                errorMessage: createdSchoolClassResponse.errorMessage ?? "none",
                successMessage: createdSchoolClassResponse.successMessage ?? "none"
            })
    }
}

export { CreateSchoolClassController, CreateSchoolClassRequestProps }