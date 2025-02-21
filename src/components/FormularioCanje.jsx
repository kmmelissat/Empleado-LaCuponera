import React, { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const FormularioCanje = ({ onSubmit }) => {
  const [codigoCupon, setCodigoCupon] = useState("");
  const [dui, setDui] = useState("");
  const [error, setError] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMensajeExito("");
  
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
  
      // Actualizar el campo status a "canjeado"
      await updateDoc(doc(db, "cupones-comprados", docId), {
        status: "canjeado",
      });
  
      setMensajeExito("El cupón ha sido canjeado exitosamente.");
      onSubmit({ codigo: codigoCupon, status: "canjeado" });
    } catch (error) {
      console.error("Error al validar el cupón: ", error);
    }
  };
  
  return (
    <div className="container mt-4">
      <h3 className="text-center">Canje de Cupón</h3>
      <form onSubmit={handleSubmit} className="p-3 border rounded bg-light w-25 mx-auto">
        <div className="mb-3 text-center">
          <label className="form-label">Código del Cupón</label>
          <input
            type="text"
            className="form-control"
            value={codigoCupon}
            onChange={(e) => setCodigoCupon(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 text-center">
          <label className="form-label">DUI</label>
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
        <button type="submit" className="btn btn-success w-100 py-3">
          Canjear
        </button>
      </form>
    </div>
  );
};

export default FormularioCanje;
