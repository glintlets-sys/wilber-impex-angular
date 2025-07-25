import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  rating: number;
  badge?: string;
  size: string[];
}

interface Category {
  id: string;
  name: string;
  link: string;
  active: boolean;
  products: Product[];
}

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  currentCategory: string = 'cementitious-tile-adhesive';
  currentCategoryName: string = 'Cementitious Tile Adhesive';

  ngOnInit() {
    this.initializeCategories();
    this.loadProductsForCategory(this.currentCategory);
  }

  initializeCategories() {
    this.categories = [
      {
        id: 'cementitious-tile-adhesive',
        name: 'Cementitious Tile Adhesive',
        link: '/stone-solution/cementitious-tile-adhesive',
        active: true,
        products: [
          {
            id: 'reg-999',
            name: 'REG-999',
            description: 'REG-999 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/Cementitious_tile_adevisa/REG-999.jpg',
            link: '/product/reg-999',
            rating: 4.5,
            badge: 'New',
            size: ['5 KG', '10 KG', '20 KG']
          },
          {
            id: 'gen-666',
            name: 'GEN-666',
            description: 'GEN-666 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/Cementitious_tile_adevisa/GEN-666.jpg',
            link: '/product/gen-666',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'mgv-333',
            name: 'MGV-333',
            description: 'MGV-333 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/Cementitious_tile_adevisa/MGV-333.jpg',
            link: '/product/mgv-333',
            rating: 4.0,
            size: ['1 KG', '5 KG', '25 KG']
          },
          {
            id: 'gel-w-100',
            name: 'GEL-W 100',
            description: 'GEL-W 100 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
            image: 'assets/images/wilber_product/Cementitious_tile_adevisa/GEL-W 100.jpg',
            link: '/product/gel-w-100',
            rating: 4.7,
            size: ['1 L', '5 L']
          }
        ]
      },
      {
        id: 'ager-polish',
        name: 'Ager / Polish',
        link: '/stone-solution/ager-polish',
        active: false,
        products: [
          {
            id: 'cera-polish-450',
            name: 'CERA POLISH-450',
            description: 'New CERA POLISH-450 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/ager_polish/CERA_POLISH-450.jpg',
            link: '/product/cera-polish-450',
            rating: 4.5,
            badge: 'New',
            size: ['5 KG', '10 KG', '20 KG']
          },
          {
            id: 'granito-colour-enhancer-400',
            name: 'GRANITO COLOUR ENHANCER-400',
            description: 'GRANITO COLOUR ENHANCER-400 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/ager_polish/GRANITO_COLOUR_ENHANCER-400.jpg',
            link: '/product/granito-colour-enhancer-400',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'jet-nero-black-460',
            name: 'JET NERO BLACK-460',
            description: 'JET NERO BLACK-460 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/ager_polish/JET_NERO_BLACK-460.jpg',
            link: '/product/jet-nero-black-460',
            rating: 4.0,
            size: ['1 KG', '5 KG', '25 KG']
          },
          {
            id: 'shiner-2000',
            name: 'SHINER-2000',
            description: 'Wilber SHINER-2000 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
            image: 'assets/images/wilber_product/ager_polish/SHINER-2000.jpg',
            link: '/product/shiner-2000',
            rating: 4.7,
            size: ['1 L', '5 L']
          }
        ]
      },
      {
        id: 'epoxy-grout',
        name: 'Epoxy Grout',
        link: '/stone-solution/epoxy-grout',
        active: false,
        products: [
          {
            id: 'epoxy-grout-set-with-gloves',
            name: 'EPOXY GROUT SET WITH GLOVES',
            description: 'New EPOXY GROUT SET WITH GLOVES is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/epoxy_grout/EPOXY_GROUT_SET_WITH_GLOVES.jpg',
            link: '/product/epoxy-grout-set-with-gloves',
            rating: 4.5,
            badge: 'New',
            size: ['1 KG Set', '2 KG Set', '4 KG Set']
          },
          {
            id: 'epoxy-grout-set-without-gloves',
            name: 'EPOXY GROUT SET(without gloves)',
            description: 'EPOXY GROUT SET(without gloves) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/epoxy_grout/EPOXY_GROUT_SET_WITHOUT_GLOVES.jpg',
            link: '/product/epoxy-grout-set-without-gloves',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG Set', '2 KG Set', '4 KG Set']
          }
        ]
      },
      {
        id: 'sealers',
        name: 'Sealers',
        link: '/stone-solution/sealers',
        active: false,
        products: [
          {
            id: 'natural-stone-back-sealer-s',
            name: 'NATURAL STONE BACK SEALER(S)',
            description: 'NATURAL STONE BACK SEALER(S) is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/sealers/NATURAL STONE BACK SEALER(S)-300.jpg',
            link: '/product/natural-stone-back-sealer-s',
            rating: 4.5,
            badge: 'New',
            size: ['1 L', '5 L']
          },
          {
            id: 'natural-stone-back-sealer-w',
            name: 'NATURAL STONE BACK SEALER(W)',
            description: 'NATURAL STONE BACK SEALER(W) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/sealers/NATURAL STONE BACK SEALER(W)-340.jpg',
            link: '/product/natural-stone-back-sealer-w',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 L', '5 L']
          },
          {
            id: 'oil-water-repellent-320',
            name: 'OIL & WATER REPELLENT-320',
            description: 'OIL & WATER REPELLENT-320 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/sealers/OIL & WATER REPELLENT-320.jpg',
            link: '/product/oil-water-repellent-320',
            rating: 4.0,
            size: ['1 L', '5 L']
          },
          {
            id: 'stain-protector-330-nano',
            name: 'STAIN PROTECTOR-330 NANO',
            description: 'STAIN PROTECTOR-330 NANO is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
            image: 'assets/images/wilber_product/sealers/STAIN PROTECTOR-330 NANO.jpg',
            link: '/product/stain-protector-330-nano',
            rating: 4.7,
            size: ['1 L', '5 L']
          },
          {
            id: 'water-repellent-310',
            name: 'WATER REPELLENT-310',
            description: 'WATER REPELLENT-310 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/sealers/WATER REPELLENT-310.jpg',
            link: '/product/water-repellent-310',
            rating: 4.5,
            size: ['1 L', '5 L']
          }
        ]
      },
      {
        id: 'cleaners',
        name: 'Cleaners',
        link: '/stone-solution/cleaners',
        active: false,
        products: [
          {
            id: 'cement-cleaner-208',
            name: 'CEMENT CLEANER-208',
            description: 'New CEMENT CLEANER-208 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/cleaners/CEMENT CLEANER-208.jpg',
            link: '/product/cement-cleaner-208',
            rating: 4.5,
            badge: 'New',
            size: ['5 KG', '10 KG', '20 KG']
          },
          {
            id: 'epoxy-remover-242',
            name: 'EPOXY REMOVER-242',
            description: 'EPOXY REMOVER-242 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/cleaners/EPOXY REMOVER-242.jpg',
            link: '/product/epoxy-remover-242',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'granite-rust-remover-253',
            name: 'GRANITE RUST REMOVER-253',
            description: 'GRANITE RUST REMOVER-253 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/cleaners/GRANITE RUST REMOVER-253.jpg',
            link: '/product/granite-rust-remover-253',
            rating: 4.0,
            size: ['1 KG', '5 KG', '25 KG']
          },
          {
            id: 'marble-cement-cleaner-200',
            name: 'MARBLE CEMENT CLEANER-200',
            description: 'Wilber MARBLE CEMENT CLEANER-200 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
            image: 'assets/images/wilber_product/cleaners/MARBLE CEMENT CLEANER-200.jpg',
            link: '/product/marble-cement-cleaner-200',
            rating: 4.7,
            size: ['1 L', '5 L']
          },
          {
            id: 'marble-rust-remover-240',
            name: 'MARBLE RUST REMOVER-240',
            description: 'Wilber MARBLE RUST REMOVER-240 is primarily used for external cladding all types of tiles, ceramics, marble, and natural stones on external and internal surfaces.',
            image: 'assets/images/wilber_product/cleaners/MARBLE RUST REMOVER-240.jpg',
            link: '/product/marble-rust-remover-240',
            rating: 4.7,
            size: ['1 L', '5 L']
          },
          {
            id: 'neutral-cleaner-230',
            name: 'NEUTRAL CLEANER-230',
            description: 'NEUTRAL CLEANER-230 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/cleaners/NEUTRAL CLEANER-230.jpg',
            link: '/product/neutral-cleaner-230',
            rating: 4.5,
            size: ['1 L', '5 L']
          },
          {
            id: 'paint-remover-250',
            name: 'PAINT REMOVER-250',
            description: 'PAINT REMOVER-250 is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/cleaners/PAINT REMOVER-250.jpg',
            link: '/product/paint-remover-250',
            rating: 5.0,
            size: ['1 L', '5 L']
          },
          {
            id: 'universal-cleaner-248',
            name: 'UNIVERSAL CLEANER-248',
            description: 'UNIVERSAL CLEANER-248 is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/cleaners/UNIVERSAL CLEANER-248.jpg',
            link: '/product/universal-cleaner-248',
            rating: 4.0,
            size: ['1 L', '5 L']
          }
        ]
      },
      {
        id: 'mastic',
        name: 'Mastic',
        link: '/stone-solution/mastic',
        active: false,
        products: [
          {
            id: 'epox-7005',
            name: 'EPOX 7005',
            description: 'EPOX 7005 is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/mastic/EPOX 7005 (1).png',
            link: '/product/epox-7005',
            rating: 4.5,
            badge: 'New',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'mastic-liquid',
            name: 'MASTIC LIQUID',
            description: 'MASTIC LIQUID is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/mastic/MASTIC LIQUID.jpg',
            link: '/product/mastic-liquid',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 L', '5 L']
          },
          {
            id: 'mastic-solid',
            name: 'MASTIC SOLID',
            description: 'MASTIC SOLID is perfect for all kinds of ceramic, vitrified and natural stone tiles of all sizes for internal application – floor and wall.',
            image: 'assets/images/wilber_product/mastic/MASTIC SOLID.jpg',
            link: '/product/mastic-solid',
            rating: 4.0,
            size: ['1 KG', '5 KG']
          }
        ]
      },
      {
        id: 'epoxy-products',
        name: 'Epoxy Products',
        link: '/stone-solution/epoxy-products',
        active: false,
        products: [
          {
            id: 'epoxy-adhesive-152-part-a',
            name: 'EPOXY ADHESIVE-152(PART-A)',
            description: 'EPOXY ADHESIVE-152(PART-A) is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/epoxy_products/EPOXY_ADHESIVE-152_PART-A.jpg',
            link: '/product/epoxy-adhesive-152-part-a',
            rating: 4.5,
            badge: 'New',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'epoxy-adhesive-152-part-b',
            name: 'EPOXY ADHESIVE-152(PART-B)',
            description: 'EPOXY ADHESIVE-152(PART-B) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/epoxy_products/EPOXY_ADHESIVE-152_PART-B.jpg',
            link: '/product/epoxy-adhesive-152-part-b',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG', '5 KG']
          }
        ]
      },
      {
        id: 'lapizo-bond',
        name: 'Lapizo Bond',
        link: '/stone-solution/lapizo-bond',
        active: false,
        products: [
          {
            id: 'lapizo-bond-fast-set',
            name: 'LAPIZO BOND FAST SET',
            description: 'LAPIZO BOND FAST SET is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/lapizo_bond/LAPIZO BOND FAST SET.jpg',
            link: '/product/lapizo-bond-fast-set',
            rating: 4.5,
            badge: 'New',
            size: ['1 KG', '5 KG']
          },
          {
            id: 'lapizo-bond-fast-set-small',
            name: 'LAPIZO BOND FAST SET(SMALL)',
            description: 'LAPIZO BOND FAST SET(SMALL) is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/lapizo_bond/LAPIZO BOND FAST SET(SMALL).jpg',
            link: '/product/lapizo-bond-fast-set-small',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 KG', '5 KG']
          }
        ]
      },
      {
        id: 'crystalizer',
        name: 'Crystalizer',
        link: '/stone-solution/crystalizer',
        active: false,
        products: [
          {
            id: 'marble-polish-powder',
            name: 'MARBLE POLISH POWDER',
            description: 'MARBLE POLISH POWDER is a polymer-modified, grey cement-based tile adhesive for fixing ceramic tiles such as ceramic and new floor tiles.',
            image: 'assets/images/wilber_product/crystalizer/MARBLE_POLISH_POWDER.jpg',
            link: '/product/marble-polish-powder',
            rating: 4.5,
            badge: 'New',
            size: ['1 KG', '5 KG']
          }
        ]
      },
      {
        id: 'marble-densifier',
        name: 'Marble Densifier',
        link: '/stone-solution/marble-densifier',
        active: false,
        products: [
          {
            id: 'marble-densifier-regular',
            name: 'MARBLE DESNIFIER REGULAR',
            description: 'MARBLE DESNIFIER REGULAR is suitable for fixing natural stones, clay, terracotta, and vitrified tiles of regular size on floor and wall.',
            image: 'assets/images/wilber_product/MARBLE_DESNIFIER_REGULAR.jpg',
            link: '/product/marble-densifier-regular',
            rating: 5.0,
            badge: 'Bestseller',
            size: ['1 L', '5 L']
          }
        ]
      }
    ];
  }

  loadProductsForCategory(categoryId: string) {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      this.products = category.products;
      this.currentCategory = categoryId;
      this.currentCategoryName = category.name;
      
      // Update active state
      this.categories.forEach(cat => cat.active = cat.id === categoryId);
    }
  }

  onCategoryClick(categoryId: string) {
    this.loadProductsForCategory(categoryId);
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(1);
    }
    
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(0);
    }
    
    return stars;
  }
}
