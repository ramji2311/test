import {
  useEffect,
  useState,
} from "react";

import Tailors from "../Tailors/Tailors";
import api from "../../services/api";

import "./Employees.css";

function Employees() {
  const [activeSection, setActiveSection] =
    useState(null);

  /* =========================
     EMPLOYEES
  ========================= */

  const sanitizeEmployeeList = (list) =>
    Array.isArray(list)
      ? list.map((employee) => ({
          ...employee,
          rates: Array.isArray(employee.rates)
            ? employee.rates
            : [],
        }))
      : [];

  const [employees, setEmployees] = useState(() => {
    try {
      const saved =
        localStorage.getItem("miara-employees");

      if (saved) {
        const parsed = JSON.parse(saved);

        return {
          "cutting-master":
            sanitizeEmployeeList(
              parsed["cutting-master"]
            ),

          designers:
            sanitizeEmployeeList(
              parsed.designers
            ),

          embroidery:
            sanitizeEmployeeList(
              parsed.embroidery
            ),
        };
      }
    } catch (error) {
      console.error(
        "Failed to load employees:",
        error
      );
    }

    return {
      "cutting-master": [],
      designers: [],
      embroidery: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(
      "miara-employees",
      JSON.stringify(employees)
    );
  }, [employees]);

  /* =========================
     ADD / EDIT EMPLOYEE
  ========================= */

  const [showEmployeeForm, setShowEmployeeForm] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [employeeForm, setEmployeeForm] =
    useState({
      name: "",
      phone: "",
      rates: [],
    });

  /* =========================
     ASSIGNMENT
  ========================= */

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [assignments, setAssignments] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "miara-employee-assignments"
        );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const [orders, setOrders] =
    useState([]);

  const [loadingOrders, setLoadingOrders] =
    useState(false);

  const [orderSearch, setOrderSearch] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  /* =========================
     SAVE ASSIGNMENTS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "miara-employee-assignments",
      JSON.stringify(assignments)
    );
  }, [assignments]);

  /* =========================
     LOAD ORDERS
  ========================= */

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoadingOrders(true);

        const response =
          await api.get("/orders");

        setOrders(
          response.data?.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, []);

  /* =========================
     EMPLOYEE TYPES
  ========================= */

  const employeeTypes = [
    {
      id: "cutting-master",
      title: "Cutting Master",
      subtitle:
        "Manage cutting workers",
      addText:
        "Add Cutting Master",
      designation:
        "Cutting Master",
    },

    {
      id: "tailors",
      title: "Tailors",
      subtitle:
        "Manage stitching workers",
      designation:
        "Tailor",
    },

    {
      id: "designers",
      title:
        "Fashion Designers",
      subtitle:
        "Manage fashion designers",
      addText:
        "Add Designer",
      designation:
        "Fashion Designer",
    },

    {
      id: "embroidery",
      title: "Embroidery",
      subtitle:
        "Manage embroidery workers",
      addText:
        "Add Embroidery",
      designation:
        "Embroidery",
    },
  ];

  /* =========================
     ADD EMPLOYEE
  ========================= */

  const openAddEmployee = () => {
    setEditingEmployee(null);

    setEmployeeForm({
      name: "",
      phone: "",
      rates: [],
    });

    setShowEmployeeForm(true);
  };

  /* =========================
     EDIT EMPLOYEE
  ========================= */

  const openEditEmployee = (
    employee
  ) => {
    setEditingEmployee(employee);

    setEmployeeForm({
      name: employee.name || "",
      phone: employee.phone || "",

      rates: Array.isArray(
        employee.rates
      )
        ? employee.rates.map(
            (item) => ({
              id:
                item.id ||
                Date.now() +
                  Math.random(),

              dress:
                item.dress || "",

              rate:
                item.rate ?? "",
            })
          )
        : [],
    });

    setShowEmployeeForm(true);
  };

  /* =========================
     CLOSE EMPLOYEE MODAL
  ========================= */

  const closeEmployeeForm = () => {
    setShowEmployeeForm(false);

    setEditingEmployee(null);

    setEmployeeForm({
      name: "",
      phone: "",
      rates: [],
    });
  };

  /* =========================
     INPUT
  ========================= */

  const handleEmployeeInput = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    if (name === "phone") {
      const phone =
        value
          .replace(/\D/g, "")
          .slice(0, 10);

      setEmployeeForm(
        (previous) => ({
          ...previous,
          phone,
        })
      );

      return;
    }

    setEmployeeForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =========================
     RATE ROWS
  ========================= */

  const addEmployeeRateRow = () => {
    setEmployeeForm(
      (previous) => ({
        ...previous,

        rates: [
          ...previous.rates,

          {
            id:
              Date.now() +
              Math.random(),

            dress: "",

            rate: "",
          },
        ],
      })
    );
  };

  const updateEmployeeRateRow = (
    index,
    field,
    value
  ) => {
    setEmployeeForm(
      (previous) => ({
        ...previous,

        rates:
          previous.rates.map(
            (
              item,
              itemIndex
            ) =>
              itemIndex === index
                ? {
                    ...item,
                    [field]:
                      value,
                  }
                : item
          ),
      })
    );
  };

  const removeEmployeeRateRow = (
    index
  ) => {
    setEmployeeForm(
      (previous) => ({
        ...previous,

        rates:
          previous.rates.filter(
            (
              _,
              itemIndex
            ) =>
              itemIndex !== index
          ),
      })
    );
  };

  /* =========================
     ADD / EDIT SUBMIT
  ========================= */

  const handleEmployeeSubmit = (
    event
  ) => {
    event.preventDefault();

    const name =
      employeeForm.name.trim();

    const phone =
      employeeForm.phone.trim();

    if (!name) {
      alert(
        "Please enter name."
      );
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        phone
      )
    ) {
      alert(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    const section =
      activeSection;

    if (
      !section ||
      section === "tailors"
    ) {
      return;
    }

    const currentType =
      employeeTypes.find(
        (type) =>
          type.id === section
      );

    const rates =
      employeeForm.rates
        .map((item) => ({
          dress: String(
            item.dress || ""
          ).trim(),

          rate: Number(
            item.rate
          ),
        }))
        .filter(
          (item) =>
            item.dress &&
            Number.isFinite(
              item.rate
            ) &&
            item.rate >= 0
        );

    /* EDIT */

    if (editingEmployee) {
      setEmployees(
        (previous) => ({
          ...previous,

          [section]:
            previous[
              section
            ].map(
              (employee) =>
                employee.id ===
                editingEmployee.id
                  ? {
                      ...employee,

                      name,

                      phone,

                      rates,

                      designation:
                        employee.designation ||
                        currentType?.designation ||
                        "",
                    }
                  : employee
            ),
        })
      );

      closeEmployeeForm();

      return;
    }

    /* ADD */

    const newEmployee = {
      id: Date.now(),

      name,

      phone,

      isActive: true,

      rates,

      designation:
        currentType?.designation ||
        "",
    };

    setEmployees(
      (previous) => ({
        ...previous,

        [section]: [
          ...previous[
            section
          ],

          newEmployee,
        ],
      })
    );

    closeEmployeeForm();
  };

  /* =========================
     ACTIVE / INACTIVE
  ========================= */

  const toggleEmployeeStatus = (
    employeeId
  ) => {
    const section =
      activeSection;

    setEmployees(
      (previous) => ({
        ...previous,

        [section]:
          previous[
            section
          ].map(
            (employee) =>
              employee.id ===
              employeeId
                ? {
                    ...employee,

                    isActive:
                      !employee.isActive,
                  }
                : employee
          ),
      })
    );
  };

  /* =========================
     REMOVE EMPLOYEE
  ========================= */

  const removeEmployee = (
    employeeId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to remove this employee?"
      );

    if (!confirmed) {
      return;
    }

    const section =
      activeSection;

    setEmployees(
      (previous) => ({
        ...previous,

        [section]:
          previous[
            section
          ].filter(
            (employee) =>
              employee.id !==
              employeeId
          ),
      })
    );
  };

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    const value =
      String(date).split(
        "T"
      )[0];

    const parts =
      value.split("-");

    if (
      parts.length !== 3
    ) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const formatDateForInput = (
    date
  ) => {
    if (!date) {
      return "";
    }

    return String(date)
      .split("T")[0];
  };

  /* =========================
     OPEN ASSIGN MODAL
  ========================= */

  const openAssignModal = (
    employee
  ) => {
    setSelectedEmployee(
      employee
    );

    setOrderSearch("");

    setSelectedOrder(null);

    setShowAssignModal(true);
  };

  /* =========================
     CLOSE ASSIGN MODAL
  ========================= */

  const closeAssignModal = () => {
    setShowAssignModal(false);

    setSelectedEmployee(null);

    setOrderSearch("");

    setSelectedOrder(null);
  };

  /* =========================
     SEARCH ORDERS
  ========================= */

  const filteredOrders =
    orders.filter(
      (order) => {
        const search =
          orderSearch
            .trim()
            .toLowerCase();

        if (!search) {
          return false;
        }

        return (
          String(
            order.orderId || ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            order.customerName ||
              ""
          )
            .toLowerCase()
            .includes(search) ||

          String(
            order.dressType ||
              ""
          )
            .toLowerCase()
            .includes(search)
        );
      }
    );

  /* =========================
     SELECT ORDER
  ========================= */

  const selectOrder = (
    order
  ) => {
    setSelectedOrder(
      order
    );
  };

  /* =========================
     GET RATE
  ========================= */

  const getEmployeeRate = (
    employee,
    dress
  ) => {
    const rateItem =
      (
        employee?.rates ||
        []
      ).find(
        (item) =>
          String(
            item.dress || ""
          )
            .trim()
            .toLowerCase() ===
          String(
            dress || ""
          )
            .trim()
            .toLowerCase()
      );

    return Number(
      rateItem?.rate || 0
    );
  };

  /* =========================
     ASSIGN WORK
  ========================= */

  const handleAssignWork = (
    event
  ) => {
    event.preventDefault();

    if (!selectedOrder) {
      alert(
        "Please search and select an order."
      );
      return;
    }

    if (!selectedEmployee) {
      return;
    }

    const alreadyAssigned =
      assignments.some(
        (assignment) =>
          assignment.employeeId ===
            selectedEmployee.id &&
          assignment.orderId ===
            selectedOrder._id
      );

    if (alreadyAssigned) {
      alert(
        "This order is already assigned to this employee."
      );
      return;
    }

    const rate =
      getEmployeeRate(
        selectedEmployee,
        selectedOrder.dressType
      );

    if (rate <= 0) {
      alert(
        `No rate is set for "${selectedOrder.dressType}" for ${selectedEmployee.name}. Please open Edit and add the dress/work rate first.`
      );
      return;
    }

    const newAssignment = {
      id: Date.now(),

      employeeId:
        selectedEmployee.id,

      employeeName:
        selectedEmployee.name,

      designation:
        selectedEmployee.designation,

      employeeType:
        activeSection,

      orderId:
        selectedOrder._id,

      orderNumber:
        selectedOrder.orderId,

      customerName:
        selectedOrder.customerName,

      dress:
        selectedOrder.dressType,

      quantity:
        selectedOrder.quantity ||
        1,

      rate,

      bookingDate:
        formatDateForInput(
          selectedOrder.bookingDate
        ),

      dueDate:
        formatDateForInput(
          selectedOrder.dueDate
        ),

      status:
        "Assigned",
    };

    setAssignments(
      (previous) => [
        ...previous,

        newAssignment,
      ]
    );

    closeAssignModal();
  };

  /* =========================
     COMPLETE ASSIGNMENT
  ========================= */

  const handleCompleteAssignment = (
    assignmentId
  ) => {
    setAssignments(
      (previous) =>
        previous.map(
          (assignment) =>
            assignment.id ===
            assignmentId
              ? {
                  ...assignment,

                  rate:
                    Number(
                      assignment.rate
                    ) > 0
                      ? Number(
                          assignment.rate
                        )
                      : getEmployeeRate(
                          (
                            employees[
                              assignment
                                .employeeType
                            ] ||
                            []
                          ).find(
                            (employee) =>
                              employee.id ===
                              assignment.employeeId
                          ),

                          assignment.dress
                        ),

                  status:
                    "Completed",

                  completedDate:
                    new Date()
                      .toISOString()
                      .split(
                        "T"
                      )[0],
                }
              : assignment
        )
    );
  };

  /* =========================
     REMOVE ASSIGNMENT
  ========================= */

  const handleRemoveAssignment = (
    assignmentId
  ) => {
    const confirmed =
      window.confirm(
        "Remove this assignment?"
      );

    if (!confirmed) {
      return;
    }

    setAssignments(
      (previous) =>
        previous.filter(
          (assignment) =>
            assignment.id !==
            assignmentId
        )
    );
  };

  /* =========================
     CURRENT EMPLOYEES
  ========================= */

  const currentEmployees =
    activeSection &&
    activeSection !==
      "tailors"
      ? employees[
          activeSection
        ] || []
      : [];

  /* =========================
     SHOULD SHOW ASSIGN
  ========================= */

  const canAssign =
    activeSection ===
      "cutting-master" ||
    activeSection ===
      "embroidery";

  /* =========================
     SECTION
  ========================= */

  const renderEmployeeSection =
    () => {

      /* TAILORS */

      if (
        activeSection ===
        "tailors"
      ) {
        return <Tailors />;
      }

      /* CUTTING / DESIGNER / EMBROIDERY */

      if (
        activeSection ===
          "cutting-master" ||
        activeSection ===
          "designers" ||
        activeSection ===
          "embroidery"
      ) {
        const currentType =
          employeeTypes.find(
            (type) =>
              type.id ===
              activeSection
          );

        return (
          <div className="employee-section-card">

            <div className="employee-section-header">

              <div>

                <h2>
                  {
                    currentType.title
                  }
                </h2>

                <p>
                  {
                    activeSection ===
                    "cutting-master"
                      ? "Manage cutting masters and cutting piece work."
                      : activeSection ===
                        "designers"
                      ? "Manage fashion designers."
                      : "Manage embroidery workers."
                  }
                </p>

              </div>

              <button
                type="button"
                className="add-employee-button"
                onClick={
                  openAddEmployee
                }
              >
                +{" "}
                {
                  currentType.addText
                }
              </button>

            </div>

            {currentEmployees.length ===
            0 ? (

              <div className="empty-employee-section">

                <h3>
                  No{" "}
                  {
                    currentType.title.toLowerCase()
                  }{" "}
                  added yet
                </h3>

                <p>
                  Click the button above
                  to add one.
                </p>

              </div>

            ) : (

              <div className="production-employee-grid">

                {currentEmployees.map(
                  (employee) => (

                    <div
                      className="production-employee-card"
                      key={
                        employee.id
                      }
                    >

                      <div className="production-employee-header">

                        <div>

                          <h3>
                            {
                              employee.name
                            }
                          </h3>

                          <span
                            className={
                              employee.isActive
                                ? "status active"
                                : "status inactive"
                            }
                          >
                            {
                              employee.isActive
                                ? "ACTIVE"
                                : "INACTIVE"
                            }
                          </span>

                        </div>

                        <button
                          type="button"
                          className="edit-employee-button"
                          onClick={() =>
                            openEditEmployee(
                              employee
                            )
                          }
                        >
                          Edit
                        </button>

                      </div>

                      <p className="employee-phone">

                        <strong>
                          Phone:
                        </strong>{" "}

                        {
                          employee.phone
                        }

                      </p>

                      <p className="employee-rate-count">

                        <strong>
                          Rates set:
                        </strong>{" "}

                        {
                          (
                            employee.rates ||
                            []
                          ).length
                        }

                      </p>

                      <div className="employee-card-actions">

                        <button
                          type="button"
                          className={
                            employee.isActive
                              ? "employee-status-button active-action"
                              : "employee-status-button inactive-action"
                          }
                          onClick={() =>
                            toggleEmployeeStatus(
                              employee.id
                            )
                          }
                        >
                          {
                            employee.isActive
                              ? "Inactive"
                              : "Active"
                          }
                        </button>

                        <button
                          type="button"
                          className="remove-employee-button"
                          onClick={() =>
                            removeEmployee(
                              employee.id
                            )
                          }
                        >
                          Remove
                        </button>

                        {canAssign && (
                          <button
                            type="button"
                            className="employee-assign-work-button"
                            onClick={() =>
                              openAssignModal(
                                employee
                              )
                            }
                          >
                            + Assign Work
                          </button>
                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        );
      }

      return (
        <div className="employee-placeholder">

          <h2>
            Select an employee category
          </h2>

          <p>
            Choose a category above to
            manage employees.
          </p>

        </div>
      );
    };

  return (
    <div className="employees-page">

      {/* PAGE HEADER */}

      <div className="employees-header">

        <div>

          <h1>
            Employees
          </h1>

          <p>
            Manage your production
            employees.
          </p>

        </div>

      </div>

      {/* CATEGORY BUTTONS */}

      <div className="employee-category-grid">

        {employeeTypes.map(
          (employee) => (

            <button
              type="button"
              key={
                employee.id
              }
              className={
                activeSection ===
                employee.id
                  ? "employee-category active"
                  : "employee-category"
              }
              onClick={() =>
                setActiveSection(
                  employee.id
                )
              }
            >

              <span className="employee-category-title">
                {
                  employee.title
                }
              </span>

              <span className="employee-category-subtitle">
                {
                  employee.subtitle
                }
              </span>

            </button>

          )
        )}

      </div>

      {/* SELECTED SECTION */}

      <div className="employees-content">

        {
          renderEmployeeSection()
        }

      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showEmployeeForm && (

        <div
          className="employee-modal-overlay"
          onClick={
            closeEmployeeForm
          }
        >

          <div
            className="employee-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="employee-modal-header">

              <div>

                <h2>

                  {editingEmployee
                    ? "Edit Employee"
                    : `Add ${
                        employeeTypes.find(
                          (type) =>
                            type.id ===
                            activeSection
                        )?.title
                      }`}

                </h2>

                <p>
                  Update employee
                  details.
                </p>

              </div>

              <button
                type="button"
                className="employee-modal-close"
                onClick={
                  closeEmployeeForm
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleEmployeeSubmit
              }
            >

              {/* NAME */}

              <div className="employee-form-group">

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    employeeForm.name
                  }
                  onChange={
                    handleEmployeeInput
                  }
                  placeholder="Enter name"
                  required
                />

              </div>

              {/* PHONE */}

              <div className="employee-form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={
                    employeeForm.phone
                  }
                  onChange={
                    handleEmployeeInput
                  }
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  inputMode="numeric"
                  required
                />

                <small>
                  {
                    employeeForm.phone
                      .length
                  }
                  /10 digits
                </small>

              </div>

              {/* DRESS / WORK RATES */}

              <div className="rates-section">

                <div className="rates-section-header">

                  <div>

                    <h3>
                      Dress / Work Rates
                    </h3>

                    <p>
                      Add any dress/work
                      and set the rate
                      per piece.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="add-rate-button"
                    onClick={
                      addEmployeeRateRow
                    }
                  >
                    + Add Dress / Work
                  </button>

                </div>

                {employeeForm.rates
                  .length ===
                0 ? (

                  <div className="no-rates-message">

                    No rates added yet.
                    Click "+ Add Dress /
                    Work".

                  </div>

                ) : (

                  <div className="rates-list">

                    <div className="rates-list-heading">

                      <span>
                        Dress / Work
                      </span>

                      <span>
                        Rate / Piece
                      </span>

                      <span></span>

                    </div>

                    {employeeForm.rates.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          className="rate-row"
                          key={
                            item.id ||
                            index
                          }
                        >

                          <input
                            type="text"
                            value={
                              item.dress
                            }
                            placeholder="Example: Blouse"
                            onChange={(e) =>
                              updateEmployeeRateRow(
                                index,
                                "dress",
                                e.target.value
                              )
                            }
                          />

                          <div className="rate-input">

                            <span>
                              ₹
                            </span>

                            <input
                              type="number"
                              min="0"
                              value={
                                item.rate
                              }
                              placeholder="150"
                              onChange={(e) =>
                                updateEmployeeRateRow(
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
                              removeEmployeeRateRow(
                                index
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* MODAL ACTIONS */}

              <div className="employee-modal-actions">

                <button
                  type="button"
                  className="employee-cancel-button"
                  onClick={
                    closeEmployeeForm
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="employee-save-button"
                >
                  {editingEmployee
                    ? "Save Changes"
                    : "Add Employee"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          ASSIGN WORK MODAL
      ========================= */}

      {showAssignModal && (

        <div
          className="employee-modal-overlay"
          onClick={
            closeAssignModal
          }
        >

          <div
            className="employee-assign-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="employee-modal-header">

              <div>

                <h2>
                  Assign Work
                </h2>

                <p>
                  Assign work to{" "}
                  <strong>
                    {
                      selectedEmployee?.name
                    }
                  </strong>
                </p>

              </div>

              <button
                type="button"
                className="employee-modal-close"
                onClick={
                  closeAssignModal
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleAssignWork
              }
            >

              {/* SEARCH */}

              <div className="employee-form-group">

                <label>
                  Search Existing Order
                </label>

                <input
                  type="text"
                  value={
                    orderSearch
                  }
                  onChange={(e) => {
                    setOrderSearch(
                      e.target.value
                    );

                    setSelectedOrder(
                      null
                    );
                  }}
                  placeholder="Search order number, customer name or dress"
                  autoFocus
                />

              </div>

              {/* LOADING */}

              {loadingOrders && (

                <div className="employee-order-message">

                  Loading existing
                  orders...

                </div>

              )}

              {/* SEARCH RESULTS */}

              {!selectedOrder &&
                orderSearch.trim() &&
                !loadingOrders && (

                  <div className="employee-order-results">

                    {filteredOrders.length ===
                    0 ? (

                      <div className="employee-no-orders">

                        No matching orders
                        found.

                      </div>

                    ) : (

                      filteredOrders.map(
                        (order) => (

                          <button
                            type="button"
                            key={
                              order._id
                            }
                            className="employee-order-result"
                            onClick={() =>
                              selectOrder(
                                order
                              )
                            }
                          >

                            <div className="employee-order-result-top">

                              <strong>
                                {
                                  order.orderId
                                }
                              </strong>

                              <span>
                                {
                                  order.status
                                }
                              </span>

                            </div>

                            <div>

                              Customer:{" "}

                              <strong>
                                {
                                  order.customerName
                                }
                              </strong>

                            </div>

                            <div>

                              Dress:{" "}

                              <strong>
                                {
                                  order.dressType
                                }
                              </strong>

                            </div>

                            <div className="employee-order-dates">

                              Booking:{" "}

                              {formatDate(
                                order.bookingDate
                              )}

                              {" • "}

                              Due:{" "}

                              {formatDate(
                                order.dueDate
                              )}

                            </div>

                          </button>

                        )
                      )

                    )}

                  </div>

                )}

              {/* SELECTED ORDER */}

              {selectedOrder && (

                <div className="employee-selected-order">

                  <div className="employee-selected-order-header">

                    <div>

                      <h3>
                        Selected Order
                      </h3>

                      <p>
                        Order information
                        from your ERP.
                      </p>

                    </div>

                    <button
                      type="button"
                      className="change-employee-order"
                      onClick={() => {

                        setSelectedOrder(
                          null
                        );

                        setOrderSearch(
                          ""
                        );

                      }}
                    >
                      Change
                    </button>

                  </div>

                  <div className="employee-selected-order-grid">

                    <div>

                      <label>
                        Order Number
                      </label>

                      <strong>
                        {
                          selectedOrder.orderId
                        }
                      </strong>

                    </div>

                    <div>

                      <label>
                        Customer
                      </label>

                      <strong>
                        {
                          selectedOrder.customerName
                        }
                      </strong>

                    </div>

                    <div>

                      <label>
                        Dress
                      </label>

                      <strong>
                        {
                          selectedOrder.dressType
                        }
                      </strong>

                    </div>

                    <div>

                      <label>
                        Quantity
                      </label>

                      <strong>
                        {
                          selectedOrder.quantity ||
                          1
                        }
                      </strong>

                    </div>

                    <div>

                      <label>
                        Booking Date
                      </label>

                      <strong>
                        {formatDate(
                          selectedOrder.bookingDate
                        )}
                      </strong>

                    </div>

                    <div>

                      <label>
                        Due Date
                      </label>

                      <strong>
                        {formatDate(
                          selectedOrder.dueDate
                        )}
                      </strong>

                    </div>

                    <div>

                      <label>
                        Rate
                      </label>

                      <strong>

                        ₹
                        {getEmployeeRate(
                          selectedEmployee,
                          selectedOrder.dressType
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </strong>

                    </div>

                  </div>

                </div>

              )}

              {/* ACTIONS */}

              <div className="employee-modal-actions">

                <button
                  type="button"
                  className="employee-cancel-button"
                  onClick={
                    closeAssignModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="employee-save-button"
                  disabled={
                    !selectedOrder
                  }
                >
                  Assign Work
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =========================
          ASSIGNED WORK TABLE
      ========================= */}

      {(
        activeSection ===
          "cutting-master" ||
        activeSection ===
          "embroidery"
      ) && (

        <div className="employee-assigned-work-section">

          <div className="employee-assigned-work-header">

            <div>

              <h2>
                Assigned Work
              </h2>

              <p>
                View work assigned to
                cutting masters and
                embroidery workers.
              </p>

            </div>

            <span>

              {
                assignments.filter(
                  (item) =>
                    item.employeeType ===
                    activeSection
                ).length
              }{" "}

              {
                assignments.filter(
                  (item) =>
                    item.employeeType ===
                    activeSection
                ).length ===
                1
                  ? "Assignment"
                  : "Assignments"
              }

            </span>

          </div>

          {assignments.filter(
            (item) =>
              item.employeeType ===
              activeSection
          ).length ===
          0 ? (

            <div className="employee-empty-assignment">

              <h3>
                No work assigned yet
              </h3>

              <p>
                Click "Assign Work" on an
                employee to assign an
                order.
              </p>

            </div>

          ) : (

            <div className="employee-assignment-table-wrapper">

              <table className="employee-assignment-table">

                <thead>

                  <tr>

                    <th>
                      Employee
                    </th>

                    <th>
                      Order Number
                    </th>

                    <th>
                      Dress
                    </th>

                    <th>
                      Booking Date
                    </th>

                    <th>
                      Due Date
                    </th>

                    <th>
                      Rate
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {assignments
                    .filter(
                      (item) =>
                        item.employeeType ===
                        activeSection
                    )
                    .map(
                      (
                        assignment
                      ) => (

                        <tr
                          key={
                            assignment.id
                          }
                        >

                          <td>

                            <strong>
                              {
                                assignment.employeeName
                              }
                            </strong>

                          </td>

                          <td>
                            {
                              assignment.orderNumber
                            }
                          </td>

                          <td>
                            {
                              assignment.dress
                            }
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
                              Number(
                                assignment.rate
                              ) > 0
                                ? Number(
                                    assignment.rate
                                  )
                                : getEmployeeRate(
                                    (
                                      employees[
                                        assignment.employeeType
                                      ] ||
                                      []
                                    ).find(
                                      (
                                        employee
                                      ) =>
                                        employee.id ===
                                        assignment.employeeId
                                    ),

                                    assignment.dress
                                  )
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </td>

                          <td>

                            <span
                              className={
                                assignment.status ===
                                "Completed"
                                  ? "assignment-status completed"
                                  : "assignment-status assigned"
                              }
                            >
                              {
                                assignment.status
                              }
                            </span>

                          </td>

                          <td>

                            <div className="assignment-actions">

                              {assignment.status !==
                                "Completed" && (

                                <button
                                  type="button"
                                  className="assignment-complete-button"
                                  onClick={() =>
                                    handleCompleteAssignment(
                                      assignment.id
                                    )
                                  }
                                >
                                  ✓ Complete
                                </button>

                              )}

                              <button
                                type="button"
                                className="assignment-remove-button"
                                onClick={() =>
                                  handleRemoveAssignment(
                                    assignment.id
                                  )
                                }
                              >
                                Remove
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Employees;