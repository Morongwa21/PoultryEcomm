import React, { useState } from 'react';
import axios from 'axios';
import productList from "../lookNfeel/productList";

const ProductListS = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/products', {
        name,
        description,
        price,
        quantityAvailable
      });
      setMessage(response.data.message);
      // Clear form fields after successful submission
      setName('');
      setDescription('');
      setPrice('');
      setQuantityAvailable('');
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Add Product</h2>
      <form onSubmit={handleSubmit} className="product-list-form">
        <label className="product-list-label">Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="product-list-input" required />

        <label className="product-list-label">Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="product-list-input" required />

        <label className="product-list-label">Price:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" className="product-list-input" required />

        <label className="product-list-label">Quantity Available:</label>
        <input type="number" value={quantityAvailable} onChange={(e) => setQuantityAvailable(e.target.value)} className="product-list-input" required />

        <button type="submit" className="product-list-button">Add Product</button>
      </form>
      {message && <p className="product-list-message">{message}</p>}
    </div>
  );
};

export default ProductListS;
