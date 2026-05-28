// Centralized sample data and procedural generator to ensure zero duplication

export const sampleCategories = [
  { name: "Processors", slug: 'processors', image: '/category_processors.png', description: 'High-performance AMD Ryzen and Intel Core processors.' },
  { name: "Graphics Cards", slug: 'gpus', image: '/category_gpus.png', description: 'NVIDIA GeForce and AMD Radeon graphics cards.' },
  { name: "Gaming Laptops", slug: 'laptops', image: '/category_laptops.png', description: 'Powerful portable gaming laptops and notebooks.' },
  { name: "Custom Gaming PCs", slug: 'gaming-pcs', image: '/category_gaming_pcs.png', description: 'Custom built pre-assembled gaming desktops.' },
  { name: "Monitors", slug: 'monitors', image: '/category_monitors.png', description: 'Ultra-fast refresh rate gaming monitors.' },
  { name: "Keyboards & Mice", slug: 'peripherals', image: '/category_peripherals.png', description: 'Precision gaming mechanical keyboards and mice.' },
  { name: "Audio & Headsets", slug: 'audio', image: '/category_audio.png', description: 'Immersive studio-grade headsets and microphones.' },
  { name: "PC Cabinets", slug: 'cases', image: '/category_cases.png', description: 'Premium PC cabinets with tempered glass and RGB.' },
  { name: "Storage", slug: 'storage', image: '/category_storage.png', description: 'High-speed PCIe 4.0 NVMe SSDs and high-capacity HDDs.' },
  { name: "Cooling & Fans", slug: 'cooling', image: '/category_cooling.png', description: 'AIO liquid CPU coolers and high-airflow RGB fans.' }
];

const categoryProductsList = {
  "Processors": [
    "Intel Core i9-14900K Processor",
    "AMD Ryzen 9 7950X3D Processor",
    "Intel Core i7-14700K Processor",
    "AMD Ryzen 7 7800X3D Processor",
    "Intel Xeon W7-2495X Processor",
    "AMD Ryzen Threadripper 7960X",
    "Intel Core i9-13900KS Processor",
    "AMD Ryzen 9 5950X Processor",
    "Intel Core i9-12900KS Processor",
    "AMD Ryzen Threadripper 3960X"
  ],
  "Graphics Cards": [
    "NVIDIA GeForce RTX 4090 24GB",
    "ASUS ROG Strix RTX 4080 Super",
    "MSI Gaming X Trio RTX 4070 Ti",
    "AMD Radeon RX 7900 XTX 24GB",
    "Gigabyte AORUS RTX 4080 16GB",
    "EVGA GeForce RTX 3090 Ti FTW3",
    "Sapphire NITRO+ RX 7900 XT",
    "ZOTAC Gaming RTX 4070 Ti Super",
    "NVIDIA RTX 6000 Ada Generation",
    "ASUS TUF Gaming RX 7800 XT"
  ],
  "Gaming Laptops": [
    "ASUS ROG Strix Scar 16 (2026)",
    "Razer Blade 16 QHD+ 240Hz",
    "MSI Raider GE78 HX Gaming Laptop",
    "Alienware m18 R2 Gaming Laptop",
    "Lenovo Legion Pro 7i Gen 9",
    "HP Omen 17 Premium Laptop",
    "ASUS ROG Zephyrus G16 OLED",
    "Acer Predator Helios 18 Laptop",
    "Gigabyte AORUS 16X (2026)",
    "MSI Titan GT77 HX Gaming Laptop"
  ],
  "Custom Gaming PCs": [
    "Satrion Aegis Extreme Liquid Gaming PC",
    "Satrion Titan Elite RTX 4090 Build",
    "Satrion Chronos Ryzen 9 Custom PC",
    "Satrion Horizon H1 RTX 4080 Build",
    "Satrion Eclipse Dual-Loop Custom PC",
    "Satrion Prism White Edition Gaming PC",
    "Satrion Apex Pro Creator Workstation",
    "Satrion Nemesis Watercooled PC",
    "Satrion Phantom Stealth Gaming Rig",
    "Satrion Vanguard Ryzen Threadripper PC"
  ],
  "Monitors": [
    "Samsung Odyssey OLED G9 49\"",
    "ASUS ROG Swift PG42UQ OLED",
    "LG UltraGear 45\" Curved OLED",
    "Alienware AW3423DW QD-OLED",
    "MSI Optix MPG321UR-QD 4K",
    "BenQ MOBIUZ EX480UZ 48\" OLED",
    "Gigabyte AORUS FO48U 4K OLED",
    "Corsair XENEON FLEX Bendable OLED",
    "Samsung Odyssey Ark 55\" UHD",
    "Sony Inzone M9 4K HDR Monitor"
  ],
  "Keyboards & Mice": [
    "Razer Huntsman V3 Pro Keyboard",
    "Logitech G Pro X Superlight 2 Mouse",
    "Corsair K100 RGB Mechanical Keyboard",
    "SteelSeries Apex Pro TKL Keyboard",
    "Wooting 60HE Hall Effect Keyboard",
    "Logitech MX Master 3S Wireless Mouse",
    "ASUS ROG Azoth Mechanical Keyboard",
    "Razer Basilisk V3 Pro Wireless Mouse",
    "Wooting Two HE Analog Keyboard",
    "Corsair Darkstar Wireless MMO Mouse"
  ],
  "Audio & Headsets": [
    "SteelSeries Arctis Nova Pro Wireless",
    "Audeze Maxwell Planar Headset",
    "Sennheiser HD 800 S Headphones",
    "Beyerdynamic DT 1990 Pro Headset",
    "Razer Leviathan V2 Pro Soundbar",
    "Shure SM7B Studio Microphone",
    "Astro A50 X Wireless Headset",
    "ASUS ROG Theta 7.1 Headset",
    "Focal Bathys Wireless ANC Headphones",
    "Neumann TLM 103 Microphone Set"
  ],
  "PC Cabinets": [
    "LIAN LI O11 Dynamic EVO XL Case",
    "Corsair Obsidian 1000D Super-Tower",
    "ASUS ROG Hyperion GR701 Chassis",
    "Phanteks NV9 Premium Mid-Tower",
    "Thermaltake Tower 900 Full-Tower",
    "Hyte Y70 Touch Dual-Chamber Case",
    "Fractal Design Terra Jade SFF Case",
    "Cooler Master HAF 700 EVO Case",
    "Lian Li V3000 Plus Full-Tower",
    "NZXT H9 Elite Dual-Chamber Chassis"
  ],
  "Storage": [
    "Samsung 990 Pro PCIe 5.0 4TB SSD",
    "Crucial T700 PCIe 5.0 4TB NVMe SSD",
    "Seagate FireCuda 530 4TB NVMe SSD",
    "Western Digital Black SN850X 4TB SSD",
    "Sabrent Rocket 4 Plus-G 8TB SSD",
    "ASUS ROG Strix Arion 4TB SSD",
    "SanDisk Professional PRO-BLADE 4TB",
    "Corsair MP700 PRO PCIe 5.0 4TB SSD",
    "Kingston FURY Renegade 4TB NVMe SSD",
    "G-Technology G-SPEED Shuttle 8TB SSD"
  ],
  "Cooling & Fans": [
    "Corsair iCUE Link H170i LCD AIO",
    "ASUS ROG Ryujin III 360 ARGB Cooler",
    "MSI MEG Silent Gale P12 9-Fan Pack",
    "Lian Li UNI Fan TL LCD 9-Fan Kit",
    "Thermaltake Pacific TOUGH Liquid Kit",
    "EK Water Blocks Quantum Custom Loop Kit",
    "Noctua NH-D15 chromax.black Cooler",
    "Phanteks Glacier One 420 T30 AIO",
    "NZXT Kraken Elite 360 RGB Cooler",
    "Alphacool Eisbaer Pro Aurora AIO"
  ]
};

