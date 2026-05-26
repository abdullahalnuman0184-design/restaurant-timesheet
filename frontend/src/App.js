import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import WelcomePage from './WelcomePage';
import Dashboard from './Dashboard';
import ManagerDashboard from './ManagerDashboard';

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
  path="/"
  element={<WelcomePage />}
/>
<Route
  path="/login"
  element={<Login />}
/>
<Route
  path="/signup"
  element={<Signup />}
/>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/manager"
          element={<ManagerDashboard />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;