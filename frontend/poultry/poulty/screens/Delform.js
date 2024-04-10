import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    deliveryDate: '',
    deliveryAddress: '',
    status: 'Pending'
  });
  const [orderID, setOrderID] = useState(null);

  useEffect(() => {
    // Retrieve orderID from local storage when the component mounts
    const storedOrderID = localStorage.getItem('orderID');
    if (storedOrderID) {
      setOrderID(storedOrderID);
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderID) {
      console.error('Order ID not found in storage');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3002/deliveries', {
        orderID,
        ...formData
      });
      console.log('Delivery created:', response.data);
      setFormData({
        deliveryDate: '',
        deliveryAddress: '',
        status: 'Pending'
      });
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error creating delivery:', error.message);
      // Handle error (e.g., show an error message to the user)
    }
  };

  if (!orderID) {
    return <div>Loading...</div>; // Add loading state while retrieving orderID
  }

  return (
    <div>
      <h2>Create Delivery</h2>
      <p>Order ID: {orderID}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Delivery Date:</label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Delivery Address:</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DeliveryForm;
