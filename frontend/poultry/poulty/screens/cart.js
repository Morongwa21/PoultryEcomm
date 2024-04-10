import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


const CartPage = () => {
  const navigation = useNavigation(); 
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Map each product type to its corresponding image URL
  const productImages = {
    eggs: 'https://wovenmeadows.com/wordpress/wp-content/uploads/2012/10/Valdale-Farm-Eggs-1005.jpg',
    turkey: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Wild_Turkey.jpg',
    chicken: 'https://modernfarmer.com/wp-content/uploads/2021/05/shutterstock_339099548.jpg',
    chick: 'https://justtwofarmkids.files.wordpress.com/2012/05/chicks4.jpg'
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userID = await AsyncStorage.getItem('UserID');
        const response = await axios.get(`http://localhost:3002/cart/${userID}`);
        setCart(response.data);

        // Calculate total price
        const total = response.data.reduce((acc, item) => acc + item.Quantity * item.ProductPrice, 0);
        applyDiscount(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to fetch cart. Please try again later.');
        setLoading(false);
      }
    };

    fetchCart();
  }, [discount]);

  const handleRemoveFromCart = async (cartItem) => {
    try {
      // Perform API call to remove item from the cart
      const response = await axios.delete(`http://localhost:3002/cart/${cartItem.UserID}/${cartItem.ProductID}`);

      // Log the deleted item
      console.log('Deleted item:', response.data);

      // Refresh the cart after successful removal
      const userID = await AsyncStorage.getItem('UserID');
      const updatedCart = await axios.get(`http://localhost:3002/cart/${userID}`);
      setCart(updatedCart.data);

      // Recalculate total price
      const total = updatedCart.data.reduce((acc, item) => acc + item.Quantity * item.ProductPrice, 0);
      applyDiscount(total);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setError('Failed to remove item from cart. Please try again later.');
    }
  };

  const handleQuantityChange = async (newQuantity, cartItem) => {
    //const newQuantity = parseInt(event.target.value);
    if (newQuantity >= 1) {
      // Perform API call to update item quantity in the cart
      try {
        const response = await axios.put(`http://localhost:3002/cart/${cartItem.UserID}/${cartItem.ProductID}`, {
          quantity: newQuantity
        });
        // Refresh the cart after successful update
        const userID = await AsyncStorage.getItem('UserID');
        const updatedCart = await axios.get(`http://localhost:3002/cart/${userID}`);
        setCart(updatedCart.data);

        // Recalculate total price
        const total = updatedCart.data.reduce((acc, item) => acc + item.Quantity * item.ProductPrice, 0);
        applyDiscount(total);
      } catch (error) {
        console.error('Error updating item quantity:', error);
        setError('Failed to update item quantity. Please try again later.');
      }
    }
  };

  const applyDiscount = (total) => {
    // Implement logic to apply discount based on coupon code
    // For example, you can fetch discount details from the server and update the 'discount' state accordingly
    setTotalPrice(total - discount);
  };

  const handleCouponCodeChange = (event) => {
    setCouponCode(event.target.value);
  };

  const handleApplyCoupon = () => {
    // Implement logic to apply the coupon code
    // For example, you can make an API call to validate the coupon code and update the 'discount' state accordingly
    console.log('Applying coupon code:', couponCode);
    // Assume you get the discount amount from the server based on the coupon code
    const fakeDiscount = 10; // For demonstration purposes
    setDiscount(fakeDiscount);
  };

  const handleCheckout = () => {
    // Implement logic to handle checkout process
    console.log('Checkout button clicked');
    // Redirect to checkout page or perform any other action
    navigation.navigate('CheckoutS'); 
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Shopping Cart</h2>
      <div style={styles.scrollContainer}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div style={styles.cartItems}>
              {cart.map((item, index) => (
                <div key={index} style={styles.cartItem}>
                  <img src={productImages[item.ProductType]} alt={item.ProductName} style={{ maxWidth: '100px', maxHeight: '100px', marginBottom: '10px' }} />
                  <p><strong>Product Name:</strong> {item.ProductName}</p>
                  <p><strong>Size:</strong> {item.Size}</p>
                  <p><strong>Color:</strong> {item.Color}</p>
                  <p><strong>Quantity:</strong> 
                    <button onClick={() => handleQuantityChange(item.Quantity - 1, item)}>-</button>
                    {item.Quantity}
                    <button onClick={() => handleQuantityChange(item.Quantity + 1, item)}>+</button>
                  </p>
                  <p><strong>Price:</strong> R{item.ProductPrice}</p>
                  <p><strong>Subtotal:</strong> R{item.Quantity * item.ProductPrice}</p>
                  <button 
                    onClick={() => handleRemoveFromCart(item)} 
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove from Cart
                  </button>
                </div>
              ))}
            </div>
            <div style={styles.total}>
              <p><strong>Total Price:</strong> R{totalPrice}</p>
              <input type="text" placeholder="Enter coupon code" value={couponCode} onChange={handleCouponCodeChange} />
              <button onClick={handleApplyCoupon}>Apply Coupon</button>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </>
        )}
      </div>
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
  scrollContainer: {
    maxHeight: '400px', // Set the maximum height for scrolling
    overflowY: 'auto', // Enable vertical scrolling
  },
  cartItems: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  cartItem: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '5px',
  },
  total: {
    marginTop: '20px',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  },
};

export default CartPage;
