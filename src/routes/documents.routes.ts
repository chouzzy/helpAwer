import { Router } from "express"
import { CreateDocumentsController } from "../modules/registrations/useCases/Documents/createDocuments/CreateDocumentsController"
import { DeleteDocumentsController } from "../modules/registrations/useCases/Documents/deleteDocuments/DeleteDocumentsController"
import { ListDocumentsController } from "../modules/registrations/useCases/Documents/listDocuments/ListDocumentsController"
import { UpdateDocumentsController } from "../modules/registrations/useCases/Documents/updateDocuments/UpdateDocumentsController"
// import { DeleteDocumentsController } from "../modules/registrations/useCases/Documents/deleteDocuments/DeleteDocumentsController"
// import { ListDocumentsController } from "../modules/registrations/useCases/Documents/listDocuments/ListDocumentsController"
// import { UpdateDocumentsController } from "../modules/registrations/useCases/Documents/updateDocuments/UpdateDocumentsController"

const documentsRoutes = Router()

const listDocumentsController = new ListDocumentsController()
documentsRoutes.get('/:schoolClassID', listDocumentsController.handle)

const createDocumentsController = new CreateDocumentsController()
documentsRoutes.post('/:schoolClassID/create', createDocumentsController.handle)

const updateDocumentsController = new UpdateDocumentsController()
documentsRoutes.put('/:documentID/update', updateDocumentsController.handle)

const deleteDocumentsController = new DeleteDocumentsController()
documentsRoutes.delete('/:documentsID/delete', deleteDocumentsController.handle)



export {documentsRoutes}