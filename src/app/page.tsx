"use client";

import React from "react";
import Header from "./components/Header";

export default function HomePage() {
  const handleShopNow = () => {
    window.location.href = "/Shop";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <div
        className="relative h-[800px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/Assets/backmainpage.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl md:text-2xl mb-8">Discover our amazing collection</p>
          <button
            onClick={handleShopNow}
            className="bg-[#1A7DB4] hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
