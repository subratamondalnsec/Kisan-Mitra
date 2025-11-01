import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

const InfoField = ({ label, value }) => (
  <div>
    <span className="text-sm font-medium text-secondary-foreground">{label}:</span>
    <p className="mt-1 text-foreground">{value || "Not provided"}</p>
  </div>
);

const ProfileInfo = ({ user, onEdit }) => {
  return (
    <Card className="backdrop-blur-md bg-card/80 border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-brand-golden">
            Profile Information
          </CardTitle>
          <Button
            onClick={onEdit}
            variant="outline"
            size="icon"
            className="bg-brand-teal/70 hover:bg-brand-teal hover:text-brand-teal-foreground transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card className="bg-muted/50 border-border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-brand-teal flex items-center">
                👤 Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="First Name" value={user.firstName} />
                <InfoField label="Last Name" value={user.lastName} />
                <InfoField label="Email" value={user.email} />
                <InfoField label="Contact Number" value={user.contactNumber} />
                <div className="sm:col-span-2">
                  <InfoField label="Role" value="🌾 Farmer" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          {user.address && (
            <Card className="bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-brand-teal flex items-center">
                  📍 Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField label="Street" value={user.address.street} />
                  <InfoField label="Village" value={user.address.village} />
                  <InfoField label="Tehsil" value={user.address.tehsil} />
                  <InfoField label="District" value={user.address.district} />
                  <InfoField label="State" value={user.address.state} />
                  <InfoField label="Pin Code" value={user.address.pincode} />
                  <div className="sm:col-span-2">
                    <InfoField label="Country" value={user.address.country || "India"} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
