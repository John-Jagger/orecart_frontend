import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, Polyline, CircleMarker, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import L from "leaflet";

const DEFAULT_CENTER = [39.747389, -105.224338];

const ROUTE_CONFIG = {
  silver: {
    waypoints: [
      [39.75123, -105.222302],
      [39.753914, -105.226298],
      [39.750895, -105.223291],
      [39.748435, -105.222988],
      [39.744379, -105.224428],
      [39.741498, -105.223882],
      [39.740863, -105.222378],
      [39.75123, -105.222302],
    ],
    color: "#C0C0C0",
    name: "Silver"
  },
};

const createIcon = (url, size, anchor) => new L.Icon({
  iconUrl: url,
  iconSize: size,
  iconAnchor: anchor,
});

const cartIcon = createIcon("/cart.svg", [30, 30], [15, 15]);
const stopIcon = createIcon("/bus.svg", [25, 25], [12, 25]);
const driverIcon = createIcon("/driver.svg", [40, 40], [20, 20]);

export default function App() {
  const [route, setRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("silver");
  const [times, setTimes] = useState([]);
  const [position, setPosition] = useState(DEFAULT_CENTER);
  const [mode, setMode] = useState("user");
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  const currentRoute = ROUTE_CONFIG[selectedRoute];

  // Fetch last known location on load
  useEffect(() => {
    fetch("https://tracker-backendgun.onrender.com/api/location/")
      .then((res) => res.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          console.log("📍 Loaded last known location:", data);
          setPosition([data.latitude, data.longitude]);
        }
      })
      .catch((err) => console.error("Error loading last known location:", err));
  }, []);

  // Connect WebSocket (with auto-reconnect)
  useEffect(() => {
    let ws;
    let shouldReconnect = true;

    const connectWebSocket = () => {
      console.log("🔌 Connecting WebSocket...");
      ws = new WebSocket("wss://tracker-backendgun.onrender.com/ws/location/");

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        ws.send(JSON.stringify({ user_id: "unknown" }));
        if (mode === "driver") {
          startLocationSharing();
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (mode === "user" && data.latitude && data.longitude) {
          setPosition([data.latitude, data.longitude]);
        }
      };

      ws.onerror = (err) => console.error("WebSocket error:", err);

      ws.onclose = () => {
        console.warn("⚠️ WebSocket closed");
        if (shouldReconnect) {
          setTimeout(connectWebSocket, 5000); // Try again in 5 seconds
        }
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      shouldReconnect = false;
      ws?.close();
    };
  }, [mode]);

  // Watch location if in driver mode
  useEffect(() => {
    if (mode === "driver") {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition([latitude, longitude]);

            if (socketRef.current?.readyState === WebSocket.OPEN) {
              socketRef.current.send(JSON.stringify({
                user_id: "unknown",
                latitude,
                longitude,
                mode: "driver"
              }));
            }
          },
          (err) => console.error("Geo error:", err),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      }
    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [mode]);

  // Load route (or fallback to config)
  useEffect(() => {
    fetch(`/${selectedRoute}-route.json`)
      .then((res) => res.json())
      .then((data) => {
        setRoute(data.route || currentRoute.waypoints);
        setTimes((data.route || currentRoute.waypoints).map(() => Math.floor(Math.random() * 10) + 1));
      })
      .catch((err) => {
        console.warn("Fallback to hardcoded route due to fetch error:", err);
        setRoute(currentRoute.waypoints);
        setTimes(currentRoute.waypoints.map(() => Math.floor(Math.random() * 10) + 1));
      });
  }, [selectedRoute]);

  return (
    <div className="app-container">
      <div className="top-bar">
        <span className="title">ORECART</span>
        <button
          className="report-button"
          onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSe7nRbh6Vp9wmA-PTlPgbShxyE5fXBfWK5n0zX_1kMQ2D1luA/viewform?usp=header", "_blank")}
        >
          Report Issue
        </button>
        <div className="controls">
          <button
            className={`mode-toggle ${mode === 'driver' ? 'driver' : ''}`}
            onClick={() => {
              if (mode === "driver") {
                setMode("user");
              } else {
                const password = prompt("Password:");
                if (password === "orecartS1") setMode("driver");
              }
            }}
          >
            {mode === "driver" ? "DRIVER MODE" : "USER MODE"}
          </button>
        </div>
      </div>

      <MapContainer center={DEFAULT_CENTER} zoom={14} className="map">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {route.length > 0 && (
          <Polyline
            key={selectedRoute}
            positions={route}
            color={currentRoute.color}
            weight={5}
            interactive={false}
          />
        )}

        {currentRoute.waypoints.map((point, index) => (
          <div key={index}>
            <CircleMarker
              center={point}
              radius={7}
              fillColor={currentRoute.color}
              color="#f8f9fa08"
              weight={15}
              fillOpacity={1}
            />
            <Marker position={point} icon={stopIcon}>
              <Popup>{currentRoute.name} - Stop</Popup>
            </Marker>
          </div>
        ))}

        <Marker position={position} icon={mode === "driver" ? driverIcon : cartIcon}>
          <Popup>{mode === "driver" ? "Driver Position" : "Cart Location"}</Popup>
        </Marker>

        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
}
