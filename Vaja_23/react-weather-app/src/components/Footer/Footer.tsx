import React from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const Footer: React.FC = () => {
  return (
    <footer className="rw-footer">
      <p>
        Developed By <a href="https://github.com/BojanCestnik">UNG MT</a>
      </p>
      {/* For testing only: shown while running `npm run dev`, hidden in production builds */}
      {/* import.meta.env.DEV && (
        <p style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          API key: <code>{apiKey ? String(apiKey) : "(not set - check .env)"}</code>
        </p>
      ) */}
    </footer>
  );
};

export default Footer;
