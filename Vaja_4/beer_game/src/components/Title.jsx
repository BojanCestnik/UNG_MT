import React, { useState } from "react";

const Title = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(true); // Keep open while hovering
  const closeDropdown = () => setIsDropdownOpen(false); // Close when mouse leaves
  const closePopup = () => setIsPopupOpen(false);

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
          style={{ width: '80px', height: 'auto' }}
        />
      </a>

      {/* Centered Text */}
      <h1 style={{ margin: 0, textAlign: 'center', fontFamily: 'Roboto, sans-serif', fontWeight: '600' }}>THE BEER GAME</h1>
      <span style={{ position: 'absolute', bottom: '5px', fontSize: '14px', textAlign: 'center', width: '100%' }}>Presented by The Beer Company</span>

      {/* Dropdown menu */}
      <div
        style={{
          position: 'absolute',
          top: '50%', // Center the dropdown vertically
          right: '20px',
          color: 'white',
          fontSize: '22px', // Bigger font size for easier readability
          cursor: 'pointer',
          fontFamily: 'Roboto, sans-serif', // Modern font
          fontWeight: '600', // Bold
          padding: '15px 20px', // Increased clickable area
          backgroundColor: '#FFD700', // Same as background of the banner
          borderRadius: '5px',
          transform: 'translateY(-50%)', // Center vertically
        }}
        onMouseEnter={toggleDropdown}
        onMouseLeave={closeDropdown}
      >
        Pomoč
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              right: '0',
              backgroundColor: '#FFD700',
              border: '1px solid #ccc',
              borderRadius: '5px',
              boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
              padding: '10px 0',
              minWidth: '200px', // Menu width based on text length
            }}
          >
            <span
              onClick={() => setIsPopupOpen(true)}
              style={{
                display: 'block',
                padding: '12px 20px',
                color: 'black',
                cursor: 'pointer',
                fontWeight: '400',
                transition: 'background-color 0.3s',
              }}
            >
              Navodila
            </span>
            <a
              href="https://www.example.com/o-aplikaciji" // Link for "O aplikaciji"
              style={{
                display: 'block',
                padding: '12px 20px',
                color: 'black',
                textDecoration: 'none',
                fontWeight: '400',
                transition: 'background-color 0.3s',
              }}
            >
              O aplikaciji
            </a>
          </div>
        )}
      </div>

      {/* Popup Instructions */}
      {isPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f4f4f4',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 999,
            width: '300px', // Set width for consistency
            textAlign: 'left',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          <h3 style={{ textAlign: 'center', fontSize: '20px', color: 'black', fontWeight: '600' }}>Navodila za igro: Človek, ne jezi se</h3>
          <ol style={{ marginTop: '10px', fontSize: '16px', color: 'black' }}>
            <li>Vsak igralec dobi 4 figure iste barve, ki jih mora premikati po plošči.</li>
            <li>Na začetku se vse figure nahajajo v domači coni, kjer čakajo na začetek igre.</li>
            <li>Da premakneš svojo figuro, moraš dobiti točen zadetek z kocko, da prideš iz domače cone.</li>
            <li>Ko prideš iz domače cone, začneš premikati svojo figuro po plošči v smeri urinega kazalca.</li>
            <li>Če se tvoje polje sreča s poljem nasprotnika, ga vržeš nazaj na začetek!</li>
            <li>Prvi, ki pripelje vse svoje figure do cilja, zmaga igro.</li>
          </ol>
          <button
            onClick={closePopup}
            style={{
              padding: '10px 15px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px',
            }}
          >
            Zapri
          </button>
        </div>
      )}
    </div>
  );
};

export default Title;
