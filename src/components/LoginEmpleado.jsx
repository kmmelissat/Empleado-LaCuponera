import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginEmpleado = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Iniciar sesión con Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, correo, contrasena);
      const user = cred.user;

      // Buscar en colección empleados
      const q = query(
        collection(db, "empleados"),
        where("correo", "==", user.email.toLowerCase().trim())
      );
      const res = await getDocs(q);

      if (res.empty) {
        setError("Acceso denegado. Solo empleados pueden iniciar sesión.");
        await signOut(auth); // cerrar sesión si no está autorizado
        return;
      }

      // Usuario es empleado ✅
      const empleado = res.docs[0].data();
      onLoginSuccess(empleado); // pasar datos al componente padre
      navigate("/empleado/dashboard"); // Redirigir a la página de inicio del empleado
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 flex-column">
      <h1 className="text-center text-success fw-bold mb-4">La Cuponera Empleado 🎟️</h1>

      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4 text-success">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="empleado@cuponera.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-success w-100">
            Entrar
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted mt-4" style={{ fontSize: "0.9rem" }}>
        © 2025 La Cuponera. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default LoginEmpleado;
