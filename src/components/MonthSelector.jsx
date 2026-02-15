
const MonthSelector = ({ value, onChange }) => {
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Generate years (current year - 2 to current year + 2)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
        years.push(i);
    }

    // Parse current value (YYYY-MM format)
    const [selectedYear, selectedMonth] = value ? value.split('-') : [currentYear.toString(), '01'];

    const handleMonthChange = (e) => {
        const newMonth = e.target.value;
        onChange(`${selectedYear}-${newMonth}`);
    };

    const handleYearChange = (e) => {
        const newYear = e.target.value;
        onChange(`${newYear}-${selectedMonth}`);
    };

    return (
        <div className="month-year-selector">
            <select value={selectedMonth} onChange={handleMonthChange} className="month-select">
                {months.map(month => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
            <select value={selectedYear} onChange={handleYearChange} className="year-select">
                {years.map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MonthSelector;
