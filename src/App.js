import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import SinglePost from './pages/SinglePost';
import Home from './pages/Home.js';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthRoute />} >
              <Route path="/login" element={<Login/>}/>
            </Route>
            <Route path="/register" element={<AuthRoute />} >
              <Route path='/register' element={<Register/>}/>
            </Route>
            <Route path="/posts/:id" element={<SinglePost />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
