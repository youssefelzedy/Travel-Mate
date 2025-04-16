import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "./styles/style.css";
import AppLayout from "./AppLayout";
import ErrorBoundary from "./ErrorBoundary";

function App() {
    return (
        <ErrorBoundary>
            <AppLayout />
        </ErrorBoundary>
    );
}

export default App;
