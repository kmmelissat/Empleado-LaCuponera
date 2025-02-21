import React, { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const FormularioCanje = ({ onSubmit }) => {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [dui, setDui] = useState("");
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [datosCupon, setDatosCupon] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensajeExito("");
    setDatosCupon(null);

    if (!codigoCupon.trim() || !dui.trim()) {
      setError("Debe ingresar el código del cupón y el DUI.");
      return;
    }

    try {
      const cuponesRef = collection(db, "cupones-comprados");
      const querySnapshot = await getDocs(cuponesRef);

      const documento = querySnapshot.docs.find((doc) => {
        const data = doc.data();
        const usuarioDui = data.usuario?.dui;
        const cupones = data.cupones || [];

        return cupones.some((cupon) => cupon.codigo === codigoCupon) && usuarioDui === dui;
      });

      if (!documento) {
        setError("Cupón no encontrado o datos incorrectos.");
        return;
      }

      const docId = documento.id;
      const data = documento.data();

      // Actualizar el campo status a "canjeado"
      await updateDoc(doc(db, "cupones-comprados", docId), {
        status: "canjeado",
      });

      // Obtener los datos del cupón y del usuario
      const cuponEncontrado = data.cupones.find(cupon => cupon.codigo === codigoCupon);
      const datosUsuario = data.usuario;

      setDatosCupon({
        usuario: datosUsuario,
        cupon: cuponEncontrado
      });

      setMensajeExito("El cupón ha sido canjeado exitosamente.");
      onSubmit({ codigo: codigoCupon, status: "canjeado" });
    } catch (error) {
      console.error("Error al validar el cupón: ", error);
      setError("Ocurrió un error al procesar el cupón.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Canje de Cupón</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-center">Código del Cupón</label>
                  <input
                    type="text"
                    className="form-control"
                    value={codigoCupon}
                    onChange={(e) => setCodigoCupon(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-center">DUI</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dui}
                    onChange={(e) => setDui(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {mensajeExito && <div className="alert alert-success">{mensajeExito}</div>}
                <button type="submit" className="btn btn-success w-100">
                  Canjear
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {datosCupon && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h4 className="card-title">Datos del Cupón Canjeado</h4>
                <h5>Usuario</h5>
                <p>Nombre: {datosCupon.usuario.nombres} {datosCupon.usuario.apellidos}</p>
                <p>DUI: {datosCupon.usuario.dui}</p>
                <h5>Cupón</h5>
                <p>Código: {datosCupon.cupon.codigo}</p>
                <p>Título: {datosCupon.cupon.titulo}</p>
                <p>Descripción: {datosCupon.cupon.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioCanje;