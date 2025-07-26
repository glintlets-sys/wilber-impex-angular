import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  rating: number;
  badge?: string;
  size: string[];
  category: string;
  categoryName: string;
  specifications?: string[];
  features?: string[];
  applications?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getAllProducts(): Observable<Product[]> {
    const products: Product[] = [
      // Cementitious Tile Adhesive Products
      {
        id: 'reg-999',
        name: 'REG-999',
        description: 'REG-999 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/Cementitious_tile_adevisa/REG-999.jpg',
        link: '/product/reg-999',
        rating: 4.5,
        badge: 'New',
        size: ['5 KG', '10 KG', '20 KG'],
        category: 'cementitious-tile-adhesive',
        categoryName: 'Cementitious Tile Adhesive',
        specifications: [
          'Polymer-modified cement-based adhesive',
          'Grey color',
          'Suitable for ceramic tiles',
          'High bonding strength'
        ],
        features: [
          'Excellent adhesion',
          'Water resistant',
          'Easy to apply',
          'Long shelf life'
        ],
        applications: [
          'Floor tile installation',
          'Wall tile installation',
          'Ceramic tile fixing',
          'Internal applications'
        ]
      },
      {
        id: 'gen-666',
        name: 'GEN-666',
        description: 'GEN-666 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/Cementitious_tile_adevisa/GEN-666.jpg',
        link: '/product/gen-666',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG', '5 KG'],
        category: 'cementitious-tile-adhesive',
        categoryName: 'Cementitious Tile Adhesive',
        specifications: [
          'Premium tile adhesive',
          'Suitable for natural stones',
          'High strength formula',
          'Flexible bonding'
        ],
        features: [
          'Superior bonding',
          'Crack resistance',
          'Moisture resistant',
          'Quick setting'
        ],
        applications: [
          'Natural stone installation',
          'Clay tile fixing',
          'Terracotta applications',
          'Vitrified tile installation'
        ]
      },
      {
        id: 'mgv-333',
        name: 'MGV-333',
        description: 'MGV-333 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/Cementitious_tile_adevisa/MGV-333.jpg',
        link: '/product/mgv-333',
        rating: 4.0,
        size: ['1 KG', '5 KG', '25 KG'],
        category: 'cementitious-tile-adhesive',
        categoryName: 'Cementitious Tile Adhesive',
        specifications: [
          'Versatile tile adhesive',
          'Suitable for all tile types',
          'Internal applications',
          'High performance formula'
        ],
        features: [
          'Universal compatibility',
          'Strong bonding',
          'Easy mixing',
          'Extended working time'
        ],
        applications: [
          'Ceramic tile installation',
          'Vitrified tile fixing',
          'Natural stone applications',
          'Internal floor and wall'
        ]
      },
      {
        id: 'gel-w-100',
        name: 'GEL-W 100',
        description: 'GEL-W 100 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
        image: 'assets/images/wilber_product/Cementitious_tile_adevisa/GEL-W 100.jpg',
        link: '/product/gel-w-100',
        rating: 4.7,
        size: ['1 L', '5 L'],
        category: 'cementitious-tile-adhesive',
        categoryName: 'Cementitious Tile Adhesive',
        specifications: [
          'Gel-based adhesive',
          'External cladding formula',
          'Weather resistant',
          'High flexibility'
        ],
        features: [
          'Weatherproof bonding',
          'Flexible application',
          'UV resistance',
          'Long-term durability'
        ],
        applications: [
          'External cladding',
          'Marble installation',
          'Natural stone fixing',
          'Outdoor applications'
        ]
      },
      // Ager / Polish Products
      {
        id: 'cera-polish-450',
        name: 'CERA POLISH-450',
        description: 'New CERA POLISH-450 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/ager_polish/CERA_POLISH-450.jpg',
        link: '/product/cera-polish-450',
        rating: 4.5,
        badge: 'New',
        size: ['5 KG', '10 KG', '20 KG'],
        category: 'ager-polish',
        categoryName: 'Ager / Polish',
        specifications: [
          'Ceramic polish formula',
          'High gloss finish',
          'Durable protection',
          'Easy application'
        ],
        features: [
          'Long-lasting shine',
          'Stain resistance',
          'UV protection',
          'Non-toxic formula'
        ],
        applications: [
          'Ceramic tile polishing',
          'Floor maintenance',
          'Surface protection',
          'Restoration projects'
        ]
      },
      {
        id: 'granito-colour-enhancer-400',
        name: 'GRANITO COLOUR ENHANCER-400',
        description: 'GRANITO COLOUR ENHANCER-400 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/ager_polish/GRANITO_COLOUR_ENHANCER-400.jpg',
        link: '/product/granito-colour-enhancer-400',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG', '5 KG'],
        category: 'ager-polish',
        categoryName: 'Ager / Polish',
        specifications: [
          'Color enhancement formula',
          'Granite specific',
          'Deep penetration',
          'Natural finish'
        ],
        features: [
          'Color enhancement',
          'Natural appearance',
          'Deep penetration',
          'Long-lasting effect'
        ],
        applications: [
          'Granite enhancement',
          'Color restoration',
          'Surface beautification',
          'Natural stone treatment'
        ]
      },
      {
        id: 'jet-nero-black-460',
        name: 'JET NERO BLACK-460',
        description: 'JET NERO BLACK-460 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/ager_polish/JET_NERO_BLACK-460.jpg',
        link: '/product/jet-nero-black-460',
        rating: 4.0,
        size: ['1 KG', '5 KG', '25 KG'],
        category: 'ager-polish',
        categoryName: 'Ager / Polish',
        specifications: [
          'Black color enhancer',
          'Deep black finish',
          'High concentration',
          'Professional grade'
        ],
        features: [
          'Deep black color',
          'Professional finish',
          'High concentration',
          'Easy application'
        ],
        applications: [
          'Black stone enhancement',
          'Professional finishing',
          'Color restoration',
          'Surface treatment'
        ]
      },
      {
        id: 'shiner-2000',
        name: 'SHINER-2000',
        description: 'Wilber SHINER-2000 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
        image: 'assets/images/wilber_product/ager_polish/SHINER-2000.jpg',
        link: '/product/shiner-2000',
        rating: 4.7,
        size: ['1 L', '5 L'],
        category: 'ager-polish',
        categoryName: 'Ager / Polish',
        specifications: [
          'High shine formula',
          'Universal application',
          'Long-lasting shine',
          'Professional finish'
        ],
        features: [
          'High gloss finish',
          'Universal compatibility',
          'Long-lasting shine',
          'Easy maintenance'
        ],
        applications: [
          'Surface polishing',
          'Gloss enhancement',
          'Maintenance treatment',
          'Professional finishing'
        ]
      },
      // Epoxy Grout Products
      {
        id: 'epoxy-grout-set-with-gloves',
        name: 'EPOXY GROUT SET WITH GLOVES',
        description: 'New EPOXY GROUT SET WITH GLOVES is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/epoxy_grout/EPOXY_GROUT_SET_WITH_GLOVES.jpg',
        link: '/product/epoxy-grout-set-with-gloves',
        rating: 4.5,
        badge: 'New',
        size: ['1 KG Set', '2 KG Set', '4 KG Set'],
        category: 'epoxy-grout',
        categoryName: 'Epoxy Grout',
        specifications: [
          'Epoxy grout system',
          'Includes protective gloves',
          'Complete kit',
          'Professional grade'
        ],
        features: [
          'Complete protection',
          'Professional kit',
          'Easy application',
          'Safety included'
        ],
        applications: [
          'Tile grouting',
          'Professional installation',
          'Epoxy applications',
          'Safety-conscious projects'
        ]
      },
      {
        id: 'epoxy-grout-set-without-gloves',
        name: 'EPOXY GROUT SET(without gloves)',
        description: 'EPOXY GROUT SET(without gloves) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/epoxy_grout/EPOXY_GROUT_SET_WITHOUT_GLOVES.jpg',
        link: '/product/epoxy-grout-set-without-gloves',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG Set', '2 KG Set', '4 KG Set'],
        category: 'epoxy-grout',
        categoryName: 'Epoxy Grout',
        specifications: [
          'Epoxy grout system',
          'Basic kit',
          'Professional grade',
          'Cost-effective'
        ],
        features: [
          'Professional quality',
          'Cost-effective',
          'Easy mixing',
          'Strong bonding'
        ],
        applications: [
          'Tile grouting',
          'Professional installation',
          'Epoxy applications',
          'Budget projects'
        ]
      },
      // Sealers Products
      {
        id: 'natural-stone-back-sealer-s',
        name: 'NATURAL STONE BACK SEALER(S)',
        description: 'NATURAL STONE BACK SEALER(S) is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/sealers/NATURAL STONE BACK SEALER(S)-300.jpg',
        link: '/product/natural-stone-back-sealer-s',
        rating: 4.5,
        badge: 'New',
        size: ['1 L', '5 L'],
        category: 'sealers',
        categoryName: 'Sealers',
        specifications: [
          'Natural stone sealer',
          'Solvent-based formula',
          'Back sealing',
          'Professional grade'
        ],
        features: [
          'Back protection',
          'Moisture resistance',
          'Professional finish',
          'Long-lasting protection'
        ],
        applications: [
          'Natural stone protection',
          'Back sealing',
          'Moisture prevention',
          'Professional installation'
        ]
      },
      {
        id: 'natural-stone-back-sealer-w',
        name: 'NATURAL STONE BACK SEALER(W)',
        description: 'NATURAL STONE BACK SEALER(W) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/sealers/NATURAL STONE BACK SEALER(W)-340.jpg',
        link: '/product/natural-stone-back-sealer-w',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 L', '5 L'],
        category: 'sealers',
        categoryName: 'Sealers',
        specifications: [
          'Natural stone sealer',
          'Water-based formula',
          'Back sealing',
          'Environmentally friendly'
        ],
        features: [
          'Water-based formula',
          'Environmentally friendly',
          'Easy application',
          'Low VOC'
        ],
        applications: [
          'Natural stone protection',
          'Back sealing',
          'Eco-friendly projects',
          'Indoor applications'
        ]
      },
      {
        id: 'oil-water-repellent-320',
        name: 'OIL & WATER REPELLENT-320',
        description: 'OIL & WATER REPELLENT-320 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/sealers/OIL & WATER REPELLENT-320.jpg',
        link: '/product/oil-water-repellent-320',
        rating: 4.0,
        size: ['1 L', '5 L'],
        category: 'sealers',
        categoryName: 'Sealers',
        specifications: [
          'Oil and water repellent',
          'Universal application',
          'Long-lasting protection',
          'Professional grade'
        ],
        features: [
          'Dual protection',
          'Universal compatibility',
          'Long-lasting effect',
          'Easy maintenance'
        ],
        applications: [
          'Surface protection',
          'Oil resistance',
          'Water resistance',
          'Maintenance treatment'
        ]
      },
      {
        id: 'stain-protector-330-nano',
        name: 'STAIN PROTECTOR-330 NANO',
        description: 'STAIN PROTECTOR-330 NANO is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
        image: 'assets/images/wilber_product/sealers/STAIN PROTECTOR-330 NANO.jpg',
        link: '/product/stain-protector-330-nano',
        rating: 4.7,
        size: ['1 L', '5 L'],
        category: 'sealers',
        categoryName: 'Sealers',
        specifications: [
          'Nano technology',
          'Stain protection',
          'Advanced formula',
          'Professional grade'
        ],
        features: [
          'Nano protection',
          'Stain resistance',
          'Advanced technology',
          'Long-lasting effect'
        ],
        applications: [
          'Stain protection',
          'Advanced treatment',
          'Professional projects',
          'High-end applications'
        ]
      },
      {
        id: 'water-repellent-310',
        name: 'WATER REPELLENT-310',
        description: 'WATER REPELLENT-310 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/sealers/WATER REPELLENT-310.jpg',
        link: '/product/water-repellent-310',
        rating: 4.5,
        size: ['1 L', '5 L'],
        category: 'sealers',
        categoryName: 'Sealers',
        specifications: [
          'Water repellent formula',
          'Universal application',
          'Long-lasting protection',
          'Easy application'
        ],
        features: [
          'Water resistance',
          'Universal compatibility',
          'Long-lasting protection',
          'Easy maintenance'
        ],
        applications: [
          'Water protection',
          'Surface sealing',
          'Maintenance treatment',
          'Universal applications'
        ]
      },
      // Cleaners Products
      {
        id: 'cement-cleaner-208',
        name: 'CEMENT CLEANER-208',
        description: 'New CEMENT CLEANER-208 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/cleaners/CEMENT CLEANER-208.jpg',
        link: '/product/cement-cleaner-208',
        rating: 4.5,
        badge: 'New',
        size: ['5 KG', '10 KG', '20 KG'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Cement cleaning formula',
          'Strong cleaning power',
          'Safe for surfaces',
          'Professional grade'
        ],
        features: [
          'Strong cleaning',
          'Surface safe',
          'Easy application',
          'Effective removal'
        ],
        applications: [
          'Cement removal',
          'Surface cleaning',
          'Construction cleanup',
          'Professional cleaning'
        ]
      },
      {
        id: 'epoxy-remover-242',
        name: 'EPOXY REMOVER-242',
        description: 'EPOXY REMOVER-242 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/cleaners/EPOXY REMOVER-242.jpg',
        link: '/product/epoxy-remover-242',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG', '5 KG'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Epoxy removal formula',
          'Strong solvent',
          'Professional grade',
          'Effective cleaning'
        ],
        features: [
          'Epoxy removal',
          'Strong solvent',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Epoxy removal',
          'Surface cleaning',
          'Professional projects',
          'Construction cleanup'
        ]
      },
      {
        id: 'granite-rust-remover-253',
        name: 'GRANITE RUST REMOVER-253',
        description: 'GRANITE RUST REMOVER-253 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/cleaners/GRANITE RUST REMOVER-253.jpg',
        link: '/product/granite-rust-remover-253',
        rating: 4.0,
        size: ['1 KG', '5 KG', '25 KG'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Rust removal formula',
          'Granite specific',
          'Safe for stone',
          'Professional grade'
        ],
        features: [
          'Rust removal',
          'Stone safe',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Rust removal',
          'Granite cleaning',
          'Stone restoration',
          'Professional cleaning'
        ]
      },
      {
        id: 'marble-cement-cleaner-200',
        name: 'MARBLE CEMENT CLEANER-200',
        description: 'Wilber MARBLE CEMENT CLEANER-200 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
        image: 'assets/images/wilber_product/cleaners/MARBLE CEMENT CLEANER-200.jpg',
        link: '/product/marble-cement-cleaner-200',
        rating: 4.7,
        size: ['1 L', '5 L'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Marble cement cleaner',
          'Marble specific',
          'Safe for marble',
          'Professional grade'
        ],
        features: [
          'Marble safe',
          'Cement removal',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Marble cleaning',
          'Cement removal',
          'Stone restoration',
          'Professional cleaning'
        ]
      },
      {
        id: 'marble-rust-remover-240',
        name: 'MARBLE RUST REMOVER-240',
        description: 'Wilber MARBLE RUST REMOVER-240 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
        image: 'assets/images/wilber_product/cleaners/MARBLE RUST REMOVER-240.jpg',
        link: '/product/marble-rust-remover-240',
        rating: 4.7,
        size: ['1 L', '5 L'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Marble rust remover',
          'Marble specific',
          'Safe for marble',
          'Professional grade'
        ],
        features: [
          'Marble safe',
          'Rust removal',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Marble rust removal',
          'Stone restoration',
          'Professional cleaning',
          'Marble maintenance'
        ]
      },
      {
        id: 'neutral-cleaner-230',
        name: 'NEUTRAL CLEANER-230',
        description: 'NEUTRAL CLEANER-230 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/cleaners/NEUTRAL CLEANER-230.jpg',
        link: '/product/neutral-cleaner-230',
        rating: 4.5,
        size: ['1 L', '5 L'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Neutral pH formula',
          'Safe for all surfaces',
          'Gentle cleaning',
          'Professional grade'
        ],
        features: [
          'Neutral pH',
          'Surface safe',
          'Gentle cleaning',
          'Universal application'
        ],
        applications: [
          'Gentle cleaning',
          'Surface maintenance',
          'Regular cleaning',
          'Safe applications'
        ]
      },
      {
        id: 'paint-remover-250',
        name: 'PAINT REMOVER-250',
        description: 'PAINT REMOVER-250 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/cleaners/PAINT REMOVER-250.jpg',
        link: '/product/paint-remover-250',
        rating: 5.0,
        size: ['1 L', '5 L'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Paint removal formula',
          'Strong solvent',
          'Professional grade',
          'Effective removal'
        ],
        features: [
          'Paint removal',
          'Strong solvent',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Paint removal',
          'Surface cleaning',
          'Professional projects',
          'Construction cleanup'
        ]
      },
      {
        id: 'universal-cleaner-248',
        name: 'UNIVERSAL CLEANER-248',
        description: 'UNIVERSAL CLEANER-248 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/cleaners/UNIVERSAL CLEANER-248.jpg',
        link: '/product/universal-cleaner-248',
        rating: 4.0,
        size: ['1 L', '5 L'],
        category: 'cleaners',
        categoryName: 'Cleaners',
        specifications: [
          'Universal cleaning formula',
          'All surface compatible',
          'Professional grade',
          'Effective cleaning'
        ],
        features: [
          'Universal application',
          'All surface safe',
          'Professional grade',
          'Effective cleaning'
        ],
        applications: [
          'Universal cleaning',
          'Surface maintenance',
          'Professional cleaning',
          'General applications'
        ]
      },
      // Mastic Products
      {
        id: 'epox-7005',
        name: 'EPOX 7005',
        description: 'EPOX 7005 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/mastic/EPOX 7005 (1).png',
        link: '/product/epox-7005',
        rating: 4.5,
        badge: 'New',
        size: ['1 KG', '5 KG'],
        category: 'mastic',
        categoryName: 'Mastic',
        specifications: [
          'Epoxy mastic formula',
          'High strength',
          'Professional grade',
          'Durable bonding'
        ],
        features: [
          'High strength',
          'Durable bonding',
          'Professional grade',
          'Long-lasting'
        ],
        applications: [
          'Epoxy applications',
          'Professional bonding',
          'High-strength projects',
          'Durable installations'
        ]
      },
      {
        id: 'mastic-liquid',
        name: 'MASTIC LIQUID',
        description: 'MASTIC LIQUID is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/mastic/MASTIC LIQUID.jpg',
        link: '/product/mastic-liquid',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 L', '5 L'],
        category: 'mastic',
        categoryName: 'Mastic',
        specifications: [
          'Liquid mastic formula',
          'Easy application',
          'Professional grade',
          'Flexible bonding'
        ],
        features: [
          'Easy application',
          'Flexible bonding',
          'Professional grade',
          'Versatile use'
        ],
        applications: [
          'Liquid applications',
          'Flexible bonding',
          'Professional projects',
          'Versatile installations'
        ]
      },
      {
        id: 'mastic-solid',
        name: 'MASTIC SOLID',
        description: 'MASTIC SOLID is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
        image: 'assets/images/wilber_product/mastic/MASTIC SOLID.jpg',
        link: '/product/mastic-solid',
        rating: 4.0,
        size: ['1 KG', '5 KG'],
        category: 'mastic',
        categoryName: 'Mastic',
        specifications: [
          'Solid mastic formula',
          'High strength',
          'Professional grade',
          'Durable bonding'
        ],
        features: [
          'High strength',
          'Durable bonding',
          'Professional grade',
          'Solid consistency'
        ],
        applications: [
          'Solid applications',
          'High-strength bonding',
          'Professional projects',
          'Durable installations'
        ]
      },
      // Epoxy Products
      {
        id: 'epoxy-adhesive-152-part-a',
        name: 'EPOXY ADHESIVE-152(PART-A)',
        description: 'EPOXY ADHESIVE-152(PART-A) is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/epoxy_products/EPOXY_ADHESIVE-152_PART-A.jpg',
        link: '/product/epoxy-adhesive-152-part-a',
        rating: 4.5,
        badge: 'New',
        size: ['1 KG', '5 KG'],
        category: 'epoxy-products',
        categoryName: 'Epoxy Products',
        specifications: [
          'Epoxy adhesive Part A',
          'Two-component system',
          'High strength',
          'Professional grade'
        ],
        features: [
          'High strength',
          'Two-component',
          'Professional grade',
          'Durable bonding'
        ],
        applications: [
          'Epoxy bonding',
          'High-strength applications',
          'Professional projects',
          'Durable installations'
        ]
      },
      {
        id: 'epoxy-adhesive-152-part-b',
        name: 'EPOXY ADHESIVE-152(PART-B)',
        description: 'EPOXY ADHESIVE-152(PART-B) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/epoxy_products/EPOXY_ADHESIVE-152_PART-B.jpg',
        link: '/product/epoxy-adhesive-152-part-b',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG', '5 KG'],
        category: 'epoxy-products',
        categoryName: 'Epoxy Products',
        specifications: [
          'Epoxy adhesive Part B',
          'Two-component system',
          'High strength',
          'Professional grade'
        ],
        features: [
          'High strength',
          'Two-component',
          'Professional grade',
          'Durable bonding'
        ],
        applications: [
          'Epoxy bonding',
          'High-strength applications',
          'Professional projects',
          'Durable installations'
        ]
      },
      // Lapizo Bond Products
      {
        id: 'lapizo-bond-fast-set',
        name: 'LAPIZO BOND FAST SET',
        description: 'LAPIZO BOND FAST SET is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/lapizo_bond/LAPIZO BOND FAST SET.jpg',
        link: '/product/lapizo-bond-fast-set',
        rating: 4.5,
        badge: 'New',
        size: ['1 KG', '5 KG'],
        category: 'lapizo-bond',
        categoryName: 'Lapizo Bond',
        specifications: [
          'Fast-setting adhesive',
          'High strength',
          'Professional grade',
          'Quick bonding'
        ],
        features: [
          'Fast setting',
          'High strength',
          'Professional grade',
          'Quick bonding'
        ],
        applications: [
          'Fast applications',
          'Quick bonding',
          'Professional projects',
          'Time-sensitive installations'
        ]
      },
      {
        id: 'lapizo-bond-fast-set-small',
        name: 'LAPIZO BOND FAST SET(SMALL)',
        description: 'LAPIZO BOND FAST SET(SMALL) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/lapizo_bond/LAPIZO BOND FAST SET(SMALL).jpg',
        link: '/product/lapizo-bond-fast-set-small',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 KG', '5 KG'],
        category: 'lapizo-bond',
        categoryName: 'Lapizo Bond',
        specifications: [
          'Fast-setting adhesive',
          'Small size option',
          'High strength',
          'Professional grade'
        ],
        features: [
          'Fast setting',
          'Small size',
          'High strength',
          'Professional grade'
        ],
        applications: [
          'Small projects',
          'Fast applications',
          'Quick bonding',
          'Professional installations'
        ]
      },
      // Crystalizer Products
      {
        id: 'marble-polish-powder',
        name: 'MARBLE POLISH POWDER',
        description: 'MARBLE POLISH POWDER is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
        image: 'assets/images/wilber_product/crystalizer/MARBLE_POLISH_POWDER.jpg',
        link: '/product/marble-polish-powder',
        rating: 4.5,
        badge: 'New',
        size: ['1 KG', '5 KG'],
        category: 'crystalizer',
        categoryName: 'Crystalizer',
        specifications: [
          'Marble polish powder',
          'Professional grade',
          'High shine finish',
          'Easy application'
        ],
        features: [
          'High shine',
          'Professional grade',
          'Easy application',
          'Long-lasting finish'
        ],
        applications: [
          'Marble polishing',
          'Professional finishing',
          'Surface enhancement',
          'Maintenance treatment'
        ]
      },
      // Marble Densifier Products
      {
        id: 'marble-densifier-regular',
        name: 'MARBLE DESNIFIER REGULAR',
        description: 'MARBLE DESNIFIER REGULAR is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
        image: 'assets/images/wilber_product/marble_densifier/MARBLE DESNIFIER REGULAR.jpg',
        link: '/product/marble-densifier-regular',
        rating: 5.0,
        badge: 'Bestseller',
        size: ['1 L', '5 L'],
        category: 'marble-densifier',
        categoryName: 'Marble Densifier',
        specifications: [
          'Marble densifier',
          'Regular formula',
          'Professional grade',
          'Surface strengthening'
        ],
        features: [
          'Surface strengthening',
          'Professional grade',
          'Regular formula',
          'Long-lasting effect'
        ],
        applications: [
          'Marble densification',
          'Surface strengthening',
          'Professional treatment',
          'Long-term protection'
        ]
      }
    ];

    return of(products);
  }

  getProductById(id: string): Observable<Product | undefined> {
    return new Observable(observer => {
      this.getAllProducts().subscribe(products => {
        const product = products.find(p => p.id === id);
        observer.next(product);
        observer.complete();
      });
    });
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe(products => {
        const categoryProducts = products.filter(p => p.category === category);
        observer.next(categoryProducts);
        observer.complete();
      });
    });
  }

  getRelatedProducts(category: string, excludeProductId?: string): Observable<Product[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe(products => {
        let relatedProducts = products.filter(p => p.category === category);
        
        if (excludeProductId) {
          relatedProducts = relatedProducts.filter(p => p.id !== excludeProductId);
        }
        
        // Return max 4 related products
        observer.next(relatedProducts.slice(0, 4));
        observer.complete();
      });
    });
  }

  getCategories(): Observable<string[]> {
    return new Observable(observer => {
      this.getAllProducts().subscribe(products => {
        const categories = [...new Set(products.map(p => p.category))];
        observer.next(categories);
        observer.complete();
      });
    });
  }
} 