const BannerLeft = () => {
  return (
    <div style={{ 
      width: '250px', 
      height: '100%', 
      backgroundColor: '#f4a261', 
      color: 'white', 
      padding: '20px', 
      boxSizing: 'border-box', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h3>Oglas</h3>
      <p>Ne zamudite našega novega izdelka! Preizkusite najnovejši napitek in odkrijte osvežujoče okuse. Samo ta teden 20% popusta!</p>
      <a href="https://www.example.com" style={{ color: 'white', textDecoration: 'underline' }}>Kliknite tukaj za več informacij!</a>
    </div>
  );
};

export default BannerLeft;