import { useState } from "react";

const Title = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(true); // Keep open while hovering
  const closeDropdown = () => setIsDropdownOpen(false); // Close when mouse leaves
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="title-bar">
      {/* Logo in the top-left corner */}
      <a href="https://www.union-experience.si/sl" className="title-logo">
        <img 
          src="https://atomageindustries.com/cdn/shop/products/BeerButton.png?v=1610655263" // Replace with your logo image URL
          alt="Beer Company Logo"
        />
      </a>

      {/* Centered Text */}
      <div className="title-text">
        <h1>THE BEER GAME</h1>
        <span>Presented by The Beer Company</span>
      </div>

      {/* Dropdown menu */}
      <div
        className="title-help"
        onMouseEnter={toggleDropdown}
        onMouseLeave={closeDropdown}
      >
        Pomoč
        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
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
          <h3 style={{ textAlign: 'center', fontSize: '20px', color: 'black', fontWeight: '600' }}>Navodila za igro: The Beer Game</h3>
          <ol style={{ marginTop: '10px', fontSize: '16px', color: 'black' }}>
            <li>Igra simulira dobavno verigo piva: Pivovarna → Distributer → Grosist → Maloprodaja → Kupec.</li>
            <li>Vsak teden kupec odda naročilo maloprodaji, vsak člen verige pa naroči blago pri svojem dobavitelju.</li>
            <li>Blago in naročila potujejo z zamikom, zato naročila pridejo do dobavitelja šele čez nekaj tednov.</li>
            <li>Če naročila ne moreš izpolniti, nastane zaostanek (preorder), ki ga moraš dobaviti kasneje.</li>
            <li>Stroški nastajajo za zalogo na skladišču in (višji) za neizpolnjena naročila.</li>
            <li>Cilj ekipe je čim nižji skupni strošek celotne verige.</li>
            <li>Klikni »Izvedi teden« za premik v naslednji teden.</li>
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
