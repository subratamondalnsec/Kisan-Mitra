import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ProfileHeader = ({ user }) => {
  return (
    <Card className="bg-brand-teal/70 border border-gray-600 mt-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side - Profile Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-2 border-background">
              <AvatarImage src={user.image} alt="Profile" />
              <AvatarFallback className="bg-brand-teal text-brand-teal-foreground text-xl font-bold">
                {(user.firstName?.charAt(0) || "F") + (user.lastName?.charAt(0) || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-foreground">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-foreground text-sm">
                Super Kisan since Oct 2025
              </p>
              <Badge variant="success" className="mt-2">
                🌾 Farmer
              </Badge>
            </div>
          </div>

          {/* Right Side - Credit Score Card */}
          <Card className="bg-foreground/20 backdrop-blur-md min-w-[200px] border border-gray-500">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-brand-golden text-xl">💰</span>
                <span className="text-3xl font-bold text-foreground">480</span>
              </div>
              <p className="text-foreground text-sm">Current Credits</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
