"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { red } from "@mui/material/colors"

// Credenciales por defecto
const DEFAULT_CREDENTIALS = {
    username: "admin@buycar.com",
    password: "admin123"
}

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Verificar si hay una sesion activa
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token === "true"){
            router.push("/facturas")
        }
    }, [router])

    const handleLogin = (e: React.FormEvent) =>{
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Simular un delay en la red
        setTimeout(() => {
            if (email === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password){
                // Guardar informacion en el localStorage
                localStorage.setItem("token", "true")
                localStorage.setItem("userEmail", email)
    
                // Redireccionar a la pagina de facturas
                router.push("/facturas")
            }else{
                setError("Las credenciales no coinciden, por favor intenta nuevamente.")
            }
            setIsLoading(false);
        }, 8000)
    }

    return(
        <div>
            {/* Navbar */}
            <header style={{background: "Blue"}} className="navbar-header">
                <div className="headercontainer">
                    <Link href="/">
                        <Image alt="logo" src="/buycarlogo.png" width={500} height={400} className="logo" />
                    </Link>

                    <div>
                        <p>Home page</p>
                        <p>Car collection</p>
                        <p>Car Reviews</p>
                        <p>Car News</p>
                    </div>

                </div>

                <p style={{background: "red"}}> Hola Gran hp</p>
            </header>
        </div>
    )

}