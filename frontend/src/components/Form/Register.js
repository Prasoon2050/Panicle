import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";

const Register = (props) => {
  const { register, handleSubmit, reset } = useForm();

  const [userInfo, setUserInfo] = useState();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://panicle-api.onrender.com/api/admin/signup",
        data
      );
      setMessage(response.data.message);
      setUserInfo(data);
      reset();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-firsthalf-reg">
        <h1 className="heading">One of Us?</h1>
        <p className="reg-p">
          If you already have an account,
          <br /> just sign in. we've missed you!
        </p>
        <div className="reg-button-container">
          <Link to="/">
            <button className={`reg-create-account-button-sign`}>
              Sign in
            </button>
          </Link>
        </div>
      </div>
      <div className="reg-secondhalf-reg">
        <h1 className="heading">Create Free Account</h1>
        <div className="reg-signup-form">
          {message && <div className="success-message">{message}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>Username</label>
            <input
              className="input-field"
              type="text"
              id="username"
              placeholder="username"
              {...register("username", {
                required: "Enter User Name",
              })}
            />
            <br />
            <label>Email</label>
            <input
              className="input-field"
              type="text"
              id="email"
              placeholder="example@gmail.com"
              {...register("email", { required: "Enter email" })}
            />
            <br />
            <label>Password</label>
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder="********"
              {...register("password", {
                required: "Enter Password",
              })}
            />
            <br />
            <br />
            <div className="reg-button-container">
              <button type="submit" className="reg-create-account-button">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
