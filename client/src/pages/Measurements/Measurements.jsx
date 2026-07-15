import { useState } from "react";
import "./Measurements.css";
import Layout from "../../components/Layout/Layout";
import { saveMeasurement } from "../../services/measurementService";

function Measurements() {

  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeve: "",
    neck: "",
    armRound: "",
    topLength: "",
    bottomLength: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (form.phoneNumber === "") {
      alert("Phone Number Required");
      return;
    }
    saveMeasurement(form);
    alert("Measurements Saved");
  };

  return (
    <Layout>
      <div className="measurement-container">

        <h1>Measurements</h1>

        <div className="measurement-form">

          <input
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
          />

          <input
            name="bust"
            placeholder="Bust"
            value={form.bust}
            onChange={handleChange}
          />

          <input
            name="waist"
            placeholder="Waist"
            value={form.waist}
            onChange={handleChange}
          />

          <input
            name="hip"
            placeholder="Hip"
            value={form.hip}
            onChange={handleChange}
          />

          <input
            name="shoulder"
            placeholder="Shoulder"
            value={form.shoulder}
            onChange={handleChange}
          />

          <input
            name="sleeve"
            placeholder="Sleeve"
            value={form.sleeve}
            onChange={handleChange}
          />

          <input
            name="neck"
            placeholder="Neck"
            value={form.neck}
            onChange={handleChange}
          />

          <input
            name="armRound"
            placeholder="Arm Round"
            value={form.armRound}
            onChange={handleChange}
          />

          <input
            name="topLength"
            placeholder="Top Length"
            value={form.topLength}
            onChange={handleChange}
          />

          <input
            name="bottomLength"
            placeholder="Bottom Length"
            value={form.bottomLength}
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            value={form.remarks}
            onChange={handleChange}
          />

          <button onClick={handleSave}>
            Save Measurements
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default Measurements;