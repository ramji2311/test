import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;
