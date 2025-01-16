import React, { useState } from "react";
import { useGlobalState } from "./Variable"; // Import global state hook if using Context API

const Title = () => {
  const [order, setOrder] = useState(0); // Local state for input field
  const { setVariable15 } = useGlobalState(); // Replace `setVariable15` with the relevant global variable setter

  const handleSubmit = () => {
    // Update the relevant global variable with the order value
    setVariable15(order);
    alert('Order submitted: ${order}');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Center text in the middle
        backgroundColor: '#FFD700', // Golden yellow background
        width: '100%', // Ensure the banner spans the entire width of the box
        padding: '15px 0',
        position: 'relative', // Positioning for the logo
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        fontSize: '24px',
        boxSizing: 'border-box', // Ensure padding doesn't affect layout
      }}
    >
      {/* Logo in the top-left corner */}
      <a href="https://www.union-experience.si/sl" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
        <img 
          src="https://atomageindustries.com/cdn/shop/products/BeerButton.png?v=1610655263" // Replace with your logo image URL
          alt="Beer Company Logo"
          style={{ width: '50px', height: 'auto' }}
        />
      </a>

      {/* Centered Text */}
      <h1 style={{ margin: 0, textAlign: 'center' }}>THE BEER GAME</h1>
      <span style={{ position: 'absolute', bottom: '5px', fontSize: '14px', textAlign: 'center', width: '100%' }}>Presented by The Beer Company</span>
    </div>
  );
};

export default Title;