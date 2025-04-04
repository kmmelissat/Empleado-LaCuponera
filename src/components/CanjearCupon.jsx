import React, { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const CanjearCupon = ({ empleado }) => {
  const [codigo, setCodigo] = useState("");
  const [datosCupon, setDatosCupon] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const buscarCupon = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    setDatosCupon(null);

    try {
      const snapshot = await getDocs(collection(db, "cupones-comprados"));
      const ahora = Date.now() / 1000;
      let encontrado = null;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const cupones = data.cupones || [];
        const statusDocumento = data.status;

        cupones.forEach((cupon) => {
          const coincideCodigo = cupon.codigo?.toLowerCase().trim() === codigo.toLowerCase().trim();
          const coincideEmpresa = cupon.empresaId?.trim() === empleado.empresaId?.trim();
          const estadoCorrecto = cupon.estado === "Oferta aprobada";
          const statusCorrecto = statusDocumento === "active";
          const noHaVencido = cupon.fechaLimiteUso?.seconds > ahora;
          const noCanjeado = cupon.status !== "canjeado";

          if (
            coincideCodigo &&
            coincideEmpresa &&
            estadoCorrecto &&
            statusCorrecto &&
            noHaVencido &&
            noCanjeado
          ) {
            encontrado = {
              cupon,
              usuario: data.usuario,
              documentoId: docSnap.id,
            };
          }
        });
      });

      if (!encontrado) {
        setError("No se encontró el cupón o no pertenece a tu empresa.");
        return;
      }

      setDatosCupon(encontrado);
    } catch (err) {
      console.error("Error al buscar el cupón", err);
      setError("Ocurrió un error al buscar el cupón.");
    }
  };

  const canjearCupon = async () => {
    if (!datosCupon) return;

    try {
      const { documentoId, cupon } = datosCupon;
      const docRef = doc(db, "cupones-comprados", documentoId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      const nuevosCupones = data.cupones.map((c) =>
        c.codigo === cupon.codigo
          ? { ...c, status: "canjeado", fechaCanje: new Date().toISOString() }
          : c
      );

      await updateDoc(docRef, {
        cupones: nuevosCupones,
      });

      setMensaje("¡Cupón canjeado exitosamente!");
      setDatosCupon(null);
      setCodigo("");
    } catch (err) {
      console.error("Error al canjear", err);
      setError("Ocurrió un error al canjear el cupón.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">
        Canje de Cupones - {empleado.nombres} ({empleado.empresa})
      </h3>

      <form
        onSubmit={buscarCupon}
        className="card p-4 shadow mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="mb-3">
          <label className="form-label">Código del cupón</label>
          <input
            type="text"
            className="form-control"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Buscar
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
      {mensaje && <div className="alert alert-success mt-3 text-center">{mensaje}</div>}

      {datosCupon && (
        <div className="card mt-4 shadow mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <h5 className="card-title">Datos del Cliente</h5>
            <p><strong>Nombre:</strong> {datosCupon.usuario.nombres} {datosCupon.usuario.apellidos}</p>
            <p><strong>DUI:</strong> {datosCupon.usuario.dui}</p>

            <h5 className="card-title mt-4">Detalles del Cupón</h5>
            <p><strong>Título:</strong> {datosCupon.cupon.titulo}</p>
            <p><strong>Descripción:</strong> {datosCupon.cupon.descripcion}</p>
            <p><strong>Precio Oferta:</strong> ${datosCupon.cupon.precioOferta}</p>

            <button onClick={canjearCupon} className="btn btn-success w-100 mt-3">
              Canjear Cupón
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanjearCupon;
