import MyMap from "./Map";
import Sidebar from "./Sidebar";

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <MyMap />
      <style jsx="true">{`
        .app-layout {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default AppLayout;
