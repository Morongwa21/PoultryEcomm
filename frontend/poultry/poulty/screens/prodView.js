import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a mapping of product names to image URLs
const productImages = {
  eggs: 'https://wovenmeadows.com/wordpress/wp-content/uploads/2012/10/Valdale-Farm-Eggs-1005.jpg',
  turkey: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Wild_Turkey.jpg',
  chicken: 'https://modernfarmer.com/wp-content/uploads/2021/05/shutterstock_339099548.jpg',
  chick: 'https://justtwofarmkids.files.wordpress.com/2012/05/chicks4.jpg'
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cartNotification, setCartNotification] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3002/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const addToCart = async () => {
    if (selectedProduct) {
      try {
        const userID = await AsyncStorage.getItem('UserID');
        const parsedUserID = parseInt(userID);
        if (!isNaN(parsedUserID)) {
          const requestData = {
            userID: parsedUserID,
            productID: selectedProduct.ProductID,
            quantity: quantity
          };

          const response = await axios.post('http://localhost:3002/cart', requestData);
          if (response.status === 201) {
            setCart(prevCart => [...prevCart, selectedProduct]);
            setCartNotification(response.data.message);
            setSelectedProduct(null);
            setQuantity(1);
            setShowPopup(false);
            console.log(`Product "${selectedProduct.Name}" added to the cart`);

          }
        } else {
          throw new Error('Invalid userID');
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        setCartNotification(error.response?.data?.error || 'Failed to add product to cart');
      }
    }
  };

  const openPopup = (product) => {
    setSelectedProduct(product);
    setShowPopup(true);
  };

  const navigateToCart = () => {
    navigation.navigate('cart', { selectedItems: cart }); // Navigate to the cart page
  };

  return (
    <div style={{ height: 'calc(100vh - 100px)', overflowY: 'auto', padding: '20px' }}> {/* Adjust the height as needed */}
      <h2 style={{ marginBottom: '20px' }}>Products</h2>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button onClick={navigateToCart} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
          <FaShoppingCart size={24} color="#000" />
          {cart.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'red', color: '#fff', borderRadius: '50%', padding: '2px 5px', fontSize: '12px' }}>{cart.length}</span>}
        </button>
        {cartNotification && <p style={{ fontSize: '14px', color: 'green' }}>{cartNotification}</p>}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.ProductID} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>{product.Name}</h3>
            <img 
              src={productImages[product.Name.toLowerCase()]} 
              alt={product.Name} 
              style={{ width: '150px', height: '150px', marginBottom: '10px' }} // Adjust the width and height as needed
            />
            <p style={{ marginBottom: '5px' }}>Description: {product.Description}</p>
            <p style={{ marginBottom: '5px' }}>Price: {product.Price}</p>
            <p style={{ marginBottom: '5px' }}>Quantity Available: {product.QuantityAvailable}</p>
            <button onClick={() => openPopup(product)} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Select</button>
          </div>
        ))}
      </div>
      {showPopup && selectedProduct && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
          <h3>Selected Product: {selectedProduct.Name}</h3>
          <p>Quantity:</p>
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(parseInt(e.target.value))} 
            min={1} 
            max={selectedProduct.QuantityAvailable} 
            style={{ marginBottom: '10px' }}
          />
          <button onClick={addToCart} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>Add to Cart</button>
          <button onClick={() => setShowPopup(false)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
        </div>
      )}

    </div>
  );
};

export default ProductList;
