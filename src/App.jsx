import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Header } from "./components/Header.jsx";
import { Form } from "./components/Form.jsx";
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
      <div 
        style={{
          backgroundImage: 'url("/img/fondo.jpeg")', 
          backgroundSize: 'cover', 
          minHeight: "100vh",
          backgroundPosition: "center"
        }}
      >
        <Header usuario={usuario} />
        
        <div style={{
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh", 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 100
        }}>
          {!usuario && (
            <button className="btn btn-outline-dark mx-3" onClick={() => setMostrarForm(true)}>
              Iniciar Sesión
            </button>
          )}

          {usuario && (
            <button className="btn btn-outline-danger mx-3" onClick={handleSignOut}>
              Cerrar Sesión
            </button>
          )}
        </div>

        {/* Alerta */}
        {alerta && (
          <div className="alert alert-info text-center" role="alert">
            {alerta}
          </div>
        )}

        {/* Formulario de autenticación */}
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
