import {
    MapContainer,
    TileLayer,
    Polyline,
    useMap,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";
import { data } from "./data";

const RoutingControl = ({ path }) => {
    const map = useMap();

    useEffect(() => {
        const control = L.Routing.control({
            waypoints: path.map(coord => L.latLng(coord)),
            router: L.Routing.osrmv1({
                serviceUrl:
                    "https://routing.openstreetmap.de/routed-car/route/v1",
            }),
            lineOptions: {
                styles: [{ color: "red", opacity: 0.8, weight: 5 }],
            },
            // createMarker: () => null,
            addWaypoints: false,
            show: false,
            draggableWaypoints: false,
        }).addTo(map);

        return () => map.removeControl(control);
    }, [map, path]);

    return null;
};

const MyMap = () => {
    return (
        <MapContainer
            center={data.journey.location}
            zoom={8}
            style={{ height: "100vh", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
                key={data.journey.location}
                position={data.journey.location}>
                <Popup>
                    <h2>Walk Start</h2>
                </Popup>
            </Marker>
            {data.pathResult.totalPath.map((path, index) => {
                if (path.type === "walk") {
                    return (
                        <Polyline
                            key={index}
                            positions={path.coordinates}
                            pathOptions={{
                                color: "gray",
                                weight: 3,
                                opacity: 0.7,
                                dashArray: "5, 5",
                            }}></Polyline>
                    );
                } else {
                    return (
                        <RoutingControl key={index} path={path.coordinates} />
                    );
                }
            })}
            <Marker
                key={data.journey.destination}
                position={data.journey.destination}>
                <Popup>
                    <h2>destination</h2>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MyMap;
