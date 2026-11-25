const BannerRight = () => {
  return (
    <div className="banner-right">
      {/* Text box; hidden by a container query when the column is too narrow */}
      <div className="offer">
        <h3>Special Offer</h3>
        <p>Get 20% off on your next purchase! Explore our new collection of beverages and enjoy refreshing flavors.</p>
        <a href="https://www.example.com">Learn More</a>
      </div>
    </div>
  );
};

export default BannerRight;
