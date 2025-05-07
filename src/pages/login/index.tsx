"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import styles from "./login.module.css"

// Componente de icono SVG
const AlertCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
  
  // Credenciales por defecto
  const DEFAULT_CREDENTIALS = {
    email: "admin@buycar.com",
    password: "admin123",
  }
  
  export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const router = useRouter()
  
    // Verificar si ya hay una sesión activa
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  
      if (isLoggedIn) {
        router.replace("/facturas")
      } else {
        // Solo marcar como verificado si no está autenticado
        setIsCheckingAuth(false)
      }
    }, [router])
  
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setError("")
  
      // Simular un delay de red
      setTimeout(() => {
        if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
          // Guardar información en localStorage
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userEmail", email)
  
          // Redireccionar a la página de facturas
          router.replace("/facturas")
        } else {
          setError("Credenciales incorrectas. Por favor, intente nuevamente.")
        }
        setIsLoading(false)
      }, 800)
    }
  
    // Mostrar pantalla de carga mientras verificamos autenticación
    if (isCheckingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Cargando...</p>
        </div>
      )
    }

    return (
        <div className={styles["login-container"]}>
            {/* Navbar */}
            <header className={styles["header-container"]}>
                <div>
                    <Link href="/">
                        <Image alt="logo" src="/buycarlogo.png" width={500} height={400} className={styles["logo"]} />
                    </Link>
                </div>
            </header>

            {/* Login Card */}
            <div className={styles["login-form-container"]}>
                <div className={styles["login-card"]}>
                    <div className={styles["login-card-header"]}>
                        <h2 className={styles["login-card-title"]}>Log in</h2>
                        <p className={styles["login-card-description"]}>Type your credentials</p>
                    </div>
                    <div className={styles["login-card-content"]}>
                        <form onSubmit={handleLogin} className={styles["login-form"]}>
                            {error && (
                                <div className={styles["login-alert"]}>
                                    <AlertCircleIcon />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className={styles["login-form-group"]}>
                                <label htmlFor="email" className={styles["login-label"]}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="example@buycar.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className={styles["login-input"]}
                                />
                            </div>
                            <div className={styles["login-form-group"]}>
                                <label htmlFor="password" className={styles["login-label"]}>
                                    Password
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
                                Did you forget your password?
                            </Link>
                            <Link href="#" className={styles["login-link"]}>
                                Register
                            </Link>
                        </div>
                        <p className={styles["login-credentials-hint"]}>Default credentials: admin@buycar.com / admin123</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles["login-footer"]}>
                <p>© 2025 BuyCar. All rights are reserved.</p>
            </footer>
        </div>
    )
}