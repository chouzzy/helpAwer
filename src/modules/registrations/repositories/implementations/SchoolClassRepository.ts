import { Prisma } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { validationResponse } from "../../../../types";
import { SchoolClass } from "../../entities/SchoolClass";
import { CreateSchoolClassRequestProps } from "../../useCases/SchoolClass/createSchoolClass/CreateSchoolClassController";
import { UpdateSchoolClassRequestProps } from "../../useCases/SchoolClass/updateSchoolClass/UpdateSchoolClassController";
import { ISchoolClassRepository } from "../ISchoolClassRepository";
import { StripeProducts } from "../../../../hooks/StripeProducts";


class SchoolClassRepository implements ISchoolClassRepository {

    private SchoolClass: SchoolClass[]
    constructor() {
        this.SchoolClass = [];
    }

    async createSchoolClass(
        schoolClassData: CreateSchoolClassRequestProps
    ): Promise<validationResponse> {

        try {

            //busca usuario no banco pra ve se existe
            const schoolClassFound = await prisma.schoolClass.findFirst({
                where: {
                    OR: [
                        { title: schoolClassData.title },
                    ],
                },
            })

            //Checa se email e usuario ja existem
            if (schoolClassFound) {
                return { isValid: false, errorMessage: `🛑 School Class tittle already exists 🛑`, statusCode: 403 }
            }

            const schoolClassDataWithStripeProductID = { stripeProductID: 'teste ID', ...schoolClassData }

            const createdSchoolClass = await prisma.schoolClass.create({
                data: schoolClassDataWithStripeProductID
            })

            return { isValid: true, statusCode: 202, schoolClass: createdSchoolClass }


        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientValidationError) {

                const argumentPosition = error.message.search('Argument')
                const mongoDBError = error.message.slice(argumentPosition)
                return { isValid: false, errorMessage: mongoDBError, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async listAllSchoolClasses(): Promise<validationResponse | SchoolClass[]> {
        try {
            const allSchoolClasses = await prisma.schoolClass.findMany()

            return allSchoolClasses
        } catch (error: unknown) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async updateSchoolClass(
        schoolClassData: UpdateSchoolClassRequestProps,
        schoolClassID: SchoolClass["id"],
        stripeProductID?: SchoolClass["stripeProductID"]
    ): Promise<validationResponse> {

        try {

            const schoolClass = await prisma.schoolClass.findUnique({
                where: {
                    id: schoolClassID
                }
            })


            if (!schoolClass) {
                return { isValid: false, errorMessage: '🛑 SchoolClass not found 🛑', statusCode: 403 }
            }


            if (stripeProductID) {
                schoolClass.stripeProductID = stripeProductID
            }

            const updatedSchoolClass = await prisma.schoolClass.update({
                where: {
                    id: schoolClassID
                },
                data: {
                    stripeProductID: schoolClass.stripeProductID
                }
            })

            return {
                isValid: true,
                statusCode: 202,
                schoolClass: updatedSchoolClass
            }

        } catch (error: unknown) {

            if (error instanceof Prisma.PrismaClientValidationError) {
                const argumentPosition = error.message.search('Argument')
                const mongoDBError = error.message.slice(argumentPosition)
                return { isValid: false, errorMessage: mongoDBError, statusCode: 403 }
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }
            }

            else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async deleteSchoolClass(schoolClassID: string): Promise<SchoolClass | validationResponse> {

        try {


            const schoolClass = await prisma.schoolClass.findUnique({
                where: {
                    id: schoolClassID
                }
            })


            if (schoolClass) {

                try {

                    const stripeProducts = new StripeProducts()

                    await stripeProducts.deleteProduct(schoolClass.stripeProductID)

                    await prisma.documents.deleteMany({
                        where: {
                            schoolClassId: schoolClassID
                        }
                    })

                    await prisma.schoolClass.delete({
                        where: {
                            id: schoolClassID
                        }
                    })

                    return schoolClass

                } catch {

                    return {
                        isValid: false,
                        statusCode: 403,
                        errorMessage: "⛔ An error occurred when trying to delete the schoolClass from the database ⛔"
                    }
                }

            } else {

                return {
                    isValid: false,
                    statusCode: 403,
                    errorMessage: "⛔ SchoolClass not found in database ⛔"
                }
            }

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

}

export { SchoolClassRepository }
