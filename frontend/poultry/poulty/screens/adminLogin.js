import React, { useState } from 'react';
import axios from 'axios';
import adminLogin from "../lookNfeel/adminLogin";
import { useNavigation } from "@react-navigation/native";


const AdminLogin = () => {
    const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3002/Adlogin', { Email: email, Password: password });
      if (response.data.success) {
        setMessage('Admin login successful');
        // Redirect to admin dashboard or perform other actions
        navigation.navigate('ProductListS'); 
      } else {
        setMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="admin-login-container">
      <h2 className="admin-login-title">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AdminLogin;
