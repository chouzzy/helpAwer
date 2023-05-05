import { ISchoolClassRepository } from "../../../repositories/ISchoolClassRepository"
import { validationResponse } from "../../../../../types"
import { SchoolClass } from "../../../entities/SchoolClass"
//////

class ListSchoolClassUseCase {
    constructor(
        private schoolClassRepository: ISchoolClassRepository) { }

    async execute(): Promise<SchoolClass[] | validationResponse> {


        const schoolClass = await this.schoolClassRepository.listAllSchoolClasses()
        
        return schoolClass
    }
}

export { ListSchoolClassUseCase }
