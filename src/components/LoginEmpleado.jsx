import React, { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const LoginEmpleado = ({ onLoginSuccess }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

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
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login Empleado</h2>
      <form onSubmit={handleLogin} className="card p-4 shadow mx-auto" style={{ maxWidth: "400px" }}>
        <div className="mb-3">
          <label>Correo</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginEmpleado;
