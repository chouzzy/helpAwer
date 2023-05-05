import { Documents } from "./Documents"

class SchoolClass {
    id!:                 string
    title!:              string
    description!:              string
    initHour!:           string
    endHour!:            string
    daysOfWeek!:         string
    registrationStatus!: string
    subscriptionPrice!:  number
    semester!:  string
    year!:  string
    stripeProductID!: string
    documents?:          Documents[]
  }

export { SchoolClass }