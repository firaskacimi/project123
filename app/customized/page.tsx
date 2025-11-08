"use client";
import { useState } from "react";

interface PCOption {
  name: string;
  price: number;
}

export default function CustomizePCPage() {
  // Sample options
  const cpuOptions: PCOption[] = [
    { name: "Intel i7 13700K", price: 450 },
    { name: "AMD Ryzen 9 7900X", price: 500 },
    { name: "Intel i9 14900K", price: 700 },
  ];

  const gpuOptions: PCOption[] = [
    { name: "NVIDIA RTX 4070", price: 600 },
    { name: "AMD RX 7900 XT", price: 650 },
    { name: "NVIDIA RTX 4080", price: 1200 },
  ];

  const ramOptions: PCOption[] = [
    { name: "16GB DDR5", price: 120 },
    { name: "32GB DDR5", price: 220 },
    { name: "64GB DDR5", price: 400 },
  ];

  const storageOptions: PCOption[] = [
    { name: "1TB NVMe SSD", price: 100 },
    { name: "2TB NVMe SSD", price: 180 },
    { name: "4TB NVMe SSD", price: 350 },
  ];

  // Selected state
  const [selectedCPU, setSelectedCPU] = useState(cpuOptions[0]);
  const [selectedGPU, setSelectedGPU] = useState(gpuOptions[0]);
  const [selectedRAM, setSelectedRAM] = useState(ramOptions[0]);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[0]);

  const totalPrice = selectedCPU.price + selectedGPU.price + selectedRAM.price + selectedStorage.price;

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Customize Your PC
      </h1>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* CPU */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-cyan-500/50 transition-shadow">
          <h2 className="text-2xl font-bold mb-4">CPU</h2>
          {cpuOptions.map((cpu) => (
            <button
              key={cpu.name}
              onClick={() => setSelectedCPU(cpu)}
              className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${
                selectedCPU.name === cpu.name
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {cpu.name} - ${cpu.price}
            </button>
          ))}
        </div>

        {/* GPU */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-purple-500/50 transition-shadow">
          <h2 className="text-2xl font-bold mb-4">GPU</h2>
          {gpuOptions.map((gpu) => (
            <button
              key={gpu.name}
              onClick={() => setSelectedGPU(gpu)}
              className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${
                selectedGPU.name === gpu.name
                  ? "bg-purple-500 text-black font-semibold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {gpu.name} - ${gpu.price}
            </button>
          ))}
        </div>

        {/* RAM */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-green-500/50 transition-shadow">
          <h2 className="text-2xl font-bold mb-4">RAM</h2>
          {ramOptions.map((ram) => (
            <button
              key={ram.name}
              onClick={() => setSelectedRAM(ram)}
              className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${
                selectedRAM.name === ram.name
                  ? "bg-green-500 text-black font-semibold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {ram.name} - ${ram.price}
            </button>
          ))}
        </div>

        {/* Storage */}
        <div className="bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-yellow-500/50 transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Storage</h2>
          {storageOptions.map((storage) => (
            <button
              key={storage.name}
              onClick={() => setSelectedStorage(storage)}
              className={`w-full text-left p-3 rounded-xl mb-2 transition-colors ${
                selectedStorage.name === storage.name
                  ? "bg-yellow-500 text-black font-semibold"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {storage.name} - ${storage.price}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="max-w-3xl mx-auto mt-12 bg-gray-900 rounded-3xl p-6 text-center shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>
        <p className="mb-4">
          <span className="font-semibold">CPU:</span> {selectedCPU.name} (${selectedCPU.price})
        </p>
        <p className="mb-4">
          <span className="font-semibold">GPU:</span> {selectedGPU.name} (${selectedGPU.price})
        </p>
        <p className="mb-4">
          <span className="font-semibold">RAM:</span> {selectedRAM.name} (${selectedRAM.price})
        </p>
        <p className="mb-6">
          <span className="font-semibold">Storage:</span> {selectedStorage.name} (${selectedStorage.price})
        </p>
        <p className="text-3xl font-bold mb-6">Total: ${totalPrice}</p>
        <button className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-md transition-all duration-300">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
