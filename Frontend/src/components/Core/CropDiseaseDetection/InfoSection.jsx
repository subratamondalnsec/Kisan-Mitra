import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InfoCard = ({ icon, title, description }) => (
  <div className="text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <h4 className="font-semibold text-foreground mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const InfoSection = () => {
  const steps = [
    {
      icon: "📸",
      title: "Upload Image",
      description: "Take or upload a clear photo of your crop"
    },
    {
      icon: "🤖",
      title: "AI Analysis",
      description: "Our AI model analyzes the image for diseases"
    },
    {
      icon: "📊",
      title: "Get Results",
      description: "Receive instant diagnosis and recommendations"
    }
  ];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
          ℹ️ How it works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <InfoCard key={index} {...step} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoSection;
