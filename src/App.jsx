import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Login } from "./components/Login.jsx";
import { Form } from "./components/Form.jsx";
import { Header } from "./components/Header.jsx"; // Importar el Header
import 'bootstrap/dist/css/bootstrap.min.css';
import FormularioCanje from "./components/FormularioCanje.jsx";

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/Login" />; 
  }
  return children;
};

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
        {/* Mostrar el Header solo si el usuario está autenticado */}
        {usuario && <Header usuario={usuario} onSignOutClick={handleSignOut} />}

        {/* Mostrar el Login solo si no hay usuario autenticado */}
        {!usuario && (
          <Login usuario={usuario} onSignInClick={() => setMostrarForm(true)} onSignOutClick={handleSignOut} />
        )}

        {/* Mostrar alertas */}
        {alerta && (
          <div className="alert alert-success text-center mt-3 mx-3" role="alert">
            {alerta}
          </div>
        )}

        {/* Mostrar el formulario de inicio de sesión si no hay usuario */}
        {mostrarForm && !usuario && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1000 }}>
            <Form onAuthSuccess={() => { setUsuario(auth.currentUser); setMostrarForm(false); }} onCloseForm={() => setMostrarForm(false)} />
          </div>
        )}

        {/* Rutas */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute user={usuario}>
                <FormularioCanje />
              </ProtectedRoute>
            }
          />
          <Route
            path="/canje-de-cupones"
            element={
              <ProtectedRoute user={usuario}>
                <FormularioCanje />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;