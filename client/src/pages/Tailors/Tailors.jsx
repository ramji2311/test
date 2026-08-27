import { useEffect, useMemo, useState } from "react";
import "./Tailors.css";
import api from "../../services/api";

function Tailors() {
  // Tailor data + dress-wise rates
  const defaultTailors = [
    {
      id: 1,
      name: "durai",
      phone: "8363773839",
      status: "ACTIVE",
      rates: [],
    },
    {
      id: 2,
      name: "Varadharajan",
      phone: "8877878678",
      status: "ACTIVE",
      rates: [],
    },
    {
      id: 3,
      name: "thangamani",
      phone: "6464637378",
      status: "ACTIVE",
      rates: [],
    },
    {
      id: 4,
      name: "devan",
      phone: "3633217762",
      status: "ACTIVE",
      rates: [],
    },
    {
      id: 5,
      name: "RAMU",
      phone: "9597263619",
      status: "ACTIVE",
      rates: [],
    },
  ];

  const [tailors, setTailors] = useState(() => {
    const saved = localStorage.getItem("miara-tailors");

    if (!saved) {
      return defaultTailors;
    }

    try {
      const parsed = JSON.parse(saved);

      return parsed.map((tailor) => ({
        ...tailor,
        rates: Array.isArray(tailor.rates)
          ? tailor.rates
          : [],
      }));
    } catch {
      return defaultTailors;
    }
  });

  // Assigned work
  const [assignments, setAssignments] = useState(() => {
    const savedAssignments = localStorage.getItem(
      "miara-tailor-assignments"
    );

    return savedAssignments
      ? JSON.parse(savedAssignments)
      : [];
  });

  // Modal
  const [showModal, setShowModal] = useState(false);

  const [orders, setOrders] = useState([]);

  const [orderSearch, setOrderSearch] = useState("");

  const [loadingOrders, setLoadingOrders] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Selected tailor
  const [selectedTailor, setSelectedTailor] = useState(null);

  // Add / Edit tailor modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [isAddingTailor, setIsAddingTailor] = useState(false);

  const [editTailor, setEditTailor] = useState({
    id: null,
    name: "",
    phone: "",
    status: "ACTIVE",
    rates: [],
  });

  // Form
  const [formData, setFormData] = useState({
    orderNumber: "",
    dress: "",
    bookingDate: "",
    dueDate: "",
  });

  // Save assignments whenever they change
  useEffect(() => {
    localStorage.setItem(
      "miara-tailor-assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(
      "miara-tailors",
      JSON.stringify(tailors)
    );
  }, [tailors]);

  // Load existing orders from the ERP
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);

        const response = await api.get("/orders");

        setOrders(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        alert("Failed to load existing orders.");
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  // Search results for existing orders
  const filteredOrders = useMemo(() => {
    const search = orderSearch
      .trim()
      .toLowerCase();

    if (!search) {
      return [];
    }

    return orders
      .filter((order) => {
        const orderNumber =
          String(order.orderId || "").toLowerCase();

        const customerName =
          String(order.customerName || "").toLowerCase();

        const dressType =
          String(order.dressType || "").toLowerCase();

        return (
          orderNumber.includes(search) ||
          customerName.includes(search) ||
          dressType.includes(search)
        );
      })
      .filter((order) => {
        // Don't show an order already assigned
        // to the currently selected tailor.
        return !assignments.some(
          (assignment) =>
            assignment.tailorId === selectedTailor?.id &&
            assignment.orderId === order._id
        );
      });
  }, [
    orderSearch,
    orders,
    assignments,
    selectedTailor,
  ]);

  // Open add tailor modal
  const openAddModal = () => {
    setIsAddingTailor(true);

    setEditTailor({
      id: null,
      name: "",
      phone: "",
      status: "ACTIVE",
      rates: [],
    });

    setShowEditModal(true);
  };

  // Open edit tailor modal
  const openEditModal = (tailor) => {
    setIsAddingTailor(false);

    setEditTailor({
      id: tailor.id,
      name: tailor.name,
      phone: String(tailor.phone || "").replace(/\D/g, "").slice(0, 10),
      status: tailor.status,
      rates: Array.isArray(tailor.rates)
        ? tailor.rates.map((item) => ({
            id: item.id || Date.now() + Math.random(),
            dress: item.dress || "",
            rate: item.rate ?? "",
          }))
        : [],
    });

    setShowEditModal(true);
  };

  // Delete tailor
  const handleDeleteTailor = (tailorId) => {
    const tailor = tailors.find(
      (item) => item.id === tailorId
    );

    if (!tailor) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${tailor.name}"?\n\nThis will remove the tailor from the tailor list. Existing assigned work will be kept.`
    );

    if (!confirmed) {
      return;
    }

    setTailors((previous) =>
      previous.filter(
        (item) => item.id !== tailorId
      )
    );
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setIsAddingTailor(false);

    setEditTailor({
      id: null,
      name: "",
      phone: "",
      status: "ACTIVE",
      rates: [],
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);

      setEditTailor((previous) => ({
        ...previous,
        phone: numbersOnly,
      }));

      return;
    }

    setEditTailor((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const addRateRow = () => {
    setEditTailor((previous) => ({
      ...previous,
      rates: [
        ...previous.rates,
        {
          id: Date.now() + Math.random(),
          dress: "",
          rate: "",
        },
      ],
    }));
  };

  const updateRateRow = (index, field, value) => {
    setEditTailor((previous) => ({
      ...previous,
      rates: previous.rates.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  const removeRateRow = (index) => {
    setEditTailor((previous) => ({
      ...previous,
      rates: previous.rates.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  // Save / add tailor
  const handleSaveTailor = (e) => {
    e.preventDefault();

    const name = editTailor.name.trim();
    const phone = editTailor.phone.trim();

    if (!name) {
      alert("Please enter tailor name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must contain exactly 10 digits.");
      return;
    }

    const rates = editTailor.rates
      .map((item) => ({
        dress: String(item.dress || "").trim(),
        rate: Number(item.rate),
      }))
      .filter(
        (item) =>
          item.dress &&
          Number.isFinite(item.rate) &&
          item.rate >= 0
      );

    if (isAddingTailor) {
      const newTailor = {
        id: Date.now(),
        name,
        phone,
        status: editTailor.status,
        rates,
      };

      setTailors((previous) => [
        ...previous,
        newTailor,
      ]);

      closeEditModal();
      return;
    }

    setTailors((previous) =>
      previous.map((tailor) =>
        tailor.id === editTailor.id
          ? {
              ...tailor,
              name,
              phone,
              status: editTailor.status,
              rates,
            }
          : tailor
      )
    );

    closeEditModal();
  };

  // Open assign modal
  const openAssignModal = (tailor) => {
    setSelectedTailor(tailor);

    setOrderSearch("");

    setSelectedOrder(null);

    setFormData({
      orderNumber: "",
      dress: "",
      bookingDate: "",
      dueDate: "",
    });

    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedTailor(null);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Format date for <input type="date">
  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Select an order from search results
  const selectOrder = (order) => {
    setSelectedOrder(order);

    setOrderSearch(
      `${order.orderId} - ${order.customerName}`
    );

    setFormData({
      orderNumber: order.orderId || "",
      dress: order.dressType || "",
      bookingDate: formatDateForInput(
        order.bookingDate
      ),
      dueDate: formatDateForInput(
        order.dueDate
      ),
    });
  };

  // Get the rate for a dress from the current tailor settings.
  const getTailorRate = (tailor, dress) => {
    const rateItem = (tailor?.rates || []).find(
      (item) =>
        String(item.dress || "").trim().toLowerCase() ===
        String(dress || "").trim().toLowerCase()
    );

    return Number(rateItem?.rate || 0);
  };

  // Assign work
  const handleAssignWork = (e) => {
    e.preventDefault();

    if (!selectedOrder) {
      alert("Please search and select an order.");
      return;
    }

    const alreadyAssigned = assignments.some(
      (assignment) =>
        assignment.tailorId === selectedTailor.id &&
        assignment.orderId === selectedOrder._id
    );

    if (alreadyAssigned) {
      alert(
        "This order is already assigned to this tailor."
      );
      return;
    }

    const rate = getTailorRate(
      selectedTailor,
      selectedOrder.dressType
    );

    if (rate <= 0) {
      alert(
        `No rate is set for "${selectedOrder.dressType}" for ${selectedTailor.name}. Please open Edit and add the dress/work rate first.`
      );
      return;
    }

    const newAssignment = {
      id: Date.now(),

      orderId: selectedOrder._id,

      orderNumber: selectedOrder.orderId,

      customerName: selectedOrder.customerName,

      dress: selectedOrder.dressType,

      quantity: selectedOrder.quantity,

      tailorId: selectedTailor.id,

      tailorName: selectedTailor.name,

      rate,

      bookingDate: formatDateForInput(
        selectedOrder.bookingDate
      ),

      dueDate: formatDateForInput(
        selectedOrder.dueDate
      ),

      status: "Assigned",
    };

    setAssignments((previous) => [
      ...previous,
      newAssignment,
    ]);

    closeModal();
  };

  // Remove assignment
  const handleRemoveAssignment = (id) => {
    const confirmDelete = window.confirm(
      "Remove this assignment?"
    );

    if (!confirmDelete) return;

    setAssignments((previous) =>
      previous.filter((assignment) => assignment.id !== id)
    );
  };

  // Mark assigned work as completed
  const handleCompleteAssignment = (id) => {
    setAssignments((previous) =>
      previous.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              rate:
                Number(assignment.rate) > 0
                  ? Number(assignment.rate)
                  : getTailorRate(
                      tailors.find(
                        (tailor) =>
                          tailor.id === assignment.tailorId
                      ),
                      assignment.dress
                    ),
              status: "Completed",
              completedDate: new Date()
                .toISOString()
                .split("T")[0],
            }
          : assignment
      )
    );
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const [year, month, day] = date.split("-");

    return `${day}-${month}-${year}`;
  };

  return (
    <div className="tailors-page">

      {/* PAGE HEADER */}
      <div className="tailors-header">

        <div>
          <h1>Tailors & Assignments</h1>

          <p>
            Manage tailors and assign stitching work.
          </p>
        </div>

        <button
          type="button"
          className="add-tailor-button"
          onClick={openAddModal}
        >
          + Add Tailor
        </button>

      </div>


      {/* TAILOR CARDS */}
      <div className="tailors-grid">

        {tailors.map((tailor) => (
          <div
            className="tailor-card"
            key={tailor.id}
          >

            <div className="tailor-card-top">

              <div>
                <h2>{tailor.name}</h2>

                <span className="active-badge">
                  {tailor.status}
                </span>
              </div>

              <div className="tailor-card-buttons">

                <button
                  type="button"
                  className="edit-tailor-button"
                  onClick={() => openEditModal(tailor)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="delete-tailor-button"
                  onClick={() =>
                    handleDeleteTailor(tailor.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>


            <div className="tailor-phone">

              <strong>Phone:</strong>{" "}
              {tailor.phone}

            </div>


            {/* ASSIGN BUTTON */}
            <button
              className="assign-work-button"
              onClick={() =>
                openAssignModal(tailor)
              }
            >
              + Assign Work
            </button>

          </div>
        ))}

      </div>


      {/* ASSIGNED WORK */}
      <div className="assigned-work-section">

        <div className="assigned-work-header">

          <div>
            <h2>Assigned Work</h2>

            <p>
              View all stitching work assigned to
              your tailors.
            </p>
          </div>

          <div className="assignment-count">
            {assignments.length}{" "}
            {assignments.length === 1
              ? "Assignment"
              : "Assignments"}
          </div>

        </div>


        {/* TABLE */}
        {assignments.length === 0 ? (

          <div className="empty-assignment">

            <h3>No work assigned yet</h3>

            <p>
              Click "Assign Work" on a tailor
              to assign an order.
            </p>

          </div>

        ) : (

          <div className="assignment-table-wrapper">

            <table className="assignment-table">

              <thead>
                <tr>
                  <th>Tailor</th>
                  <th>Order Number</th>
                  <th>Dress</th>
                  <th>Booking Date</th>
                  <th>Due Date</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {assignments.map((assignment) => (

                  <tr key={assignment.id}>

                    <td>
                      <strong>
                        {assignment.tailorName}
                      </strong>
                    </td>

                    <td>
                      <span className="order-number">
                        {assignment.orderNumber}
                      </span>
                    </td>

                    <td>
                      {assignment.dress}
                    </td>

                    <td>
                      {formatDate(
                        assignment.bookingDate
                      )}
                    </td>

                    <td>
                      {formatDate(
                        assignment.dueDate
                      )}
                    </td>

                    <td>
                      ₹
                      {(
                        Number(assignment.rate) > 0
                          ? Number(assignment.rate)
                          : getTailorRate(
                              tailors.find(
                                (tailor) =>
                                  tailor.id === assignment.tailorId
                              ),
                              assignment.dress
                            )
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className="assignment-status">
                        {assignment.status}
                      </span>
                    </td>

                    <td>

                      {assignment.status !== "Completed" && (
                        <button
                          className="complete-assignment-button"
                          onClick={() =>
                            handleCompleteAssignment(
                              assignment.id
                            )
                          }
                        >
                          Mark Completed
                        </button>
                      )}

                      <button
                        className="remove-assignment-button"
                        onClick={() =>
                          handleRemoveAssignment(
                            assignment.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ASSIGN WORK MODAL */}
      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="assign-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>Assign Work</h2>

                <p>
                  Assign stitching work to{" "}
                  <strong>
                    {selectedTailor?.name}
                  </strong>
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAssignWork}
            >

              {/* SEARCH EXISTING ORDER */}

              <div className="form-group">

                <label>
                  Search Order / Customer
                </label>

                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => {
                    setOrderSearch(e.target.value);
                    setSelectedOrder(null);
                  }}
                  placeholder="Search order number, customer name or dress"
                  autoFocus
                />

              </div>


              {/* LOADING */}

              {loadingOrders && (
                <div className="order-search-message">
                  Loading existing orders...
                </div>
              )}


              {/* SEARCH RESULTS */}

              {!selectedOrder &&
                orderSearch.trim() &&
                !loadingOrders && (

                  <div className="order-search-results">

                    {filteredOrders.length === 0 ? (

                      <div className="no-order-results">
                        No matching orders found.
                      </div>

                    ) : (

                      filteredOrders.map((order) => (

                        <button
                          type="button"
                          key={order._id}
                          className="order-result-card"
                          onClick={() =>
                            selectOrder(order)
                          }
                        >

                          <div className="order-result-top">

                            <strong>
                              {order.orderId}
                            </strong>

                            <span>
                              {order.status}
                            </span>

                          </div>

                          <div className="order-result-customer">

                            Customer:{" "}
                            <strong>
                              {order.customerName}
                            </strong>

                          </div>

                          <div className="order-result-dress">

                            Dress:{" "}
                            <strong>
                              {order.dressType}
                            </strong>

                          </div>

                          <div className="order-result-dates">

                            Booking:{" "}
                            {formatDisplayDate(
                              order.bookingDate
                            )}

                            {"  •  "}

                            Due:{" "}
                            {formatDisplayDate(
                              order.dueDate
                            )}

                          </div>

                        </button>

                      ))

                    )}

                  </div>

                )}


              {/* SELECTED ORDER */}

              {selectedOrder && (

                <div className="selected-order">

                  <div className="selected-order-header">

                    <div>
                      <h3>
                        Selected Order
                      </h3>

                      <p>
                        This information comes from
                        the existing ERP order.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="change-order-button"
                      onClick={() => {
                        setSelectedOrder(null);
                        setOrderSearch("");
                      }}
                    >
                      Change
                    </button>

                  </div>


                  <div className="selected-order-grid">

                    <div>
                      <label>
                        Order Number
                      </label>

                      <div className="readonly-value">
                        {selectedOrder.orderId}
                      </div>
                    </div>


                    <div>
                      <label>
                        Customer
                      </label>

                      <div className="readonly-value">
                        {selectedOrder.customerName}
                      </div>
                    </div>


                    <div>
                      <label>
                        Dress
                      </label>

                      <div className="readonly-value">
                        {selectedOrder.dressType}
                      </div>
                    </div>


                    <div>
                      <label>
                        Quantity
                      </label>

                      <div className="readonly-value">
                        {selectedOrder.quantity}
                      </div>
                    </div>


                    <div>
                      <label>
                        Booking Date
                      </label>

                      <div className="readonly-value">
                        {formatDisplayDate(
                          selectedOrder.bookingDate
                        )}
                      </div>
                    </div>


                    <div>
                      <label>
                        Due Date
                      </label>

                      <div className="readonly-value due-date-value">
                        {formatDisplayDate(
                          selectedOrder.dueDate
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              )}


              {/* BUTTONS */}
              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-assign-button"
                  disabled={!selectedOrder}
                >
                  Assign Work
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* EDIT TAILOR MODAL */}
      {showEditModal && (

        <div
          className="modal-overlay"
          onClick={closeEditModal}
        >
          <div
            className="edit-tailor-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>
                  {isAddingTailor
                    ? "Add Tailor"
                    : "Edit Tailor"}
                </h2>

                <p>
                  {isAddingTailor
                    ? "Add a new tailor to your team"
                    : "Update tailor details"}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeEditModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSaveTailor}>

              {/* NAME */}

              <div className="form-group">

                <label>Tailor Name</label>

                <input
                  type="text"
                  name="name"
                  value={editTailor.name}
                  onChange={handleEditChange}
                  placeholder="Enter tailor name"
                  required
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={editTailor.phone}
                  onChange={handleEditChange}
                  placeholder="10 digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />

                <small>
                  {editTailor.phone.length}/10 digits
                </small>

              </div>

              {/* DRESS / WORK RATES */}

              <div className="rates-section">

                <div className="rates-section-header">
                  <div>
                    <h3>Dress / Work Rates</h3>
                    <p>
                      Add any dress/work and set the rate per piece.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="add-rate-button"
                    onClick={addRateRow}
                  >
                    + Add Dress / Work
                  </button>
                </div>

                {editTailor.rates.length === 0 ? (
                  <div className="no-rates-message">
                    No rates added yet. Click "+ Add Dress / Work".
                  </div>
                ) : (
                  <div className="rates-list">

                    <div className="rates-list-heading">
                      <span>Dress / Work</span>
                      <span>Rate / Piece</span>
                      <span></span>
                    </div>

                    {editTailor.rates.map((item, index) => (
                      <div className="rate-row" key={item.id || index}>

                        <input
                          type="text"
                          value={item.dress}
                          placeholder="Example: Blouse"
                          onChange={(e) =>
                            updateRateRow(
                              index,
                              "dress",
                              e.target.value
                            )
                          }
                        />

                        <div className="rate-input">
                          <span>₹</span>
                          <input
                            type="number"
                            min="0"
                            value={item.rate}
                            placeholder="150"
                            onChange={(e) =>
                              updateRateRow(
                                index,
                                "rate",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <button
                          type="button"
                          className="remove-rate-button"
                          onClick={() =>
                            removeRateRow(index)
                          }
                        >
                          ×
                        </button>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* STATUS */}

              <div className="form-group">

                <label>Status</label>

                <select
                  name="status"
                  value={editTailor.status}
                  onChange={handleEditChange}
                >
                  <option value="ACTIVE">
                    ACTIVE
                  </option>

                  <option value="INACTIVE">
                    INACTIVE
                  </option>
                </select>

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-assign-button"
                >
                  {isAddingTailor
                    ? "Add Tailor"
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Tailors;