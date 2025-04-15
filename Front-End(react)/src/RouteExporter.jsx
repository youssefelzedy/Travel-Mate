// components/RouteExporter.jsx
import React, { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { saveAs } from "file-saver";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const RouteExporter = () => {
    const [points, setPoints] = useState([]);
    const [route, setRoute] = useState([]);

    const addPoint = e => {
        setPoints([...points, [e.latlng.lat, e.latlng.lng]]);
    };

    const getRoute = async () => {
        if (points.length < 2) return alert("Add at least two points!");

        try {
            const coordinates = points.map(p => p.reverse()); // [lng, lat]
            const res = await axios.post(
                "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                { coordinates },
                {
                    headers: {
                        Authorization:
                            "5b3ce3597851110001cf6248f1712e0786d74c90a111089c7819590f",
                        "Content-Type": "application/json",
                    },
                }
            );

            const coords = res.data.features[0].geometry.coordinates.map(p =>
                p.reverse()
            ); // [lat, lng]
            setRoute(coords);
        } catch (err) {
            console.error(err);
        }
    };

    const exportRoute = () => {
        if (!route.length) return alert("No route to export.");

        const geojson = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: route.map(p => [p[1], p[0]]), // [lng, lat]
            },
        };

        const blob = new Blob([JSON.stringify(geojson)], {
            type: "application/json",
        });
        saveAs(blob, "route.geojson");
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: addPoint,
        });
        return null;
    };

    return (
        <div>
            <MapContainer
                center={[31.2662163606, 32.2821235657]}
                zoom={13}
                style={{ height: "500px" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                {points.map((pos, idx) => (
                    <Marker key={idx} position={pos} />
                ))}
                {route.length > 0 && (
                    <Polyline positions={route} color="blue" />
                )}
            </MapContainer>
            <div style={{ marginTop: "10px" }}>
                <button onClick={getRoute}>Generate Route</button>
                <button onClick={exportRoute} style={{ marginLeft: "10px" }}>
                    Export Route (GeoJSON)
                </button>
            </div>
        </div>
    );
};

export default RouteExporter;
