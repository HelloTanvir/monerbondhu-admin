import { Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';

const App = () => {
  return (
    <>
      <Route path='/' exact component={Login} />
      <Route path='/dashboard' component={Dashboard} />
    </>
  );
}

export default App;
