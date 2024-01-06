import React from 'react';
import 'reactflow/dist/style.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Editor from './pages/Editor';
import Library from './pages/Library';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import UserProvider from './providers/UserProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login /> //<LandingPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/library",
    element: <Library />
  },
  {
    path: "/editor/:id",
    element: <Editor />
  },
]);

function App() {

  return (
    <React.StrictMode>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </React.StrictMode>
  );
}

export default App;