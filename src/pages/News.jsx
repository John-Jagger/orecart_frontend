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
    <div className="app-container">
      <div className="top-bar">
        <span className="title">ORECART</span>
        </div>
        <div className="news-section">
            <h2>Beta is FINISHED🎉</h2>
            <p> The ore cart tracker beta has now concluded. We hope you used and found our site helpful. This is a student project and even though we did</p>
            <p> work with the orecart shuttle team to make this happen we couldn't keep it up due to our very small budget. We were not funded by anyone to</p>
            <p> do this and as such could only afford to track the orecart to a limited time. We are still looking for other ways to help fund this student</p>
            <p> project but as of this moment we do not have any concrete solutions. This doesn't mean the orecart tracker is down for good, we hope to find </p>
            <p>some more funding soon and add new features to it (gold, tungsten routes, with 2 carts per route)</p>
            <p>Sincerely,  </p>
            <p>The Ore Cart Tracker Team</p>
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
