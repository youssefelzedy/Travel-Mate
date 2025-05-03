import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export const RoutingControl = ({ path }) => {
    const map = useMap();

    useEffect(() => {
        const control = L.Routing.control({
            waypoints: path.map(([lng, lat]) => L.latLng(lat, lng)), // Reverse coordinates
            lineOptions: {
                styles: [{ color: "red", opacity: 0.8, weight: 5 }],
            },
            createMarker: () => null,
            addWaypoints: false,
            show: false,
            fitSelectedRoutes: false,
            draggableWaypoints: false,
        }).addTo(map);

        return () => map.removeControl(control);
    }, [map, path]);

    return null;
};
