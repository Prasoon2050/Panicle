import React from "react";
import {
  BsFillPersonFill,
  BsPersonFillGear,
  BsFillBoxFill,
  BsReceiptCutoff,
} from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { RiChatHistoryLine } from "react-icons/ri";
import "./Navbar.css";

const Navbar = ({ onSelectComponent, role, selectComponent }) => {
  return (
    <div className="navbar">
      {role === "Admin" && (
        <button
          onClick={() => onSelectComponent("profile")}
          className={`${selectComponent === "profile" ? "active" : ""}`}
        >
          <span className="size">
            <BsFillPersonFill />
          </span>
          <span className="size">Profile</span>
        </button>
      )}

      {role === "Admin" && (
        <button
          onClick={() => onSelectComponent("employee-management")}
          className={`${
            selectComponent === "employee-management" ? "active" : ""
          }`}
        >
          <span className="size">
            <BsPersonFillGear />
          </span>
          <span className="size">Employees</span>
        </button>
      )}

      <button
        className="logout-button"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
      >
        <span className="size">
          <IoLogOutOutline />
        </span>
        <span className="size">Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
