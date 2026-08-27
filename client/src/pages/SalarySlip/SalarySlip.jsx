import { useLocation, useNavigate } from "react-router-dom";
import "./SalarySlip.css";

function SalarySlip() {
  const location = useLocation();
  const navigate = useNavigate();

  const salaryData = location.state;

  // If page is opened directly without generating a slip
  if (!salaryData) {
    return (
      <div className="salary-slip-page">
        <div className="salary-slip-empty">
          <h2>No Salary Slip Data</h2>

          <p>
            Please generate a salary slip from the Salary page.
          </p>

          <button
            onClick={() => navigate("/salary")}
            className="back-salary-button"
          >
            Back to Salary
          </button>
        </div>
      </div>
    );
  }

  const {
    employee,
    period,
    startDate,
    endDate,
    dressSummary = [],
    totalPieces = 0,
    totalSalary = 0,
    paymentStatus = "Unpaid",
  } = salaryData;

  const formatDate = (date) => {
    if (!date) return "-";

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const getPeriodText = () => {
    if (period === "daily") {
      return "Daily";
    }

    if (period === "weekly") {
      return "Weekly";
    }

    if (period === "monthly") {
      return "Monthly";
    }

    return period;
  };

  return (
    <div className="salary-slip-page">

      {/* ACTIONS */}

      <div className="salary-slip-actions">

        <button
          className="salary-slip-back"
          onClick={() => navigate("/salary")}
        >
          ← Back to Salary
        </button>

        <button
          className="salary-slip-print"
          onClick={() => window.print()}
        >
          🖨️ Print Salary Slip
        </button>

      </div>


      {/* SALARY SLIP */}

      <div className="salary-slip-container">

        {/* COMPANY HEADER */}

        <div className="salary-slip-company">

          <div>
            <h1>MIARA</h1>
            <p>Designer House</p>
          </div>

          <div className="salary-slip-title">
            <h2>SALARY SLIP</h2>
          </div>

        </div>


        {/* EMPLOYEE DETAILS */}

        <div className="salary-slip-details">

          <div className="salary-detail-row">
            <span>Employee</span>
            <strong>{employee}</strong>
          </div>

          <div className="salary-detail-row">
            <span>Salary Period</span>
            <strong>
              {getPeriodText()}
            </strong>
          </div>

          <div className="salary-detail-row">
            <span>From</span>
            <strong>
              {formatDate(startDate)}
            </strong>
          </div>

          <div className="salary-detail-row">
            <span>To</span>
            <strong>
              {formatDate(endDate)}
            </strong>
          </div>

        </div>


        {/* PRODUCTION TABLE */}

        <div className="salary-slip-section">

          <h3>Production Details</h3>

          <table className="salary-slip-table">

            <thead>

              <tr>
                <th>Dress</th>
                <th>Completed Pieces</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              {dressSummary.length === 0 ? (

                <tr>
                  <td colSpan="4">
                    No production records found.
                  </td>
                </tr>

              ) : (

                dressSummary.map((item, index) => (

                  <tr key={index}>

                    <td>
                      {item.dress}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      ₹
                      {item.rate.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      ₹
                      {item.amount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

            <tfoot>

              <tr>

                <td>
                  <strong>TOTAL</strong>
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


        {/* SALARY SUMMARY */}

        <div className="salary-slip-summary">

          <div className="salary-summary-row">

            <span>
              Total Pieces
            </span>

            <strong>
              {totalPieces}
            </strong>

          </div>


          <div className="salary-summary-row">

            <span>
              Total Salary
            </span>

            <strong className="salary-total">
              ₹
              {totalSalary.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <div className="salary-summary-row">

            <span>
              Payment Status
            </span>

            <strong
              className={
                paymentStatus === "Paid"
                  ? "salary-paid"
                  : "salary-unpaid"
              }
            >
              {paymentStatus}
            </strong>

          </div>

        </div>


        {/* FOOTER */}

        <div className="salary-slip-footer">

          <p>
            This salary slip is generated by
            MIARA Designer House.
          </p>

          <div className="salary-signatures">

            <div>
              <div className="signature-line"></div>
              <span>Employee Signature</span>
            </div>

            <div>
              <div className="signature-line"></div>
              <span>Authorized Signature</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SalarySlip;