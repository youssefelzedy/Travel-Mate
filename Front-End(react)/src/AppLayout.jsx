import MyMap from "./Map";
import Sidebar from "./Sidebar";

function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <MyMap />
        </div>
    );
}

export default AppLayout;
