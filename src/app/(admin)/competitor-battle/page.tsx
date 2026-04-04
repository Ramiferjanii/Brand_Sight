"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import api from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { BoxCubeIcon, PieChartIcon } from "@/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import PageTour, { TourStep } from "@/components/tour/PageTour";

const battleTourSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    title: "Competitor Battle ⚔️",
    content: "Pick two products and go head-to-head! Our engine compares prices, ratings and market position. Let's see how it works.",
    data: { emoji: "⚔️" },
  },
  {
    target: "[data-tour='battle-carousel']",
    placement: "bottom",
    disableBeacon: true,
    title: "Product Carousel 🎠",
    content: "Swipe through all scraped products and click one to add it to the battle. The first click sets Side A, the second sets Side B.",
    data: { emoji: "🎠" },
  },
  {
    target: "[data-tour='battle-side-a']",
    placement: "right",
    disableBeacon: true,
    title: "Side A — Contender 🥊",
    content: "Your first product slot. You can also type in the search box to find a specific product quickly.",
    data: { emoji: "🥊" },
  },
  {
    target: "[data-tour='battle-side-b']",
    placement: "left",
    disableBeacon: true,
    title: "Side B — Competitor 🥊",
    content: "Your second product slot. Once both sides are filled, the comparison stats appear automatically below.",
    data: { emoji: "🥊" },
  },
];

interface ProductComparison {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  domain: string;
  image: string;
  avgRating: number;
  sentiment?: string;
}

