import React, { useState } from "react";

const AkterDistributer = () => {
  const [stock, setStock] = useState(500);
  const [preorder, setPreorder] = useState(0);
  const [order, setOrder] = useState(0);

  const handleSubmit = () => {
    if (order > stock) {
      setPreorder(preorder + (order - stock));
      setStock(0);
    } else {
      setStock(stock - order);
    }
    // handleOrderUpdate(order);
  };

  return (
    <div style={{ width: "100%",
      maxWidth: "100%",  // Prevents overflow by limiting the container's width
      padding: "2px",
      height: "100%",
      boxSizing: "border-box",  // Ensures padding is included in width/height
      overflowX: "auto",  // Prevents horizontal overflow
      margin: "0 auto", }}>
        <div class="AHA"  >
      <h1>Distributer</h1>
      <p>Stock: {stock}</p>
      <p>Preorder: {preorder}</p>
      <p>Cost: €65</p></div>

      <div style={{ marginTop: "0px", fontSize:"100%" }}>
        <label htmlFor="order">Order Quantity: </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          style={{ marginLeft: "3px",
            padding: "1%", width:"30%" }}
        />
        <button onClick={handleSubmit} style={{marginLeft:"5px", marginTop: "3px", fontSize:"100%" }}>
           Submit Order
        </button>
      </div>

      
    </div>
  );
};

export default AkterDistributer;
