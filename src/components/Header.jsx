import React from 'react';
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import '../css/header.css';

export function Header({ usuario }) {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm py-3 px-6">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src="/img/cuponeralogo.svg" alt="Logo de Cuponera" />
            </Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link active" href="#home">Inicio</a></li>
                <li className="nav-item"><a className="nav-link" href="#cupones">Cupones</a></li>
                <li className="nav-item"><a className="nav-link" href="#perfil">Mi Perfil</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
  