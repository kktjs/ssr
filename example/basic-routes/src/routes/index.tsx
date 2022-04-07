import React from "react";
import { Route, Routes, Outlet, Link } from "react-router-dom";
import Home from "./Home"
import About from "./About"

const Nav = () => {
  return <div>
    <Link style={{ margin: "0px 10px" }} to="/home">home</Link>
    <Link style={{ margin: "0px 10px" }} to="/about">about</Link>
    <Outlet />
  </div>
}

export default () => {
  return <Routes>
    <Route path="/" element={<Nav />} >
      <Route index element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<div>无页面</div>} />
    </Route>
  </Routes>
}

