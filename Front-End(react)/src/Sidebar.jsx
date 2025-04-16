import { useState } from "react";
import { data } from "./data";

const Sidebar = () => {
  const { journey, pathResult } = data;
  const [isVisible, setIsVisible] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  // Function to format coordinates for display
  const formatCoords = (coords) => {
    return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  };

  // Function to get transportation icon based on type
  const getTransportIcon = (type) => {
    switch (type) {
      case "walk":
        return "🚶";
      case "bus":
        return "🚌";
      case "train":
        return "🚆";
      case "car":
        return "🚗";
      default:
        return "🚩";
    }
  };

  return (
    <div className="sidebar-container">
      <button
        className={`toggle-button ${isVisible ? "visible" : "hidden"}`}
        onClick={toggleSidebar}
      >
        {isVisible ? "◄" : "►"}
      </button>
      {isVisible && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Travel Details</h2>
          </div>

          <div className="journey-info">
            <div className="info-section">
              <h3>Journey Overview</h3>
              <div className="info-item">
                <span className="label">Start Location:</span>
                <span className="value">{formatCoords(journey.location)}</span>
              </div>
              <div className="info-item">
                <span className="label">Destination:</span>
                <span className="value">
                  {formatCoords(journey.destination)}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Total Fee:</span>
                <span className="value">${pathResult.totalFee.toFixed(2)}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>Route Directions</h3>
              <div className="directions-list">
                {pathResult.totalPath.map((segment, index) => (
                  <div key={index} className="direction-segment">
                    <div className="segment-header">
                      <span className="transport-icon">
                        {getTransportIcon(segment.type)}
                      </span>
                      <span className="transport-type">
                        {segment.type.charAt(0).toUpperCase() +
                          segment.type.slice(1)}
                      </span>
                    </div>
                    <div className="segment-details">
                      <div className="segment-point">
                        <span className="point-label">From:</span>
                        <span className="point-value">
                          {segment.coordinates[0][0].toFixed(6)},{" "}
                          {segment.coordinates[0][1].toFixed(6)}
                        </span>
                      </div>
                      <div className="segment-point">
                        <span className="point-label">To:</span>
                        <span className="point-value">
                          {segment.coordinates[
                            segment.coordinates.length - 1
                          ][0].toFixed(6)}
                          ,
                          {segment.coordinates[
                            segment.coordinates.length - 1
                          ][1].toFixed(6)}
                        </span>
                      </div>
                      <div className="segment-point">
                        <span className="point-label">Points:</span>
                        <span className="point-value">
                          {segment.coordinates.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .sidebar-container {
          position: relative;
        }

        .sidebar {
          width: 350px;
          height: 100vh;
          background-color: white;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          padding: 20px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .toggle-button {
          position: absolute;
          top: 20px;
          z-index: 1100;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
        }

        .toggle-button.visible {
          left: 350px;
        }

        .toggle-button.hidden {
          left: 0;
        }

        .toggle-button:hover {
          background-color: #0056b3;
        }

        .sidebar-header {
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          margin: 0;
          color: #333;
        }

        .info-section {
          margin-bottom: 25px;
        }

        .info-section h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #555;
          font-size: 18px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
        }

        .directions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .direction-segment {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 12px;
        }

        .segment-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f0f0f0;
        }

        .transport-icon {
          font-size: 20px;
          margin-right: 10px;
        }

        .transport-type {
          font-weight: 600;
          color: #444;
        }

        .segment-details {
          padding-left: 10px;
        }

        .segment-point {
          display: flex;
          margin-bottom: 6px;
        }

        .point-label {
          width: 50px;
          font-weight: 500;
          color: #777;
        }

        .point-value {
          flex: 1;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
