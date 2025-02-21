import React from 'react';
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export function Login({ usuario, onSignInClick }) {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Sesión cerrada");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column justify-content-center align-items-center">
            <Link className="navbar-brand" to="/">
                <img src="/img/cuponeralogo.svg" alt="Logo de Cuponera" className="img-fluid" style={{ width: '600px' }} />
            </Link>
            <div className="mt-3">
                <div className="d-flex justify-content-center">
                    {usuario ? (
                        <button className="btn btn-outline-danger btn-lg mx-3" onClick={handleSignOut}>Cerrar Sesión</button>
                    ) : (
                        <button className="btn btn-outline-dark btn-lg mx-3" onClick={onSignInClick}>Iniciar Sesión</button>
                    )}
                </div>
            </div>
        </div>
    );
}
