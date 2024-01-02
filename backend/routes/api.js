const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const Note = require("../models/Note");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret key
    req.user = decodedToken; // Attach the decoded token payload to req.user
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Define the '/admin/signup' route for admin registration
router.post("/admin/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Admin Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Define the '/admin/employee' route for admin to create an employee
router.post("/admin/employee", verifyToken, async (req, res) => {
  try {
    const { username, email, password, Position, salary, age, department } =
      req.body;

    const userId = req.user.email;
    const admin = await Admin.findOne({ email: userId });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      username,
      email,
      password: hashedPassword,
      Position,
      salary,
      age,
      department,
      admin: userId, // Link to the admin who is creating the employee
    });
    await newEmployee.save();

    res.setHeader("Content-Type", "application/json");

    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    console.error("Employee Creation error:", error);
    res.status(500).json({ message: "Incomplete Fields" });
  }
});

// New route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;

    if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else if (role === "employee") {
      user = await Employee.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(402).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role }, // Include user ID and role in the token payload
      process.env.SECRET_KEY, // Replace with your actual secret key
      { expiresIn: "1h" } // Token expiration time
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:role/profile", verifyToken, async (req, res) => {
  try {
    const { role } = req.params;
    const userId = req.user.email;

    let userProfile;

    if (role === "Admin") {
      userProfile = await Admin.findOne({ email: userId });
    } else if (role === "employee") {
      userProfile = await Employee.findOne({ email: userId });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    let totalEmployees = 0;
    if (role === "Admin") {
      totalEmployees = await Employee.countDocuments({ admin: userId });
    }

    const userProfileJSON = userProfile.toJSON({ virtuals: true });

    // Add the totalEmployees field to the JSON response
    userProfileJSON.totalEmployees = totalEmployees;

    res.status(200).json(userProfileJSON);
  } catch (error) {
    console.error("Profile Retrieval error:", error);
    console.error("Error Details:", error.message, error.stack);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all employee names
router.get("/admin/employees/names", verifyToken, async (req, res) => {
  try {
    // Find the admin based on the user's token or any other authentication method you're using
    const userId = req.user.email;
    const admin = await Admin.findOne({ email: userId });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Fetch only the employees whose admin email matches the received email
    const employeeNames = await Employee.find({ admin: userId });

    res.status(200).json(employeeNames);
  } catch (error) {
    console.error("Error fetching employee names:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update employee information by employeeId
router.put("/admin/employees/:employeeemail", verifyToken, async (req, res) => {
  try {
    const { employeeemail } = req.params;
    const updatedEmployeeInfo = req.body;

    // Find the admin based on the user's token or any other authentication method you're using
    const userId = req.user.email;
    const admin = await Admin.findOne({ email: userId });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Find the employee by email
    const employee = await Employee.findOne({ email: employeeemail });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee information
    Object.assign(employee, updatedEmployeeInfo);

    // Save the employee document with the updated information
    await employee.save();

    res.status(200).json({
      message: "Employee information updated successfully",
    });
  } catch (error) {
    console.error("Employee Information Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an employee by employeeId
router.delete(
  "/admin/employees/:employeeemail",
  verifyToken,
  async (req, res) => {
    try {
      const { employeeemail } = req.params;

      // Find the employee by email
      const employee = await Employee.findOne({ email: employeeemail });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Delete the employee document
      await Employee.deleteOne({ email: employeeemail });

      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Employee Deletion error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/admin/employees/age-distribution",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.email;
      const ageDistribution = await Employee.aggregate([
        { $match: { admin: userId } },
        {
          $group: {
            _id: "$age",
            count: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json(ageDistribution);
    } catch (error) {
      console.error("Error fetching age distribution:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Department employee count (pie chart or bar chart)
router.get(
  "/admin/employees/department-count",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.user.email;
      const departmentCount = await Employee.aggregate([
        { $match: { admin: userId } },
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json(departmentCount);
    } catch (error) {
      console.error("Error fetching department count:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete("/admin/delete", verifyToken, async (req, res) => {
  try {
    const { password } = req.body;

    // Find the admin by email
    const userId = req.user.email;
    const admin = await Admin.findOne({ email: userId });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if the provided password matches the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    // Delete the admin's data (bills, stock, etc.)
    await Admin.deleteOne({ email: admin.email });

    res.status(200).json({ message: "Admin data deleted successfully" });
  } catch (error) {
    console.error("Admin data deletion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Note app

// Create Note
router.post("/note", async (req, res) => {
  const { title, content, userEmail } = req.body;
  if (!title || !content || !userEmail) {
    return res
      .status(400)
      .json({ message: "Title, content, and user email are required" });
  }
  const newNote = new Note({
    title,
    content,
    userEmail,
  });
  await newNote.save();
  res.status(201).json({ message: "Note created successfully" });
});

// Retrieve Notes for a specific user
router.get("/notes/:userEmail", async (req, res) => {
  const { userEmail } = req.params;
  const notes = await Note.find({ userEmail: userEmail });
  if (!notes) {
    return res.status(404).json({ message: "No notes found for this user" });
  }
  res.status(200).json(notes);
});

// Retrieve a single note by its ID
router.get("/note/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json(note);
});

// Update Note
router.put("/note/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, userEmail } = req.body;
  if (!title || !content || !userEmail) {
    return res
      .status(400)
      .json({ message: "Title, content, and user email are required" });
  }
  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { title, content, userEmail },
    { new: true }
  );
  if (!updatedNote) {
    return res.status(404).json({ message: "Note not found" });
  }
  res
    .status(200)
    .json({ message: "Note updated successfully", note: updatedNote });
});

// Delete Note
router.delete("/note/:id", async (req, res) => {
  const { id } = req.params;
  const deletedNote = await Note.findByIdAndDelete(id);
  if (!deletedNote) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.status(200).json({ message: "Note deleted successfully" });
});

module.exports = router;
