import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Form = ({ onAuthSuccess, onCloseForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Usuario autenticado:", userCredential.user);

            const empleadoDocRef = doc(db, "empleados", userCredential.user.uid);
            const empleadoDoc = await getDoc(empleadoDocRef);

            if (empleadoDoc.exists()) {
                console.log("Usuario es empleado, acceso permitido.");
                setSuccessMessage("Inicio de sesión exitoso. Redirigiendo...");
                onAuthSuccess(); 
                navigate("/canje-de-cupones"); 
            } else {
                console.log("Acceso denegado. Solo los empleados pueden iniciar sesión.");
                await auth.signOut(); 
                setError("Acceso denegado. Solo los empleados pueden iniciar sesión.");
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error);
            setError("Credenciales incorrectas. Verifique su correo y contraseña.");
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div
                className="card p-4 shadow"
                style={{ width: "25rem", backgroundColor: "#d4edda", maxHeight: "80vh", overflowY: "auto" }}
            >
                <button className="btn-close" onClick={onCloseForm}></button>
                <h2 className="text-center">Iniciar Sesión</h2>
                {/* Mostrar mensajes de error o éxito */}
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};