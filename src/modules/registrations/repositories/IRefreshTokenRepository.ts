import { validationResponse } from "../../../types";
import { Admins } from "../entities/Admins";
import { RefreshToken } from "../entities/RefreshToken";


interface IRefreshTokenRepository {

    refreshTokenValidation(refreshToken: RefreshToken): Promise<validationResponse>
}

export {IRefreshTokenRepository}