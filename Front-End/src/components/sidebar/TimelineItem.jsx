import React from "react";
import { FaBus, FaFlag, FaWalking } from "react-icons/fa";

const TimelineItem = ({ segment, isLast }) => {
    const getTransportIcon = type => {
        switch (type) {
            case "walk":
                return <FaWalking size={16} />;
            case "bus":
                return <FaBus size={16} />;
            default:
                return <FaFlag size={16} />;
        }
    };

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
        <div className="timeline-item">
            <div className="timeline-marker">
                <div className="marker-circle">
                    <span className="transport-icon">
                        {getTransportIcon(segment.type)}
                    </span>
                </div>
                {!isLast && renderTimelineLine(segment.type)}
            </div>
            <div className="timeline-content">
                <div className="segment-header">
                    <span className="transport-type">
                        {segment.type.charAt(0).toUpperCase() +
                            segment.type.slice(1)}
                    </span>
                </div>
                <div className="segment-details">
                    <div className="segment-point">
                        <span className="point-label">
                            {segment.type === "walk"
                                ? isLast
                                    ? "walk to reach destination"
                                    : "walk to find the next microbus"
                                : segment.name}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineItem;
