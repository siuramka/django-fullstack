import { useContext, useState } from "react";
import { getUserDataFromJWT, Login } from "../../services/AuthService";
import { AuthContext } from "../../features/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const tokens = await Login(formData.username, formData.password);
    const userData = getUserDataFromJWT(tokens.access);

    if (tokens && userData) {
      setLogin(
        userData.username,
        userData.email,
        tokens.access,
        tokens.refresh
      );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen ">
        <form
          className="bg-white rounded px-8 pt-6 pb-8 mb-4 w-96 shadow-md"
          onSubmit={handleLogin}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="username"
              required={true}
              type="text"
              placeholder="Enter your username"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              required={true}
              type="password"
              placeholder="Enter your password"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="text-black font-bold  rounded focus:outline-none focus:shadow-outline cursor-pointer"
              type="submit"
              onClick={() => navigate("/sign-up")}
            >
              Register Page
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
