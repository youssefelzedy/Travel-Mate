import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";
import { data } from "./data";

const LeafletMap = () => {
    useEffect(() => {
        const mapContainer = L.DomUtil.get("map");

        if (mapContainer != null) {
            mapContainer._leaflet_id = null;
        }

        const map = L.map("map").setView(data.journey.location, 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        data.pathResult.totalPath.forEach(path => {
            if (path.type === "walk") {
                L.Polygon([
                    L.latLng(path.coordinates[0]),
                    L.latLng(path.coordinates.at(-1)),
                ]).addTo(map);
            } else {
                L.Routing.control({
                    waypoints: [
                        L.latLng(path.coordinates[0]),
                        L.latLng(path.coordinates.at(-1)),
                    ],
                    lineOptions: {
                        styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
                    },
                    show: false,
                    addWaypoints: false,
                    draggableWaypoints: false,
                    fitSelectedRoutes: true,
                }).addTo(map);
            }
        });

        return () => {
            map.remove();
        };
    }, []);

    return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default LeafletMap;
