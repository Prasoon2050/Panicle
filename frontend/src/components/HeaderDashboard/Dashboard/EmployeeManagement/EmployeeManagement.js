import React, { useState, useEffect } from "react";
import axios from "axios";
import AddEmployee from "./AddEmployee";
import DeleteConfirmation from "./DeleteConfirmation/DeleteConfirmation";
import SaveConfirmation from "./SaveConfirmation/SaveConfirmation";
import "./EmployeeManagement.css";
import { HiSortAscending } from "react-icons/hi";

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
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortColumn, setSortColumn] = useState("username");

  const token = localStorage.getItem("token");

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      toggleSortOrder();
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const performSorting = (data) => {
    return data.slice().sort((a, b) => {
      const columnA = a[sortColumn].toLowerCase();
      const columnB = b[sortColumn].toLowerCase();
      if (columnA < columnB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (columnA > columnB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const filterEmployeeData = () => {
    return employeeData.filter((employee) => {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      const usernameMatches = employee.username
        .toLowerCase()
        .includes(lowerCaseSearchQuery);
      const emailMatches = employee.email
        .toLowerCase()
        .includes(lowerCaseSearchQuery);
      const positionMatches =
        employee.Position.toLowerCase().includes(lowerCaseSearchQuery);
      const departmentMatches = employee.department
        .toLowerCase()
        .includes(lowerCaseSearchQuery);

      return (
        usernameMatches || emailMatches || positionMatches || departmentMatches
      );
    });
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
    setEditEmployeeemail(email);
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
    fetchEmployeeData();
  }, [token]);

  return (
    <div className="component-container">
      <h2 className="employee-component-heading">Employee Management</h2>

      <div className="employee-button-container">
        <button
          onClick={() => setActiveTab("view")}
          className={`employee-tab-button ${
            activeTab === "view" ? "active" : ""
          }`}
        >
          View Employees
        </button>
        <button
          onClick={() => setActiveTab("add")}
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
          <div className="search-bar">
            <i className="icon">🔍</i>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              title="Search for any field of data."
            />
          </div>
          <div className="employee-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("username")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Name <HiSortAscending />
                  </th>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("email")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Email <HiSortAscending />
                  </th>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("Position")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Position <HiSortAscending />
                  </th>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("age")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Age <HiSortAscending />
                  </th>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("department")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Department <HiSortAscending />
                  </th>
                  <th
                    className="employee-table-header"
                    onClick={() => handleSort("salary")}
                    style={{ cursor: "pointer" }}
                    title="Click here to sort in ascending or descending order"
                  >
                    Salary <HiSortAscending />
                  </th>
                  <th className="employee-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {performSorting(filterEmployeeData()).map((employee) => (
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
