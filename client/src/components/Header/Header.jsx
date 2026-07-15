import "./Header.css";

function Header() {
  // Today's Date
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="header">

      <div className="left-header">
        <h1>MIARA DESIGNER HOUSE</h1>
        <p>Tailor ERP System</p>
      </div>

      <div className="right-header">
        <h2>Welcome Raman 👋</h2>
        <p>Today: {today}</p>
      </div>

    </div>
  );
}

export default Header;