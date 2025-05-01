import { useState, useEffect, useCallback } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';
import Image from 'next/image';
import AutoScrollGallery from "./components/AutoScrollGallery";
const Home: NextPage = () => {

  const { connected, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount,setAmount] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  
  const [currentCar,setCurrentCar ] = useState({
    name: 'Toyota Corolla Cross Hybrid GR Sport',
    image: '/Toyota.png',
    price: '0.10' // Precio base para Toyota
  });
  
  const imagePaths = [
    '/carone.png',
    '/cartwo.png',
    '/carthree.png'
  ];

  async function postFacture(txHash: string) {
    const carData = JSON.parse(localStorage.getItem('carPurchases') || '{}');
    const response = await fetch('https://67f854922466325443ec6b72.mockapi.io/bills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...carData, txHash }),
    });
    return await response.json();
  }

  async function tx() {
    const carPurchase = localStorage.getItem('carPurchases');
    
    if (!carPurchase) {
      alert('🚨 No hay nada en el carrito');
      return;
    }
    
    try {
      const { price, amount } = JSON.parse(carPurchase);
      
      // Validar datos numéricos
      if (isNaN(price) || isNaN(amount)) {
        alert('Error: Datos inválidos en el carrito');
        return;
      }
  
      // Calcular total en lovelace (1 ADA = 1,000,000 lovelace)
      const priceNumber = parseFloat(price);
      const amountNumber = parseInt(amount);
      const totalLovelace = Math.round(priceNumber * amountNumber * 1000000);
  
      if (!wallet) {
        alert('Wallet no conectada');
        return;
      }
  
      // Verificar balance suficiente
      if (balance !== null && balance < totalLovelace / 1000000) {
        alert('❌ Balance insuficiente');
        return;
      }
  
      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        'addr1q8hgvw69utaqwlz3zdwswa39rl428cqe47uv97jht89034slnpfxfa09mlp65fa6hnqk4pu4ar57vzrqtx6s84yhdpuqplk2a7',
        totalLovelace.toString()
      );
  
      const unsignedTx = await tx.build().catch(error => {
        throw new Error(`Error construyendo transacción: ${error.message}`);
      });
  
      // Paso 2: Firmar transacción
      const signedTx = await wallet.signTx(unsignedTx).catch(error => {
        if (error.message.includes('declined')) {
          throw new Error('Has cancelado la firma de la transacción');
        }
        throw new Error(`Error firmando transacción: ${error.message}`);
      });
  
      // Paso 3: Enviar transacción
      const txHash = await wallet.submitTx(signedTx).catch(error => {
        throw new Error(`Error enviando transacción: ${error.message}`);
      });
      
      postFacture(txHash)

      console.log('Transacción exitosa:', txHash);
      alert(`✅ Transacción exitosa!\nHash: ${txHash}`);
      


      // Limpiar carrito después de transacción exitosa
      localStorage.removeItem('carPurchases');
      setAmount(1);
  
    } catch (error) {
      console.error('Error en la transacción:', error);
      alert(`❌ Error en la transacción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  
  const getBalance = useCallback(async () => {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getBalance();
      setBalance(Math.round(Number(_assets[0].quantity) / 1000000));
      setLoading(false);
    }
  }, [wallet]); // Dependencias de la función
  
  useEffect(() => {
    if (connected) getBalance();
  }, [connected, getBalance]); 

  
  
  
  


  // Handler para cambiar imagen (nuevo)
  const handleImageClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagePaths.length);
  };
  

  const [currentCarImage,setCurrentCarImage]= useState<string>("/Toyota.png")


  
  // notacion de tipescrtip , asi se declara un objeto en typescript declarando , en este ejemplo , que ambos son de tipo string
  //[key,value]


  const carPrices : Record<string, string> =  {
    'Toyota Corolla Cross Hybrid GR Sport': '1',
    'Suzuki Grand Vitara': '1.1',
    'Suzuki S-Presso': '1.2',
    'Subaru WRX': '1.3',
    'Chery Omoda 5': '1.4'

  }


  const handleCarClick = (carName:string) => {

    const images: Record<string, string> = {
      'Toyota Corolla Cross Hybrid GR Sport': '/Toyota.png',
      'Suzuki Grand Vitara': '/SuzukiGV.png',
      'Suzuki S-Presso': '/SuzukiSP.png',
      'Subaru WRX': '/SubaruWRX.png',
      'Chery Omoda 5': '/CheryOmoda5.png'
    };

    setCurrentCar({
      name: carName,
      image: images[carName],
      price: carPrices[carName]
    });
    setAmount(1); 


    setCurrentCarImage(images[carName]);
  
  };

  const incrementAmount = () => setAmount(prev => prev + 1);
  const decrementAmount = () => setAmount(prev => (prev > 1 ? prev - 1 : 1));

  const saveToLocalStorage = () => {
    const carData = {
      name: currentCar.name,
      amount: amount.toString(),
      price: currentCar.price
    };
  
    // Sobrescribe directamente con el nuevo registro
    localStorage.setItem('carPurchases', JSON.stringify(carData));
    alert('Datos guardados con exito :'+JSON.stringify(Object.values(carData),null,4));
    console.log('Datos guardados (sobrescritos):', carData);
  };

  
    
  

  return (
    <div>
      <header className="headercontainer">
        <div>
          <Image alt="logo" src="/buycarlogo.png" width={500} height={400} className="logo" />
         
          <div>
            <p>Home page</p>
            <p>Car collection</p>
            <p>Car Reviews</p>
            <p>Car News</p>
          </div>
          
        </div>

   
        <div> {/* Componente de la billetera de cardano  */}
          
          <CardanoWallet isDark={true} />
          
          {connected && (
            <>
              {/* Mostrar balance automáticamente */}
              <h2 className="balance">Balance: </h2>
              
              {balance !== null ? ( <p>{balance} ADA</p>):(<p>{loading ? "Loading..." : "No balance found"}</p>)}

              {/* Botón de transacción */}
              <button onClick={tx} disabled={loading} className="buybutton">
                
                Buy
              
              </button>
            </>
          )}
        </div>
      </header>

      {/*carro de fondo en position absolute y z-index: -1 */}
      <div className="backgroundcontainer">
        <Image className="imagebackground" src="/backgroundmaindiv.png" alt="background" width={1000} height={700}></Image>
      </div>
      {/*banner de fondo en position absolute y z-index: -1 */}
      <div className="bannercontainer">
        <Image className="bannerimage" src="/banner.png" alt="background" width={8000} height={1000}></Image>
      </div>


      <main className="maincontainer">
        
        <section>
          <article>
            <h1>Your Dream Car is Waiting Here</h1>
            <p>Choice of quality cars, affordable prices and the best service are only here</p>
            <div>
              <button>Contact us</button>
              <button>Furthermore</button>
            </div>

          </article>
            
          <article onClick={handleImageClick}>
            <Image alt="car1" src={imagePaths[currentImageIndex]} width={1000} height={100} ></Image>
              
          </article>

        </section>

        <section>

          <article>

            <p>Why buy a car at BuyCar?</p>

            
            <div>
              <div>
                <Image width={100} height={100} alt="icon" src="/discount.png" ></Image>
                <p>A wide selection of quality cars at affordable prices</p>
              </div>
              
              <div>
                <Image width={100} height={100} alt="icon" src="/heart.png" ></Image>
                <p>Expert assistance in choosing a car that suits your needs and budget.</p>
              </div>
              
              <div>
                <Image width={100} height={100} alt="icon" src="/smile.png" ></Image>
                <p>Buying a car is easy, fun and satisfying</p>
              </div>
            
            
            </div>
          </article>

          
        </section>
        
        <section>
          <article>

            <div>
              <p>Latest car</p>
              <p>View Car Collection {'>'}</p>
            </div>
          
          
            <div>
              <div>
                <p onClick={() => handleCarClick('Toyota Corolla Cross Hybrid GR Sport')}>
                  Toyota Corolla Cross Hybrid GR Sport
                </p>
                <p onClick={() => handleCarClick('Suzuki Grand Vitara') }>
                  Suzuki Grand Vitara
                </p>
                <p onClick={() => handleCarClick('Suzuki S-Presso')}>
                  Suzuki S-Presso
                </p>
                <p onClick={() => handleCarClick('Subaru WRX')}>
                  Subaru WRX
                </p>
                <p onClick={() => handleCarClick('Chery Omoda 5')}>
                  Chery Omoda 5
                </p>
              </div>
              
              <div>
                <Image width={1000} height={1000} alt="icon" src={currentCarImage} ></Image>
                
                <div>
                  <h2>AMOUNT</h2>
                  
                  <div>
                    <p onClick={decrementAmount} >-</p>
                    <p>{amount}</p>
                    <p  onClick={incrementAmount}>+</p>
                  </div>

                  <button  onClick={saveToLocalStorage} >Add</button>
                  
                </div>
                
              </div>

            </div>
          
          </article>
        </section>

        <section className="gallery-section">
          <AutoScrollGallery />
        </section>
        
        <section>

          <article>
            <h1>What do customers say?</h1>
            
            <div> 
            
              <div>
                <div>
                  <p>
                  I am very satisfied with BuyCar service. Their team of experts helped me choose a car that fits my needs and budget. The car I bought is also of good quality. Thank you BuyCar!
                  </p>
                  <h2>Wulan Sari</h2>
                </div>
                
                <div>
                  <p>I am very happy with the car I bought from BuyCar. The car is in very good condition and the price is very affordable. I will definitely recommend BuyCar to my friends.</p>
                  <h2>Cahyono</h2>
                </div>
                
              </div>
              

              <div>
                <div>
                  <p>
                  I never thought about buying a car online before, but BuyCar has proven that the online car buying experience can be very easy and enjoyable. I am very happy with the car I bought and the service provided by the BuyCar team.
                  </p>
                  <h2>Agus Santoso</h2>
                </div>
                
                <div>
                  <p>I bought a car from BuyCar and I am very happy with my buying experience. The car I bought was in very good condition and the price was very affordable. Thank you BuyCar!</p>
                  <h2>Iwan Pranata</h2>
                </div>
                
                
              </div>
              
              <div>
                <div>
                  <p>
                  BuyCar provided excellent service. They were very responsive and helped me through every step of the purchase. I felt very safe and comfortable transacting with them.
                  </p>
                  <h2>Sri Hartini</h2>
                </div>
                
                <div>
                  <p>
                  I am very happy with my car buying experience from BuyCar. They provide a good selection of quality and affordable cars, and excellent service. I highly recommend BuyCar to anyone looking to buy a car.
                  </p>
                  <h2>Ahmad Faris</h2>
                </div>
                
                
              </div>


            </div>
            

          </article>
          
        </section>
        
        <section>
          <article>

            <p>Buy your dream car now at BuyCar and enjoy an easy and enjoyable car buying experience! What are you waiting for?</p>
            <button>Contact Us Now</button>


          </article>
          

        </section>


      </main>


          


    </div>
  );
};

export default Home;