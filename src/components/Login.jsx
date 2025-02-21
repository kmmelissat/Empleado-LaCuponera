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
        <div>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img src="/img/cuponeralogo.svg" alt="Logo de Cuponera" />
                </Link>
                <div>
                    <div className="d-flex align-items-center">
                    {usuario ? (
                        <button className="btn btn-outline-danger mx-3" onClick={handleSignOut}>Cerrar Sesión</button>
                    ) : (
                        <button className="btn btn-outline-dark mx-3" onClick={onSignInClick}>Iniciar Sesión</button>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}
