import { Route,BrowserRouter,Routes } from 'react-router-dom';
import Home from './pages/home';
import { UserProvider } from './components/context';
import Login from './pages/login';

import User from './pages/user';
import Company from './pages/company';

function App() {
  return (
    <UserProvider>  <BrowserRouter>
    <Routes>
      <Route path='/' Component={Home} />
      <Route path='/login' Component={Login}/>
      <Route path='/user' Component={User}/>
      <Route path='/company' Component={Company}/>
    </Routes>
    </BrowserRouter></UserProvider>

  );
}

export default App;
