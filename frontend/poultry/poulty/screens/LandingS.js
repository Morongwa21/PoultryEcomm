import React from 'react';
import LandingForm from "../lookNfeel/LandingForm"; // Assuming LandingForm is the component for the form
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const LandingS = () => {
    const navigation = useNavigation();

    const handleGetStartedClick = () => {
        navigation.navigate("LoginS"); // Navigate to the login screen
    };

    return (
        <div className="container">
            <header>
                <h1>Welcome to Poultry Paradise</h1>
                <p>Providing high-quality poultry products.</p>
            </header>
            <main>
                <section>
                    <h2>Our Products</h2>
                    <p>Explore our range of fresh poultry products:</p>
                    <ul>
                        <li>Chicken</li>
                        <li>Eggs</li>
                        <li>Turkey</li>
                        {/* Add more items as needed */}
                    </ul>
                </section>
                <section>
                    <h2>Get Started</h2>
                    <p>
                        Ready to experience our poultry products? Get started now!
                    </p>
                    <TouchableOpacity onPress={handleGetStartedClick} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Get Started</Text>
                    </TouchableOpacity>
                </section>
                <section>
                    <h2>Contact Us</h2>
                    <p>
                        If you have any inquiries or need assistance, feel free to contact
                        us:
                    </p>
                    <address>
                        Email: info@poultryparadise.com<br />
                        Phone: +27663570148
                    </address>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 Poultry Paradise. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingS;
