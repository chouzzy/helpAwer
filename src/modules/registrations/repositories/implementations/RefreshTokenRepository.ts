import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { prisma } from "../../../../prisma";
import { validationResponse } from "../../../../types";
import { RefreshToken } from "../../entities/RefreshToken";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider";
import { IRefreshTokenRepository } from "../IRefreshTokenRepository";


class RefreshTokenRepository implements IRefreshTokenRepository {

    private refreshToken: RefreshToken[]

    constructor() {
        this.refreshToken = []
    }

    async refreshTokenValidation(refreshToken: RefreshToken): Promise< validationResponse> {

        try {

            const adminRefreshToken = await prisma.refreshToken.findFirst({
                where: {
                    id: refreshToken.id
                }
            })

            if (!adminRefreshToken) {
                return { isValid: false, errorMessage: "🔴 Refresh Token Invalid 🔴", statusCode: 403 }
            }

            const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken.expires_at))

            const generateTokenProvider = new GenerateTokenProvider()
            const token = await generateTokenProvider.execute(adminRefreshToken.adminID)

            if (refreshTokenExpired) {
                await prisma.refreshToken.deleteMany({
                    where: {
                        adminID:refreshToken.adminID
                    }
                })
                const generateRefreshToken = new GenerateRefreshToken()
                const newRefreshToken = await generateRefreshToken.execute(adminRefreshToken.adminID)

                return { isValid: true, token: token, refreshToken: newRefreshToken, statusCode: 202}
            }

            return { isValid: true, token: token, statusCode: 202}


            
        } catch (error) {
            if (error instanceof Prisma.PrismaClientValidationError) {

                const argumentPosition = error.message.search('Argument')
                const mongoDBError = error.message.slice(argumentPosition)
                return { isValid: false, errorMessage: mongoDBError, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }
}

export { RefreshTokenRepository }