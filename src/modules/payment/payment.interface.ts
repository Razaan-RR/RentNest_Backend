export interface ICreatePayment {
    rentalRequestId:string;
}

export interface IConfirmPayment {
    paymentIntentId: string;
}