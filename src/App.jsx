import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginEmpleado from "./components/LoginEmpleado";
import CanjearCupon from "./components/CanjearCupon";
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const [empleado, setEmpleado] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            empleado ? (
              <Navigate to="/canje" />
            ) : (
              <LoginEmpleado onLoginSuccess={setEmpleado} />
            )
          }
        />
        <Route
          path="/canje"
          element={
            empleado ? (
              <CanjearCupon empleado={empleado} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        {/* Ruta base: redirigir al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
