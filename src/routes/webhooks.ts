import { Router } from "express"
import { stripe } from "../server"
import { StripeCheckoutCustomerPropsDetails, StripeCheckoutCustomerProps, ChargeRefundedProps } from "../types";
import { StripeCustomer } from "../hooks/StripeCustomer";
///////

const webhooksRoutes = Router()

webhooksRoutes.post('/', async (req, res) => {

    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    const endpointSecret = process.env.STRIPE_SIGNIN_SECRET_KEY
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            )

        } catch (err: unknown) {
            // console.log(`⚠️  Webhook signature verification failed.`, err);
            return res.sendStatus(400);
        }
    }

    if (event.type == 'charge.succeeded') {
        // console.log(event.data.object)
        
        // console.log('Inside charge.succeeded')
        // const stripeCustomer = new StripeCustomer()

        // const customerCreated: StripeCheckoutCustomerProps = {

        //     metadata: {
        //         schoolClassID:'6df7a3ba-81b5-4ff4-8dcf-35e1cddbe5e9',
        //         productID:'prod_NmpAHf1qPgwXHo',
        //         productName:'Período noturno semanal'
        //     },
        //     customerDetails: event.data.object.billing_details,
        //     paymentMethod: event.data.object.payment_method_details.type,
        //     paymentStatus: event.data.object.status,
        //     amount: event.data.object.amount
        // }

        // console.log('customer created:')
        // console.log(customerCreated)
        // await stripeCustomer.updateStudent(customerCreated)
    }

    if (event.type == 'customer.subscription.created') {

        const stripeCustomer = new StripeCustomer()

        await stripeCustomer.updatePurchasedSubscriptions(event.data.object)

    }

    if (event.type == 'charge.refunded') {

        // console.log(event.data.object)
        // const stripeCustomer = new StripeCustomer()

        // const clientRefunded:ChargeRefundedProps = {
        //     refunded: event.data.object.refunded,
        //     email: event.data.object.billing_details.email
        // }
        // if (clientRefunded.refunded === true) {
        //     await stripeCustomer.refundStudent(clientRefunded)
        // }

    }

    if (event.type == 'invoice.updated') {
        
        // console.log(event.data.object)
    }

    return res.json({ success: true, message:'Cliente atualizado com sucesso!' })
})

export { webhooksRoutes }


