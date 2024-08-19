import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "./../context/AuthContext";

export const useHttp = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);

  const request = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setLoading(true);
      // const baseUrl = "http://localhost:9900";
      try {
        if (body) {
          body = JSON.stringify(body);
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${url}`, { // Use baseUrl
          method,
          body,
          headers,
        });
        const data = await response.json();

        if (!response.ok) {
          if (data.message === "Avtorizatsiyadan o'tilmagan") {
            auth.logout();
            history.push("/");
          }
          throw new Error(
            data.message || data.error || "Ko`zda tutilmagan xatolik yuzberdi"
          );
        }
        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e.message;
      }
    },
    [auth, history]
  );

  const clearError = useCallback(() => setError(null), [setError]);

  return { loading, request, error, clearError };
};
