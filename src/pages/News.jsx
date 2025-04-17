import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, Polyline, CircleMarker, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./News.css"
import "../App.css";

const DEFAULT_CENTER = [39.747389, -105.224338];


export default function App() {
    const navigate = useNavigate();
  return (
    <div 
      className="app-container"
      style={{
        backgroundColor: "#ffffff",  // white background
        color: "#000000",            // black text
        minHeight: "100vh",          // fill screen height
        paddingTop: "2rem" 
      }}
    >
      <div className="top-bar">
        <span className="title">ORECART</span>
        </div>
        <div className="announcement" style={{ padding: "5rem", maxWidth: "600px", margin: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Beta is FINISHED 🎉</h2>
        <p>
          The Ore Cart Tracker beta has now concluded. We hope you found the site helpful during its run.
          This was a student-led project created in collaboration with the Ore Cart Shuttle team.
          Unfortunately, due to our very limited budget and no external funding, we were only able to
          support live tracking for a limited time.
        </p>
        <p>
          We’re currently exploring options to secure funding so we can bring the tracker back — better
          than ever. That includes support for more routes like Gold and Tungsten, with two carts per route!
        </p>
        <p>
          Sincerely,<br />
          <strong>The Ore Cart Tracker Team</strong>
        </p>
      </div>
        <button
          className="tracker-button"
          onClick={() => navigate("/")}
        >
          Back to Tracker
        </button>
    </div>
  );
}
