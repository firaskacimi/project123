import { Cpu, HardDrive, Monitor, Zap, Settings } from "lucide-react";

const PCCustomizer = () => {
  const components = [
    {
      category: "Processor",
      icon: Cpu,
      selected: "Intel Core i9-14900K",
      price: 589,
      options: ["i7-13700K", "i9-13900K", "i9-14900K"]
    },
    {
      category: "Graphics Card",
      icon: Monitor,
      selected: "RTX 4080 Super",
      price: 999,
      options: ["RTX 4070", "RTX 4080", "RTX 4080 Super", "RTX 4090"]
    },
    {
      category: "Memory",
      icon: HardDrive,
      selected: "32GB DDR5-6000",
      price: 299,
      options: ["16GB DDR5", "32GB DDR5", "64GB DDR5"]
    },
    {
      category: "Storage",
      icon: HardDrive,
      selected: "1TB NVMe SSD",
      price: 149,
      options: ["500GB NVMe", "1TB NVMe", "2TB NVMe"]
    }
  ];

  const totalPrice = components.reduce((sum, comp) => sum + comp.price, 0) + 200;

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Customize Your{" "}
            <span className="bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Dream PC
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Build the perfect gaming machine tailored to your needs and budget
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Component Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Select Components</h3>
              <div className="inline-flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded-full text-sm">
                <Settings className="h-4 w-4 mr-1" />
                Performance Optimized
              </div>
            </div>

            {components.map((component) => {
              const IconComponent = component.icon;
              return (
                <div
                  key={component.category}
                  className="border border-gray-200 rounded-xl bg-white p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{component.category}</h4>
                        <p className="text-gray-500">{component.selected}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${component.price}</div>
                      <button className="mt-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm">
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Build Summary */}
          <div className="space-y-6">
            <div className="border border-blue-200 rounded-xl bg-white p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-500" />
                Build Summary
              </h3>

              <div className="space-y-4 mb-6">
                {components.map((comp) => (
                  <div key={comp.category} className="flex justify-between text-sm">
                    <span className="text-gray-500">{comp.category}</span>
                    <span className="font-medium">${comp.price}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Case & PSU</span>
                  <span className="font-medium">$200</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${totalPrice}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Add to Cart
                </button>
                <button className="w-full px-4 py-3 border border-gray-300 rounded hover:bg-gray-100 transition">
                  Save Configuration
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Estimated Performance:</span>
                    <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs">
                      Excellent
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Perfect for 4K gaming, streaming, and content creation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PCCustomizer;
