package constants

const Consumer = "consumer"
const Investor = "investor"

const InvestorRole = 1
const ConsumerRole = 2

const StripeAccountUpdated = "account.updated"
const StripeCheckoutSessionCompleted = "checkout.session.completed"
const StripePaymentSucceeded = "checkout.session.async_payment_succeeded"
const StripePaymentFailed = "checkout.session.async_payment_failed"

const PaymentIntentSucceeded = "succeeded"
const PaymentIntentProcessing = "processing"
const PaymentIntentRequiresPaymentMethod = "requires_payment_method"
const PaymentIntentCanceled = "canceled"
