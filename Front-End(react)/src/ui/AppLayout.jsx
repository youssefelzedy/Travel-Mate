import MyMap from "../components/map/Map";
import Sidebar from "../components/sidebar/Sidebar";

function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <MyMap />
        </div>
    );
}

export default AppLayout;
