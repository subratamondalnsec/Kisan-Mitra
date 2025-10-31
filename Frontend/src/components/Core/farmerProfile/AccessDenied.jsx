import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-background dark flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-md border-border shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-destructive mb-4">
            🚫 Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Please login as a farmer to view this page.
          </p>
          <Button
            onClick={() => (window.location.href = "/auth")}
            variant="farmer"
            className="w-full"
          >
            🌾 Login as Farmer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDenied;
