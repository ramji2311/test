import { formatDateTime12h, formatDateOnly } from "./dateFormatter";

export const printReport = (reportType, orders) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print reports.");
    return;
  }
  const html = `
    <html>
      <head>
        <title>${reportType} List - MIARA DESIGNER HOUSE</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
          h2 { color: #6d4c41; margin-bottom: 20px; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 12px 10px; text-align: left; }
          th { background-color: #6d4c41; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
          @media print {
            body { padding: 0; }
            @page { size: auto; margin: 20mm; }
          }
        </style>
      </head>
      <body>
        <h2>${reportType} List</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Dress</th>
              <th>Booking</th>
              <th>Due</th>
              <th>Delivery Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(order => `
              <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>${order.phoneNumber}</td>
                <td>${order.dressType}</td>
                <td>${formatDateTime12h(order.bookingDate)}</td>
                <td>${formatDateOnly(order.dueDate)}</td>
                <td>${formatDateOnly(order.deliveredDate)}</td>
                <td>${order.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          Generated on ${formatDateTime12h(new Date())} - MIARA DESIGNER HOUSE
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          }
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};