const localCategoryImages = {
  "Processors": [
    "/shop_01.jpg",          // Intel Core Box
    "/shop_02.jpg",          // AMD Ryzen Box
    "/category_processors.png" // Premium tech liquid metal CPU shot
  ],
  "Graphics Cards": [
    "/category_gpus.png",     // High end modern GPU
    "/feature_prod_05.jpg",   // Performance gaming graphics card
    "/feature_prod_06.jpg"    // Close-up cooling fan GPU
  ],
  "Gaming Laptops": [
    "/category_laptops.png",  // Premium gaming laptop
    "/feature_prod_03.jpg",   // Slim modern notebook
    "/about-hero.png"         // Full ROG gaming setup with laptop
  ],
  "Custom Gaming PCs": [
    "/category_gaming_pcs.png", // Dual loop custom rig
    "/feature_prod_04.jpg",     // Dynamic RGB tower chassis
    "/banner_img_01_new.png"    // Extreme custom gaming PC profile
  ],
  "Monitors": [
    "/shop_03.jpg",           // Curved wide gaming monitor
    "/shop_04.jpg",           // LG 4K flat designer monitor
    "/category_monitors.png"  // Vibrant dual screen setup
  ],
  "Keyboards & Mice": [
    "/rgb_keyboard.png",       // Mechanical gaming keyboard
    "/gaming_mouse.png",       // Ergonomic wireless mouse
    "/shop_05.jpg",            // Razer classic mouse
    "/shop_06.jpg",            // Logitech productive mouse
    "/shop_07.jpg",            // Corsair gaming keyboard
    "/mouse_pad.png",          // Stitched extended mouse pad
    "/category_peripherals.png" // Minimalist desk peripherals setup
  ],
  "Audio & Headsets": [
    "/gaming_headset.png",     // Wireless gaming headset
    "/shop_08.jpg",            // Audio-Technica professional headphones
    "/category_audio.png",     // Modern headphones on stand
    "/streaming_mic.png"       // High-end streaming microphone on boom arm
  ],
  "PC Cabinets": [
    "/category_cases.png",     // Lian Li style tempered glass PC case
    "/feature_prod_01.jpg"     // Mid tower black gaming cabinet
  ],
  "Storage": [
    "/shop_09.jpg",            // High performance Samsung M.2 NVMe SSD
    "/category_storage.png"    // PCIe storage expansion card
  ],
  "Cooling & Fans": [
    "/category_cooling.png",   // ARGB liquid cooler block & case fans
    "/feature_prod_02.jpg"     // Liquid CPU AIO cooling setup
  ]
};

