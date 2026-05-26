import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import axios from 'axios';
import './App.css';

const Dashboard = () => {

  const [workDate, setWorkDate] =
    useState('');

  const [startTime, setStartTime] =
    useState('');

  const [endTime, setEndTime] =
    useState('');

  const [timesheets, setTimesheets] =
    useState([]);

  const [statusFilter, setStatusFilter] =
    useState('');

  const token =
    localStorage.getItem('token');

  const loadTimesheets =
    useCallback(async () => {

      try {

        const res = await axios.get(
          'http://localhost:5000/my-timesheets',
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

    }, [token]);

  useEffect(() => {

    loadTimesheets();

  }, [loadTimesheets]);

  const submitShift = async () => {

    try {

      await axios.post(
        'http://localhost:5000/timesheet',
        {
          work_date: workDate,
          start_time: startTime,
          end_time: endTime
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        'Shift Submitted Successfully'
      );

      setWorkDate('');
      setStartTime('');
      setEndTime('');

      loadTimesheets();

    } catch (err) {

      alert(
        'Error submitting shift'
      );

    }

  };

  const filteredTimesheets =
    timesheets.filter((item) => {

      const statusMatch =
        statusFilter === '' ||
        item.payment_status ===
          statusFilter;

      return statusMatch;

    });

  const totalHours =
    filteredTimesheets.reduce(
      (sum, item) =>
        sum + Number(item.total_hours),
      0
    );

  return (

    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')",
        backgroundSize: 'cover',
        backgroundPosition:
          'center',
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
          maxWidth: '1000px',
          margin: 'auto',
          boxShadow:
            '0px 0px 25px orange'
        }}
      >

        <h1
          style={{
            color: 'orange',
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '50px'
          }}
        >
          Employee Dashboard
        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            marginBottom: '30px'
          }}
        >

          <input
            type="date"
            value={workDate}
            onChange={(e) =>
              setWorkDate(
                e.target.value
              )
            }
            style={{
              padding: '12px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />

          <input
            type="time"
            value={startTime}
            onChange={(e) =>
              setStartTime(
                e.target.value
              )
            }
            style={{
              padding: '12px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />

          <input
            type="time"
            value={endTime}
            onChange={(e) =>
              setEndTime(
                e.target.value
              )
            }
            style={{
              padding: '12px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          />

          <button
            onClick={submitShift}
            style={{
              padding: '14px',
              borderRadius: '10px',
              backgroundColor:
                'orange',
              color: 'black',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Submit Shift
          </button>

        </div>

        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >

          <h2>
            Total Hours:
            {' '}
            {totalHours.toFixed(2)}
          </h2>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontSize: '16px'
            }}
          >

            <option value="">
              All Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

          </select>

        </div>

        <table
          style={{
            width: '100%',
            borderCollapse:
              'collapse',
            backgroundColor:
              'rgba(0,0,0,0.75)'
          }}
        >

          <thead>

            <tr>

              <th
                style={{
                  padding: '15px',
                  border:
                    '1px solid orange',
                  color: 'orange',
                  fontSize: '18px'
                }}
              >
                Date
              </th>

              <th
                style={{
                  padding: '15px',
                  border:
                    '1px solid orange',
                  color: 'orange',
                  fontSize: '18px'
                }}
              >
                Start Time
              </th>

              <th
                style={{
                  padding: '15px',
                  border:
                    '1px solid orange',
                  color: 'orange',
                  fontSize: '18px'
                }}
              >
                End Time
              </th>

              <th
                style={{
                  padding: '15px',
                  border:
                    '1px solid orange',
                  color: 'orange',
                  fontSize: '18px'
                }}
              >
                Total Hours
              </th>

              <th
                style={{
                  padding: '15px',
                  border:
                    '1px solid orange',
                  color: 'orange',
                  fontSize: '18px'
                }}
              >
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredTimesheets.map(
              (item) => (

                <tr key={item.id}>

                  <td
                    style={{
                      padding: '15px',
                      border:
                        '1px solid rgba(255,255,255,0.2)',
                      textAlign:
                        'center',
                      fontWeight:
                        'bold'
                    }}
                  >
                    {item.work_date}
                  </td>

                  <td
                    style={{
                      padding: '15px',
                      border:
                        '1px solid rgba(255,255,255,0.2)',
                      textAlign:
                        'center',
                      fontWeight:
                        'bold'
                    }}
                  >
                    {item.start_time}
                  </td>

                  <td
                    style={{
                      padding: '15px',
                      border:
                        '1px solid rgba(255,255,255,0.2)',
                      textAlign:
                        'center',
                      fontWeight:
                        'bold'
                    }}
                  >
                    {item.end_time}
                  </td>

                  <td
                    style={{
                      padding: '15px',
                      border:
                        '1px solid rgba(255,255,255,0.2)',
                      textAlign:
                        'center',
                      fontWeight:
                        'bold'
                    }}
                  >
                    {item.total_hours}
                  </td>

                  <td
                    style={{
                      padding: '15px',
                      border:
                        '1px solid rgba(255,255,255,0.2)',
                      textAlign:
                        'center',
                      fontWeight:
                        'bold',
                      color:
                        item.payment_status ===
                        'Paid'
                          ? 'lightgreen'
                          : 'orange'
                    }}
                  >
                    {item.payment_status}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

};

export default Dashboard;