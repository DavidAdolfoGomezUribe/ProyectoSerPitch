"use client"
import { useEffect, useState } from "react";

//como estamos usando type script no se puede hacer lo que yo hice en el comit anterior, por lo tanto
//lo primero es declarar una interface , que va a ser una lista de parametros que esperamos recibir

export default function Facturas() {
  
    interface Bill {
    billNumber: string;
    firstName: string;
    lastName: string;
    selectedCar: string;
    quantity: number;
    // para agregar parametros que necesite desplegar despues en el render
    // country:string;
    // price: number;
  }

  //ud recuerda que react define un estado inicial para las variables
  //en este caso lo que va a hacer es definir como estado inicial la interface decalarada como bill, que ademas es un array
  const [data, setData] = useState<Bill[]>([]);
  
  console.log(data); 
  
  //react no puede redenderizar directamente una promesa :c por lo tanto es obligatorio el useEffect
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills");
      const jsonData = await response.json();
      setData(jsonData); 
      //una vez hecha la peticion lo que hace es introducir los valores de jsonData usando setData()
      //si hace log de setData antes de hacer la peticion deberia devolerle un array vacio 
    }
    //toca rellamar la funcion
    fetchData();
  }, []); //ni idea de por que useEffec se declara con ,[]); al final



  return (
    <>  
      <h1>Facturas</h1>

      {/* Oe parce , esto es un ternario, basicamente cuando react redenderiza todo lo ultmo q hace es hacer el fetch, si es ok , redenderiza denuevo
        en este caso lo que dice es, mientras el arreglo sea 0 . pon cargando sino redenderiza
      */}
      {data.length === 0 ? ( <p>Cargando...</p>) : ( //esto de aca es un ternadio, se lee si data igual cero lanza un p con cargando,sino redenderiza lo demas
        <ul>
          {data.map((item, index) => ( //recuerde que map aplica una funcion sobre cada elemento q encuentre y retorna un nuevo array
            <li key={item.billNumber || index}>
              <strong>{item.firstName} {item.lastName}</strong> - {item.selectedCar} - Cantidad: {item.quantity}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}