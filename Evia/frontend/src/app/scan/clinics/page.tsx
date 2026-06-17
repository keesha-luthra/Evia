"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useSkinAnalysis } from "../context/SkinAnalysisContext";
import dynamic from 'next/dynamic';
import MinimalNavbar from "@/components/layout/MinimalNavbar";

const LeafletMap = dynamic(() => import('../components/LeafletMap'), { ssr: false });

// Define a union type for valid clinic categories
type ClinicCategory = "NGO" | "Government" | "Private" | "User";

interface Clinic {
  category: ClinicCategory; // Now strictly one of the four
  name: string;
  place_id: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  location: {
    lat: number;
    lng: number;
  };
  hours?: string[];
}

interface ClinicsMapProps {
  clinics: Clinic[];
  center: { lat: number; lng: number };
  userLocation?: { lat: number; lng: number };
}



export default function ClinicsPage() {
  const { result } = useSkinAnalysis();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleFindClinics = async () => {
    if (!result) {
      toast.error("Please complete analysis to get a disease prediction first.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        console.log("User's current location:", { lat: latitude, lng: longitude });

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/find_clinics`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              disease: result.condition,
              location: { lat: latitude, lng: longitude },
              range: 5,
            }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch clinics");
          }
          const data = await response.json();
          console.log("Clinics data from backend:", data);

          setClinics(data.clinics || []);
          toast.success("Clinics found!");
        } catch (err) {
          toast.error("Error fetching clinics.");
          console.error(err);
        }
      },
      error => {
        toast.error("Failed to get your location.");
        console.error(error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-[--background] py-12 px-4 pt-24">
      <MinimalNavbar />
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
        <h1 className="text-lg text-black font-bold mb-4">Step 3: Nearby Clinics</h1>

        <button
          onClick={handleFindClinics}
          className="w-full bg-brand-500 text-white py-3 rounded-lg hover:brightness-110 transition"
        >
          Find Nearby Clinics
        </button>

        {userLocation ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Nearby Clinics</h3>
            <LeafletMap clinics={clinics} center={userLocation} />

            {/* Legend */}
            <div className="mt-4 p-3 border rounded-lg bg-brand-100 flex flex-wrap gap-4 items-center text-sm">
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  alt="NGO"
                  className="w-4 h-4"
                />
                <span>NGO</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  alt="Government"
                  className="w-4 h-4"
                />
                <span>Government</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  alt="Private"
                  className="w-4 h-4"
                />
                <span>Private</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                  alt="You"
                  className="w-4 h-4"
                />
                <span>You</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-600">
            Location not set. Click "Find Nearby Clinics" to allow geolocation.
          </p>
        )}
      </div>
    </div>
  );
}
