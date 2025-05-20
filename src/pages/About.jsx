import React from "react";
import Navbar from "../Navbar";

function About() {
  return (
    <>
      <Navbar />
      <div className="p-6 text-center">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p className="text-lg">We are an IT team showcasing innovations during Open Day.</p>
      </div>
    </>
  );
}

export default About;
