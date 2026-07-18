import { useEffect, useState } from "react";
import { getSettings } from "../../services/settingsService";
import "./Header.css";

function Header() {
  const [ownerName, setOwnerName] = useState("Ramya");
  // Today's Date
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
        <p>Today: {today}</p>
      </div>

    </div>
  );
}

export default Header;