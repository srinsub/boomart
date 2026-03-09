/**
 * BoomArt - Monthly Sales Report
 */
document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('reportMonth');
    const yearSelect = document.getElementById('reportYear');
    const generateBtn = document.getElementById('generateReport');
    const reportCard = document.getElementById('reportCard');
    const emptyReport = document.getElementById('emptyReport');
    const totalSalesCount = document.getElementById('totalSalesCount');
    const totalRevenue = document.getElementById('totalRevenue');
    const reportTableBody = document.getElementById('reportTableBody');
    const printReportBtn = document.getElementById('printReport');

    // Populate month options
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    months.forEach((m, i) => {
        const opt = document.createElement('option');
        opt.value = i + 1;
        opt.textContent = m;
        if (i + 1 === new Date().getMonth() + 1) opt.selected = true;
        monthSelect.appendChild(opt);
    });

    // Populate year options
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === currentYear) opt.selected = true;
        yearSelect.appendChild(opt);
    }

    // Generate report
    function generateReport() {
        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);
        const sales = DataStore.getSales();

        const filteredSales = sales.filter(sale => {
            const d = new Date(sale.date);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        if (filteredSales.length === 0) {
            reportCard.style.display = 'none';
            emptyReport.style.display = 'block';
            return;
        }

        reportCard.style.display = 'block';
        emptyReport.style.display = 'none';

        const totalRevenueAmount = filteredSales.reduce((sum, s) => sum + parseFloat(s.total), 0);
        totalSalesCount.textContent = filteredSales.length;
        totalRevenue.textContent = `$${totalRevenueAmount.toFixed(2)}`;

        reportTableBody.innerHTML = filteredSales.map(sale => {
            const date = new Date(sale.date);
            const items = sale.items.map(i => `${i.title} (×${i.quantity})`).join(', ');
            return `
                <tr>
                    <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                    <td>${items}</td>
                    <td>$${parseFloat(sale.total).toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    generateBtn.addEventListener('click', generateReport);

    // Print report
    printReportBtn.addEventListener('click', function() {
        const printContent = document.getElementById('reportCard').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head><title>BoomArt - Sales Report</title><link rel="stylesheet" href="css/style.css"></head>
            <body>
                <h1 style="color:#2d5a4a; text-align:center;">BoomArt Monthly Sales Report</h1>
                <p style="text-align:center;">${months[parseInt(monthSelect.value) - 1]} ${yearSelect.value}</p>
                ${printContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    });

    // Generate on load
    generateReport();
});
