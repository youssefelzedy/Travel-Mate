import { useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Polyline,
    Marker,
    Popup,
    ZoomControl,
} from "react-leaflet";

import "leaflet-routing-machine";
import { FaBus, FaMapMarkerAlt, FaRoad, FaTaxi } from "react-icons/fa";
import { RiResetLeftLine } from "react-icons/ri";

// import FitBounds from "./FitBounds";
import RedIcon from "../ui/RedIcon";
import DeleteButton from "../ui/DeleteButton";
import { ClickHandler } from "./ClickHandler";
import { RoutingControl } from "./RoutingControl";
import { useMicroBus } from "./useMicroBus";
import { useTaxi } from "./useTaxi";
import { useCarType } from "../context/CarTypeContext";

const MyMap = () => {
    const [location, setLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const { carType, setCarType } = useCarType();
    const locationRef = useRef(null);
    const destinationRef = useRef(null);

    // eslint-disable-next-line no-unused-vars
    const { getMicrobus, data: dataMicroBus } = useMicroBus();
    const { getTaxi, data: dataTaxi } = useTaxi();

    const handleClear = e => {
        e.stopPropagation();
        setLocation(null);
        setDestination(null);
    };
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
                zoom={14}
                style={{ height: "100vh", width: "100%", position: "absolute" }}
                zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ZoomControl position="topright" />
                {/* microbus */}
                {/* {data?.data?.pathResult.totalPath.map((path, index) => {
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
                })} */}
                {dataTaxi &&
                    location &&
                    destination &&
                    [dataTaxi?.data?.result?.route_geometry.coordinates].map(
                        (path, index) => (
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
