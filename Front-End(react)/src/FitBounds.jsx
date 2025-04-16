import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

const FitBounds = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        if (!coordinates || coordinates.length === 0) return;

        const bounds = L.latLngBounds(
            coordinates.map(coord => [coord[1], coord[0]])
        );
        map.fitBounds(bounds, { padding: [50, 50] }); // Optional padding
    }, [coordinates, map]);

    return null;
};

export default FitBounds;
