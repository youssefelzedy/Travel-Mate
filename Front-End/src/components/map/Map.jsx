import { useRef } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
    ZoomControl,
    CircleMarker,
} from "react-leaflet";

import "leaflet-routing-machine";
import { FaBus, FaMapMarkerAlt, FaRoad, FaTaxi } from "react-icons/fa";
import { RiResetLeftLine } from "react-icons/ri";

// import FitBounds from "./FitBounds";
import RedIcon from "../../ui/RedIcon";
import DeleteButton from "../../ui/DeleteButton";
import { ClickHandler } from "./ClickHandler";
import { RoutingControl } from "./RoutingControl";
import { useMicroBus } from "../useMicroBus";
import { useTaxi } from "../useTaxi";
import { useUserData } from "../../context/UserDataContext";
import { useQueryClient } from "@tanstack/react-query";

const MyMap = () => {
    const {
        carType,
        setCarType,
        location,
        setLocation,
        destination,
        setDestination,
    } = useUserData();

    const locationRef = useRef(null);
    const destinationRef = useRef(null);

    const { getMicrobus, data: dataMicroBus } = useMicroBus({
        location,
        destination,
    });
    const { getTaxi, data: dataTaxi } = useTaxi({ location, destination });
    const queryClient = useQueryClient();

    const handleClear = e => {
        e.stopPropagation();
        queryClient.clear();
        setLocation(null);
        setDestination(null);
    };

    const updateMarkerPosition = (markerRef, setter) => {
        if (markerRef.current) {
            const { lat, lng } = markerRef.current.getLatLng();
            setter({ lat, lng });
        }
    };

    // Function to get the current locations
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
            {/* Toggle Buttons */}
            <div className="toggle-car-container">
                <button
                    onClick={() => setCarType("microbus")}
                    className={`toggle-car-button ${
                        carType === "microbus" ? "active" : ""
                    }`}>
                    <FaBus size={20} /> Bus
                </button>
                <button
                    onClick={() => setCarType("taxi")}
                    className={`toggle-car-button ${
                        carType === "taxi" ? "active" : ""
                    }`}>
                    <FaTaxi size={20} />
                    Taxi
                </button>
            </div>

            <MapContainer
                center={location || [31.2662163606, 32.2821235657]}
                zoom={15}
                style={{ height: "100vh", width: "100%", position: "absolute" }}
                zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ZoomControl position="topright" />

                {dataTaxi && location && destination && (
                    <RoutingControl
                        key={location}
                        path={
                            dataTaxi?.data?.result?.route_geometry.coordinates
                        }
                    />
                )}

                {dataMicroBus &&
                    location &&
                    destination &&
                    dataMicroBus?.data?.pathResult.totalPath.map(
                        (path, index) =>
                            path.type === "walk" ? (
                                <>
                                    {/* Border for the line */}
                                    <Polyline
                                        key={`${index}-path`}
                                        pathOptions={{
                                            color: "lightblue", // Border color (changed from black to dark blue)
                                            weight: 10, // Border thickness
                                            opacity: 1,
                                        }}
                                        positions={path.coordinates}
                                    />
                                    {/* Main line */}
                                    <Polyline
                                        key={`${index}-border`}
                                        pathOptions={{
                                            color: "darkblue", // Main line color
                                            weight: 12, // Main line thickness
                                            opacity: 0.7,
                                            dashArray: "0.5 , 20",
                                        }}
                                        positions={path.coordinates}
                                    />
                                    <Polyline
                                        key={index}
                                        pathOptions={{
                                            color: "#1972c4bf", // Main line color
                                            weight: 8, // Main line thickness
                                            opacity: 1,
                                            dashArray: "0.5 , 20",
                                        }}
                                        positions={path.coordinates}
                                    />
                                </>
                            ) : (
                                <RoutingControl key={index} path={path} />
                            )
                    )}

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

            <button onClick={handleClear} className="clear-button">
                <RiResetLeftLine size={20} />
            </button>

            {location && destination ? (
                dataMicroBus || dataTaxi ? (
                    <button onClick={handleClear} className="get-route-button">
                        <RiResetLeftLine size={20} /> Try Again
                    </button>
                ) : (
                    <button
                        onClick={() =>
                            carType === "microbus"
                                ? getMicrobus({ location, destination })
                                : getTaxi({ location, destination })
                        }
                        className="get-route-button">
                        <FaRoad size={20} /> Get Route
                    </button>
                )
            ) : (
                ""
            )}
        </>
    );
};

export default MyMap;
