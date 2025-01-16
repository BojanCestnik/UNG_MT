import React, { useState } from "react";

const AkterMaloprodaja = ({ handleOrderUpdate }) => {
  const [ms, setMs] = useState(200); // Maloprodaja storage
  const [mp, setMp] = useState(0); // Maloprodaja preorder
  const [mo, setMo] = useState(0); // Maloprodaja order

  const mc = 80; // Maloprodaja cost (constant)

  const handleSubmit = () => {
    if (mo > ms) {
      setMp(mp + (mo - ms));
      setMs(0);
      console.log("Order exceeds stock. Setting preorder:", mp + (mo - ms));
    } else {
      setMs(ms - mo);
      console.log("Order fulfilled. Remaining stock:", ms - mo);
    }
    //handleOrderUpdate(mo);
    console.log("Order submitted:", mo);
  };

  return (
    <div style={{ width: "100%", padding: "10px", height: "100%" }}>
      <h1>Maloprodaja</h1>
      <p>Stock (ms): {ms}</p>
      <p>Preorder (mp): {mp}</p>
      <p>Cost (mc): €{mc}</p>

      <div style={{ marginTop: "0px" }}>
        <label htmlFor="order">Order Quantity (mo): </label>
        <input
          type="number"
          id="order"
          value={mo}
          onChange={(e) => setMo(Number(e.target.value))}
          style={{ marginLeft: "0px", padding: "10px" }}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Submit Order
      </button>
    </div>
  );
};

export default AkterMaloprodaja;

