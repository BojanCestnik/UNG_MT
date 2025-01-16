import React, { useState } from "react";
import { useGlobalState } from "./Variable"; // Import global state hook if using Context API

const BannerLeft = () => {
  const [order, setOrder] = useState(0); // Local state for input field
  const { setVariable15 } = useGlobalState(); // Replace `setVariable15` with the relevant global variable setter

  const handleSubmit = () => {
    // Update the relevant global variable with the order value
    setVariable15(order);
    alert('Order submitted: ${order}');
  };

  return (
    <div style={{ 
      width: '250px', 
      height: '100%', 
      backgroundColor: '#f4a261', 
      color: 'white', 
      padding: '20px', 
      boxSizing: 'border-box', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h3>Oglas</h3>
      <p>Ne zamudite našega novega izdelka! Preizkusite najnovejši napitek in odkrijte osvežujoče okuse. Samo ta teden 20% popusta!</p>
      <a href="https://www.example.com" style={{ color: 'white', textDecoration: 'underline' }}>Kliknite tukaj za več informacij!</a>
    </div>
  );
};

export default BannerLeft;