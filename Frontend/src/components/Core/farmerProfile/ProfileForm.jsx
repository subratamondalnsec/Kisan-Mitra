import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ProfileForm = ({ profileData, onChange, onSubmit, onCancel }) => {
  return (
    <Card className="backdrop-blur-md bg-card/80 border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-brand-teal">
          ✏️ Edit Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                👤 Personal Information
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={onChange}
                  required
                  placeholder="First Name"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
                <Input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={onChange}
                  required
                  placeholder="Last Name"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>

              <Input
                type="email"
                name="email"
                value={profileData.email}
                onChange={onChange}
                required
                placeholder="Email Address"
                className="focus:ring-brand-teal focus:border-brand-teal"
              />

              <Input
                type="tel"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={onChange}
                required
                placeholder="Contact Number"
                className="focus:ring-brand-teal focus:border-brand-teal"
              />

              <Input
                type="url"
                name="image"
                value={profileData.image}
                onChange={onChange}
                placeholder="Profile Image URL (https://example.com/image.jpg)"
                className="focus:ring-brand-teal focus:border-brand-teal"
              />
            </div>

            {/* Right Column - Address Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-foreground flex items-center">
                📍 Address Information
              </h4>

              <Input
                type="text"
                name="address.street"
                value={profileData.address.street}
                onChange={onChange}
                placeholder="Street Address"
                className="focus:ring-brand-teal focus:border-brand-teal"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="address.village"
                  value={profileData.address.village}
                  onChange={onChange}
                  placeholder="Village"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
                <Input
                  type="text"
                  name="address.tehsil"
                  value={profileData.address.tehsil}
                  onChange={onChange}
                  placeholder="Tehsil"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="address.district"
                  value={profileData.address.district}
                  onChange={onChange}
                  placeholder="District"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
                <Input
                  type="text"
                  name="address.state"
                  value={profileData.address.state}
                  onChange={onChange}
                  placeholder="State"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="address.pincode"
                  value={profileData.address.pincode}
                  onChange={onChange}
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit pin code"
                  placeholder="Pin Code (6 digits)"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
                <Input
                  type="text"
                  name="address.country"
                  value={profileData.address.country}
                  onChange={onChange}
                  placeholder="Country"
                  className="focus:ring-brand-teal focus:border-brand-teal"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="farmer"
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