export const generateAllProducts = () => {
  const products = [];
  const prices = [59999, 64999, 79999, 89999, 99999, 109999, 119999, 124999, 139999, 149999];
  const brands = {
    "Processors": ["Intel", "AMD"],
    "Graphics Cards": ["NVIDIA", "ASUS", "MSI", "AMD", "Gigabyte", "EVGA", "Sapphire", "ZOTAC"],
    "Gaming Laptops": ["ASUS", "Razer", "MSI", "Alienware", "Lenovo", "HP", "Acer", "Gigabyte"],
    "Custom Gaming PCs": ["Satrion"],
    "Monitors": ["Samsung", "ASUS", "LG", "Alienware", "MSI", "BenQ", "Gigabyte", "Corsair", "Sony"],
    "Keyboards & Mice": ["Razer", "Logitech", "Corsair", "SteelSeries", "Wooting", "Keychron", "ASUS"],
    "Audio & Headsets": ["SteelSeries", "Audeze", "Sennheiser", "Beyerdynamic", "Razer", "Shure", "Astro", "ASUS", "Focal", "Neumann"],
    "PC Cabinets": ["LIAN LI", "Corsair", "ASUS", "Phanteks", "Thermaltake", "Hyte", "Fractal", "Cooler Master", "NZXT"],
    "Storage": ["Samsung", "Crucial", "Seagate", "Western Digital", "Sabrent", "ASUS", "SanDisk", "Corsair", "Kingston"],
    "Cooling & Fans": ["Corsair", "ASUS", "MSI", "Lian Li", "Thermaltake", "EKWB", "Noctua", "Phanteks", "NZXT", "Alphacool"]
  };

  let globalIndex = 0;
  for (const [catName, prodList] of Object.entries(categoryProductsList)) {
    prodList.forEach((name, idx) => {
      const price = prices[idx % prices.length];
      const originalPrice = price + 10000;
      
      // Determine real local product image based on product characteristics
      const catImgs = localCategoryImages[catName];
      let image = catImgs[0];
      
      if (catName === "Processors") {
        if (name.includes("Intel")) image = "/shop_01.jpg";
        else if (name.includes("AMD")) image = "/shop_02.jpg";
        else image = "/category_processors.png";
      } else if (catName === "Keyboards & Mice") {
        if (name.toLowerCase().includes("keyboard")) {
          image = idx % 2 === 0 ? "/rgb_keyboard.png" : "/shop_07.jpg";
        } else if (name.toLowerCase().includes("mouse")) {
          image = name.includes("Logitech") ? "/shop_06.jpg" : (name.includes("Razer") ? "/shop_05.jpg" : "/gaming_mouse.png");
        } else {
          image = "/category_peripherals.png";
        }
      } else if (catName === "Audio & Headsets") {
        if (name.toLowerCase().includes("microphone") || name.toLowerCase().includes("mic")) {
          image = "/streaming_mic.png";
        } else if (name.includes("Sennheiser") || name.includes("Focal")) {
          image = "/shop_08.jpg";
        } else if (name.includes("Audeze") || name.includes("Beyerdynamic")) {
          image = "/category_audio.png";
        } else {
          image = "/gaming_headset.png";
        }
      } else {
        // Round robin for other categories
        image = catImgs[idx % catImgs.length];
      }
      
      const catBrands = brands[catName];
      const brand = catBrands[idx % catBrands.length];

      // Homepage section logic (9 of each)
      let homepageSection = 'None';
      let isFeatured = false;
      if (globalIndex < 9) {
        homepageSection = 'Featured Products';
        isFeatured = true;
      } else if (globalIndex >= 9 && globalIndex < 18) {
        homepageSection = 'Bestsellers';
      } else if (globalIndex >= 18 && globalIndex < 27) {
        homepageSection = 'Our Range of Gaming Products';
      }

      products.push({
        name,
        price,
        originalPrice,
        description: `Premium high-performance ${name} designed for gaming enthusiasts and professional workloads. Features exceptional build quality and industry-leading performance.`,
        rating: idx % 3 === 0 ? 5 : 4.5,
        reviews: 10 + (idx * 7) % 90,
        image,
        category: catName,
        brand,
        stock: 5 + (idx * 3) % 45,
        isFeatured,
        homepageSection
      });
      globalIndex++;
    });
  }
  return products;
};

