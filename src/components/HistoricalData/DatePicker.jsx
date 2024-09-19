import { useState } from "react";
import DatePicker from "react-datepicker";
import "./HistoricalData.css";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    if (end) {
      end.setHours(23, 59, 59, 999);
    }
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end);
  };

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div style={{ margin: 10, display: "flex", justifyContent: "center" }}>
      <button
        className="date-button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        {"<"}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(value)}
      >
        {Array.from(
          { length: 20 },
          (_, i) => new Date().getFullYear() - 10 + i
        ).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        value={date.getMonth()}
        onChange={({ target: { value } }) => changeMonth(value)}
      >
        {[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((option, index) => (
          <option key={option} value={index}>
            {option}
          </option>
        ))}
      </select>

      <button
        className="date-button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        {">"}
      </button>
    </div>
  );

  const formatDate = (date) => {
    return date ? date.toDateString() : "";
  };

  return (
    <div className="date-picker-container">
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        inline
        renderCustomHeader={renderCustomHeader}
        className="date-picker"
      />
      <div className="selected-range-text">
        {startDate && endDate ? (
          <p>
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
        ) : (
          <p>Please select a date range</p>
        )}
      </div>
    </div>
  );
};

export default DatePickerComponent;
