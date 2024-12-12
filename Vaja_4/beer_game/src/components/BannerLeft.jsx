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
    <div style={{ width: "100%", padding: "10px", height: "100%", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <h1>Left Banner</h1>
    </div>
  );
};

export default BannerLeft;