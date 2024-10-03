/* eslint-disable react/prop-types */
import  { Suspense } from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import { Signup } from '../pages/Signup';
import { Signin } from '../pages/Signin';
import Dashboard from '../pages/Dashboard';
import SendMoney from '../pages/SendMoney';

// const Signup = React.lazy(() => import("../pages/Signup"));
// const Signin = React.lazy(() => import("../pages/Signin"));
// const Dashboard = React.lazy(() => import("../pages/Dashboard"));
// const SendMoney = React.lazy(() => import("../pages/SendMoney"));

function AllRoutes({isAuthenticated}) {
  return (
   
      <Routes>
        <Route path="/signup" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Signup />
          </Suspense>
        } />
        <Route path="/signin" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Signin />
          </Suspense>
        } />
       

<Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>

          ) : <Navigate to="/signin" />
        }
      />
        <Route path="/send" element={
          <Suspense fallback={<div>Loading...</div>}>
            <SendMoney />
          </Suspense>
        } />
      </Routes>
  
  )
}

export default AllRoutes;
