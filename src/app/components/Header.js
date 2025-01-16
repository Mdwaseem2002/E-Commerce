"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { auth, googleProvider } from "./firebase"; // Import Firebase auth and provider
import { signInWithPopup } from "firebase/auth";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };

      // Store user data in MongoDB
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to store user data");
      }

      setCurrentUser(userData);
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } catch (error) {
      console.error("Authentication Error:", error.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center">
          <img src="/Assets/logo.png" alt="Logo" className="w-48 h-22 object-contain" />
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6 items-center">
            <li className="text-[#1A7DB4] hover:text-blue-500 cursor-pointer text-xl">
              <Link href="/">Home</Link>
            </li>
            <li className="text-[#1A7DB4] hover:text-blue-500 cursor-pointer text-xl">
              <Link href="/services">Services</Link>
            </li>
            {currentUser ? (
              <li className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-[#1A7DB4] focus:outline-none"
                >
                  <User size={24} />
                  <span className="ml-2">My Account</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <button
                  onClick={handleGoogleSignIn}
                  className="text-[#1A7DB4] hover:text-blue-500 cursor-pointer text-xl"
                >
                  Login with Google
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
