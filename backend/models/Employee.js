const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Position: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