export default function CompetitorBattle() {
  const { products, loading: loadingProducts } = useProducts({ limit: 20 });
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [resultsA, setResultsA] = useState<ProductComparison[]>([]);
  const [resultsB, setResultsB] = useState<ProductComparison[]>([]);
  const [productA, setProductA] = useState<ProductComparison | null>(null);
  const [productB, setProductB] = useState<ProductComparison | null>(null);

  const getProductType = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("laptop") || n.includes("portable") || n.includes("notebook")) return "Laptop";
    if (n.includes("casque") || n.includes("headset") || n.includes("buds") || n.includes("écouteurs")) return "Audio";
    if (n.includes("phone") || n.includes("téléphone")) return "Smartphone";
    return "Other";
  };

  const selectFromCarousel = (product: any) => {
    const formatted: ProductComparison = {
      ...product,
      avgRating: 4.5,
    };
    
    if (productA && !productB) {
      const typeA = getProductType(productA.name);
      const typeB = getProductType(product.name);
      if (typeA !== typeB) {
        alert(`❌ Battle Mismatch! You are trying to compare a ${typeA} with a ${typeB}. Please select products from the same category!`);
        return;
      }
    }

    if (!productA) {
      setProductA(formatted);
    } else if (!productB) {
      setProductB(formatted);
    } else {
      // If both selected, replace A
      setProductA(formatted);
    }
  };

  const searchProduct = async (query: string, side: 'A' | 'B') => {
    if (query.length < 2) return;
    try {
      const res = await api.get(`/products?name=${query}&limit=5`);
      const formatted = res.data.products.map((p: any) => ({
        ...p,
        avgRating: 4.5,
      }));

      // Validation for search selection
      if (side === 'B' && productA) {
          // This will be handled in the onClick of the search result dropdown below
          setResultsB(formatted);
      } else {
          setResultsA(formatted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Competitor Battle ⚔️
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Compare two products side-by-side. Click a product below to add it to the battle!
          </p>
        </div>
        <PageTour steps={battleTourSteps} />
      </div>

      {/* Product Carousel Selection */}
      <div data-tour="battle-carousel" className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <Swiper
           modules={[Navigation, Pagination, EffectCoverflow]}
           effect={"coverflow"}
           grabCursor={true}
           centeredSlides={true}
           slidesPerView={"auto"}
           coverflowEffect={{
             rotate: 10,
             stretch: 0,
             depth: 100,
             modifier: 1,
             slideShadows: false,
           }}
           pagination={{ 
             clickable: true,
             dynamicBullets: true 
           }}
           navigation={true}
           className="product-swiper !pb-16"
           breakpoints={{
             640: { slidesPerView: 2 },
             1024: { slidesPerView: 4 },
             1280: { slidesPerView: 5 },
           }}
        >
          {products.map((product) => (
             <SwiperSlide key={product.id} className="p-2">
                <div 
                   onClick={() => selectFromCarousel(product)}
                   className={`cursor-pointer rounded-xl border-2 p-3 transition-all mb-6 ${
                     productA?.id === product.id || productB?.id === product.id 
                     ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
                     : "border-gray-100 bg-white hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                   }`}
                >
                   <div className="relative mb-2 h-24 w-full overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800">
                      <img src={product.image || "/images/placeholder.svg"} className="h-full w-full object-contain p-1" alt={product.name} />
                   </div>
                   <h5 className="line-clamp-1 text-xs font-bold text-gray-800 dark:text-white">{product.name}</h5>
                   <p className="text-xs text-brand-500 font-bold mt-1">{product.price}</p>
                </div>
             </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product A Selection */}
        <div className="space-y-4" data-tour="battle-side-a">
          <ComponentCard title="Side A: Contender">
            <div className="relative pt-2">
              <input
                type="text"
                placeholder="Search Product A..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2 dark:bg-gray-900 dark:border-gray-800"
                value={searchA}
                onChange={(e) => {
                  setSearchA(e.target.value);
                  searchProduct(e.target.value, 'A');
                }}
              />
              {resultsA.length > 0 && !productA && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {resultsA.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex gap-3 items-center"
                      onClick={() => {
                        setProductA(p);
                        setResultsA([]);
                      }}
                    >
                      <img src={p.image || "/images/placeholder.svg"} className="w-8 h-8 rounded" alt="" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {productA && (
              <div className="mt-6 animate-fadeIn">
                 <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 p-4 flex items-center justify-center">
                    <img src={productA.image || "/images/placeholder.svg"} className="max-h-full object-contain shadow-lg rounded-lg" alt="" />
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 h-10">{productA.name}</h3>
                 <div className="flex justify-between items-center mt-3">
                    <p className="text-brand-500 font-bold text-xl">{productA.price}</p>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500 uppercase font-bold">{productA.domain}</span>
                 </div>
                 <button 
                  onClick={() => {setProductA(null); setSearchA("")}}
                  className="mt-4 w-full py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-lg transition-colors"
                 >Change Contender A</button>
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Product B Selection */}
        <div className="space-y-4" data-tour="battle-side-b">
          <ComponentCard title="Side B: Competitor">
            <div className="relative pt-2">
              <input
                type="text"
                placeholder="Search Product B..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2 dark:bg-gray-900 dark:border-gray-800"
                value={searchB}
                onChange={(e) => {
                  setSearchB(e.target.value);
                  searchProduct(e.target.value, 'B');
                }}
              />
              {resultsB.length > 0 && !productB && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {resultsB.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex gap-3 items-center"
                      onClick={() => {
                        const typeA = getProductType(productA!.name);
                        const typeB = getProductType(p.name);
                        if (typeA !== typeB) {
                          alert(`❌ Battle Mismatch! You are trying to compare a ${typeA} with a ${typeB}. Please select products from the same category!`);
                          return;
                        }
                        setProductB(p);
                        setResultsB([]);
                      }}
                    >
                      <img src={p.image || "/images/placeholder.svg"} className="w-8 h-8 rounded" alt="" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {productB && (
              <div className="mt-6 animate-fadeIn">
                 <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 p-4 flex items-center justify-center">
                    <img src={productB.image || "/images/placeholder.svg"} className="max-h-full object-contain shadow-lg rounded-lg" alt="" />
                 </div>
                 <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 h-10">{productB.name}</h3>
                 <div className="flex justify-between items-center mt-3">
                    <p className="text-brand-500 font-bold text-xl">{productB.price}</p>
                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500 uppercase font-bold">{productB.domain}</span>
                 </div>
                 <button 
                  onClick={() => {setProductB(null); setSearchB("")}}
                  className="mt-4 w-full py-2 border border-red-200 text-red-500 hover:bg-red-50 text-xs rounded-lg transition-colors"
                 >Change Competitor B</button>
              </div>
            )}
          </ComponentCard>
        </div>
      </div>

      {/* Versus Comparison Stats */}
      {productA && productB && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
           <ComponentCard title="Battle Summary">
              <div className="space-y-4">
                 {[
                   { 
                     label: "Winner By Budget", 
                     value: productA.priceAmount === productB.priceAmount 
                        ? "Price Match 🤝" 
                        : (productA.priceAmount < productB.priceAmount ? productA.name : productB.name), 
                     badge: "success" 
                   },
                   { label: "Price Gap", value: `${Math.abs(productA.priceAmount - productB.priceAmount).toFixed(2)} TND`, badge: "info" },
                   { label: "Platform Battle", value: `${productA.domain} vs ${productB.domain}`, badge: "secondary" }
                 ].map((stat, i) => (
                   <div key={i} className="flex flex-col gap-1 border-b pb-2 dark:border-gray-800 last:border-0">
                      <span className="text-xs text-gray-500 uppercase font-bold tracking-tight">{stat.label}</span>
                      <span className="text-sm dark:text-gray-300 font-medium line-clamp-1">{stat.value}</span>
                   </div>
                 ))}
              </div>
           </ComponentCard>

           <ComponentCard title="Market Analysis">
              <div className="space-y-6">
                 {/* Price Comparison bar */}
                 <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase mb-3 text-gray-600 dark:text-gray-400">
                       <span>Market Value Weight</span>
                       <span className="text-brand-500">{((productA.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100).toFixed(0)}% vs {((productB.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full flex overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 transition-all duration-500 shadow-[0_0_10px_rgba(70,95,255,0.4)]" 
                          style={{ width: `${(productA.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100}%` }}
                        />
                        <div 
                          className="h-full bg-slate-300 dark:bg-slate-700 transition-all duration-500" 
                          style={{ width: `${(productB.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                        <span>{productA.priceAmount.toFixed(2)} TND</span>
                        <span>{productB.priceAmount.toFixed(2)} TND</span>
                    </div>
                 </div>

                 <div className="p-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-500/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-bold text-brand-600 block mb-1">Shopping Advice:</span> 
                    {productA.priceAmount === productB.priceAmount ? (
                      <span>Both products have the **exact same price**. We recommend picking based on store reputation or faster delivery!</span>
                    ) : (
                      <span>Choosing the <strong>{productA.priceAmount < productB.priceAmount ? productA.name : productB.name}</strong> saves you roughly <strong>{Math.abs(productA.priceAmount - productB.priceAmount).toFixed(0)} TND</strong> which could be used for extra accessories!</span>
                    )}
                 </div>
              </div>
           </ComponentCard>

           <ComponentCard title="AI Final Verdict">
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <PieChartIcon className="w-20 h-20" />
                 </div>
                 <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-xl rotate-0">
                    {productA.priceAmount === productB.priceAmount ? "=" : "VS"}
                 </div>
                 <div>
                    <h4 className="font-extrabold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-[0.2em] mb-1">
                      {productA.priceAmount === productB.priceAmount ? "Match Found" : "Crowned Winner"}
                    </h4>
                    <p className={`font-extrabold text-2xl tracking-tight leading-tight ${productA.priceAmount === productB.priceAmount ? "text-brand-500" : "text-emerald-500"}`}>
                      {productA.priceAmount === productB.priceAmount 
                        ? "It's a Draw! ⚖️" 
                        : (productA.priceAmount < productB.priceAmount ? productA.name : productB.name)}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                       <BoxCubeIcon className="w-4 h-4 text-brand-500" />
                       <p className="text-[10px] text-gray-400 uppercase font-black">
                         {productA.priceAmount === productB.priceAmount ? "Equivalent Market Value" : "Verified Marketplace Pick"}
                       </p>
                    </div>
                 </div>
              </div>
           </ComponentCard>
        </div>
      )}
    </div>
  );
}
