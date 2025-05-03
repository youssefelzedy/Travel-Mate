import { useState } from "react";
import { data } from "../utils/data";
import "../styles/sidebar.css";

// Load FontAwesome for icons
const FontAwesomeCDN = () => (
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
    />
);

const Sidebar = () => {
    const { journey, pathResult } = data;
    const [isVisible, setIsVisible] = useState(false);

    // Function to toggle sidebar visibility
    const toggleSidebar = () => {
        setIsVisible(!isVisible);
    };

    // Function to format coordinates for display
    const formatCoords = coords => {
        return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
    };

    // Function to get transportation icon based on type
    const getTransportIcon = type => {
        switch (type) {
            case "walk":
                return <i className="fas fa-walking"></i>;
            case "bus":
                return <i className="fas fa-bus"></i>;
            default:
                return <i className="fas fa-flag"></i>;
        }
    };

    // Function to render the appropriate line style based on the current segment's type
    const renderTimelineLine = currentType => {
        if (currentType === "walk") {
            return (
                <div className="timeline-dashed">
                    {[...Array(5)].map((_, dotIndex) => (
                        <span key={dotIndex} className="dash-dot"></span>
                    ))}
                </div>
            );
        } else if (currentType === "bus") {
            return <div className="timeline-line bold"></div>;
        } else {
            return <div className="timeline-line"></div>;
        }
    };

    return (
        <div className="sidebar-container">
            <FontAwesomeCDN />
            {!isVisible && (
                <button className="show-button" onClick={toggleSidebar}>
                    <i className="fas fa-chevron-right"></i>
                </button>
            )}
            {isVisible && (
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h2>Travel Details</h2>
                        <button
                            className="toggle-button"
                            onClick={toggleSidebar}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    </div>

                    <div className="journey-info">
                        <div className="info-section">
                            <h3>Journey Overview</h3>
                            <div className="overview-card">
                                <div className="info-item">
                                    <span className="icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Start Location:
                                        </span>
                                        <span className="value">
                                            {formatCoords(journey.location)}
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">
                                        <i className="fas fa-flag-checkered"></i>
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Destination:
                                        </span>
                                        <span className="value">
                                            {formatCoords(journey.destination)}
                                        </span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <span className="icon">
                                        <i className="fas fa-dollar-sign"></i>
                                    </span>
                                    <div className="info-content">
                                        <span className="label">
                                            Total Fee:
                                        </span>
                                        <span className="value">
                                            ${pathResult.totalFee.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Route Directions</h3>
                            <div className="timeline">
                                {pathResult.totalPath.map((segment, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-marker">
                                            <div className="marker-circle">
                                                <span className="transport-icon">
                                                    {getTransportIcon(
                                                        segment.type
                                                    )}
                                                </span>
                                            </div>
                                            {index <
                                                pathResult.totalPath.length -
                                                    1 &&
                                                renderTimelineLine(
                                                    segment.type
                                                )}
                                        </div>
                                        <div className="timeline-content">
                                            <div className="segment-header">
                                                <span className="transport-type">
                                                    {segment.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        segment.type.slice(1)}
                                                </span>
                                            </div>
                                            <div className="segment-details">
                                                <div className="segment-point">
                                                    <span className="point-label">
                                                        From:
                                                    </span>
                                                    <span className="point-value">
                                                        {segment.coordinates[0][0].toFixed(
                                                            6
                                                        )}
                                                        ,{" "}
                                                        {segment.coordinates[0][1].toFixed(
                                                            6
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="segment-point">
                                                    <span className="point-label">
                                                        To:
                                                    </span>
                                                    <span className="point-value">
                                                        {segment.coordinates[
                                                            segment.coordinates
                                                                .length - 1
                                                        ][0].toFixed(6)}
                                                        ,
                                                        {segment.coordinates[
                                                            segment.coordinates
                                                                .length - 1
                                                        ][1].toFixed(6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
