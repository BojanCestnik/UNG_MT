import React from 'react';

const BannerWithGif = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%', // Ensures the container fills the parent container
        backgroundImage: 'url("https://i.pinimg.com/originals/17/be/5c/17be5c644f35f2b4be5a8bf3dbd30424.gif")', // Replace with your GIF URL
        backgroundSize: 'cover', // Ensures the GIF covers both width and height without distorting
        backgroundPosition: 'center', // Centers the GIF in the container
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

export default BannerWithGif;




