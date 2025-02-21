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
    setMensajeExito("");  // Resetea el mensaje de éxito

    try {
      const cuponesRef = collection(db, "cupones-comprados");
      const querySnapshot = await getDocs(cuponesRef);
      let cuponEncontrado = null;
      let docId = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const usuarioDui = data.usuario?.dui; // Obtener DUI del usuario
        const cupones = data.cupones || []; // Obtener lista de cupones

        // Buscar un cupón con el código ingresado y validar DUI
        const cuponValido = cupones.find((cupon) => cupon.codigo === codigoCupon);

        if (cuponValido && usuarioDui === dui) {
          cuponEncontrado = { ...cuponValido, id: doc.id }; // Guardar el cupón encontrado
          docId = doc.id;
        }
      });

      if (cuponEncontrado) {
        // Actualizar el estado del cupón a "canjeado" en Firestore
        const cuponRef = doc(db, "cupones-comprados", docId);
        const cuponesActualizados = cupones.map((cupon) =>
          cupon.codigo === codigoCupon ? { ...cupon, estado: "canjeado" } : cupon
        );
        
        await updateDoc(cuponRef, {
          cupones: cuponesActualizados
        });

        // Mostrar mensaje de éxito
        setMensajeExito("El cupón ha sido canjeado exitosamente.");
        onSubmit(cuponEncontrado);  // Opcional: pasar el cupon encontrado al componente superior
      } else {
        setError("Cupón no encontrado o datos incorrectos.");
      }
    } catch (error) {
      setError("Error al validar el cupón.");
      console.error("Error al validar el cupón: ", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Canje de Cupón</h3>
      <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Código del Cupón</label>
          <input 
            type="text" 
            className="form-control" 
            value={codigoCupon} 
            onChange={(e) => setCodigoCupon(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
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
        <button type="submit" className="btn btn-primary w-100">Canjear</button>
      </form>
    </div>
  );
};

export default FormularioCanje;
