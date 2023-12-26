import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./features/AuthContext";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import ChatPage from "./components/ChatPage/ChatPage";

function App() {
  const { userAuth } = useContext(AuthContext);

  return (
    <Layout>
      {userAuth.isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      ) : (
        <>
          <Routes>
            <Route path="*" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/sign-up" element={<RegisterPage />} />
          </Routes>
        </>
      )}
    </Layout>
  );
}

export default App;
