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

    // Validar que los campos no estén vacíos
    if (!codigoCupon.trim() || !dui.trim()) {
      setError("Debe ingresar el código del cupón y el DUI.");
      return;
    }

    try {
      const cuponesRef = collection(db, "cupones-comprados");
      const querySnapshot = await getDocs(cuponesRef);

      // Buscar el cupón válido dentro de Firestore
      const documento = querySnapshot.docs.find((doc) => {
        const data = doc.data();
        const usuarioDui = data.usuario?.dui; // Obtener el DUI del usuario
        const cupones = data.cupones || []; // Lista de cupones

        return cupones.some((cupon) => cupon.codigo === codigoCupon) && usuarioDui === dui;
      });

      if (!documento) {
        setError("Cupón no encontrado o datos incorrectos.");
        return;
      }

      // Obtener la referencia del documento
      const docId = documento.id;
      const data = documento.data();
      const cuponesActualizados = data.cupones.map((cupon) =>
        cupon.codigo === codigoCupon ? { ...cupon, estado: "canjeado" } : cupon
      );

      // Actualizar Firestore
      await updateDoc(doc(db, "cupones-comprados", docId), { cupones: cuponesActualizados });

      // Mostrar mensaje de éxito
      setMensajeExito("El cupón ha sido canjeado exitosamente.");
      onSubmit({ codigo: codigoCupon, estado: "canjeado" });
    } catch (error) {
      setError("Error al validar el cupón.");
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
