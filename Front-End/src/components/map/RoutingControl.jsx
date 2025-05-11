import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useUserData } from "../../context/UserDataContext";

export const RoutingControl = ({ path }) => {
    const map = useMap();
    const { carType } = useUserData();
    const waypoints =
        carType === "microbus"
            ? path.coordinates
            : path.map(([lng, lat]) => L.latLng(lat, lng));

    useEffect(() => {
        const control = L.Routing.control({
            waypoints: waypoints,
            lineOptions: {
                styles: [
                    {
                        color: carType === "microbus" ? "red" : "blue",
                        opacity: 0.8,
                        weight: 10,
                    },
                ],
            },
            createMarker: () => null,
            addWaypoints: false,
            show: false,
            fitSelectedRoutes: false,
            draggableWaypoints: false,
        }).addTo(map);

        return () => map.removeControl(control);
    }, [map, path, waypoints, carType]);

    return null;
};
