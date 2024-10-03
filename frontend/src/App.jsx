import AllRoutes from "./Routes/Routes";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth status
  const [loading, setLoading] = useState(true); // Track if auth check is still loading
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unprotectedRoutes = ["/signin", "/signup"]; // Define unprotected routes

    // Skip auth check on unprotected routes
    if (unprotectedRoutes.includes(location.pathname)) {
      setLoading(false); // Stop loading if the page is unprotected
      return;
    }

    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/signin");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.id && response.data.firstName) {
          setIsAuthenticated(true); // User is authenticated
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          navigate("/signin");
          setLoading(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        navigate("/signin");
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [location, navigate]);

  // While checking auth status, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <AllRoutes isAuthenticated={isAuthenticated} />
    </div>
  );
}

export default App;
