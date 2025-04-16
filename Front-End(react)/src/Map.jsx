import {
    MapContainer,
    TileLayer,
    Polyline,
    useMap,
    Marker,
    Popup,
    useMapEvent,
    ZoomControl,
} from "react-leaflet";

import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect, useRef, useState } from "react";

import { allPathCoordinates, data } from "./data";
import FitBounds from "./FitBounds";
import RedIcon from "./ui/RedIcon";
import { FaMapMarkerAlt } from "react-icons/fa";
import DeleteButton from "./DeleteButton";

const ClickHandler = ({ setLocation, setDestination, location }) => {
    useMapEvent("click", e => {
        const { lat, lng } = e.latlng;
        if (!location) {
            setLocation({ lat, lng });
        } else {
            setDestination({ lat, lng });
        }
    });

    return null;
};

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

const MyMap = () => {
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const locationRef = useRef(null);
    const destinationRef = useRef(null);

    const updateMarkerPosition = (markerRef, setter) => {
        if (markerRef.current) {
            const { lat, lng } = markerRef.current.getLatLng();
            setter({ lat, lng });
        }
    };

    const handleGetCurrentLocation = e => {
        e.stopPropagation();
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log("Current location:", latitude, longitude);

                setLocation({ lat: latitude, lng: longitude });
            },
            () => {
                alert("Unable to retrieve your location");
            }
        );
    };

    return (
        <>
            <MapContainer
                center={data.journey.location}
                zoom={8}
                style={{ height: "100vh", width: "100%", position: "absolute" }}
                zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitBounds coordinates={allPathCoordinates} />
                <ZoomControl position="topright" />

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
                            <RoutingControl
                                key={index}
                                path={path.coordinates}
                            />
                        );
                    }
                })}

                <ClickHandler
                    setLocation={setLocation}
                    setDestination={setDestination}
                    location={location}
                />

                {location && (
                    <Marker
                        position={[location.lat, location.lng]}
                        draggable={true}
                        eventHandlers={{
                            dragend: () =>
                                updateMarkerPosition(locationRef, setLocation),
                        }}
                        ref={locationRef}>
                        <Popup>
                            <div>Drag to set Location</div>
                            <DeleteButton
                                onClick={e => {
                                    e.stopPropagation();
                                    setLocation(null);
                                }}
                            />
                        </Popup>
                    </Marker>
                )}

                {destination && (
                    <Marker
                        position={[destination.lat, destination.lng]}
                        draggable={true}
                        icon={RedIcon}
                        eventHandlers={{
                            dragend: () =>
                                updateMarkerPosition(
                                    destinationRef,
                                    setDestination
                                ),
                        }}
                        ref={destinationRef}>
                        <Popup>
                            <div>Drag to set Destination</div>
                            <DeleteButton
                                onClick={e => {
                                    e.stopPropagation();
                                    setDestination(null);
                                }}
                            />
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
            {location ? (
                ""
            ) : (
                <button
                    onClick={handleGetCurrentLocation}
                    className="current-location-button">
                    <FaMapMarkerAlt size={20} />
                </button>
            )}
        </>
    );
};

export default MyMap;
