import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  updateFarmerProfile,
} from "../services/operations/FarmerAuthApi";
import FarmerNavbar from "../components/Common/FarmerNavbar";
import ProfileHeader from "../components/Core/farmerProfile/ProfileHeader";
import StatsCards from "../components/Core/farmerProfile/StatsCards";
import ProfileInfo from "../components/Core/farmerProfile/ProfileInfo";
import ProfileForm from "../components/Core/farmerProfile/ProfileForm";
import AccessDenied from "../components/Core/farmerProfile/AccessDenied";

const FarmerProfile = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    image: "",
    address: {
      street: "",
      village: "",
      tehsil: "",
      district: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  useEffect(() => {
    if (token) {
      dispatch(getFarmerProfile(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user && user.role === "farmer") {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        image: user.image || "",
        address: user.address || {
          street: "",
          village: "",
          tehsil: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setProfileData({
        ...profileData,
        address: {
          ...profileData.address,
          [field]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(updateFarmerProfile(profileData, token));
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        contactNumber: user.contactNumber || "",
        image: user.image || "",
        address: user.address || {
          street: "",
          village: "",
          tehsil: "",
          district: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
    }
    setIsEditing(false);
  };

  if (!user || user.role !== "farmer") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <FarmerNavbar />
      </div>

      {/* Main Profile Container */}
      <div className="pt-20 px-4 py-8">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {!isEditing ? (
            // View Mode
            <div className="space-y-6">
              <ProfileHeader user={user} />
              <StatsCards />
              <ProfileInfo user={user} onEdit={() => setIsEditing(true)} />
            </div>
          ) : (
            // Edit Mode
            <ProfileForm
              profileData={profileData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
