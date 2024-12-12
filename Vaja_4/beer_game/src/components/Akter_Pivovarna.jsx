import React, { useState } from "react";

const AkterPivovarna = ({ handleOrderUpdate }) => {
  const [stock, setStock] = useState(1000);
  const [preorder, setPreorder] = useState(0);
  const [order, setOrder] = useState(0);

  const handleSubmit = () => {
    if (order > stock) {
      setPreorder(preorder + (order - stock));
      setStock(0);
    } else {
      setStock(stock - order);
    }
    handleOrderUpdate(order);
  };

  return (
    <div style={{ width: "100%", padding: "10px", height: "100%" }}>
      <h1>Pivovarna</h1>
      <p>Stock: {stock}</p>
      <p>Preorder: {preorder}</p>
      <p>Cost: €60</p>

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

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit Order
      </button>
    </div>
  );
};

export default AkterPivovarna;
