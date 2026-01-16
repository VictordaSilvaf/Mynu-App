import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51SpzGA2I5MXqLH2VQyfRCi7UJgUU21kKSRypXC474YsI2csqmGIRHoBBojyHHjdPjNT5IYgWAww68SHr6Bo4OZUO00qQoS9fNL');

export default function Payment({ plan, billing, price_id }: { plan: string; billing: string; price_id: string }) {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: 'acct_1SpzElC0gtfYL5bF',
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <form>
                <PaymentElement />
                <button>Submit</button>
            </form>
        </Elements>
    );
}