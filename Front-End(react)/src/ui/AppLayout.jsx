import MyMap from "../components/Map";
import Sidebar from "../components/Sidebar";

function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <MyMap />
        </div>
    );
}

export default AppLayout;
