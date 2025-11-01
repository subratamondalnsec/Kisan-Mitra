import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "../../../hooks/useTranslation";

const CreditScoreWidget = ({ creditScore = 100 }) => {
  const { t } = useTranslation();
  
  return (
    <div className="absolute top-24 right-20 z-[90]">
      <Card className="bg-brand-teal/20 backdrop-blur-md border-brand-teal/40">
        <CardContent className="p-4 text-center">
          <div className="text-xs font-semibold text-brand-teal opacity-80 mb-1">
            {t('creditScore') || 'Credit Score'}
          </div>
          <div className="text-2xl font-bold tracking-wide text-brand-teal">
            {creditScore}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditScoreWidget;
