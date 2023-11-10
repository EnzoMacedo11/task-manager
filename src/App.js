import { Route,BrowserRouter,Routes } from 'react-router-dom';
import Home from './pages/home';
import { UserProvider } from './components/context';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <UserProvider>  <BrowserRouter>
    <Routes>
      <Route path='/' Component={Home} />
      <Route path='/login' Component={Login}/>
      <Route path='/register' Component={Register}/>
    </Routes>
    </BrowserRouter></UserProvider>

  );
}

export default App;
