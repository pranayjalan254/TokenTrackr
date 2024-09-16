const mockHistoricalData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    data.push({
      date: currentDate.toISOString().split("T")[0],
      balance: Math.random() * 1000,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

export default mockHistoricalData;
