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
      padding: "10px",
      height: "100%",
      boxSizing: "border-box",  // Ensures padding is included in width/height
      overflowX: "auto",  // Prevents horizontal overflow
      margin: "0 auto", }}>
      <h1>Distributer - Nova komponenta</h1>
      <p>Stock: {stock}</p>
      <p>Preorder: {preorder}</p>
      <p>Cost: €65</p>

      <div style={{ marginTop: "0px" }}>
        <label htmlFor="order">Order Quantity: </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          style={{ marginLeft: "0px",
            padding: "10px" }}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit Order
      </button>
    </div>
  );
};

export default AkterDistributer;
