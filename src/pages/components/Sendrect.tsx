import { useEffect, useState, Fragment } from "react";
import styles from "./Sendrect.module.css";

export default function Sendrect() {
  const [lista, setLista] = useState<Bill[]>([]);
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [expandido, setExpandido] = useState<{ [key: string]: boolean }>({});
  const [modoOscuro, setModoOscuro] = useState(false);
  useEffect(() => {
    document.body.className = modoOscuro ? "oscuro" : "claro";
  }, [modoOscuro]);
  
  const toggleModo = () => setModoOscuro((prev) => !prev);
  


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
    timestamp: Date;
  }

  function formatFecha(timestamp: Date) {
    const fecha = new Date(timestamp);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = String(fecha.getFullYear()).slice(-2);
    return `${dia}/${mes}/${año}`;
  }

  useEffect(() => {
    async function datos() {
      const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills");
      const data = await response.json();
      setLista(data);
    }
    datos();
  }, []);

  const facturasFiltradas = lista.filter((item) => {
    const fecha = new Date(item.timestamp);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();

    const cumpleDia = filtroDia ? dia === parseInt(filtroDia) : true;
    const cumpleMes = filtroMes ? mes === parseInt(filtroMes) : true;
    const cumpleAnio = filtroAnio ? anio === parseInt(filtroAnio) : true;

    return cumpleDia && cumpleMes && cumpleAnio;
  });

  const toggleExpandido = (billNumber: string) => {
    setExpandido((prev) => ({
      ...prev,
      [billNumber]: !prev[billNumber],
    }));
  };

  return (
    <section className={styles.facturas__container}>
      <h1>REGISTRO DE FACTURACIÓN</h1>
      <button className={styles.toggleModo} onClick={toggleModo}>
        {modoOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro"}
      </button>


      {/* 🔎 Filtros */}
      <div className={styles.filtro__fecha}>
        <label>
          Día:
          <input
            type="number"
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
            min="1"
            max="31"
            className="input_fecha"
          />
        </label>
        <label>
          Mes:
          <input
            type="number"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            min="1"
            max="12"
            className="input_fecha"
          />
        </label>
        <label>
          Año:
          <input
            type="number"
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            min="1900"
            className="input_fecha"
          />
        </label>
      </div>

      <div className={styles.columnas}>
        {/* FACTURAS POR ENVIAR */}
        <div className={styles.columna}>
          <h2>Facturas por enviar</h2>
          {facturasFiltradas.length > 0 ? (
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Auto</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((item) => (
                  <Fragment key={item.billNumber}>
                    <tr
                      data-id={item.billNumber}
                      data-status="porEnviar"
                    >
                      <td>{item.firstName} {item.lastName}</td>
                      <td>{item.address}</td>
                      <td>{item.selectedCar}</td>
                      <td>
                        <button
                          className={styles.botonDetalles}
                          onClick={() => toggleExpandido(item.billNumber)}
                        >
                          {expandido[item.billNumber] ? "Ocultar" : "Ver detalles"}
                        </button>
                      </td>
                    </tr>
                    {expandido[item.billNumber] && (
                      <tr className={styles.filaDetalles}>
                        <td colSpan={4}>
                          <div className={styles.detalles}>
                            <ul>
                              <li><strong>País:</strong> {item.country}</li>
                              <li><strong>Teléfono:</strong> {item.phone}</li>
                              <li><strong>Cantidad:</strong> {item.quantity}</li>
                              <li><strong>Precio:</strong> {item.price}</li>
                              <li><strong>Fecha:</strong> {formatFecha(item.timestamp)}</li>
                              <li><strong>Hash:</strong> {item.txHash}</li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron resultados con los filtros actuales.</p>
          )}
        </div>

        {/* FACTURAS ENVIADAS */}
        <div className={styles.columna}>
          <h2>Facturas enviadas</h2>
          <p className={styles.vacio}>Aquí aparecerán las facturas enviadas.</p>
        </div>
      </div>
    </section>
  );
}
