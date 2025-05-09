"use client"

import type React from "react"

import { useEffect, useState, Fragment } from "react"
import styles from "./Sendrect.module.css"
import { useRouter } from "next/navigation"

interface Bill {
  billNumber: string
  firstName: string
  lastName: string
  country: string
  phone: number
  address: string
  selectedCar: string
  quantity: number
  price: number
  txHash: string
  timestamp: Date
}

export default function Sendrect() {
  // Modificar los estados iniciales para cargar desde localStorage
  const [pendingBills, setPendingBills] = useState<Bill[]>([])
  const [sentBills, setSentBills] = useState<Bill[]>([])
  const [filtroDia, setFiltroDia] = useState("")
  const [filtroMes, setFiltroMes] = useState("")
  const [filtroAnio, setFiltroAnio] = useState("")
  const [expandido, setExpandido] = useState<{ [key: string]: boolean }>({})
  const [draggedItem, setDraggedItem] = useState<Bill | null>(null)
  const router = useRouter()



  function formatFecha(timestamp: Date) {
    const fecha = new Date(timestamp)
    const dia = String(fecha.getDate()).padStart(2, "0")
    const mes = String(fecha.getMonth() + 1).padStart(2, "0")
    const año = String(fecha.getFullYear()).slice(-2)
    return `${dia}/${mes}/${año}`
  }

  // Añadir un nuevo useEffect para cargar el estado desde localStorage al inicio
  useEffect(() => {
    // Intentar cargar facturas enviadas desde localStorage
    try {
      const savedSentBills = localStorage.getItem("sentBills")
      if (savedSentBills) {
        setSentBills(JSON.parse(savedSentBills))
      }

      const savedPendingBills = localStorage.getItem("pendingBills")
      if (savedPendingBills) {
        setPendingBills(JSON.parse(savedPendingBills))
      } else {
        // Solo cargar datos de la API si no hay datos guardados en localStorage
        async function datos() {
          const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills")
          const data = await response.json()
          setPendingBills(data)
          // Guardar en localStorage
          localStorage.setItem("pendingBills", JSON.stringify(data))
        }
        datos()
      }
    } catch (error) {
      console.error("Error al cargar datos desde localStorage:", error)
      // Si hay un error, cargar datos de la API
      async function datos() {
        const response = await fetch("https://67f854922466325443ec6b72.mockapi.io/bills")
        const data = await response.json()
        setPendingBills(data)
      }
      datos()
    }
  }, [])

  // Modificar el useEffect existente para que no se ejecute siempre
  // Eliminar el useEffect que carga datos de la API, ya que ahora lo hacemos en el useEffect anterior

  // Añadir un nuevo useEffect para guardar en localStorage cuando cambian las facturas
  useEffect(() => {
    try {
      localStorage.setItem("sentBills", JSON.stringify(sentBills))
    } catch (error) {
      console.error("Error al guardar facturas enviadas en localStorage:", error)
    }
  }, [sentBills])

  useEffect(() => {
    try {
      localStorage.setItem("pendingBills", JSON.stringify(pendingBills))
    } catch (error) {
      console.error("Error al guardar facturas pendientes en localStorage:", error)
    }
  }, [pendingBills])

  const filtrarFacturas = (facturas: Bill[]) => {
    return facturas.filter((item) => {
      const fecha = new Date(item.timestamp)
      const dia = fecha.getDate()
      const mes = fecha.getMonth() + 1
      const anio = fecha.getFullYear()

      const cumpleDia = filtroDia ? dia === Number.parseInt(filtroDia) : true
      const cumpleMes = filtroMes ? mes === Number.parseInt(filtroMes) : true
      const cumpleAnio = filtroAnio ? anio === Number.parseInt(filtroAnio) : true

      return cumpleDia && cumpleMes && cumpleAnio
    })
  }

  const pendingBillsFiltradas = filtrarFacturas(pendingBills)
  const sentBillsFiltradas = filtrarFacturas(sentBills)

  const toggleExpandido = (billNumber: string) => {
    setExpandido((prev) => ({
      ...prev,
      [billNumber]: !prev[billNumber],
    }))
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, bill: Bill) => {
    setDraggedItem(bill)
    e.dataTransfer.setData("billNumber", bill.billNumber)
    // Add a visual effect to the dragged item
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add(styles.dragging)
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Remove visual effect
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove(styles.dragging)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessary to allow dropping
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add(styles.dragover)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove(styles.dragover)
    }
  }

  // Modificar la función handleDrop para actualizar el estado correctamente
  const handleDrop = (e: React.DragEvent, targetStatus: "sent" | "pending") => {
    e.preventDefault()

    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove(styles.dragover)
    }

    if (!draggedItem) return

    const billNumber = e.dataTransfer.getData("billNumber")

    if (targetStatus === "sent" && !sentBills.some((bill) => bill.billNumber === billNumber)) {
      // Move from pending to sent
      const updatedPendingBills = pendingBills.filter((bill) => bill.billNumber !== billNumber)
      const billToMove = pendingBills.find((bill) => bill.billNumber === billNumber)

      if (billToMove) {
        // Actualizar estados
        setPendingBills(updatedPendingBills)
        setSentBills([...sentBills, billToMove])
      }
    } else if (targetStatus === "pending" && !pendingBills.some((bill) => bill.billNumber === billNumber)) {
      // Move from sent to pending
      const updatedSentBills = sentBills.filter((bill) => bill.billNumber !== billNumber)
      const billToMove = sentBills.find((bill) => bill.billNumber === billNumber)

      if (billToMove) {
        // Actualizar estados
        setSentBills(updatedSentBills)
        setPendingBills([...pendingBills, billToMove])
      }
    }

    setDraggedItem(null)
  }

  const handleLogout = () => {
    // Borrar completamente el localStorage
    localStorage.clear()

    // Redireccionar al login
    router.replace("/login")
  }

  // Componentes de iconos SVG
  const LogOutIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  )

  return (
    <section className={styles.facturas__container}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">REGISTRO DE FACTURACIÓN</h1>


      <div className={styles.filtro__fecha}>
        <label>
          Día:
          <input
            type="number"
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
            min="1"
            max="31"
            className={styles.input_fecha}
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
            className={styles.input_fecha}
          />
        </label>
        <label>
          Año:
          <input
            type="number"
            value={filtroAnio}
            onChange={(e) => setFiltroAnio(e.target.value)}
            min="1900"
            className={styles.input_fecha}
          />
        </label>
      </div>
              <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >          Cerrar sesión

                  </button>
          <LogOutIcon />
      </div>

      {/* 🔎 Filtros */}

      <div className={styles.columnas}>
        {/* FACTURAS POR ENVIAR */}
        <div
          className={`${styles.columna} ${styles.dropzone}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "pending")}
        >
          <h2>Facturas por enviar</h2>
          {pendingBillsFiltradas.length > 0 ? (
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
                {pendingBillsFiltradas.map((item) => (
                  <Fragment key={item.billNumber}>
                    <tr
                      data-id={item.billNumber}
                      data-status="porEnviar"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      className={styles.draggable}
                    >
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.address}</td>
                      <td>{item.selectedCar}</td>
                      <td>
                        <button className={styles.botonDetalles} onClick={() => toggleExpandido(item.billNumber)}>
                          {expandido[item.billNumber] ? "Ocultar" : "Ver detalles"}
                        </button>
                      </td>
                    </tr>
                    {expandido[item.billNumber] && (
                      <tr className={styles.filaDetalles}>
                        <td colSpan={4}>
                          <div className={styles.detalles}>
                            <ul>
                              <li>
                                <strong>País:</strong> {item.country}
                              </li>
                              <li>
                                <strong>Teléfono:</strong> {item.phone}
                              </li>
                              <li>
                                <strong>Cantidad:</strong> {item.quantity}
                              </li>
                              <li>
                                <strong>Precio:</strong> {item.price}
                              </li>
                              <li>
                                <strong>Fecha:</strong> {formatFecha(item.timestamp)}
                              </li>
                              <li>
                                <strong>Hash:</strong> {item.txHash}
                              </li>
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
        <div
          className={`${styles.columna} ${styles.dropzone}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "sent")}
        >
          <h2>Facturas enviadas</h2>
          {sentBillsFiltradas.length > 0 ? (
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
                {sentBillsFiltradas.map((item) => (
                  <Fragment key={item.billNumber}>
                    <tr
                      data-id={item.billNumber}
                      data-status="enviada"
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDragEnd={handleDragEnd}
                      className={styles.draggable}
                    >
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.address}</td>
                      <td>{item.selectedCar}</td>
                      <td>
                        <button className={styles.botonDetalles} onClick={() => toggleExpandido(item.billNumber)}>
                          {expandido[item.billNumber] ? "Ocultar" : "Ver detalles"}
                        </button>
                      </td>
                    </tr>
                    {expandido[item.billNumber] && (
                      <tr className={styles.filaDetalles}>
                        <td colSpan={4}>
                          <div className={styles.detalles}>
                            <ul>
                              <li>
                                <strong>País:</strong> {item.country}
                              </li>
                              <li>
                                <strong>Teléfono:</strong> {item.phone}
                              </li>
                              <li>
                                <strong>Cantidad:</strong> {item.quantity}
                              </li>
                              <li>
                                <strong>Precio:</strong> {item.price}
                              </li>
                              <li>
                                <strong>Fecha:</strong> {formatFecha(item.timestamp)}
                              </li>
                              <li>
                                <strong>Hash:</strong> {item.txHash}
                              </li>
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
            <p className={styles.vacio}>Arrastra aquí las facturas enviadas.</p>
          )}
        </div>
      </div>
    </section>
  )
}
