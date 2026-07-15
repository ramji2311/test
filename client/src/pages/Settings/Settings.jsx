import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import "./Settings.css";

import {
  getSettings,
  saveSettings,
} from "../../services/settingsService";
import { generateOrderId } from "../../utils/orderIdGenerator";

function Settings() {
  const [settings, setSettings] = useState(() => getSettings());

  useEffect(() => {
    const fetchNextOrderNumber = async () => {
      const nextId = await generateOrderId();
      setSettings((prev) => ({
        ...prev,
        nextOrderNumber: prev.nextOrderNumber || nextId,
      }));
    };
    fetchNextOrderNumber();
  }, []);

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    saveSettings(settings);

    // Apply Theme
    if (settings.theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    alert("Settings Saved Successfully ✅");
  };

  return (
    <Layout>

      <div className="settings-container">

        <h1>Settings</h1>

        <div className="settings-card">

          <div className="form-group">
            <label>Shop Name</label>

            <input
              type="text"
              name="shopName"
              value={settings.shopName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>

            <input
              type="text"
              name="ownerName"
              value={settings.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              rows="3"
              name="address"
              value={settings.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Maximum Orders Per Day</label>

            <input
              type="number"
              name="maxOrdersPerDay"
              value={settings.maxOrdersPerDay}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Next Order Number</label>

            <input
              type="number"
              name="nextOrderNumber"
              value={settings.nextOrderNumber || ""}
              onChange={handleChange}
            />
          </div>

          <button
            className="save-btn"
            onClick={handleSave}
          >
            💾 Save Settings
          </button>

        </div>

        <div className="about-card">

          <h2>About</h2>

          <p><strong>Application :</strong> Miara Designer House ERP</p>

          <p><strong>Version :</strong> 1.0</p>

          <p><strong>Developed By :</strong> Raman Kishore</p>

        </div>

      </div>

    </Layout>
  );
}

export default Settings;
