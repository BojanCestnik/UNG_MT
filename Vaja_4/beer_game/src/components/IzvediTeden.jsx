import React, { useState } from 'react';

const IzvediTeden = ({ rolesData, onWeekTransition }) => {
  // State to manage the loading status
  const [isLoading, setIsLoading] = useState(false);

  // Handle the week transition
  const handleWeekTransition = () => {
    setIsLoading(true); // Set loading state to true

    // Simulate the week transition logic (e.g., API call or complex calculations)
    setTimeout(() => {
      // Execute the week transition logic
      const updatedRolesData = rolesData.map((role) => {
        return {
          ...role,
          orders: role.orders + Math.floor(Math.random() * 10), // Example update
          goods: role.goods + Math.floor(Math.random() * 5), // Example update
        };
      });

      // Call the parent function to update the game state
      onWeekTransition(updatedRolesData);
      setIsLoading(false); // Reset loading state
    }, 1000); // Simulating a 1-second delay
  };

  return (
    <div>
      <button onClick={handleWeekTransition} disabled={isLoading}>
        {isLoading ? 'Izvajanje...' : 'Izvedi teden'}
      </button>
    </div>
  );
};

export default IzvediTeden;
