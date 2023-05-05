import { Request, Response } from "express"
import { checkBody, ErrorValidation } from "./UpdateSchoolClassCheck"
import { SchoolClassRepository } from "../../../repositories/implementations/SchoolClassRepository"
import { SchoolClass } from "../../../entities/SchoolClass"
import { UpdateSchoolClassUseCase } from "./UpdateSchoolClassUseCase"

interface UpdateSchoolClassRequestProps {

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

class UpdateSchoolClassController {

    async handle(req: Request, res: Response): Promise<Response> {

        const schoolClassData: UpdateSchoolClassRequestProps = req.body
        const { schoolClassID } = req.params

        /// é responsabilidade do controller validar os dados recebidos na requisição
        const bodyValidation = await checkBody(schoolClassData)

        if (bodyValidation.isValid === false) {
            return res.status(bodyValidation.statusCode).json({
                errorMessage: bodyValidation.errorMessage
            })
        }

        /// instanciação da classe do caso de uso
        const schoolClasssRepository = new SchoolClassRepository()
        const updateSchoolClassUseCase = new UpdateSchoolClassUseCase(schoolClasssRepository)
        const updatedSchoolClassResponse = await updateSchoolClassUseCase.execute(schoolClassData, schoolClassID)

        ///
        return res.status(updatedSchoolClassResponse.statusCode)
            .json({
                schoolClass: updatedSchoolClassResponse.schoolClass,
                successMessage: updatedSchoolClassResponse.successMessage?? "none",
                errorMessage: updatedSchoolClassResponse.errorMessage?? "none"
            })
    }
}

export { UpdateSchoolClassController, UpdateSchoolClassRequestProps }