import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import routes from './router';

function App() {
  return (
    <div className='layout'>
        <BrowserRouter>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
