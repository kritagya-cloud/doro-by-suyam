export type Product = {
  id: string;
  name: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    "id": "evil-eye-bracelet",
    "name": "Evil-eye Bracelet",
    "price": 479,
    "category": "Jewellery",
    "image": "/products/evil-eye-bracelet.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant \u2022 Magnet Lock"
  },
  {
    "id": "bow-necklace-studs",
    "name": "Minimal Bow Necklace & Studs",
    "price": 399,
    "category": "Jewellery",
    "image": "/products/bow-bracelet.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant"
  },
  {
    "id": "11-11-necklace",
    "name": "Minimal 11:11 Necklace",
    "price": 329,
    "category": "Jewellery",
    "image": "/products/11-11-necklace.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant"
  },
  {
    "id": "pink-tulip-necklace",
    "name": "Elegant Pink Tulip Chain",
    "price": 349,
    "category": "Jewellery",
    "image": "/products/pink-tulip-necklace.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant"
  },
  {
    "id": "red-tulip-necklace",
    "name": "Elegant Red Tulip Chain",
    "price": 349,
    "category": "Jewellery",
    "image": "/products/red-tulip-necklace.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant"
  },
  {
    "id": "white-heart-necklace",
    "name": "Dainty White Heart Chain",
    "price": 299,
    "category": "Jewellery",
    "image": "/products/white-heart-necklace.jpg",
    "description": "Premium quality \u2022 Anti-tarnish \u2022 Water resistant"
  },
  {
    "id": "red-tulip-bracelet",
    "name": "Red Tulip Bracelet",
    "price": null,
    "category": "Jewellery",
    "image": "/products/red-tulip-bracelet.jpg",
    "description": "Elegant floral bracelet \u2022 Gold-tone finish"
  },
  {
    "id": "blue-gem-bracelet",
    "name": "Blue Gem Floral Bracelet",
    "price": null,
    "category": "Jewellery",
    "image": "/products/blue-gem-bracelet.jpg",
    "description": "Elegant blue gemstone bracelet \u2022 Gold-tone finish"
  },
  {
    "id": "pink-gem-bracelet",
    "name": "Pink Gem Floral Bracelet",
    "price": null,
    "category": "Jewellery",
    "image": "/products/pink-gem-bracelet.jpg",
    "description": "Elegant pink gemstone bracelet \u2022 Silver-tone finish"
  },
  {
    "id": "floral-crystal-bracelet",
    "name": "Floral Crystal Bracelet",
    "price": null,
    "category": "Jewellery",
    "image": "/products/floral-crystal-bracelet.jpg",
    "description": "Delicate floral crystal bracelet"
  },
  {
    "id": "sunflower-canvas",
    "name": "Sunflower Mini Canvas",
    "price": null,
    "category": "Handmade Art",
    "image": "/products/sunflower-canvas.jpg",
    "description": "Hand-painted mini canvas \u2014 a bright little gift"
  },
  {
    "id": "pink-tulip-canvas",
    "name": "Pink Tulip Mini Canvas",
    "price": null,
    "category": "Handmade Art",
    "image": "/products/pink-tulip-canvas.jpg",
    "description": "Hand-painted mini canvas \u2014 soft and thoughtful"
  },
  {
    "id": "evil-eye-canvas",
    "name": "Evil Eye Mini Canvas",
    "price": null,
    "category": "Handmade Art",
    "image": "/products/evil-eye-canvas.jpg",
    "description": "Hand-painted mini canvas with an evil-eye motif"
  },
  {
    "id": "love-canvas",
    "name": "LOVE Mini Canvas",
    "price": null,
    "category": "Handmade Art",
    "image": "/products/love-canvas.jpg",
    "description": "Hand-painted LOVE mini canvas"
  },
  {
    "id": "satin-scrunchies",
    "name": "Satin Scrunchies \u2014 Set of 4",
    "price": null,
    "category": "Scrunchies",
    "image": "/products/scrunchies.jpg",
    "description": "Soft satin scrunchies in aqua, red, yellow and black"
  },
  {
    "id": "floral-hair-clips",
    "name": "Floral Hair Clips \u2014 Gift Box",
    "price": null,
    "category": "Gifts",
    "image": "/products/flower-clips.jpg",
    "description": "Colourful floral hair clips in a gift-ready box"
  }
];

export const categories = ["All", "Jewellery", "Handmade Art", "Scrunchies", "Gifts"];
