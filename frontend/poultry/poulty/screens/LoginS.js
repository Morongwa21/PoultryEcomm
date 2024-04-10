import React, { useState } from 'react';
import { Button, TextInput, Text, View, StyleSheet, TouchableHighlight } from 'react-native'; // Import StyleSheet
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage from the correct package


const LoginS = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3002/login', {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        console.log('Login successful');
        console.log('Response data:', response.data); // Log the response data

         // Store user ID in local storage
         const user = response.data.user;
         if (user && user.UserID) {
           await AsyncStorage.setItem('UserID', user.UserID.toString());
           console.log('UserID:', user.UserID); 
           navigation.navigate('prodView'); 
        } else {
          console.warn('User ID not found in the response');
        }
        navigation.navigate('prodView'); 

      } else {
        console.log('Login failed:', response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  const handleSignUp = () => {
    navigation.navigate('RegisterS');

  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Button
          title="Login"
          onPress={handleLogin}
          style={styles.submitButton}
        />
             <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableHighlight onPress={handleSignUp} underlayColor="transparent">
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableHighlight>
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 600,
    margin: 50,
    padding: 40,
    borderRadius: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    backgroundImage: 'url(https://www.morrisons-farming.com/contentassets/5a9898b4e1b0476d95b7029748a9b7b3/poultry.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  heading: {
    fontSize: 32,
    marginBottom: 30,
    color: '#333333',
    textTransform: 'uppercase',
  },
  form: {
    width: '80%',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333333',
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  errorMessage: {
    color: '#ff3333',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: 'orange', // Orange color
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // White text color
    fontSize: 20,
  },
});

export default LoginS;
