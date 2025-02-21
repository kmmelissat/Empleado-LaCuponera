import React, { useEffect, useState } from "react";

const Bienvenida = ({ usuario }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!usuario || !visible) return null;

  return (
    <div className="alert alert-success text-center" role="alert">
      ¡Bienvenido, {usuario.email}!
    </div>
  );
};

export default Bienvenida;
