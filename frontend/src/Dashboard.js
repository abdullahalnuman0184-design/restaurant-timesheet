import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import axios from 'axios';

const Dashboard = () => {

  const [workDate, setWorkDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [timesheets, setTimesheets] = useState([]);
const weeklyHours =
  timesheets.reduce(
    (total, item) =>
      total + item.total_hours,
    0
  );
const [weekFilter, setWeekFilter] =
  useState('');

const [statusFilter, setStatusFilter] =
  useState([]);
  const token = localStorage.getItem('token');

  const loadTimesheets = useCallback(async () => {
    try {

      const res = await axios.get(
        'http://localhost:5000/my-timesheets',
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

  loadTimesheets();

}, []);
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
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Shift Submitted');

      loadTimesheets();

    } catch (err) {

      alert('Error submitting shift');

    }

  };

  const totalHours = timesheets.reduce(
    (sum, item) => sum + item.total_hours,
    0
  );

  return (

    <div
  
  style={{
    minHeight: '100vh',
    backgroundImage:
      "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '40px',
    color: 'white'
  }}
><div
  style={{
    backgroundColor:
      'rgba(0,0,0,0.80)',
    padding: '40px',
    borderRadius: '20px',
    maxWidth: '900px',
    margin: 'auto',
    boxShadow:
      '0px 0px 25px orange'
  }}
></div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginBottom: '30px'
        }}
      >

        <input
          type="date"
          onChange={(e) =>
            setWorkDate(e.target.value)
          }
        />

        <input
          type="time"
          onChange={(e) =>
            setStartTime(e.target.value)
          }
        />

        <input
          type="time"
          onChange={(e) =>
            setEndTime(e.target.value)
          }
        />

        <button onClick={submitShift}>
          Submit Shift
        </button>

      </div>

      <h2>
        Weekly Total Hours:
        {' '}
        {totalHours.toFixed(2)}
      </h2>
<h2>
  Weekly Total Hours:
  {weeklyHours}
</h2>

{/* ADD FILTERS HERE */}

<div
  style={{
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  }}
>

  <input
    type="week"
    value={weekFilter}
    onChange={(e) =>
      setWeekFilter(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '8px'
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '8px'
    }}
  >

    <option value="">
      All Status
    </option>

    <option value="Paid">
      Paid
    </option>

    <option value="Pending">
      Unpaid
    </option>

  </select>

</div>

<div
  style={{
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  }}
>

  <input
    type="week"
    value={weekFilter}
    onChange={(e) =>
      setWeekFilter(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '8px'
    }}
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(e.target.value)
    }
    style={{
      padding: '10px',
      borderRadius: '8px'
    }}
  >

    <option value="">
      All Status
    </option>

    <option value="Paid">
      Paid
    </option>

    <option value="Pending">
      Unpaid
    </option>

  </select>

</div>
      <table
        border="1"
        cellPadding="10"
        width="100%"
      >

        <thead>

          <tr>
            <th>Date</th>
            <th>Start</th>
            <th>End</th>
            <th>Total Hours</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {timesheets
.filter((item) => {

  const statusMatch =
    statusFilter === '' ||
    item.status === statusFilter;

  return statusMatch;

})
.map((item) => (

            <tr key={item.id}>

              <td>{item.work_date}</td>

              <td>{item.start_time}</td>

              <td>{item.end_time}</td>

              <td>{item.total_hours}</td>

              <td>{item.payment_status}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Dashboard;