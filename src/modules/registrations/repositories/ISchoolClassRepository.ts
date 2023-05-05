import { validationResponse } from "../../../types"
import { SchoolClass } from "../entities/SchoolClass"
import { CreateSchoolClassRequestProps } from "../useCases/SchoolClass/createSchoolClass/CreateSchoolClassController"
import { UpdateSchoolClassRequestProps } from "../useCases/SchoolClass/updateSchoolClass/UpdateSchoolClassController"


interface ISchoolClassRepository {

    listAllSchoolClasses(): Promise<SchoolClass[] | validationResponse>

    createSchoolClass(schoolClassData: CreateSchoolClassRequestProps): Promise<validationResponse>

    updateSchoolClass(
        schoolClassData: UpdateSchoolClassRequestProps,
        schoolClassID: SchoolClass["id"],
        stripeProductID?: SchoolClass["stripeProductID"]
        ): Promise<validationResponse>

    deleteSchoolClass(schoolClassID: SchoolClass["id"]): Promise<SchoolClass | validationResponse>
}

export { ISchoolClassRepository }