import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "../../../hooks/useTranslation";

const CropPriceCard = ({ crop, index }) => {
  const isUp = crop.change >= 0;
  
  return (
    <Card className="flex-shrink-0 w-72 hover:shadow-md hover:shadow-teal transition-all duration-300 transform backdrop-blur-md border border-gray-600">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-foreground font-semibold">{crop.name}</h3>
          <Badge 
            variant={isUp ? "success" : "destructive"}
            className="text-xs bg-brand-teal/20 backdrop-blur-md border-brand-teal/40 text-gray-300/80"
          >
            {isUp ? "▲" : "▼"} {Math.abs(crop.change)}%
          </Badge>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-brand-teal">
            <div className="text-2xl font-bold">₹{crop.price.toFixed(1)}</div>
            <div className="text-gray-400 text-xs">per {crop.unit}</div>
          </div>
          <div className="text-gray-400 text-sm">Updated today</div>
        </div>
      </CardContent>
    </Card>
  );
};

const CropPricesCarousel = ({ cropPrices }) => {
  const { t } = useTranslation();
  
  return (
    <section aria-labelledby="best-crop-prices" className="border border-gray-600 px-4 py-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 id="best-crop-prices" className="text-gray-400 text-xl font-semibold">
          {t('marketPrices')}
        </h2>
        <Badge variant="outline" className="text-xs text-gray-500">
          {t('liveData')}
        </Badge>
      </div>

      <div className="relative overflow-hidden">
        {/* Left gradient overlay */}
        <div className="absolute left-0 top-0 w-12 h-full bg-gradient-to-r from-[#010101] from-30% to-transparent z-10 pointer-events-none"></div>
        
        {/* Right gradient overlay */}
        <div className="absolute right-0 top-0 w-12 h-full bg-gradient-to-l from-[#010101] from-30% to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex gap-4 animate-scroll mb-2">
          {[...cropPrices, ...cropPrices].map((crop, index) => (
            <CropPriceCard key={`${crop.name}-${index}`} crop={crop} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default CropPricesCarousel;
