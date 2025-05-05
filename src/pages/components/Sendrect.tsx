import { useAssets } from "@meshsdk/react";
import { useEffect, useState } from "react";

import styles from "../../styles/Facturas.module.css"
import { table } from "console";

export default function Sendrect() {
  const [lista, setLista] = useState([]);


  useEffect(() => {
    async function datos() {
      const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills")
      const data = await response.json()
      console.log(data)
      setLista(data)      
  } 
  datos()
}, []); // [] asegura que esto se ejecute solo una vez al montar el componente
return (
  <>
  <section className={styles.section__factura}>
    <h1>REGISTRO DE FACTURACION</h1>
    {lista.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>...</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>Cargando los datos...</p>
    )}

    <p>{/* AQUI VAN LAS FACTURAS ENVIADAS */}</p>
  </section>
</>

);
}

 //como mostrar info de fetch de datos.