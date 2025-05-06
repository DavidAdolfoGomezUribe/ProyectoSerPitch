"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import styles from "./login.module.css"


// import { AlertCircle } from "lucide-react"

// Credenciales por defecto
const DEFAULT_CREDENTIALS = {
    username: "admin@buycar.com",
    password: "admin123"
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Verificar si hay una sesion activa
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token === "true") {
            router.push("/facturas")
        }
    }, [router])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        // Simular un delay en la red
        setTimeout(() => {
            if (email === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
                // Guardar informacion en el localStorage
                localStorage.setItem("token", "true")
                localStorage.setItem("userEmail", email)

                // Redireccionar a la pagina de facturas
                router.push("/facturas")
            } else {
                setError("Las credenciales no coinciden, por favor intenta nuevamente.")
            }
            setIsLoading(false);
        }, 3000)
    }

    return (
        <div className={styles["login-container"]}>
            {/* Navbar */}
            <header className="headercontainer">
                <div>
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
            </header>

            {/* Login Card */}
            <div className={styles["login-form-container"]}>
                <div className={styles["login-card"]}>
                    <div className={styles["login-card-header"]}>
                        <h2 className={styles["login-card-title"]}>Iniciar Sesión</h2>
                        <p className={styles["login-card-description"]}>Ingrese sus credenciales para acceder a BuyCar</p>
                    </div>
                    <div className={styles["login-card-content"]}>
                        <form onSubmit={handleLogin} className={styles["login-form"]}>
                            {error && (
                                <div className={styles["login-alert"]}>
                                    {/* <AlertCircle className="login-alert-icon" /> */}
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className={styles["login-form-group"]}>
                                <label htmlFor="email" className={styles["login-label"]}>
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="ejemplo@buycar.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles["login-input"]}
                                />
                            </div>
                            <div className={styles["login-form-group"]}>
                                <label htmlFor="password" className={styles["login-label"]}>
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={styles["login-input"]}
                                />
                            </div>
                            <button type="submit" className={styles["login-button"]} disabled={isLoading}>
                                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </button>
                        </form>
                    </div>
                    <div className={styles["login-card-footer"]}>
                        <div className={styles["login-links"]}>
                            <Link href="#" className={styles["login-link"]}>
                                ¿Olvidó su contraseña?
                            </Link>
                            <Link href="#" className={styles["login-link"]}>
                                Registrarse
                            </Link>
                        </div>
                        <p className={styles["login-credentials-hint"]}>Credenciales por defecto: admin@buycar.com / admin123</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles["login-footer"]}>
                <p>© 2023 BuyCar. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}