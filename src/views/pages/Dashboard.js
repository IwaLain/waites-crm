import React from 'react'
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  return(
    <div>
      <NavLink to={"/account"} className="btn btn-primary">Account</NavLink>
    </div>
  )
}

export default Dashboard;
