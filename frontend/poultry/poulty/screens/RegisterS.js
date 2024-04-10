import React, { useState } from 'react';
import axios from 'axios';
import RegisterForm from "../lookNfeel/RegisterForm";
import { useNavigation } from "@react-navigation/native";

const RegisterS = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.Password !== formData.ConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
        const response = await axios.post('http://localhost:3002/register', formData); // Make sure the URL is correct
        console.log(response.data);
      setFormData({
        Name: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
      });
      navigation.navigate('LoginS'); 
    } catch (error) {
      console.error(error.response.data);
      setError('Registration failed. Please try again.'); // Update error message

    }
  };

  return (
    <div className="page-container"> {/* Apply a container class */}
      <div className="register-form-container"> {/* Apply container class */}
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="register-form"> {/* Apply form class */}
          <div className="form-group"> {/* Apply form-group class */}
            <label>Name:</label>
            <input type="text" name="Name" value={formData.Name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="Password" value={formData.Password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" name="ConfirmPassword" value={formData.ConfirmPassword} onChange={handleChange} />
          </div>
          {error && <div className="error-message">{error}</div>} {/* Apply error-message class */}
          <button type="submit" className="submit-button">Register</button> {/* Apply submit-button class */}
        </form>
      </div>
    </div>
  );
};

export default RegisterS;
