import React, {
  useEffect,
  useState,
  useCallback
} from 'react';

import axios from 'axios';
import './App.css';

function ManagerDashboard() {
  const [timesheets, setTimesheets] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const loadData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.get(
        'http://localhost:5000/all-timesheets',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTimesheets(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredTimesheets = timesheets.filter((item) => {
    const matchesDate =
      (!fromDate || item.work_date >= fromDate) &&
      (!toDate || item.work_date <= toDate);

    const matchesEmployee =
      !employeeFilter ||
      item.username === employeeFilter;

    return matchesDate && matchesEmployee;
  });

  const totalFilteredHours = filteredTimesheets.reduce(
    (sum, item) => sum + (Number(item.total_hours) || 0),
    0
  );

  const employeeNames = [
    ...new Set(timesheets.map((item) => item.username))
  ];

  const printReport = () => {
    window.print();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px',
        color: 'white'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.82)',
          padding: '40px',
          borderRadius: '20px',
          maxWidth: '1100px',
          margin: 'auto',
          boxShadow: '0px 0px 25px orange'
        }}
      >
        <h1
          style={{
            color: 'orange',
            fontSize: '50px',
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Manager Dashboard
        </h1>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}
        >
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          >
            <option value="">All Employees</option>

            {employeeNames.map((name) => (
              <option
                key={name}
                value={name}
              >
                {name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={printReport}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              backgroundColor: 'orange',
              color: 'black',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Print Report
          </button>
        </div>

        <h2
          style={{
            marginBottom: '20px',
            color: 'white'
          }}
        >
          Total Hours: {totalFilteredHours.toFixed(2)}
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'rgba(0,0,0,0.75)'
          }}
        >
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Employee</th>
              <th style={tableHeaderStyle}>Date</th>
              <th style={tableHeaderStyle}>Start</th>
              <th style={tableHeaderStyle}>End</th>
              <th style={tableHeaderStyle}>Total Hours</th>
              <th style={tableHeaderStyle}>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTimesheets.map((item) => (
              <tr key={item.id}>
                <td style={tableCellStyle}>{item.username}</td>
                <td style={tableCellStyle}>{item.work_date}</td>
                <td style={tableCellStyle}>{item.start_time}</td>
                <td style={tableCellStyle}>{item.end_time}</td>
                <td style={tableCellStyle}>{item.total_hours}</td>
                <td
                  style={{
                    ...tableCellStyle,
                    color:
                      item.payment_status === 'Paid'
                        ? 'lightgreen'
                        : 'orange'
                  }}
                >
                  {item.payment_status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  padding: '15px',
  border: '1px solid orange',
  color: 'orange'
};

const tableCellStyle = {
  padding: '15px',
  border: '1px solid rgba(255,255,255,0.2)',
  fontWeight: 'bold',
  textAlign: 'center'
};

export default ManagerDashboard;