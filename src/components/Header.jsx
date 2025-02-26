import React from 'react';
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export function Header({ usuario, onSignOutClick }) {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            if (onSignOutClick) onSignOutClick(); 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3">
          <div className="container-fluid">
            {/* Logo */}
            <Link className="navbar-brand" to="/">
              <img src="/img/cuponeralogo.svg" alt="Logo de Cuponera" style={{ width: '150px' }} />
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/perfil">Perfil</Link>
                </li>
                {usuario && (
                  <li className="nav-item">
                    <button className="btn btn-outline-danger mx-3" onClick={handleSignOut}>
                      Cerrar Sesión
                    </button>
                  </li>
                )}
                </ul>
            </div>
          </div>
        </nav>
      </header>
    );
}
