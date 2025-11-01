import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const SchemeCard = ({ scheme }) => (
  <Card className="w-full hover:shadow-md hover:shadow-teal transition-all duration-300 transform backdrop-blur-md border border-gray-600">
    <CardContent className="p-4">
      <h3 className="text-foreground font-semibold text-sm mb-1">{scheme.name}</h3>
      <p className="text-gray-400 text-xs mb-3">{scheme.desc}</p>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="w-full bg-brand-teal/20 backdrop-blur-md border-brand-teal/40 "
      >
        <a
          href={scheme.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2"
        >
          Check Scheme
          <ExternalLink className="h-3 w-3" />
        </a>
      </Button>
    </CardContent>
  </Card>
);

const GovernmentSchemes = ({ schemes }) => {
  return (
    <aside className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-24">
        <section className="border border-gray-600 px-4 py-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-400 text-xl font-semibold">
              Government Schemes
            </h2>
          </div>

          <div className="relative max-h-[calc(100vh-12rem)] overflow-hidden hover:overflow-y-auto scrollbar-hide">
            {/* Top gradient overlay */}
            <div className="absolute left-0 top-0 w-full h-4 bg-gradient-to-b from-[#010101] from-30% to-transparent z-10 pointer-events-none"></div>
            
            <div className="space-y-3 mb-2 px-1 pt-4">
              {schemes.map((scheme) => (
                <SchemeCard key={scheme.name} scheme={scheme} />
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-xs mt-4">
            Data sourced from official government portals. Always verify details before applying.
          </p>
        </section>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
};

export default GovernmentSchemes;
