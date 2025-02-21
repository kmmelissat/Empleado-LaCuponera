import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Login } from "./components/Login.jsx";
import { Form } from "./components/Form.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import FormularioCanje from "./components/FormularioCanje.jsx";

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
        <Login usuario={usuario} onSignInClick={() => setMostrarForm(true)} onSignOutClick={handleSignOut} />
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
          <Route path="/canje-de-cupones" element={<FormularioCanje/>} />
        </Routes>
    </Router>
  );
}

export default App;
