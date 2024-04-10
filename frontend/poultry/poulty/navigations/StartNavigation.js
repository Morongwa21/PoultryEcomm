// StartNavigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginS from "../screens/LoginS";
import RegisterS from "../screens/RegisterS";
import LandingS from "../screens/LandingS";
import ProductListS from "../screens/ProductListS";
import adminLogin from "../screens/adminLogin";
import prodView from "../screens/prodView";
import CheckoutS from "../screens/CheckoutS";
import cart from "../screens/cart";
import Delform from "../screens/Delform";


const Stack = createNativeStackNavigator();

const StartNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginS"
        screenOptions={{ headerShown: false }}
      >
        {<Stack.Screen name="LoginS" component={LoginS} /> }
        <Stack.Screen name="RegisterS" component={RegisterS} />
        <Stack.Screen name="LandingS" component={LandingS} />
        <Stack.Screen name="ProductListS" component={ProductListS} />
        <Stack.Screen name="adminLogin" component={adminLogin} />
        <Stack.Screen name="prodView" component={prodView} />
        {<Stack.Screen name="cart" component={cart} /> }
        <Stack.Screen name="CheckoutS" component={CheckoutS} />
        <Stack.Screen name="Delform" component={Delform} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StartNavigation; 
