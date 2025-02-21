import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Header } from "./components/Header.jsx";
import { Form } from "./components/Form.jsx";
import { Footer } from "./components/Footer.jsx";
import './css/custom.css';


function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [alerta, setAlerta] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        setAlerta("¡Has iniciado sesión correctamente!");
        setTimeout(() => setAlerta(null), 3000);
      } else {
        setUsuario(null);
        setAlerta("Has cerrado sesión.");
        setTimeout(() => setAlerta(null), 3000);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Router>
      <div style={{ backgroundColor: "rgb(227, 238, 206)", minHeight: "100vh" }}>
        <Header usuario={usuario} onSignInClick={() => setMostrarForm(true)} onSignOutClick={handleSignOut} />

        
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
                <li className="nav-item"><a className="nav-link active" href="#home">Inicio</a></li>
                <li className="nav-item"><a className="nav-link" href="#cupones">Cupones</a></li>
                <li className="nav-item"><a className="nav-link" href="#perfil">Mi Perfil</a></li>
            </ul>
        </div>

        <div class="row">
            <section id="quick-links" class="col-md-6 mb-4">
                <h3>Quick Links</h3>
                <div class="list-group">
                    <a href="#timesheet" class="list-group-item list-group-item-action">Submit Timesheet</a>
                    <a href="#vacation" class="list-group-item list-group-item-action">Request Vacation</a>
                    <a href="#benefits" class="list-group-item list-group-item-action">View Benefits</a>
                    <a href="#training" class="list-group-item list-group-item-action">Training Modules</a>
                </div>
            </section>

            <section id="announcements" class="col-md-6 mb-4">
                <h3>Recent Announcements</h3>
                <ul class="list-group">
                    <li class="list-group-item">Company picnic scheduled for next month</li>
                    <li class="list-group-item">New health insurance options available</li>
                    <li class="list-group-item">Quarterly meeting presentation slides now available</li>
                </ul>
            </section>
        </div>

        <Footer/>
        

        {alerta && (
          <div className="alert alert-info text-center" role="alert">
            {alerta}
          </div>
        )}

        {mostrarForm && !usuario && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 }}>
            <Form onAuthSuccess={() => { setUsuario(auth.currentUser); setMostrarForm(false); }} onCloseForm={() => setMostrarForm(false)} />
          </div>
        )}

        <Routes>
          <Route path="/" element={<></>} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;
