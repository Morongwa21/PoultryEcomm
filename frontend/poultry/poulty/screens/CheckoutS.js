import React, { useState } from 'react';

const CheckoutS = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'creditCard' // Default payment method
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process checkout logic here, e.g., submit order to backend
    console.log('Form submitted:', formData);
    // Clear form fields after submission
    clearForm();
    // Redirect user to confirmation page or display a success message
  };

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      paymentMethod: 'creditCard' // Reset payment method to default
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Checkout</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.section}>
          <h3>Billing Address</h3>
          <div style={styles.row}>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.row}>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.row}>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.row}>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
          </div>
        </div>

        <div style={styles.section}>
          <h3>Payment Information</h3>
          <div style={styles.row}>
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </label>
          </div>
          <div style={styles.row}>
            <label>
              Payment Method:
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                style={styles.input}
              >
                <option value="creditCard">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Confirm Purchase
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    margin: '20px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  input: {
    flex: '2',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '3px',
  },
  button: {
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default CheckoutS;
