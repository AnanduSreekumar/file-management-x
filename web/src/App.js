import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function () {
  const [user, setUser] = useState(localStorage.getItem("email"));

  let navigate = useNavigate();
  const redirect = () => {
    return navigate("/auth");
  };
  useEffect(() => {
    redirect();
  }, [user]);

  return <h1>Welcome</h1>;
}
