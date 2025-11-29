"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutUsPage() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      className={`min-h-screen py-20 text-white p-8 flex flex-col items-center transition-all duration-1000 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-12 text-center bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent animate-fadeInDown">
        About Us
      </h1>

      {/* Mission Statement */}
      <section className="max-w-4xl text-center mb-16 animate-fadeInUp">
        <p className="text-lg text-gray-300 mb-4">
          We are a passionate team of tech enthusiasts dedicated to bringing you the ultimate PC
          customization experience. Our goal is to provide top-notch components and a seamless
          shopping experience for gamers, creators, and PC builders.
        </p>
        <p className="text-lg text-gray-400">
          From CPUs to GPUs, RAM to Storage, we help you build a PC that’s not only powerful but
          uniquely yours.
        </p>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl w-5xl h-80 grid grid-cols-1 md:grid-cols-1 gap-8 animate-fadeInUp delay-200">
        {[
          { name: "Firas Kacimi", role: "Founder & CEO", details:"a pationate pahrmacy student and gomycode web developer graduate", img: "/ME.jpg" },
        ].map((member) => (
          <div
            key={member.name}
            className="bg-gray-900 rounded-3xl p-6 flex flex-col items-center shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-500"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-cyan-500">
              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-1">{member.name}</h3>
            <p className="text-gray-400">{member.role}</p>
            <p className="text-white text-center mt-2">"{member.details}"</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="mt-16 text-center animate-fadeInUp delay-400">
        <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Join Us on Our Journey
        </h2>
        <p className="text-gray-300 mb-6">
          Explore our products, customize your dream PC, and be part of the next-gen gaming and
          tech revolution.
        </p>
        <Link href={"/products"} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-md transition-all duration-300">
          Explore Products
        </Link>
      </section>
    </div>
  );
}
