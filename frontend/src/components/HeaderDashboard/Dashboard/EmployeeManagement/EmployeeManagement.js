import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import DeleteConfirmation from "./DeleteConfirmation/DeleteConfirmation";
import SaveConfirmation from "./SaveConfirmation/SaveConfirmation";
import "./EmployeeManagement.css";

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [employeeData, setEmployeeData] = useState([]);
  const [editEmployeeemail, setEditEmployeeemail] = useState(null);
  const [editedEmployee, setEditedEmployee] = useState({
    username: "",
    email: "",
    Position: "",
    age: "",
    department: "",
    salary: "",
  });
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const filterEmployeeData = () => {
    return employeeData.filter(
      (employee) =>
        employee.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleEdit = (email) => {
    const employeeToEdit = employeeData.find(
      (employee) => employee.email === email
    );
    if (employeeToEdit) {
      setEditEmployeeemail(email);
      setEditedEmployee({ ...employeeToEdit });
    }
  };

  const handleCancelEdit = () => {
    setEditEmployeeemail(null);
    setEditedEmployee({
      username: "",
      email: "",
      Position: "",
      age: "",
      department: "",
      salary: "",
    });
  };

  const handleDeleteConfirmation = (email) => {
    setShowDeleteConfirmation(true);
    setItemToDelete(email);
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(
        `${process.env.REACT_APP_API_URL}/api/admin/employees/${itemToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedData = employeeData.filter(
          (employee) => employee.email !== itemToDelete
        );
        setEmployeeData(updatedData);
        setShowDeleteConfirmation(false);
        setItemToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting employee data:", error);
      });
  };

  const handleSaveConfirmation = (email) => {
    setShowSaveConfirmation(true);
    setEditEmployeeemail(email); // Set the email of the employee being edited for saving
  };

  const handleConfirmSave = () => {
    const updatedEmployee = {
      username: editedEmployee.username,
      email: editedEmployee.email,
      Position: editedEmployee.Position,
      age: editedEmployee.age,
      department: editedEmployee.department,
      salary: editedEmployee.salary,
    };
    console.log(updatedEmployee);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/admin/employees/${editEmployeeemail}`,
        updatedEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        const updatedData = employeeData.map((employee) =>
          employee.email === editEmployeeemail
            ? { ...updatedEmployee, email: editEmployeeemail }
            : employee
        );

        setEmployeeData(updatedData);
        setEditEmployeeemail(null);
        setEditedEmployee({
          username: "",
          email: "",
          Position: "",
          age: "",
          department: "",
          salary: "",
        });
        setShowSaveConfirmation(false);
      })
      .catch((error) => {
        console.error("Error updating employee data:", error);
      });
  };
  const fetchEmployeeData = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/employees/names`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/admin/employees/names`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setEmployeeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [token]);

  return (
    <div className="component-container">
      <h2 className="employee-component-heading">Employee Management</h2>

      <div className="employee-button-container">
        <button
          onClick={() => handleTabChange("view")}
          className={`employee-tab-button ${
            activeTab === "view" ? "active" : ""
          }`}
        >
          View Employees
        </button>
        <button
          onClick={() => handleTabChange("add")}
          className={`employee-tab-button ${
            activeTab === "add" ? "active" : ""
          }`}
        >
          Add Employee
        </button>
      </div>
      {activeTab === "add" && (
        <div className="add-employee-animation">
          <AddEmployee onAddEmployeeSuccess={fetchEmployeeData} />
        </div>
      )}
      {activeTab === "view" && (
        <div>
          <div class="search-bar">
            <i class="icon">🔍</i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th className="employee-table-header">Name</th>
                  <th className="employee-table-header">Email</th>
                  <th className="employee-table-header">Position</th>
                  <th className="employee-table-header">Age</th>
                  <th className="employee-table-header">Department</th>
                  <th className="employee-table-header">Salary</th>
                  <th className="employee-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterEmployeeData().map((employee) => (
                  <tr key={employee.email}>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.username}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              username: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.username
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.email}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.email
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.Position}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              Position: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.Position
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.age}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              age: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.age
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.department}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              department: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.department
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <input
                          className="employee-edit-field"
                          type="text"
                          value={editedEmployee.salary}
                          onChange={(e) =>
                            setEditedEmployee({
                              ...editedEmployee,
                              salary: e.target.value,
                            })
                          }
                        />
                      ) : (
                        employee.salary
                      )}
                    </td>
                    <td>
                      {employee.email === editEmployeeemail ? (
                        <div className="employee-edited-button">
                          <button
                            className="employee-save-button"
                            onClick={() =>
                              handleSaveConfirmation(employee.email)
                            }
                          >
                            Save
                          </button>
                          <button
                            className="employee-cancel-button"
                            onClick={() => handleCancelEdit()}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="employee-edit-button"
                            onClick={() => handleEdit(employee.email)}
                          >
                            Edit
                          </button>
                          <button
                            className="employee-delete-button"
                            onClick={() =>
                              handleDeleteConfirmation(employee.email)
                            }
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {showSaveConfirmation && (
        <SaveConfirmation
          onSaveConfirmed={() => handleConfirmSave()}
          onCancel={() => setShowSaveConfirmation(false)}
        />
      )}
      {showDeleteConfirmation && (
        <DeleteConfirmation
          onDelete={() => handleConfirmDelete()}
          onCancel={() => handleCancelDelete()}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
