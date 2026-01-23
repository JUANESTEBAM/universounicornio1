"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Edit, Trash2 } from "lucide-react"
import { EditAmbassadorModal } from "./edit-ambassador-modal"

interface Ambassador {
  _id: string
  full_name: string
  email: string
  whatsapp_number: string
  distribuidor_id: string
  pais: string
}

export function AmbassadorList() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const response = await fetch("https://api.unicornio.tech/embajadores", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("No se pudieron obtener los embajadores")
        }
        const data = await response.json()
        setAmbassadors(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAmbassadors()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este embajador?")) {
      try {
        const response = await fetch(`https://api.unicornio.tech/embajadores/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Error al eliminar embajador")
        }
        setAmbassadors(ambassadors.filter((a) => a._id !== id))
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleUpdate = (updatedAmbassador: Ambassador) => {
    setAmbassadors(ambassadors.map((a) => (a._id === updatedAmbassador._id ? updatedAmbassador : a)))
    setIsEditModalOpen(false)
  }

  if (loading) {
    return <p>Cargando embajadores...</p>
  }

  return (
    <div className="grid gap-6">
      {ambassadors.length === 0 ? (
        <p>No hay embajadores disponibles.</p>
      ) : (
        ambassadors.map((ambassador) => (
          <Card key={ambassador._id} className="hover:shadow-lg transition-shadow border border-gray-200 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                {ambassador.full_name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-50 rounded-full"
                  onClick={() => {
                    setSelectedAmbassador(ambassador)
                    setIsEditModalOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-50 rounded-full"
                  onClick={() => handleDelete(ambassador._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-600">{ambassador.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <span className="text-gray-600">{ambassador.whatsapp_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">País:</span>
                  <span className="text-gray-600">{ambassador.pais}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {selectedAmbassador && (
        <EditAmbassadorModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          ambassador={selectedAmbassador}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}