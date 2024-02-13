import React from 'react';

class CurlecButton extends React.Component {
    componentDidMount() {
        // Load the Razorpay checkout script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            this.initializeRazorpay();
        };
    }

    initializeRazorpay = () => {
        const options = {
            key: 'rzp_test_8Yqkn7m3nvs8OC', // Replace with your actual Key ID
            amount: 50000,
            currency: 'MYR',
            name: 'Uppy testing',
            description: 'Test Transaction',
            image: 'https://example.com/your_logo',
            order_id: 'order_NXvvIiLpWBspuF', // Replace with your actual Order ID
            // callback_url: 'http://localhost:8080',
            redirect: true,
            prefill: {
                name: 'Siti Aisyah',
                email: 'siti.aisyah@example.com',
                contact: '+601113455567',
            },
        };

        this.rzp = new window.Razorpay(options);
    };

    handlePayment = (e) => {
        this.rzp.open();
        e.preventDefault();
    };

    render() {
        return (
            <button id="rzp-button1" onClick={this.handlePayment}>
                Pay with Curlec
            </button>
        );
    }
}

export default CurlecButton;
