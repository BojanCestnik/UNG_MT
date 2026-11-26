// import backgroundImage from "../../public/BeerBack.png"; // Adjust path as necessary

const BackCentral = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%", // Full viewport height
        backgroundImage: "url('/BeerBack.png')", // Replace with your image URL
        backgroundSize: "cover", // Maintains the original proportions contain
        backgroundRepeat: "no-repeat", // Prevents tiling
        backgroundPosition: "center", // Centers the image
        filter: "brightness(70%) opacity(30%)", // Dims the background
      }} >
    </div> 
  );
};

export default BackCentral;