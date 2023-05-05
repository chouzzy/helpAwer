import { sign } from "jsonwebtoken"
import { validationResponse } from "../../../types"
import { Admins } from "../entities/Admins"


class GenerateTokenProvider {

    async execute(adminID: Admins["id"]): Promise<validationResponse["token"]> {

        const privateKey = process.env.TOKEN_PRIVATE_KEY
        const token = sign({}, privateKey?privateKey:'', {
            subject: adminID,
            expiresIn: "20s"
        })

        return token
    }
}

export { GenerateTokenProvider }