import { Router } from "express"
import { CreateSchoolClassController } from "../modules/registrations/useCases/SchoolClass/createSchoolClass/CreateSchoolClassController"
import { DeleteSchoolClassController } from "../modules/registrations/useCases/SchoolClass/deleteSchoolClass/DeleteSchoolClassController"
import { ListSchoolClassController } from "../modules/registrations/useCases/SchoolClass/listSchoolClass/ListSchoolClassController"
import { UpdateSchoolClassController } from "../modules/registrations/useCases/SchoolClass/updateSchoolClass/UpdateSchoolClassController"

const schoolClassRoutes = Router()

const listSchoolClassController = new ListSchoolClassController()
schoolClassRoutes.get('/', listSchoolClassController.handle)

const createSchoolClassController = new CreateSchoolClassController()
schoolClassRoutes.post('/create', createSchoolClassController.handle)

const updateSchoolClassController = new UpdateSchoolClassController()
schoolClassRoutes.put('/:schoolClassID/update', updateSchoolClassController.handle)

const deleteSchoolClassController = new DeleteSchoolClassController()
schoolClassRoutes.delete('/:schoolClassID/delete', deleteSchoolClassController.handle)



export {schoolClassRoutes}