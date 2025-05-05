import { useEffect, useState } from "react";
import styles from "../../styles/Facturas.module.css";

interface Bill {
  billNumber: string;
  firstName: string;
  lastName: string;
  country: string;
  phone: number;
  address: string;
  selectedCar: string;
  quantity: number;
  price: number;
  txHash: string;
  timestamp: string;
}

export default function Sendrect() {
  const [lista, setLista] = useState<Bill[]>([]);
  const [detallesVisibles, setDetallesVisibles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function datos() {
      const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills");
      const data = await response.json();
      setLista(data);
    }
    datos();
  }, []);

  function formatFecha(timestamp: string) {
    const fecha = new Date(timestamp);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = String(fecha.getFullYear()).slice(-2);
    return `${dia}/${mes}/${año}`;
  }

  function toggleDetalles(id: string) {
    setDetallesVisibles(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <section className={styles.section__factura}>
      <h1>REGISTRO DE FACTURACIÓN</h1>
      <div className={styles.factura__grid}>
        {/* Facturas por enviar */}
        <div className={styles.factura__columna}>
          <h2>Por Enviar</h2>
          {lista.length > 0 ? (
            <ul className={styles.factura__lista}>
              {lista.map((item) => (
                <li
                  key={item.billNumber}
                  className={styles.factura__item}
                  data-id={item.billNumber}
                  data-status="pendiente"
                >
                  <p><strong>{item.firstName} {item.lastName}</strong></p>
                  <p>Dirección: {item.address}</p>
                  <p>Auto: {item.selectedCar}</p>
                  <button onClick={() => toggleDetalles(item.billNumber)}>
                    {detallesVisibles[item.billNumber] ? "Ocultar detalles" : "Ver detalles"}
                  </button>

                  {detallesVisibles[item.billNumber] && (
                    <div className={styles.factura__detalles}>
                      <p>País: {item.country}</p>
                      <p>Teléfono: {item.phone}</p>
                      <p>Cantidad: {item.quantity}</p>
                      <p>Precio: {item.price}</p>
                      <p>Fecha: {formatFecha(item.timestamp)}</p>
                      <p>TxHash: {item.txHash}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Cargando datos...</p>
          )}
        </div>

        {/* Facturas enviadas (a integrar luego con drag and drop) */}
        <div className={styles.factura__columna}>
          <h2>Enviadas</h2>
          {/* Por ahora vacío */}
          <p>Arrastra aquí las facturas enviadas.</p>
        </div>
      </div>
    </section>
  );
}
