import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./HistoricalData.css";

const DatePickerComponent = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeChange(start, end);
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
        className="date-picker"
      />
    </div>
  );
};

export default DatePickerComponent;
