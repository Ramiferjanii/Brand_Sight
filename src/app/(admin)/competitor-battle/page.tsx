"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComponentCard from "@/components/common/ComponentCard";
import api from "@/lib/api";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import { BoxCubeIcon, PieChartIcon } from "@/icons";
import PremiumAlert from "@/components/ui/PremiumAlert";
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
  overview?: string;
  monthlySales?: number;
  bsr?: number;
}

export default function CompetitorBattle() {
  const { user } = useAuth();
  const { products, loading: loadingProducts } = useProducts({ limit: 20 });
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [resultsA, setResultsA] = useState<ProductComparison[]>([]);
  const [resultsB, setResultsB] = useState<ProductComparison[]>([]);
  const [productA, setProductA] = useState<ProductComparison | null>(null);
  const [productB, setProductB] = useState<ProductComparison | null>(null);
  const [battleAlert, setBattleAlert] = useState<{ title: string; message: string } | null>(null);

  const getProductType = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("laptop") || n.includes("portable") || n.includes("notebook")) return "Laptop";
    if (n.includes("casque") || n.includes("headset") || n.includes("buds") || n.includes("écouteurs")) return "Audio";
    if (n.includes("phone") || n.includes("téléphone") || n.includes("smartphone")) return "Smartphone";
    return "Other";
  };

  const extractSpecs = (product: ProductComparison) => {
    const text = (product.name + " " + (product.overview || "")).toLowerCase();
    const specs: Record<string, string> = {};
    const type = getProductType(product.name);

    if (type === "Laptop") {
      const ram = text.match(/(\d+)\s*gb\s*ram/i) || text.match(/(\d+)\s*go\s*ram/i) || text.match(/ram\s*(\d+)\s*go/i);
      specs["RAM"] = ram ? `${ram[1]} GB` : "N/A";
      
      const storage = text.match(/(\d+)\s*gb\s*ssd/i) || text.match(/(\d+)\s*go\s*ssd/i) || text.match(/ssd\s*(\d+)\s*go/i);
      specs["Storage"] = storage ? `${storage[1]} GB SSD` : (text.match(/1\s*tb/i) ? "1 TB" : "N/A");
      
      const cpu = text.match(/core\s*i(\d)/i) || text.match(/ryzen\s*(\d)/i);
      specs["Processor"] = cpu ? cpu[0].toUpperCase() : (text.includes("m1") ? "Apple M1" : (text.includes("m2") ? "Apple M2" : "Standard"));
    } else if (type === "Smartphone") {
      const ram = text.match(/(\d+)\s*gb\s*ram/i) || text.match(/(\d+)\s*go\s*ram/i);
      specs["RAM"] = ram ? `${ram[1]} GB` : "N/A";
      
      const storage = text.match(/(\d+)\s*gb/i) || text.match(/(\d+)\s*go/i);
      specs["Storage"] = storage ? `${storage[1]} GB` : "N/A";
    }
    
    return specs;
  };

  const getAiDecision = () => {
    if (!productA || !productB) return null;
    
    const specsA = extractSpecs(productA);
    const specsB = extractSpecs(productB);
    
    let scoreA = 0;
    let scoreB = 0;
    
    // Price factor (lower is better for budget)
    if (productA.priceAmount < productB.priceAmount) scoreA += 1;
    else if (productB.priceAmount < productA.priceAmount) scoreB += 1;

    // Spec Comparison
    Object.keys(specsA).forEach(key => {
      const valA = parseInt(specsA[key]) || 0;
      const valB = parseInt(specsB[key]) || 0;
      if (valA > valB) scoreA += 2;
      else if (valB > valA) scoreB += 2;
    });

    if (scoreA > scoreB) return { winner: 'A', reason: `The ${productA.name} offers better overall technical specifications and value for money.` };
    if (scoreB > scoreA) return { winner: 'B', reason: `The ${productB.name} is the superior choice due to its advanced hardware features.` };
    return { winner: 'Tie', reason: "Both products are extremely competitive. The choice depends on your brand preference." };
  };

  const decision = getAiDecision();

  const selectFromCarousel = (product: any) => {
    const formatted: ProductComparison = {
      ...product,
      avgRating: 4.5,
    };
    
    if (productA && !productB) {
      const typeA = getProductType(productA.name);
      const typeB = getProductType(product.name);
      if (typeA !== typeB) {
        setBattleAlert({
          title: "Battle Mismatch!",
          message: `You are trying to compare a ${typeA} with a ${typeB}. Please select products from the same category!`
        });
        return;
      }
    }

    if (!productA) {
      setProductA(formatted);
    } else if (!productB) {
      setProductB(formatted);
    } else {
      setProductA(formatted);
    }
  };

  const searchProduct = async (query: string, side: 'A' | 'B') => {
    if (!user || query.length < 2) return;
    try {
      const res = await api.get(`/products?name=${query}&limit=5`);
      const formatted = res.data.products.map((p: any) => ({
        ...p,
        avgRating: 4.5,
      }));

      if (side === 'B' && productA) {
          setResultsB(formatted);
      } else {
          setResultsA(formatted);
      }
    } catch (err: any) {
        if (err.response?.status !== 401) {
            console.error(err);
        }
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
                          setBattleAlert({
                            title: "Battle Mismatch!",
                            message: `You are trying to compare a ${typeA} with a ${typeB}. Please select products from the same category!`
                          });
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
        <div className="space-y-6 animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponentCard title="Specifications Duel">
              <div className="space-y-4">
                {Object.keys(extractSpecs(productA)).length > 0 ? (
                  <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-2 font-bold text-gray-500 uppercase text-[10px]">Feature</th>
                          <th className="px-4 py-2 font-bold text-brand-500">Side A</th>
                          <th className="px-4 py-2 font-bold text-indigo-500">Side B</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {Object.keys(extractSpecs(productA)).map(key => (
                          <tr key={key}>
                            <td className="px-4 py-3 font-medium text-gray-500">{key}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{extractSpecs(productA)[key]}</td>
                            <td className="px-4 py-3 text-gray-900 dark:text-white">{extractSpecs(productB)[key]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No detailed specifications found for comparison.</p>
                )}
              </div>
            </ComponentCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComponentCard title="Market Analysis">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold uppercase mb-3 text-gray-600 dark:text-gray-400">
                      <span>Value Balance</span>
                      <span className="text-brand-500">{((productA.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100).toFixed(0)}% vs {((productB.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full flex overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 transition-all duration-500 shadow-[0_0_10px_rgba(70,95,255,0.4)]" 
                          style={{ width: `${(productA.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100}%` }}
                        />
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-500" 
                          style={{ width: `${(productB.priceAmount / (productA.priceAmount + productB.priceAmount)) * 100}%` }}
                        />
                    </div>
                  </div>

                  <div className="p-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-xl border border-brand-100 dark:border-brand-500/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-bold text-brand-600 block mb-1">Price Analysis:</span> 
                    {productA.priceAmount === productB.priceAmount ? (
                      <span>Exact price match. Comparison is purely based on specs and features.</span>
                    ) : (
                      <span>The <strong>{productA.priceAmount < productB.priceAmount ? productA.name : productB.name}</strong> is cheaper by <strong>{Math.abs(productA.priceAmount - productB.priceAmount).toFixed(0)} TND</strong>.</span>
                    )}
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard title="AI Final Verdict">
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">
                    {decision?.winner === 'Tie' ? "=" : "VS"}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-500 dark:text-gray-400 uppercase text-[10px] tracking-[0.2em] mb-1">
                      {decision?.winner === 'Tie' ? "Match Found" : "Crowned Winner"}
                    </h4>
                    <p className={`font-extrabold text-lg tracking-tight leading-tight ${decision?.winner === 'Tie' ? "text-brand-500" : "text-emerald-500"}`}>
                      {decision?.winner === 'A' ? productA.name : (decision?.winner === 'B' ? productB.name : "It's a Draw! ⚖️")}
                    </p>
                    <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                      {decision?.reason}
                    </p>
                  </div>
                </div>
              </ComponentCard>
            </div>
          </div>
        </div>
      )}

      {/* Centered Alert with Overlay */}
      <AnimatePresence>
        {battleAlert && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBattleAlert(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <div className="relative w-full max-w-md">
              <PremiumAlert 
                visible={!!battleAlert}
                type="warning"
                title={battleAlert?.title || ""}
                message={battleAlert?.message || ""}
                onClose={() => setBattleAlert(null)}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
