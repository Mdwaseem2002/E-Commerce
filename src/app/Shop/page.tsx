"use client";

import React from "react";
import Header from "../components/Header"; // Import the Header component
import TshirtGrid from "../components/TshirtGrid";

export default function Shop() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header /> {/* Add the Header component here */}
      <main className="container mx-auto p-4">
        
        <TshirtGrid />
      </main>
    </div>
  );
}
