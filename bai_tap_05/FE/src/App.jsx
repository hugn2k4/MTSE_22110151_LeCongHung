import { Spin } from "antd";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./components/context/auth.context";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      try {
        const res = await axios.get("/v1/api/user");
        // axios instance now rejects on non-2xx; when resolved, data is returned
        if (res && !res.message) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.email,
              name: res.name,
            },
          });
        } else {
          // ensure auth is cleared when backend returns an error payload
          setAuth({ isAuthenticated: false, user: null });
        }
      } catch (err) {
        // on 401 or other errors, treat as unauthenticated
        setAuth({ isAuthenticated: false, user: null });
      } finally {
        setAppLoading(false);
      }
    };
    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
