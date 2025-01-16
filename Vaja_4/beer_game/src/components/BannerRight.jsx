import React, { useState } from "react";
import { useGlobalState } from "./Variable"; // Import global state hook if using Context API

const BannerRight = () => {
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
      flexDirection: 'column', // Stack text on top of the image
      width: '100%',  // Ensures the banner doesn't overflow its grid container
      height: '100%', // Full height of the grid space
      backgroundImage: 'url(https://i.pinimg.com/736x/2c/cf/a2/2ccfa221ea3e4f392f65b2b2feb855d5.jpg)', // Replace with your image URL
      backgroundSize: 'cover', // Make the image cover the entire box
      backgroundPosition: 'center', // Center the image
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden', // Prevent any overflow
      alignItems: 'center', // Center items horizontally
      justifyContent: 'center', // Center items vertically
      boxSizing: 'border-box',
    }}
  >
    {/* Text content section */}
    <div
      style={{
        width: '100%', // Full width of the banner
        marginBottom: '20px', // Space between text and image
        textAlign: 'center',
        padding: '20px', // Add padding inside the text box
        border: '2px solid black', // Black border around the text
        borderRadius: '10px', // Rounded corners for the text box
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background for contrast
      }}
    >
      <h3>Special Offer</h3>
      <p>Get 20% off on your next purchase! Explore our new collection of beverages and enjoy refreshing flavors.</p>
      <a
        href="https://www.example.com"
        style={{
          color: 'white',
          textDecoration: 'underline',
          marginTop: '10px',
        }}
      >
        Learn More
      </a>
    </div>
  </div>
  );
};

export default BannerRight;