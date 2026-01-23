import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useLocation, useNavigate } from "react-router-dom";

interface Item {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CheckoutEnvio() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    items = [], 
    totalPrice = 0,
    currency = "MXN",
    country = "México"
  } = location.state || {};

  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get("ref");

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    pais: country,
    direccion: "",
    estado: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    email: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función para formatear el precio según la moneda
  const formatPrice = (price: number) => {
    if (currency === "COP") {
      return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    } else {
      return price.toFixed(2);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellidos.trim()) newErrors.apellidos = "Los apellidos son obligatorios";
    if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";
    if (!formData.estado.trim()) newErrors.estado = "El estado es obligatorio";
    if (!formData.ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria";
    if (!formData.telefono.trim()) newErrors.telefono = "El celular es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El correo electrónico es obligatorio";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    const costoEnvio = country === "Colombia" ? 25000 : 180;

    const userInfo = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      pais_region: formData.pais,
      direccion_calle: formData.direccion,
      numero_casa: formData.codigoPostal,
      estado_municipio: formData.estado,
      localidad_ciudad: formData.ciudad,
      telefono: formData.telefono,
      correo_electronico: formData.email,
      ref: ref,
      items: items.map((item: Item) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
      })),
      costo_envio: costoEnvio,
      currency: currency
    };

    try {
      const response = await fetch("https://api.unicornio.tech/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const result = await response.json();
      if (result.init_point) {
        window.location.href = result.init_point;
      } else {
        console.error("Error al obtener el link de pago:", result);
      }
    } catch (error) {
      console.error("Error al procesar los datos:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const isFormValid =
    formData.nombre.trim() &&
    formData.apellidos.trim() &&
    formData.direccion.trim() &&
    formData.estado.trim() &&
    formData.ciudad.trim() &&
    formData.telefono.trim() &&
    formData.email.trim() &&
    /^\S+@\S+\.\S+$/.test(formData.email);

  const costoEnvio = country === "Colombia" ? 25000 : 180;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-background">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-lg text-gray-600">Ingresar datos de envío</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Datos de Envío</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos *</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                  />
                  {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais">País *</Label>
                <Input id="pais" name="pais" value={formData.pais} onChange={handleChange} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                  placeholder="Número de la casa y nombre de la calle"
                />
                {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Región / Estado *</Label>
                  <Input
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                  />
                  {errors.estado && <p className="text-red-500 text-sm">{errors.estado}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Localidad / Ciudad *</Label>
                  <Input
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                  {errors.ciudad && <p className="text-red-500 text-sm">{errors.ciudad}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código postal</Label>
                <Input
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Celular *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
                {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item: Item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{currency} {formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              ) : (
                <div>No hay productos en el pedido.</div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span>Costo de envío</span>
                <span>{currency} {formatPrice(costoEnvio)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{currency} {formatPrice(totalPrice + costoEnvio)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 items-stretch">
            <button
              onClick={handlePayment}
              className={`w-full h-12 px-6 bg-black text-white rounded ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              } transition-colors`}
              disabled={!isFormValid}
            >
              Realizar pedido
            </button>

            <button
              onClick={handleGoBack}
              className="w-full h-12 px-6 bg-black text-white rounded hover:bg-gray-600 transition-colors"
            >
              Agregar más productos
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}