import React, { useState } from "react";
import { auth, db } from "../firebase"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 

export const Form = ({ onAuthSuccess, onCloseForm }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

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
                setSuccessMessage("Inicio de sesión exitoso. Redirigiendo..."); 
                onAuthSuccess(); 
            } else {
                setError("Acceso denegado. Solo los empleados pueden iniciar sesión.");
                await auth.signOut(); 
            }
        } catch (error) {
            console.error("Error durante el inicio de sesión:", error); 

            switch (error.code) {
                case "auth/invalid-credential":
                    setError("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
                    break;
                case "auth/user-not-found":
                    setError("Usuario no encontrado. Verifica tu correo electrónico.");
                    break;
                case "auth/wrong-password":
                    setError("Contraseña incorrecta. Por favor, inténtalo de nuevo.");
                    break;
                default:
                    setError("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.");
                    break;
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center mt-5">
            <div
                className="card p-4 shadow"
                style={{ width: "25rem", backgroundColor: "#d4edda", maxHeight: "80vh", overflowY: "auto" }}>
                <button className="btn-close" onClick={onCloseForm}></button>
                <h2 className="text-center">Iniciar Sesión</h2>

                {/* Mostrar mensaje de éxito */}
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}

                {/* Mostrar mensaje de error */}
                {error && (
                    <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};