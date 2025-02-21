import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Importar la base de datos de Firestore
import { collection, getDocs } from 'firebase/firestore';

const Perfil = () => {
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        const fetchEmpleados = async () => {
            const empleadosCollection = collection(db, 'empleados');
            const empleadosSnapshot = await getDocs(empleadosCollection);
            const empleadosList = empleadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEmpleados(empleadosList);
        };

        fetchEmpleados();
    }, []);

    return (
        <section>
            <div className="container py-5">
                <div className="row d-flex justify-content-center align-items-center">
                    {empleados.map((empleado) => (
                        <div key={empleado.id} className="col-lg-6 mb-4">
                            <div className="card mb-3 shadow-sm" style={{ borderRadius: ".5rem" }}>
                                <div className="row g-0">
                                    {/* Sección de imagen y nombre */}
                                    <div 
                                        className="col-md-4 text-center" 
                                        style={{
                                            borderTopLeftRadius: ".5rem", 
                                            borderBottomLeftRadius: ".5rem"
                                        }}
                                    >
                                        <img 
                                            src="/img/fotoPerfil.jpeg" 
                                            alt="Avatar" 
                                            className="img-fluid my-5 rounded-circle" 
                                            style={{ width: "80px" }} 
                                        />
                                        <h5 className="fw-bold">{empleado.nombres} {empleado.apellidos}</h5>
                                        <p>{empleado.rol}</p>
                                    </div>
                                    
                                    {/* Sección de información */}
                                    <div className="col-md-8">
                                        <div className="card-body p-4">
                                            <h6>Información</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{empleado.email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Teléfono</h6>
                                                    <p className="text-muted">{empleado.telefono}</p>
                                                </div>
                                            </div>

                                            <h6>Detalles Adicionales</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Dirección</h6>
                                                    <p className="text-muted">{empleado.direccion}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>DUI</h6>
                                                    <p className="text-muted">{empleado.dui}</p>
                                                </div>
                                            </div>

                                            {/* Iconos de redes sociales */}
                                            <div className="d-flex justify-content-start">
                                                <a href="#!" className="text-success me-3"><i className="fab fa-facebook-f fa-lg"></i></a>
                                                <a href="#!" className="text-success me-3"><i className="fab fa-twitter fa-lg"></i></a>
                                                <a href="#!" className="text-success"><i className="fab fa-instagram fa-lg"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Perfil;
