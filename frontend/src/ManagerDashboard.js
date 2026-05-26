import React, {
  useEffect,
  useState
} from 'react';

import axios from 'axios';
import './App.css';

function ManagerDashboard() {

  const [timesheets, setTimesheets] =
    useState([]);

  const [fromDate, setFromDate] =
    useState('');

  const [toDate, setToDate] =
    useState('');

  const [employeeFilter,
    setEmployeeFilter] =
    useState('');

  const token =
    localStorage.getItem('token');

  const loadData = async () => {

    try {

      const res = await axios.get(
        'http://localhost:5000/all-timesheets',
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setTimesheets(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const filteredTimesheets =
    timesheets.filter(item => {

      const matchesDate =
        (!fromDate ||
          item.work_date >= fromDate) &&
        (!toDate ||
          item.work_date <= toDate);

      const matchesEmployee =
        !employeeFilter ||
        item.username === employeeFilter;

      return matchesDate &&
        matchesEmployee;

    });

  const totalFilteredHours =
    filteredTimesheets.reduce(
      (sum, item) =>
        sum + item.total_hours,
      0
    );

  const printReport = () => {

    window.print();

  };
useEffect(() => {

  loadData();

}, [loadData]);
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
          backgroundColor:
            'rgba(0,0,0,0.82)',
          padding: '40px',
          borderRadius: '20px',
          maxWidth: '1100px',
          margin: 'auto',
          boxShadow:
            '0px 0px 25px orange'
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
            marginBottom: '30px'
          }}
        >

          <input
            type="date"
            onChange={(e) =>
              setFromDate(
                e.target.value
              )
            }
          />

          <input
            type="date"
            onChange={(e) =>
              setToDate(
                e.target.value
              )
            }
          />

          <select
            onChange={(e) =>
              setEmployeeFilter(
                e.target.value
              )
            }
          >

            <option value="">
              All Employees
            </option>

            {[...new Set(
              timesheets.map(
                item => item.username
              )
            )].map((name) => (

              <option
                key={name}
                value={name}
              >
                {name}
              </option>

            ))}

          </select>

          <button
            onClick={printReport}
          >
            🖨 Print Report
          </button>

        </div>

        <h2>
          Total Hours:
          {' '}
          {totalFilteredHours.toFixed(2)}
        </h2>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor:
              'rgba(0,0,0,0.75)'
          }}
        >

          <thead>

            <tr>

              <th>Employee</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Total Hours</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {filteredTimesheets.map(
              (item) => (

                <tr key={item.id}>

                  <td>{item.username}</td>
                  <td>{item.work_date}</td>
                  <td>{item.start_time}</td>
                  <td>{item.end_time}</td>
                  <td>{item.total_hours}</td>
                  <td>{item.payment_status}</td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default ManagerDashboard;