/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../Redux/Slices/AuthSlice";

const Home = lazy(() => import("../Components/Screen/Home/index"));
const Auth = lazy(() => import("../Components/Screen/Auth/Auth"));

const Login = lazy(() => import("../Components/Screen/Auth/authLogin"));
const AddCat = lazy(() => import("../Components/Screen/AddCategory/index"));
const ListCategory = lazy(() => import("../Components/Screen/AddCategory/ListCategory"));


const Router = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  // const isAuthenticated = false; .
  return (
    <Suspense
      fallback={
        <div className="lazy_spiner">
          <Spinner animation="grow" variant="success" />
        </div>
      }
    >
      {useRoutes([
        // auth path start
        {
          path: "/",
          element: isAuthenticated ? <Home /> : <Navigate to="/login" />,
        },
        {
          path: "/login",
          element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
        },
        {
          path: "/auth",
          element: !isAuthenticated ? <Auth /> : <Navigate to="/" />,
        },

        // othe screen
        {
          path: "/AddCat",
          element: isAuthenticated ? <AddCat /> : <Navigate to="/" />,
        },
        {
          path: "/listCategory",
          element: isAuthenticated ? <ListCategory /> : <Navigate to="/" />,
        },
      ])}
    </Suspense>
  );
};

export default Router;
