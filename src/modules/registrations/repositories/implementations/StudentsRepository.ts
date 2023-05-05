import { Prisma } from "@prisma/client";
import { prisma } from "../../../../prisma";
import { validationResponse } from "../../../../types";
import { Students, purcharsedSubscriptions } from "../../entities/Students";
import { CreateStudentRequestProps } from "../../useCases/Students/createStudents/CreateStudentsController";
import { UpdateStudentRequestProps } from "../../useCases/Students/updateStudents/UpdateStudentController";
import { IStudentsRepository } from "../IStudentsRepository";
import { StripeCustomer } from "../../../../hooks/StripeCustomer";
import { StripeFakeFront } from "../../../../hooks/StripeFakeFront";


class StudentsRepository implements IStudentsRepository {

    private students: Students[]
    constructor() {
        this.students = [];
    }

    async filterStudent(
        id: Students["id"],
        email: Students["email"],
        state: Students["state"],
        paymentStatus: string,
        actualPage: number
    ): Promise<Students[] | validationResponse> {

        if (actualPage == 0) { actualPage = 1 }

        // Função do prisma para buscar todos os students

        try {

            const students = await prisma.students.findMany({
                where: {
                    AND: [
                        { id: id },
                        { email: email },
                        { state: state }
                    ],
                },
            })

            return students
        } catch (error: unknown) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return { isValid: false, errorMessage: error, statusCode: 403 }

            } else {
                return { isValid: false, errorMessage: String(error), statusCode: 403 }
            }
        }
    }

    async createStudent(studentData: CreateStudentRequestProps): Promise<Students | validationResponse> {

        try {
            const searchedStudent = await prisma.students.findFirst({
                where: {
                    OR: [
                        { cpf: studentData.cpf },
                        { rg: studentData.rg }
                    ]
                }

            })


            // Buscando o RG e CPF do customer no Stripe
            const stripeCustomer = new StripeCustomer()
            const { cpf, rg } = studentData
            const stripeSearchedCustomerID = await stripeCustomer.searchCustomer(cpf, rg)


            //create stripe customer
            //pegar id do created stripe customer e atualizar o student ID
            if (searchedStudent && stripeSearchedCustomerID) {

                let subscriptionsDuplicated: Array<purcharsedSubscriptions["schoolClassID"]> = []

                studentData.pursharsedSubscriptions.map(
                    (subscription) => {

                        searchedStudent.purcharsedSubscriptions.map(
                            (subscriptionAlreadyRegistered) => {

                                if (subscriptionAlreadyRegistered.schoolClassID == subscription.schoolClassID
                                    &&
                                    subscriptionAlreadyRegistered.paymentStatus == "active"
                                ) {

                                    subscriptionsDuplicated.push(subscription.schoolClassID)
                                }
                            })
                    })


                if (subscriptionsDuplicated.length > 0) {

                    return {
                        isValid: false,
                        errorMessage: `🛑 One or more subscriptions has been already bought by this Student 🛑`,
                        subscriptionsDuplicated: subscriptionsDuplicated,
                        statusCode: 403
                    }
                }

                //push student pursharsed subscriptions

                searchedStudent.purcharsedSubscriptions = [...searchedStudent.purcharsedSubscriptions, ...studentData.pursharsedSubscriptions]

                studentData.pursharsedSubscriptions.map((subscription) => {

                    searchedStudent.purcharsedSubscriptions.map(
                        (subscriptionAlreadyRegistered) => {

                            if (subscription.schoolClassID == subscriptionAlreadyRegistered.schoolClassID
                            ) {
                                subscriptionAlreadyRegistered.paymentDate = subscriptionAlreadyRegistered.paymentDate ?? 'Pagamento não confirmado',
                                subscriptionAlreadyRegistered.paymentMethod = subscriptionAlreadyRegistered.paymentMethod ?? 'Pagamento não confirmado',
                                subscriptionAlreadyRegistered.paymentStatus = subscriptionAlreadyRegistered.paymentStatus ?? 'Pagamento não confirmado',
                                subscriptionAlreadyRegistered.productID = subscriptionAlreadyRegistered.productID ?? 'Pagamento não confirmado',
                                subscriptionAlreadyRegistered.productName = subscriptionAlreadyRegistered.productName ?? 'Pagamento não confirmado',
                                subscriptionAlreadyRegistered.valuePaid = subscriptionAlreadyRegistered.valuePaid ?? 0
                                
                            } 
                    })

                })


                const updatedStudent = await prisma.students.update({
                    where: { id: searchedStudent.id },
                    data: {
                        name: studentData.name,
                        email: studentData.email,
                        gender: studentData.gender ?? 'Não informado',
                        birth: studentData.birth,
                        phoneNumber: studentData.phoneNumber,
                        country: studentData.country,
                        state: studentData.state,
                        city: studentData.city,

                        address: studentData.address,
                        cpf: studentData.cpf,
                        rg: studentData.rg,
                        selfDeclaration: studentData.selfDeclaration,
                        oldSchool: studentData.oldSchool,
                        oldSchoolAdress: studentData.oldSchoolAdress,
                        highSchoolGraduationDate: studentData.highSchoolGraduationDate,
                        highSchoolPeriod: studentData.highSchoolPeriod,
                        metUsMethod: studentData.metUsMethod,
                        exStudent: studentData.exStudent,
                        stripeCustomerID: stripeSearchedCustomerID,

                        purcharsedSubscriptions: searchedStudent.purcharsedSubscriptions
                    }
                })


                const stripeFrontEnd = new StripeFakeFront()
                studentData.pursharsedSubscriptions.map(async (subscription) => {
    
                    await stripeFrontEnd.createSubscription('', stripeSearchedCustomerID, cpf, rg, subscription.schoolClassID)
                })

                return {
                    isValid: true,
                    errorMessage: `Student updated successfully in database`,
                    statusCode: 202
                }

            }


            // Student não encontrado no banco:
            const stripeCustomerCreatedID = await stripeCustomer.createCustomer(studentData)

            let studentSchoolClasses:purcharsedSubscriptions[] = []

            studentData.pursharsedSubscriptions.map((subscription) => {
                studentSchoolClasses.push({
                    schoolClassID: subscription.schoolClassID,
                    paymentDate: subscription.paymentDate ?? 'Pagamento não confirmado',
                    paymentMethod: subscription.paymentMethod ?? 'Pagamento não confirmado',
                    paymentStatus: subscription.paymentStatus ?? 'Pagamento não confirmado',
                    productID: subscription.productID ?? 'Pagamento não confirmado',
                    productName: subscription.productName ?? 'Pagamento não confirmado',
                    valuePaid: subscription.valuePaid ?? 0
                })
            })

            const createdStudent = await prisma.students.create({
                data: {
                    name: studentData.name,
                    email: studentData.email,
                    gender: studentData.gender ?? 'Não informado',
                    birth: studentData.birth,
                    phoneNumber: studentData.phoneNumber,
                    country: studentData.country,
                    state: studentData.state,
                    city: studentData.city,

                    address: studentData.address,
                    cpf: studentData.cpf,
                    rg: studentData.rg,
                    selfDeclaration: studentData.selfDeclaration,
                    oldSchool: studentData.oldSchool,
                    oldSchoolAdress: studentData.oldSchoolAdress,
                    highSchoolGraduationDate: studentData.highSchoolGraduationDate,
                    highSchoolPeriod: studentData.highSchoolPeriod,
                    metUsMethod: studentData.metUsMethod,
                    exStudent: studentData.exStudent,
                    stripeCustomerID: stripeCustomerCreatedID,

                    purcharsedSubscriptions: studentSchoolClasses
                }
            })


            ////TESTE SUBSCRIPTION
            const stripeFrontEnd = new StripeFakeFront()
            studentData.pursharsedSubscriptions.map(async (subscription) => {

                await stripeFrontEnd.createSubscription('',stripeCustomerCreatedID, cpf, rg, subscription.schoolClassID)
            })


            return {
                isValid: true,
                errorMessage: `Student created successfully in database`,
                statusCode: 202
            }


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

    async updateStudent(studentData: UpdateStudentRequestProps, studentID: Students["id"]): Promise<Students | validationResponse> {
        try {

            const student = await prisma.students.findUnique({
                where: {
                    id: studentID
                }
            })

            if (student == null) {
                return { isValid: false, errorMessage: '🛑 Student not found 🛑', statusCode: 403 }
            }

            const updatedStudent = await prisma.students.update({
                where: {
                    id: studentID
                },
                data: {
                    name: studentData.name ?? student.name,
                    email: studentData.email ?? student.email,
                    gender: studentData.gender ?? student.gender,
                    birth: studentData.birth ?? student.birth,
                    phoneNumber: studentData.phoneNumber ?? student.phoneNumber,
                    country: studentData.country ?? student.country,
                    state: studentData.state ?? student.state,
                    city: studentData.city ?? student.city,

                    address: studentData.address ?? student.address,
                    cpf: studentData.cpf ?? student.cpf,
                    rg: studentData.rg ?? student.rg,
                    selfDeclaration: studentData.selfDeclaration ?? student.selfDeclaration,
                    oldSchool: studentData.oldSchool ?? student.oldSchool,
                    oldSchoolAdress: studentData.oldSchoolAdress ?? student.oldSchoolAdress,
                    highSchoolGraduationDate: studentData.highSchoolGraduationDate ?? student.highSchoolGraduationDate,
                    highSchoolPeriod: studentData.highSchoolPeriod ?? student.highSchoolPeriod,
                    metUsMethod: studentData.metUsMethod ?? student.metUsMethod,
                    exStudent: studentData.exStudent ?? student.exStudent
                }
            })
            return updatedStudent

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

    async deleteStudent(studentID: string): Promise<Students | validationResponse> {
        try {

            const student = await prisma.students.findFirst({
                where: {
                    id: studentID
                }
            })

            if (student != null) {

                try {

                    await prisma.students.delete({
                        where: {
                            id: studentID
                        }
                    })

                    return student

                } catch {

                    return {
                        isValid: false,
                        statusCode: 403,
                        errorMessage: "⛔ An error occurred when trying to delete the student from the database ⛔"
                    }
                }

            } else {

                return {
                    isValid: false,
                    statusCode: 403,
                    errorMessage: "⛔ Student not found in database ⛔"
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

export { StudentsRepository }
