import { useEffect, useState } from "react";
import "./NewOrder.css";
import Layout from "../../components/Layout/Layout";
import { dressTypes } from "../../constants/dressTypes";
import { generateOrderId } from "../../utils/orderIdGenerator";
import { getCapacityStatus } from "../../utils/capacityChecker";
import { saveOrder } from "../../services/orderService";
import { getSettings, saveSettings } from "../../services/settingsService";

function NewOrder() {
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dressType, setDressType] = useState(dressTypes[0]);
  const [quantity, setQuantity] = useState(1);
  const [dueDate, setDueDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [advance, setAdvance] = useState("");
  const [remarks, setRemarks] = useState("");
  const [capacityStatus, setCapacityStatus] = useState({
    maximum: 15,
    booked: 0,
    remaining: 15,
    isFull: false,
  });

  useEffect(() => {
    let isMounted = true;

    const loadOrderId = async () => {
      const nextOrderId = await generateOrderId();
      if (isMounted) setOrderId(nextOrderId);
    };

    loadOrderId();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCapacityStatus = async () => {
      const status = await getCapacityStatus(dueDate);
      if (isMounted) setCapacityStatus(status);
    };

    loadCapacityStatus();

    return () => {
      isMounted = false;
    };
  }, [dueDate]);

  const balance =
    (Number(totalAmount) || 0) -
    (Number(advance) || 0);

  const resetForm = async () => {
    setOrderId(await generateOrderId());
    setCustomerName("");
    setPhoneNumber("");
    setDressType(dressTypes[0]);
    setQuantity(1);
    setDueDate("");
    setDeliveryDate("");
    setTotalAmount("");
    setAdvance("");
    setRemarks("");
  };

  const handleSave = async () => {
	    if (!orderId) {
	      alert("Enter Order Number");
	      return;
	    }
    if (!customerName.trim()) {
      alert("Enter Customer Name");
      return;
    }
    if (!phoneNumber.trim()) {
      alert("Enter Phone Number");
      return;
    }
    if (phoneNumber.length !== 10) {
      alert("Phone Number must contain 10 digits");
      return;
    }
    if (!dueDate) {
      alert("Select Due Date");
      return;
    }
    if (capacityStatus.isFull) {
      alert("This delivery date is already full.");
      return;
    }

    const order = {
      orderId,
      customerName,
      phoneNumber,
      dressType,
      quantity,
      bookingDate: new Date().toISOString().split("T")[0],
      dueDate,
      deliveryDate,
      totalAmount: Number(totalAmount),
      advanceAmount: Number(advance),
      balanceAmount: Number(balance),
      remarks,
      status: "Pending",
    };

    try {
      await saveOrder(order);
      alert("Order Saved Successfully ✅");

      const currentSettings = getSettings();
      currentSettings.nextOrderNumber = String(Number(orderId) + 1);
      saveSettings(currentSettings);

      await resetForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error) {
      console.error(error.response?.data || error);

      alert(
        error.response?.data?.message ||
        "Unable to save order."
      );
    }
  };

  const handleClear = () => {
    resetForm();
  };

  return (
    <Layout>
      <div className="new-order-container">

        <h1 className="page-title">New Order</h1>

        <div className="new-order-layout">

          {/* Left Side */}

	          <div className="main-form">

	            <div className="form-group">
	              <label>Order Number</label>
	              <input
	                type="text"
	                placeholder="19000"
	                value={orderId}
	                onChange={(e) =>
	                  setOrderId(e.target.value.replace(/\D/g, ""))
	                }
	              />
	            </div>
	
	            <div className="form-group">
	              <label>Customer Name</label>
              <input
                type="text"
                placeholder="Enter Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="9876543210"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setPhoneNumber(value);
                }}
              />
            </div>

            <div className="form-group">
              <label>Dress Type</label>
              <select
                value={dressType}
                onChange={(e) => setDressType(e.target.value)}
              >
                {dressTypes.map((dress) => (
                  <option key={dress}>{dress}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Delivery Date (Optional)</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) =>
                  setDeliveryDate(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Total Amount</label>
              <input
                type="number"
                value={totalAmount}
                placeholder="Enter Total Amount"
                onChange={(e) =>
                  setTotalAmount(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Advance Amount</label>
              <input
                type="number"
                value={advance}
                placeholder="Enter Advance Amount"
                onChange={(e) =>
                  setAdvance(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Balance Amount</label>
              <input
                value={balance}
                readOnly
              />
            </div>

            <div className="form-group remarks-field">
              <label>Remarks</label>
              <textarea
                rows="4"
                value={remarks}
                placeholder="Remarks..."
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
              />
            </div>

            <div className="buttons form-actions">

              <button onClick={handleSave} disabled={!orderId}>
                Save Order
              </button>

              <button
                className="clear-btn"
                onClick={handleClear}
              >
                Clear
              </button>

            </div>

          </div>

          {/* Right Side */}

          <div className="capacity-panel">

            <h2>Capacity Status</h2>

            <div className="capacity-item">
              <span>Maximum</span>
              <strong>{capacityStatus.maximum}</strong>
            </div>

            <div className="capacity-item">
              <span>Booked</span>
              <strong>{capacityStatus.booked}</strong>
            </div>

            <div className="capacity-item">
              <span>Remaining</span>
              <strong>{capacityStatus.remaining}</strong>
            </div>

            <div className="capacity-status">
              {capacityStatus.isFull
                ? "🔴 Full"
                : "🟢 Available"}
            </div>

          </div>

        </div>

      </div>
    </Layout>
  );

}

export default NewOrder;
