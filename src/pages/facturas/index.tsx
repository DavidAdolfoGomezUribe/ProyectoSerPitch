import Sendrect from "../components/Sendrect"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"


export default function FacturasPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Verificar autenticación una sola vez al cargar
  useEffect(() => {
    // Función para verificar autenticación
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

      if (!isLoggedIn) {
        // Redirigir solo si no está autenticado
        router.replace("/login")
      } else {
        // Marcar como autenticado
        setIsAuthenticated(true)
      }
    }

    // Solo verificar si aún no sabemos el estado de autenticación
    if (isAuthenticated === null) {
      checkAuth()
    }

    // Escuchar cambios en localStorage (para sincronizar entre pestañas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isLoggedIn" && e.newValue !== "true") {
        // Solo redirigir si el cambio fue a no autenticado
        router.replace("/login")
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router, isAuthenticated])

  // Mostrar pantalla de carga mientras verificamos autenticación
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  // Renderizar el componente Sendrect solo si está autenticado
  return <Sendrect />
}
