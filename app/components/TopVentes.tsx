function TopVentes() {
     const topProducts = [
    { name: "Clavier RGB", img: "/keyboard.jpg" },
    { name: "Souris gaming", img: "/mouse.jpg" },
    { name: "Accessoires PC", img: "/accessories.jpg" },
    { name: "Chargeur portable", img: "/charger.jpg" },
  ];
  return (
         <section className="py-24 px-4 md:px-16 relative">
        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Top ventes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducts.map((item, index) => (
              <div
                key={index}
                className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,217,255,0.3)]"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-center font-bold text-lg group-hover:text-cyan-400 transition-colors">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  );
}

export default TopVentes;