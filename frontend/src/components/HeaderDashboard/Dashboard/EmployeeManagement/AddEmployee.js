import "./AddEmployee.css";
import React, { useState } from "react";

const AddEmployee = ({ onAddEmployeeSuccess }) => {
  const token = localStorage.getItem("token");

  const initialState = {
    username: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
  };

  const [employeeData, setEmployeeData] = useState(initialState);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const resetForm = () => {
    setEmployeeData(initialState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newEmployeeData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      salary: formData.get("salary"),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newEmployeeData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setMessage(responseData.message);
        setMessageType("success");
        onAddEmployeeSuccess();
        resetForm();
      } else {
        setMessage(responseData.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Network error");
      setMessageType("error");
    }
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="add-employee-container">
      <h2>Add Employee</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={submitHandler} className="add-employee-form">
        <input
          type="text"
          name="username"
          placeholder="Name"
          className="add-employee-input-field"
          value={employeeData.username}
          onChange={inputChangeHandler}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="add-employee-input-field"
          value={employeeData.email}
          onChange={inputChangeHandler}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="add-employee-input-field"
          value={employeeData.password}
          onChange={inputChangeHandler}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="add-employee-input-field"
          value={employeeData.phone}
          onChange={inputChangeHandler}
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary"
          className="add-employee-input-field"
          value={employeeData.salary}
          onChange={inputChangeHandler}
        />
        <button type="submit" className="add-employee-add-button">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
