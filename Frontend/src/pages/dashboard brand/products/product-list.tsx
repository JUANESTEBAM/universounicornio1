import { useEffect, useState } from "react";
import aconditionerMen from "../../../assets/CONDITIONER MEN.png";
import kitLimpieza from "../../../assets/kit limpieza.png";
import kitBasico from "../../../assets/kit basico.png";
import kitLineaSpecial from "../../../assets/KIT LÍNEA SPECIAL.png";
import kitdefinicion from "../../../assets/kit definicion.png";

interface ProductListProps {
  pais?: string | null;
}

const products = [
  { id: 1, name: "Shampoo", description: "cleaning & freshness", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_Shampoo_Mesa+de+trabajo+1.png" },
  { id: 2, name: "Acondicionador", description: "shine & softness", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_Conditioner_Mesa+de+trabajo+1+1.png" },
  { id: 3, name: "Gel", description: "shine & hold", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_DefiningGel_Mesa+de+trabajo+1.png" },
  { id: 4, name: "Crema 3 en 1", description: "repair moisturize & define", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_CurlingCream_Mesa+de+trabajo+1.png" },
  { id: 5, name: "Shampoo Special Men", description: "cleaning & freshness", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/SHAMPOO+MEN.png" },
  { id: 6, name: "Aceite", description: "pre lavado", price: 427, image: "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_MoisturizingOil_Mesa+de+trabajo+1.png" },
  { id: 7, name: "Cream 3 in 1 Men", description: "repair & define", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/CREAM+3+IN+1.png" },
  { id: 8, name: "Gel Men", description: "shine & hold", price: 507, image: "https://u-niverse.s3.us-east-1.amazonaws.com/GEL+MEN.png" },
  { id: 9, name: "Acondicionador Men", description: "shine & softness", price: 507, image: aconditionerMen },
  { id: 10, name: "Kit Limpieza", description: "", price: 850, image: kitLimpieza },
  { id: 11, name: "Kit Basico", description: "", price: 1.275, image: kitBasico },
  { id: 12, name: "Kit Definicion", description: "", price: 850, image: kitdefinicion },
  { id: 13, name: "Kit Linea Special", description: "", price: 2.050, image: kitLineaSpecial },
];

const ProductCard = ({ product, currencySymbol, formatPrice }: any) => (
  <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden p-3 transition-transform transform hover:scale-105 hover:shadow-lg">
    <div className="relative w-full h-40">
      <img
        src={product.image}
        alt={product.name}
        className="object-contain w-full h-full rounded-t-lg"
      />
    </div>

    <div className="flex-grow p-2 text-center">
      <h3 className="mb-1 text-sm font-semibold" style={{ color: "#F198C0" }}>
        {product.name}
      </h3>
      <p className="text-xs text-gray-600">{product.description}</p>
    </div>

    <div className="p-2 text-center">
      <span className="text-sm font-bold" style={{ color: "#F198C0" }}>
        {currencySymbol} {formatPrice(product.price)}
      </span>
    </div>
  </div>
);

const ProductList = ({ pais }: ProductListProps) => {
  const [currentPais, setCurrentPais] = useState<string | null>(pais ?? null);

  useEffect(() => {
    if (!currentPais) {
      setCurrentPais(localStorage.getItem("pais"));
    }
  }, [currentPais]);

  const isColombia = currentPais === "Colombia";

  const formatPrice = (price: number) => {
    if (isColombia) {
      return price === 427 ? "59.400" : "77.350";
    }
    return price.toString();
  };

  const currencySymbol = isColombia ? "COP" : "MXN";

  const specialProducts = products.filter((p) => !p.name.includes("Men") && !p.name.includes("Kit"));
  const menProducts = products.filter((p) => p.name.includes("Men") && !p.name.includes("Kit"));
  const kitProducts = isColombia ? [] : products.filter((p) => p.name.includes("Kit"));

  return (
    <div className="space-y-8">
      {/* Línea Special */}
      <div>
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F198C0" }}>
          Línea Special
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {specialProducts.map((product) => (
            <ProductCard key={product.id} product={product} currencySymbol={currencySymbol} formatPrice={formatPrice} />
          ))}
        </div>
      </div>

      {/* Línea Men */}
      <div>
        <h2 className="text-xl font-bold mb-3" style={{ color: "#F198C0" }}>
          Línea Men
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {menProducts.map((product) => (
            <ProductCard key={product.id} product={product} currencySymbol={currencySymbol} formatPrice={formatPrice} />
          ))}
        </div>
      </div>

      {/* Kits - Solo se muestra si no es Colombia */}
      {!isColombia && (
        <div>
          <h2 className="text-xl font-bold mb-3" style={{ color: "#F198C0" }}>
            Kits
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {kitProducts.map((product) => (
              <ProductCard key={product.id} product={product} currencySymbol={currencySymbol} formatPrice={formatPrice} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;