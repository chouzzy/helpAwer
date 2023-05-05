import { validationResponse } from "../../../../../types";
import { SchoolClass } from "../../../entities/SchoolClass";
import { ISchoolClassRepository } from "../../../repositories/ISchoolClassRepository";
import { UpdateSchoolClassRequestProps } from "./UpdateSchoolClassController";

class UpdateSchoolClassUseCase {
    constructor(
        private schoolClassRepository: ISchoolClassRepository) {}

    async execute(schoolClassData: UpdateSchoolClassRequestProps, schoolClassID: SchoolClass["id"]): Promise<validationResponse> {
        
        const upatedSchoolClassResponse = await this.schoolClassRepository.updateSchoolClass(schoolClassData, schoolClassID)
        
        return upatedSchoolClassResponse
    }
    
}

export {UpdateSchoolClassUseCase}