import { useEffect, useState } from "react";
import "./Customers.css";
import Layout from "../../components/Layout/Layout";
import {
  getCustomers,
  deleteCustomer,
  updateCustomer,
  getCustomerOrders,
} from "../../services/customerService";
import {
  getMeasurement,
  saveMeasurement,
} from "../../services/measurementService";
import MeasurementViewer from "../../components/MeasurementViewer/MeasurementViewer";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [measurement, setMeasurement] = useState({
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeve: "",
    neck: "",
    topLength: "",
    bottomLength: "",
    remarks: "",
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setCustomers(await getCustomers());
    } catch (error) {
      console.error("Error loading customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    getCustomers()
      .then((data) => {
        if (isMounted) setCustomers(data);
      })
      .catch((error) => {
        console.error("Error loading customers:", error);
        if (isMounted) setCustomers([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = (phoneNumber) => {
    const confirmDelete = window.confirm("Delete this customer?");
    if (!confirmDelete) return;
	    deleteCustomer(phoneNumber);
	    loadCustomers();
  };

  const handleView = async (customer) => {
    setSelectedCustomer(customer);
    setCustomerOrders(await getCustomerOrders(customer.phoneNumber));
    const savedMeasurement = getMeasurement(customer.phoneNumber);
    if (savedMeasurement) {
      setMeasurement(savedMeasurement);
    } else {
      setMeasurement({
        bust: "",
        waist: "",
        hip: "",
        shoulder: "",
        sleeve: "",
        neck: "",
        topLength: "",
        bottomLength: "",
        remarks: "",
      });
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setEditedName(customer.customerName);
    setEditedPhone(customer.phoneNumber);
  };

  const handleUpdate = () => {
    if (!editedName.trim()) {
      alert("Customer name cannot be empty.");
      return;
    }
    if (editedPhone.length !== 10) {
      alert("Phone number must contain 10 digits.");
      return;
    }
    updateCustomer({
      customerName: editedName,
      phoneNumber: editedPhone,
    });
	    loadCustomers();
    setEditingCustomer(null);
  };

  const handleMeasurementChange = (e) => {
    setMeasurement({
      ...measurement,
      [e.target.name]: e.target.value,
    });
  };

  const handleMeasurementSave = () => {
    saveMeasurement({
      ...measurement,
      customerName: selectedCustomer.customerName,
      phoneNumber: selectedCustomer.phoneNumber,
    });
    alert("Measurements Saved Successfully ✅");
  };

  return (
    <Layout>
      <div className="customers-container">
        <h1>Customers</h1>

        {loading ? (
          <h3>Loading Customers...</h3>
        ) : customers.length === 0 ? (
          <h3>No Customers Found</h3>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.phoneNumber}>
                  <td>{customer.customerName}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>

                    <div className="action-buttons">

                      <button
                        className="view-btn"
                        onClick={() => handleView(customer)}
                      >
                        👁 View
                      </button>

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(customer)}
                      >
                        ✏ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(customer.phoneNumber)}
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* View Customer Popup */}
        {selectedCustomer && (
          <div
            className="customer-popup"
            onClick={() => setSelectedCustomer(null)}
          >
            <div
              className="popup"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{selectedCustomer.customerName}</h2>
              <p>
                <strong>Phone :</strong> {selectedCustomer.phoneNumber}
              </p>

              <h3>Order History</h3>
              {customerOrders.length === 0 ? (
                <p>No Orders Found</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Dress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.dressType}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <hr />
              <h3>Measurements (Optional)</h3>

              <div className="measurement-layout">

                <div className="measurement-left">

                  <div className="measurement-grid">

                    <input
                      name="bust"
                      placeholder="Bust"
                      value={measurement.bust}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="waist"
                      placeholder="Waist"
                      value={measurement.waist}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="hip"
                      placeholder="Hip"
                      value={measurement.hip}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="shoulder"
                      placeholder="Shoulder"
                      value={measurement.shoulder}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="sleeve"
                      placeholder="Sleeve"
                      value={measurement.sleeve}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="neck"
                      placeholder="Neck"
                      value={measurement.neck}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="topLength"
                      placeholder="Top Length"
                      value={measurement.topLength}
                      onChange={handleMeasurementChange}
                    />
                    <input
                      name="bottomLength"
                      placeholder="Bottom Length"
                      value={measurement.bottomLength}
                      onChange={handleMeasurementChange}
                    />
                    <textarea
                      rows="3"
                      name="remarks"
                      placeholder="Remarks"
                      value={measurement.remarks}
                      onChange={handleMeasurementChange}
                    />

                  </div>

                  <button
                    className="save-btn"
                    onClick={handleMeasurementSave}
                  >
                    Save Measurements
                  </button>

                </div>

                <MeasurementViewer
                  measurement={measurement}
                />

              </div>

              <br />
              <button onClick={() => setSelectedCustomer(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Edit Customer Popup */}
        {editingCustomer && (
          <div
            className="customer-popup"
            onClick={() => setEditingCustomer(null)}
          >
            <div
              className="popup"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit Customer</h2>
              <input
                type="text"
                value={editedName}
                placeholder="Customer Name"
                onChange={(e) => setEditedName(e.target.value)}
              />
              <input
                type="text"
                value={editedPhone}
                maxLength={10}
                placeholder="Phone Number"
                onChange={(e) =>
                  setEditedPhone(e.target.value.replace(/\D/g, ""))
                }
              />
              <div className="popup-buttons">
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingCustomer(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Customers;
