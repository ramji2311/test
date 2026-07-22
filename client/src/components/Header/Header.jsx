import { useEffect, useState } from "react";
import { getSettings } from "../../services/settingsService";
import "./Header.css";

function Header() {
  const [ownerName, setOwnerName] = useState("Ramya");

  useEffect(() => {
    const settings = getSettings();
    if (settings && settings.ownerName) {
      setOwnerName(settings.ownerName);
    }
  }, []);

  return (
    <div className="header">

      <div className="left-header">
        <h1>MIARA DESIGNER HOUSE</h1>
        <p>Tailor ERP System</p>
      </div>

      <div className="right-header">
        <h2>Welcome {ownerName} 👋</h2>
      </div>

    </div>
  );
}

export default Header;