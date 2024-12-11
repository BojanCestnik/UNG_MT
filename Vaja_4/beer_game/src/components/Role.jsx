import React, { useState } from "react";
import { useGlobalState } from "./GlobalStateProvider"; // Import global state hook if using Context API

const Role = ({ title, stock, preorder, cost }) => {
  const [order, setOrder] = useState(0); // Local state for input field
  const { setVariable15 } = useGlobalState(); // Replace `setVariable15` with the relevant global variable setter

  const handleSubmit = () => {
    // Update the relevant global variable with the order value
    setVariable15(order);
    alert('Order submitted: ${order}');
  };

  return (
    <div style={{ width: "100%", padding: "10px", height: "100%" }}>
      <h1>{title}</h1>
      <p>Stock: {stock}</p>
      <p>Preorder: {preorder}</p>
      <p>Cost: €{cost}</p>

      <div style={{ marginTop: "0px" }}>
        <label htmlFor="order">Order Quantity: </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          style={{ marginLeft: "0px", padding: "10px" }}
        />
      </div>

    </div>
  );
};

export default Role;

/* import React from "react";
import { useGlobalState } from "./GlobalStateProvider";

const MyComponent = () => {
  const {
    variable1,
    setVariable1,
    variable3,
    setVariable3,
  } = useGlobalState();

  const handleUpdate = () => {
    setVariable1("Updated Value");
    setVariable3(variable3 + 1);
  };

  return (
    <div>
      <p>Variable1: {variable1}</p>
      <p>Variable3: {variable3}</p>
      <button onClick={handleUpdate}>Update Variables</button>
    </div>
  );
};

      <button
        onClick={handleSubmit}
        style={{ marginTop: "0px", padding: "0px 0px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "0px", cursor: "pointer" }}
      >
        Submit Order
      </button>

export default MyComponent; */
