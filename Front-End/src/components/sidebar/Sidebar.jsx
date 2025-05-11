import "../../styles/sidebar.css";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMicroBus } from "../useMicroBus";
import { useUserData } from "../../context/UserDataContext";
import { useNearestStreet } from "../../hooks/useNearestStreet";
import TimelineItem from "./TimelineItem";
import {
    FaChevronLeft,
    FaChevronRight,
    FaFlagCheckered,
    FaMapMarkerAlt,
    FaMoneyBillAlt,
} from "react-icons/fa";
import { GiPathDistance } from "react-icons/gi";
import { useTaxi } from "../useTaxi";

const Sidebar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { location, destination, carType } = useUserData();
    const { getMicrobus, data: mutationMicrobusData } = useMicroBus({
        location,
        destination,
    });

    const { getTaxi, data: mutationTaxiData } = useTaxi({
        location,
        destination,
    });

    const { data: microbusData } = useQuery({
        queryKey: ["microbus"],
        queryFn: ({ location, destination }) =>
            getMicrobus({ location, destination }),
        enabled: !!mutationMicrobusData,
    });

    const pathResult = microbusData?.data?.pathResult || null;

    const { data: taxiData } = useQuery({
        queryKey: ["taxi"],
        queryFn: ({ location, destination }) =>
            getTaxi({ location, destination }),
        enabled: !!mutationTaxiData,
    });
    const taxiResult = taxiData?.data?.result || null;

    useEffect(() => {
        if (microbusData || taxiData) setIsVisible(true);
        else setIsVisible(false);
    }, [microbusData, taxiData]);

    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };
    const { data: startStreet = "Loading...", isError: startError } =
        useNearestStreet(location?.lat, location?.lng);
    const { data: endStreet = "Loading...", isError: endError } =
        useNearestStreet(destination?.lat, destination?.lng);

    return (
        <div className="sidebar-container">
            {!isVisible && (microbusData || taxiData) && (
                <button className="show-button" onClick={toggleSidebar}>
                    <FaChevronRight size={16} />
                </button>
            )}
            {isVisible && carType === "taxi" && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h2>Travel Details</h2>
                        <button
                            className="toggle-button"
                            onClick={toggleSidebar}>
                            <FaChevronLeft size={16} />
                        </button>
                    </div>
                    <div className="info-section">
                        <h3>Journey Overview</h3>
                        <div className="overview-card">
                            <div className="info-item">
                                <span className="icon">
                                    <FaMapMarkerAlt size={16} />
                                </span>
                                <div className="info-content">
                                    <span className="label">
                                        Start Location:
                                    </span>
                                    <span className="value">
                                        {startError
                                            ? "Error fetching street"
                                            : startStreet}
                                    </span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">
                                    <FaFlagCheckered size={16} />
                                </span>
                                <div className="info-content">
                                    <span className="label">Destination:</span>
                                    <span className="value">
                                        {endError
                                            ? "Error fetching street"
                                            : endStreet}
                                    </span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">
                                    <FaMoneyBillAlt size={16} />
                                </span>
                                <div className="info-content">
                                    <span className="label">Total Fee:</span>
                                    <span className="value">
                                        {taxiResult?.price_egp.toFixed(0)} EGP
                                    </span>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="icon">
                                    <GiPathDistance size={16} />
                                </span>
                                <div className="info-content">
                                    <span className="label">
                                        Total Distance:
                                    </span>
                                    <span className="value">
                                        {(
                                            taxiResult?.distance_meters / 1000.0
                                        ).toFixed(3)}{" "}
                                        KM
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isVisible && carType === "microbus" && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h2>Travel Details</h2>
                        <button
                            className="toggle-button"
                            onClick={toggleSidebar}>
                            <FaChevronLeft size={16} />
                        </button>
                    </div>

                    <div className="journey-info">
                        <div className="info-section">
                            <h3>Journey Overview</h3>
                            <div className="overview-card">
                                <div className="info-item">
                                    <span className="icon">
                                        <FaMapMarkerAlt size={16} />
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Start Location:
                                        </span>
                                        <span className="value">
                                            {startError
                                                ? "Error fetching street"
                                                : startStreet}
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">
                                        <FaFlagCheckered size={16} />
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Destination:
                                        </span>
                                        <span className="value">
                                            {endError
                                                ? "Error fetching street"
                                                : endStreet}
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">
                                        <FaMoneyBillAlt size={16} />
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Total Fee:
                                        </span>
                                        <span className="value">
                                            {pathResult?.totalFee.toFixed(2)}{" "}
                                            EGP
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">
                                        <GiPathDistance size={16} />
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Total Distance:
                                        </span>
                                        <span className="value">
                                            {pathResult?.distance.toFixed(3)} KM
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Route Directions</h3>
                            <div className="timeline">
                                {pathResult?.totalPath.map((segment, index) => (
                                    <TimelineItem
                                        key={index}
                                        segment={segment}
                                        isLast={
                                            index ===
                                            pathResult.totalPath.length - 1
                                        }
                                        nextSegment={
                                            pathResult.totalPath[index + 1]
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
