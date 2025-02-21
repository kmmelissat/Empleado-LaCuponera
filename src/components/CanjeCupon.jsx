import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// esta es la parte que no se porque no se renderiza// 
function CanjeCupon() {

    const [codigo, setCodigo] = useState('');
    const [dui, setDui] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [empleado, setEmpleado] = useState(null);

    // Verificaciones para ver que la persona que canjee es un empleado, en firebase, puse un rol de empleado en la colecion. pero no se si eso funciona

    useEffect(() => {

        const verificarEmpleado = async () => {
            if (auth.currentUser) {
                const empleadoRef = doc(db, 'empleados', auth.currentUser.uid);
                const empleadoDoc = await getDoc(empleadoRef);
                if (empleadoDoc.exists()) {
                    setEmpleado(empleadoDoc.data());
                }
            }
        };
        verificarEmpleado();
    }, []);

    //todo el formulario que ingresa para canjear el cupon//

    return (
        <div className="container mt-5">
            <h2>Canje de Cupones</h2>
            <form>
                <div className="mb-3">
                    <label className="form-label">Código del Cupón</label>
                    <input type="text" className="form-control" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">DUI del Comprador</label>
                    <input type="text" className="form-control" value={dui} onChange={(e) => setDui(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Canjear</button>
            </form>
            {mensaje && <p className="mt-3 alert alert-info">{mensaje}</p>}
        </div>
    );
}

export default CanjeCupon;
