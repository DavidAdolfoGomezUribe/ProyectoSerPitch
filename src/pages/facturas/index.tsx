"use client"

async function fetchData() {
    const data = await(await(fetch("https://67f854922466325443ec6b72.mockapi.io/bills"))).json()
    const newData = JSON.stringify(data)
    console.log(newData);
    
    return newData
}
const ejemplo = fetchData()

export default function Facturas(){
    
    

 return(
    <>  
        <h1>Hola</h1>
        <p>{ejemplo}</p>
    </>
 )
}