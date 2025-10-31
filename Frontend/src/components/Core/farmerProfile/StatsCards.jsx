import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StatCard = ({ icon, value, label, change, changeType, bgColor }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-600">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <Badge 
            variant={changeType === 'positive' ? 'success' : changeType === 'warning' ? 'warning' : 'secondary'}
            className="text-xs"
          >
            {change}
          </Badge>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-secondary-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsCards = () => {
  const stats = [
    {
      icon: "🔬",
      value: "142",
      label: "Crops Analyzed",
      change: "+15",
      changeType: "positive",
      bgColor: "bg-brand-teal"
    },
    {
      icon: "🏦",
      value: "₹2,50,000",
      label: "Total Loan Amount",
      change: "Active",
      changeType: "warning",
      bgColor: "bg-brand-golden"
    },
    {
      icon: "💰",
      value: "₹3,85,400",
      label: "Total Revenue",
      change: "+22%",
      changeType: "positive",
      bgColor: "bg-brand-teal"
    },
    {
      icon: "🚚",
      value: "8",
      label: "Pending Deliveries",
      change: "Urgent",
      changeType: "destructive",
      bgColor: "bg-destructive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;
