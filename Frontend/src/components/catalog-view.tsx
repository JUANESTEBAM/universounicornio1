import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "react-router-dom";
import logoRSF from "../assets/logoRFS.png";
import prePro from "../assets/Rectangle 48.png";
import product1Img from "../assets/Acondicionador.png";
import product2Img from "../assets/Shampoo.png";
import product3Img from "../assets/Aceite.png";
import product4Img from "../assets/Crema 3 en 1.png";
import product5Img from "../assets/Defining Gel.png";
import kitBasico from "../assets/kit basico.png"
import kitDefinicion from "../assets/kit definicion.png"
import kitLimpieza from "../assets/kit limpieza.png"
import kitLineaSpecial from "../assets/KIT LÍNEA SPECIAL.png"
import { useCart } from "./carritoContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  currency?: string;
}

const baseProducts: Product[] = [
  { id: 1, name: "Acondicionador", description: "shine & softness", price: 507.00, image: product1Img, category: "Lavado" },
  { id: 2, name: "Shampoo", description: "cleaning & freshness", price: 507.00, image: product2Img, category: "Lavado" },
  { id: 3, name: "Aceite", description: "pre lavado", price: 427.00, image: product3Img, category: "Tratamiento" },
  { id: 4, name: "Crema 3 en 1", description: "repair moisturize & define", price: 507.00, image: product4Img, category: "Definición" },
  { id: 5, name: "Gel", description: "shine & hold", price: 507.00, image: product5Img, category: "Definición" },
  { id: 10, name: "Kit Definición", description: "", price: 850.00, image: kitDefinicion, category: "Kits" },
  { id: 11, name: "Kit Limpieza", description: "", price: 850.00, image: kitLimpieza, category: "Kits" },
  { id: 12, name: "Kit Básico", description: "", price: 1275.00, image: kitBasico, category: "Kits" },
  { id: 13, name: "Kit Línea Special", description: "", price: 2050.00, image: kitLineaSpecial, category: "Kits" },
];

const formatPrice = (price: number) => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const ProductCard = ({ product, onAddToCart, isDesktop = false, isLoading = false }: { product: Product; onAddToCart: (product: Product) => void; isDesktop?: boolean; isLoading?: boolean }) => {
  const formattedPrice = isLoading ? "Cargando..." : `${formatPrice(product.price)} ${product.currency || "MXN"}`;

  return (
    <div className={`flex flex-col items-center space-y-3 border p-4 rounded-lg shadow-sm ${isDesktop ? "hover:shadow-md" : ""}`}>
      <img
        src={product.image}
        alt={product.name}
        className={`object-contain rounded-lg ${isDesktop ? "w-32 h-32 mb-4 mt-2" : "w-full h-40"} `}
      />
      <div className="text-center">
        <h3 className={`font-medium ${isDesktop ? "text-xl" : "text-sm"}`} style={{ color: '#F198C0' }}>{product.name}</h3>
        <p className={`${isDesktop ? "text-sm" : "text-xs"}`} style={{ color: '#F198C0' }}>{product.description}</p>
      </div>
      <div className="flex justify-between items-center w-full mt-8">
        <span className={`${isDesktop ? "text-lg" : "text-sm"} font-semibold`} style={{ color: '#F198C0' }}>
          {formattedPrice}
        </span>
        <Button
          className="bg-[#F198C0] hover:bg-[#E87FAF] text-white px-4 py-1 rounded-full text-xs lg:px-6 lg:py-2 lg:text-sm"
          onClick={() => onAddToCart(product)}
          disabled={isLoading}
        >
          Lo quiero
        </Button>
      </div>
    </div>
  );
};

const ProductSection = ({ title, products, onAddToCart, isLoading }: { title: string; products: Product[]; onAddToCart: (product: Product) => void; isLoading: boolean }) => {
  if (products.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#F198C0' }}>{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
};

const PreProSection = () => {
  return (
    <div className="relative h-72 rounded-lg overflow-hidden">
      <img
        src={prePro}
        alt="Pre-poo Tratamiento"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F198C0]/40 to-transparent"></div>
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="text-2xl font-bold">Pre-poo</h3>
        <p className="text-lg">Tratamiento</p>
      </div>
    </div>
  );
};

const EcommercePage = () => {
  const { addItem } = useCart();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ref = searchParams.get("ref");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isColombia, setIsColombia] = useState(false);

  useEffect(() => {
    const fetchCountry = async () => {
      if (ref) {
        try {
          const response = await fetch(`https://api.unicornio.tech/api/pais?ref=${encodeURIComponent(ref)}`);
          const data = await response.json();
          const country = data.pais;

          setIsColombia(country === "Colombia");

          // Ajustar precios según el país
          const adjustedProducts = baseProducts
            .filter(product => {
              // Si es Colombia, filtramos los kits
              if (country === "Colombia" && product.category === "Kits") {
                return false;
              }
              return true;
            })
            .map(product => {
              let adjustedPrice = product.price;
              let currency = "MXN";

              if (country === "Colombia") {
                adjustedPrice = 77350; // Precio fijo para todos los productos
                currency = "COP";

                if (product.id === 3) {
                  adjustedPrice = 59400; // Precio fijo para el Aceite
                }
              }

              return { ...product, price: adjustedPrice, currency };
            });

          setProducts(adjustedProducts);
        } catch (error) {
          console.error("Error fetching country:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchCountry();
  }, [ref]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const catalogLink = ref ? `/catalog-view-men?ref=${encodeURIComponent(ref)}` : "/catalog";

  // Filtrar productos para mostrar solo los que correspondan
  const filteredProducts = isColombia 
    ? products.filter(p => p.category !== "Kits")
    : products;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Link to={catalogLink}>
        <Card className="rounded-xl shadow-sm mx-4 mt-4 mb-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="relative p-4">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logoRSF} alt="RSF Logo" className="h-6 object-contain" />
            </div>
            <div className="text-right">
              <span className="text-xs tracking-wide" style={{ color: '#F198C0' }}>Línea Men</span>
            </div>
          </div>
        </Card>
      </Link>

      {/* Mobile View */}
      <div className="md:hidden px-4">
        <ProductSection
          title="Lavado"
          products={products.filter((p) => p.category === "Lavado")}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#F198C0' }}>Tratamiento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <PreProSection />
            {products
              .filter((p) => p.category === "Tratamiento")
              .map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isLoading={isLoading} />
              ))}
          </div>
        </div>
        <ProductSection
          title="Definición"
          products={products.filter((p) => p.category === "Definición")}
          onAddToCart={handleAddToCart}
          isLoading={isLoading}
        />
        {!isColombia && (
          <ProductSection
            title="Kits"
            products={products.filter((p) => p.category === "Kits")}
            onAddToCart={handleAddToCart}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Tablet/Desktop View */}
      <div className="hidden md:block px-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#F198C0' }}>Linea Special</h2>
        <div className="grid grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isDesktop isLoading={isLoading} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;