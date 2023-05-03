import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import {RequireAuth} from 'react-auth-kit';



function App() {
  return (
    <main className='app'>
      <Routes>
        <Route exact path="/" element={<LoginPage/>} />
        <Route exact path="/dashboard" element={<RequireAuth loginPath='/'> <Dashboard/></RequireAuth>} > 
        </Route>
      </Routes>
  </main>

  );
}
export default App;

