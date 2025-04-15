import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !waypoints || waypoints.length < 2) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints.map(coord => L.latLng(coord[0], coord[1])),
            lineOptions: {
                styles: [{ color: "blue", weight: 4 }],
            },
            router: L.Routing.osrmv1({
                serviceUrl:
                    "https://routing.openstreetmap.de/routed-car/route/v1",
            }),
            showAlternatives: false,
            createMarker: () => null,
        }).addTo(map);

        return () => {
            map.removeControl(routingControl);
        };
    }, [map, waypoints]);

    return null;
};

export default RoutingMachine;
