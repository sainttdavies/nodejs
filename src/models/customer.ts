import {Schema, model} from 'mongoose';
interface IOrder {
    description: String,
    amountInCents?: number

};
interface ICustomer {
    name: string,
    industry?: string,  
    orders?: IOrder[]
}
const customerSchema = new Schema<ICustomer>({
    name: {
        type: String,
        required: true
    },
    industry:String,
    orders: [
        {
            description: String,
            amountInCents: Number
        }
    ]
});
const Customer = model('customer', customerSchema);
export default Customer;
