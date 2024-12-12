import React from "react";
import { useGlobalState } from "./GlobalStateProvider";

const Stats = () => {
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

export default Stats;

+++++

import React, { useState, useEffect } from 'react';
import './App.css';

const BeerGame = () => {
  // State for the brewery with custom variables
  const [brewery, setBrewery] = useState({
    bp: 0,   // Brewery Preorder
    bc: 0,   // Brewery Cost
    bo: 0,   // Brewery Order
    inventory: 100,
    backlog: 0,
    storageCost: 1,  // Storage cost per unit
    backlogCost: 2,  // Backlog cost per unit
    orderCost: 5,    // Order cost per unit
    productionRate: 5,  // How many units are produced each round
  });

  // State for the distributor with custom variables
  const [distributor, setDistributor] = useState({
    ds: 0,   // Distributor Storage
    dp: 0,   // Distributor Preorder
    dc: 0,   // Distributor Cost
    do: 0,   // Distributor Order
    inventory: 50,
    backlog: 0,
    storageCost: 1,
    backlogCost: 2,
    orderCost: 5,
  });

  // State for the wholesaler with custom variables
  const [wholesaler, setWholesaler] = useState({
    gs: 0,   // Wholesaler Storage
    gp: 0,   // Wholesaler Preorder
    gc: 0,   // Wholesaler Cost
    go: 0,   // Wholesaler Order
    inventory: 30,
    backlog: 0,
    storageCost: 1,
    backlogCost: 2,
    orderCost: 5,
  });

  // State for the retailer with custom variables
  const [retailer, setRetailer] = useState({
    ms: 0,   // Retailer Storage
    mp: 0,   // Retailer Preorder
    mc: 0,   // Retailer Cost
    mo: 0,   // Retailer Order
    ko: 0,   // Buyer Order (customer demand)
    inventory: 20,
    backlog: 0,
    storageCost: 1,
    backlogCost: 2,
    orderCost: 5,
  });

  // Track total costs
  const [totalCosts, setTotalCosts] = useState({
    breweryCosts: 0,
    distributorCosts: 0,
    wholesalerCosts: 0,
    retailerCosts: 0,
  });

  const [time, setTime] = useState(0);

  // Function to simulate a round for each player with custom variables
  const simulateRound = () => {
    // Update the state for each player based on custom variables
    const updatePlayerState = (playerState, setPlayerState, additionalCost) => {
      const newInventory = playerState.inventory + playerState.bo - playerState.backlog;
      const newBacklog = playerState.backlog - playerState.inventory < 0 ? 0 : playerState.backlog - playerState.inventory;

      // Calculate costs for this round
      const roundStorageCost = newInventory * playerState.storageCost;
      const roundBacklogCost = newBacklog * playerState.backlogCost;
      const roundOrderCost = playerState.bo * playerState.orderCost;
      const roundAdditionalCost = additionalCost * playerState.bo;

      setPlayerState({
        ...playerState,
        inventory: newInventory,
        backlog: newBacklog,
      });

      return roundStorageCost + roundBacklogCost + roundOrderCost + roundAdditionalCost;
    };

    // Calculate costs for each player
    const breweryCost = updatePlayerState(brewery, setBrewery, brewery.bc);  // Adding brewery cost
    const distributorCost = updatePlayerState(distributor, setDistributor, distributor.dc);  // Distributor cost
    const wholesalerCost = updatePlayerState(wholesaler, setWholesaler, wholesaler.gc);  // Wholesaler cost
    const retailerCost = updatePlayerState(retailer, setRetailer, retailer.mc);  // Retailer cost

    // Update total costs for all players
    setTotalCosts({
      breweryCosts: totalCosts.breweryCosts + breweryCost,
      distributorCosts: totalCosts.distributorCosts + distributorCost,
      wholesalerCosts: totalCosts.wholesalerCosts + wholesalerCost,
      retailerCosts: totalCosts.retailerCosts + retailerCost,
    });

    setTime(time + 1);
  };

  // Start the game simulation
  const startGame = () => {
    const intervalId = setInterval(() => {
      simulateRound();
      if (time >= 10) { // Set a time limit (e.g., 10 rounds)
        clearInterval(intervalId);
      }
    }, 1000); // Update every second
  };

  // Handle order input changes for each player
  const handleOrderChange = (e, setPlayerState, player) => {
    const value = Number(e.target.value);
    setPlayerState(prevState => ({ ...prevState, bo: value }));
  };

  return (
    <div className="beer-game">
      <h1>Beer Game: Supply Chain Simulation with Custom Variables</h1>

      <div>
        <h2>Brewery</h2>
        <p>Inventory: {brewery.inventory}</p>
        <p>Backlog: {brewery.backlog}</p>
        <p>Total Cost: ${totalCosts.breweryCosts}</p>
        <input
          type="number"
          value={brewery.bo}
          onChange={(e) => handleOrderChange(e, setBrewery, 'brewery')}
          placeholder="Enter orders"
        />
        <p>Brewery Preorder (bp): {brewery.bp}</p>
        <p>Brewery Cost (bc): ${brewery.bc}</p>
      </div>

      <div>
        <h2>Distributor</h2>
        <p>Inventory: {distributor.inventory}</p>
        <p>Backlog: {distributor.backlog}</p>
        <p>Total Cost: ${totalCosts.distributorCosts}</p>
        <input
          type="number"
          value={distributor.do}
          onChange={(e) => handleOrderChange(e, setDistributor, 'distributor')}
          placeholder="Enter orders"
        />
        <p>Distributor Storage (ds): {distributor.ds}</p>
        <p>Distributor Preorder (dp): {distributor.dp}</p>
        <p>Distributor Cost (dc): ${distributor.dc}</p>
      </div>

      <div>
        <h2>Wholesaler</h2>
        <p>Inventory: {wholesaler.inventory}</p>
        <p>Backlog: {wholesaler.backlog}</p>
        <p>Total Cost: ${totalCosts.wholesalerCosts}</p>
        <input
          type="number"
          value={wholesaler.go}
          onChange={(e) => handleOrderChange(e, setWholesaler, 'wholesaler')}
          placeholder="Enter orders"
        />
        <p>Wholesaler Storage (gs): {wholesaler.gs}</p>
        <p>Wholesaler Preorder (gp): {wholesaler.gp}</p>
        <p>Wholesaler Cost (gc): ${wholesaler.gc}</p>
      </div>

      <div>
        <h2>Retailer</h2>
        <p>Inventory: {retailer.inventory}</p>
        <p>Backlog: {retailer.backlog}</p>
        <p>Total Cost: ${totalCosts.retailerCosts}</p>
        <input
          type="number"
          value={retailer.mo}
          onChange={(e) => handleOrderChange(e, setRetailer, 'retailer')}
          placeholder="Enter orders"
        />
        <p>Retailer Storage (ms): {retailer.ms}</p>
        <p>Retailer Preorder (mp): {retailer.mp}</p>
        <p>Retailer Cost (mc): ${retailer.mc}</p>
        <p>Buyer Order (ko): {retailer.ko}</p>
      </div>

      <div>
        <button onClick={startGame}>Start Simulation</button>
      </div>
    </div>
  );
};

export default BeerGame;
Key Updates:
Custom Variables: