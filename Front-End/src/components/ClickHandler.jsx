import { useMapEvent } from "react-leaflet";

export const ClickHandler = ({ setLocation, setDestination, location }) => {
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
