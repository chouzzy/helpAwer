import { Request, Response } from "express"
import { Admins } from "../../../entities/Admins"
import { ErrorValidation } from "./AuthenticateAdminCheck"
import { AuthenticateAdminUseCase } from "./AuthenticateAdminUseCase"
import { AdminsRepository } from "../../../repositories/implementations/AdminsRepository"

interface AuthenticateAdminRequestProps {
    username: Admins["username"],
    password: Admins["password"],
}

class AuthenticateAdminsController {
    async handle(req: Request, res: Response): Promise<Response> {

        const adminData: AuthenticateAdminRequestProps = req.body

        /// instanciação da classe do caso de uso
        const adminsRepository = new AdminsRepository()
        const authenticateAdminUseCase = new AuthenticateAdminUseCase(adminsRepository)
        const authenticatedAdmin = await authenticateAdminUseCase.execute(adminData)

        ///
        const authenticatedAdminIsValid = await ErrorValidation(authenticatedAdmin)

        if (authenticatedAdminIsValid.isValid === false) {
            return res.status(authenticatedAdminIsValid.statusCode).json({
                errorMessage: authenticatedAdminIsValid.errorMessage
            })
        }

        return res.status(202).json({
            authenticatedAdmin
        })

    }
}

export { AuthenticateAdminsController, AuthenticateAdminRequestProps }