import { Router } from "express"
import { companiesRoutes } from "./companies.routes"
import { customersRoutes } from "./customers.routes"
import { helloRoutes } from "./hello.routes"
import { rolesRoutes } from "./roles.routes"
import { usersRoutes } from "./users.routes"


const router = Router()

router.use('/hello', helloRoutes)
router.use('/users', usersRoutes)

//Institute routes
router.use('/roles', rolesRoutes)
router.use('/companies', companiesRoutes)
router.use('/customers', customersRoutes)


export {router}