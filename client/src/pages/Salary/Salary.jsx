import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Salary.css";

function Salary() {
  const navigate = useNavigate();

  const [selectedEmployee, setSelectedEmployee] =
    useState("");

  const [selectedDesignation, setSelectedDesignation] =
    useState("");

  const [period, setPeriod] =
    useState("weekly");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] =
    useState(today);

  const [endDate, setEndDate] =
    useState(today);

  const [paymentStatus, setPaymentStatus] =
    useState("Unpaid");

  /*
   * LOAD ASSIGNED WORK
   */
  const [assignments] = useState(() => {
    const savedAssignments =
      localStorage.getItem(
        "miara-tailor-assignments"
      );

    if (!savedAssignments) {
      return [];
    }

    try {
      return JSON.parse(savedAssignments);
    } catch (error) {
      console.error(
        "Failed to load assignments:",
        error
      );

      return [];
    }
  });

  /*
   * LOAD TAILORS
   *
   * This contains:
   *
   * tailor name
   * tailor status
   * dress-wise rates
   */
  const [tailors] = useState(() => {
    const savedTailors =
      localStorage.getItem(
        "miara-tailors"
      );

    if (!savedTailors) {
      return [];
    }

    try {
      return JSON.parse(savedTailors);
    } catch (error) {
      console.error(
        "Failed to load tailors:",
        error
      );

      return [];
    }
  });

  /*
   * EMPLOYEE LIST
   *
   * Combines tailors with the other
   * employee types (cutting masters,
   * fashion designers, embroidery)
   * stored under "miara-employees".
   */
  const employeeList = useMemo(() => {
    const list = [];

    /*
     * TAILORS
     */
    tailors.forEach((employee) => {
      if (
        employee?.name &&
        employee.status !== "INACTIVE"
      ) {
        list.push({
          id: `tailor-${employee.id}`,
          name: employee.name,
          designation: "Tailor",
        });
      }
    });

    /*
     * OTHER EMPLOYEES
     */
    const savedEmployees =
      localStorage.getItem(
        "miara-employees"
      );

    if (savedEmployees) {
      try {
        const otherEmployees =
          JSON.parse(savedEmployees);

        /*
         * CUTTING MASTERS
         */
        (
          otherEmployees["cutting-master"] ||
          []
        ).forEach((employee) => {
          if (employee?.name && employee.isActive) {
            list.push({
              id: `cutting-${employee.id}`,
              name: employee.name,
              designation:
                "Cutting Master",
            });
          }
        });

        /*
         * FASHION DESIGNERS
         */
        (
          otherEmployees.designers ||
          []
        ).forEach((employee) => {
          if (employee?.name && employee.isActive) {
            list.push({
              id: `designer-${employee.id}`,
              name: employee.name,
              designation:
                "Fashion Designer",
            });
          }
        });

        /*
         * EMBROIDERY
         */
        (
          otherEmployees.embroidery ||
          []
        ).forEach((employee) => {
          if (employee?.name && employee.isActive) {
            list.push({
              id: `embroidery-${employee.id}`,
              name: employee.name,
              designation:
                "Embroidery",
            });
          }
        });

      } catch (error) {
        console.error(
          "Failed to load employee data:",
          error
        );
      }
    }

    /*
     * Remove duplicate names
     */
    return list.filter(
      (employee, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.name.toLowerCase() ===
            employee.name.toLowerCase()
        )
    );

  }, [tailors]);

  /*
   * GET TAILOR RATE
   *
   * First:
   * check assignment.rate
   *
   * If old assignment doesn't have
   * rate, find the rate from:
   *
   * tailor -> dress -> rate
   */
  const getRate = (assignment) => {
    const savedAssignmentRate =
      Number(assignment.rate);

    if (
      Number.isFinite(savedAssignmentRate) &&
      savedAssignmentRate > 0
    ) {
      return savedAssignmentRate;
    }

    const employeeName =
      assignment.tailorName ||
      assignment.tailor ||
      "";

    const employee =
      tailors.find((tailor) => {
        const sameName =
          String(tailor.name || "")
            .trim()
            .toLowerCase() ===
          employeeName
            .trim()
            .toLowerCase();

        const sameId =
          String(tailor.id) ===
          String(assignment.tailorId);

        return sameName || sameId;
      });

    if (!employee) {
      return 0;
    }

    const dressName =
      String(
        assignment.dress ||
        assignment.dressType ||
        ""
      )
        .trim()
        .toLowerCase();

    const rateItem =
      (employee.rates || []).find(
        (item) =>
          String(item.dress || "")
            .trim()
            .toLowerCase() ===
          dressName
      );

    if (!rateItem) {
      return 0;
    }

    const rate =
      Number(rateItem.rate);

    return Number.isFinite(rate)
      ? rate
      : 0;
  };

  /*
   * GET PRODUCTION DATE
   *
   * Completed work uses
   * completedDate.
   *
   * Old records without completedDate
   * fall back to bookingDate.
   */
  const getProductionDate = (
    assignment
  ) => {
    return (
      assignment.completedDate ||
      assignment.bookingDate ||
      ""
    );
  };

  /*
   * FILTER COMPLETED PRODUCTION
   */
  const employeeProduction = useMemo(() => {
    if (!selectedEmployee) {
      return [];
    }

    return assignments
      .filter((assignment) => {
        const employeeName =
          assignment.tailorName ||
          assignment.tailor ||
          "";

        /*
         * Employee check
         */
        const employeeMatches =
          employeeName
            .trim()
            .toLowerCase() ===
          selectedEmployee
            .trim()
            .toLowerCase();

        if (!employeeMatches) {
          return false;
        }

        /*
         * ONLY COMPLETED WORK
         */
        const status =
          String(
            assignment.status || ""
          )
            .trim()
            .toLowerCase();

        if (status !== "completed") {
          return false;
        }

        /*
         * DATE CHECK
         */
        const productionDate =
          getProductionDate(
            assignment
          );

        if (!productionDate) {
          return false;
        }

        /*
         * DAILY
         */
        if (period === "daily") {
          return (
            productionDate ===
            startDate
          );
        }

        /*
         * FROM DATE
         */
        if (
          startDate &&
          productionDate < startDate
        ) {
          return false;
        }

        /*
         * TO DATE
         */
        if (
          endDate &&
          productionDate > endDate
        ) {
          return false;
        }

        return true;
      })
      .map((assignment) => {
        const quantity =
          Number(
            assignment.quantity
          ) || 0;

        const rate =
          getRate(assignment);

        const amount =
          quantity * rate;

        return {
          ...assignment,

          quantity,

          rate,

          amount,
        };
      });
  }, [
    assignments,
    selectedEmployee,
    period,
    startDate,
    endDate,
    tailors,
  ]);

  /*
   * TOTAL PIECES
   */
  const totalPieces =
    employeeProduction.reduce(
      (total, assignment) =>
        total +
        assignment.quantity,
      0
    );

  /*
   * TOTAL SALARY
   */
  const totalSalary =
    employeeProduction.reduce(
      (total, assignment) =>
        total +
        assignment.amount,
      0
    );

  /*
   * DRESS-WISE SUMMARY
   */
  const dressSummary = useMemo(() => {
    const summary = {};

    employeeProduction.forEach(
      (assignment) => {
        const dress =
          assignment.dress ||
          "Unknown";

        if (!summary[dress]) {
          summary[dress] = {
            dress,

            quantity: 0,

            rate: assignment.rate,

            amount: 0,
          };
        }

        summary[dress].quantity +=
          assignment.quantity;

        /*
         * If the same dress somehow
         * has different rates, keep
         * the current assignment rate
         * for each amount.
         */
        summary[dress].amount +=
          assignment.amount;

        if (
          !summary[dress].rate &&
          assignment.rate
        ) {
          summary[dress].rate =
            assignment.rate;
        }
      }
    );

    return Object.values(summary);
  }, [employeeProduction]);

  /*
   * GENERATE SALARY SLIP
   */
  const handleGenerateSalarySlip =
    () => {
      if (!selectedEmployee) {
        alert(
          "Please select an employee."
        );

        return;
      }

      if (
        employeeProduction.length ===
        0
      ) {
        alert(
          "No completed production found for this employee in the selected period."
        );

        return;
      }

      navigate(
        "/salary-slip",
        {
          state: {
            employee:
              selectedEmployee,

            designation:
              selectedDesignation,

            period,

            startDate,

            endDate:
              period === "daily"
                ? startDate
                : endDate,

            dressSummary,

            totalPieces,

            totalSalary,

            paymentStatus,
          },
        }
      );
    };

  /*
   * PAYMENT STATUS
   */
  const handlePaymentStatus =
    () => {
      setPaymentStatus(
        paymentStatus === "Paid"
          ? "Unpaid"
          : "Paid"
      );
    };

  /*
   * PERIOD CHANGE
   */
  const handlePeriodChange =
    (value) => {
      setPeriod(value);

      if (value === "daily") {
        setEndDate(startDate);
      }
    };

  /*
   * START DATE CHANGE
   */
  const handleStartDateChange =
    (value) => {
      setStartDate(value);

      if (period === "daily") {
        setEndDate(value);
      }
    };

  return (
    <div className="salary-page">

      {/* HEADER */}

      <div className="salary-header">

        <div>
          <h1>Salary</h1>

          <p>
            Calculate employee salary from
            completed production.
          </p>
        </div>

      </div>


      {/* FILTER */}

      <div className="salary-filter-card">

        <div className="salary-filter">

          {/* EMPLOYEE */}

          <div className="salary-field">

            <label>
              Employee
            </label>

            <select
              value={selectedEmployee}
              onChange={(e) => {

                const employeeName =
                  e.target.value;

                setSelectedEmployee(
                  employeeName
                );

                const employee =
                  employeeList.find(
                    (item) =>
                      item.name ===
                      employeeName
                  );

                setSelectedDesignation(
                  employee?.designation || ""
                );
              }}
            >

              <option value="">
                Select Employee
              </option>

              {employeeList.map(
                (employee) => (

                  <option
                    key={employee.id}
                    value={employee.name}
                  >
                    {employee.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* DESIGNATION */}

          <div className="salary-field">

            <label>
              Designation
            </label>

            <input
              type="text"
              value={selectedDesignation}
              placeholder="Designation"
              readOnly
            />

          </div>


          {/* PERIOD */}

          <div className="salary-field">

            <label>
              Salary Period
            </label>

            <select
              value={period}
              onChange={(e) =>
                handlePeriodChange(
                  e.target.value
                )
              }
            >

              <option value="daily">
                Daily
              </option>

              <option value="weekly">
                Weekly
              </option>

              <option value="monthly">
                Monthly
              </option>

            </select>

          </div>


          {/* FROM */}

          <div className="salary-field">

            <label>
              From
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                handleStartDateChange(
                  e.target.value
                )
              }
            />

          </div>


          {/* TO */}

          <div className="salary-field">

            <label>
              To
            </label>

            <input
              type="date"
              value={endDate}
              disabled={
                period === "daily"
              }
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* NO EMPLOYEE */}

      {!selectedEmployee && (

        <div className="salary-empty">

          <h2>
            Select an employee
          </h2>

          <p>
            Select an employee above to
            view their production and salary.
          </p>

        </div>

      )}


      {/* SALARY CONTENT */}

      {selectedEmployee && (

        <>

          {/* SUMMARY CARDS */}

          <div className="salary-summary-grid">

            <div className="salary-summary-card">

              <span>
                Employee
              </span>

              <strong>
                {selectedEmployee}
              </strong>

            </div>


            <div className="salary-summary-card">

              <span>
                Total Pieces
              </span>

              <strong>
                {totalPieces}
              </strong>

            </div>


            <div className="salary-summary-card">

              <span>
                Total Earnings
              </span>

              <strong className="salary-amount">
                ₹
                {totalSalary.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="salary-summary-card">

              <span>
                Payment
              </span>

              <strong
                className={
                  paymentStatus ===
                  "Paid"
                    ? "paid-text"
                    : "unpaid-text"
                }
              >
                {paymentStatus}
              </strong>

            </div>

          </div>


          {/* PRODUCTION SUMMARY */}

          <div className="salary-table-card">

            <div className="salary-table-header">

              <div>

                <h2>
                  Production Summary
                </h2>

                <p>
                  Completed dress-wise
                  salary calculation.
                </p>

              </div>

            </div>


            {dressSummary.length ===
            0 ? (

              <div className="salary-no-production">

                <h3>
                  No completed production
                  found
                </h3>

                <p>
                  Complete assigned work
                  first to calculate salary.
                </p>

              </div>

            ) : (

              <div className="salary-table-wrapper">

                <table className="salary-table">

                  <thead>

                    <tr>

                      <th>
                        Dress
                      </th>

                      <th>
                        Completed Pieces
                      </th>

                      <th>
                        Rate
                      </th>

                      <th>
                        Amount
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {dressSummary.map(
                      (item) => (

                        <tr
                          key={item.dress}
                        >

                          <td>
                            <strong>
                              {item.dress}
                            </strong>
                          </td>

                          <td>
                            {item.quantity}
                          </td>

                          <td>
                            ₹
                            {Number(
                              item.rate || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            <strong>
                              ₹
                              {Number(
                                item.amount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>


                  <tfoot>

                    <tr>

                      <td>
                        <strong>
                          TOTAL
                        </strong>
                      </td>

                      <td>
                        <strong>
                          {totalPieces}
                        </strong>
                      </td>

                      <td>
                        —
                      </td>

                      <td>
                        <strong>
                          ₹
                          {totalSalary.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>

                    </tr>

                  </tfoot>

                </table>

              </div>

            )}

          </div>


          {/* ACTIONS */}

          <div className="salary-actions">

            <button
              className="salary-payment-button"
              onClick={
                handlePaymentStatus
              }
            >

              {paymentStatus ===
              "Paid"
                ? "Mark as Unpaid"
                : "Mark as Paid"}

            </button>


            <button
              className="salary-slip-button"
              onClick={
                handleGenerateSalarySlip
              }
              disabled={
                employeeProduction.length ===
                0
              }
            >
              Generate Salary Slip
            </button>

          </div>

        </>

      )}

    </div>
  );
}

export default Salary;