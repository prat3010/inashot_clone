import { db, schema } from '@/lib/db';
import HeroCarousel from '@/components/HeroCarousel';
import TrustMarquee from '@/components/TrustMarquee';
import ProductGrid from '@/components/ProductGrid';
import BrandTrio from '@/components/BrandTrio';
import ParallaxBanner from '@/components/ParallaxBanner';
import ReviewsCarousel, { ReviewItem } from '@/components/ReviewsCarousel';
import LifestyleImageCarousel from '@/components/LifestyleImageCarousel';
import SocialMediaFollow from '@/components/SocialMediaFollow';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  // 1. Fetch all products from SQLite
  const rawProducts = db.select().from(schema.products).all();

  const formattedProducts = rawProducts.map((p) => {
    let parsedImages: string[] = [];
    try {
      parsedImages = JSON.parse(p.images);
    } catch {
      parsedImages = [p.featuredImage];
    }

    let parsedMacros = null;
    try {
      parsedMacros = p.macros ? JSON.parse(p.macros) : null;
    } catch {}

    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      featuredImage: p.featuredImage,
      images: parsedImages,
      badge: p.badge,
      inStock: p.inStock,
      grams: p.grams || 270,
      description: p.description,
      macros: parsedMacros,
      ingredients: p.ingredients,
    };
  });

  const comboProducts = formattedProducts.filter((p) => p.category === 'combo');
  const singleFlavourProducts = formattedProducts
    .filter((p) => p.category !== 'combo')
    .slice(0, 6);

  // 2. Fetch UGC Reviews with linked shoppable products
  const rawReviews = db.select().from(schema.reviews).all();

  const formattedReviews: ReviewItem[] = rawReviews.map((r) => {
    const linkedProduct = r.shoppableProductId
      ? formattedProducts.find((p) => p.id === r.shoppableProductId)
      : formattedProducts[0];

    return {
      id: r.id,
      authorName: r.authorName || 'Verified Customer',
      authorHandle: r.authorHandle,
      rating: r.rating,
      quote: r.quote,
      product: {
        id: linkedProduct?.id || 'p-1',
        title: linkedProduct?.title || 'Roasted Edamame',
        handle: linkedProduct?.handle || 'peri-peri-roasted-edamame',
        price: linkedProduct?.price || 531.0,
        compareAtPrice: linkedProduct?.compareAtPrice,
        image: linkedProduct?.featuredImage || formattedProducts[0]?.featuredImage || '/scraped/images/WhatsApp_Image_2026-11-12_at_17.46.43_1.jpg',
        packCount: linkedProduct?.category === 'roasted-edamame' ? 9 : 8,
        grams: linkedProduct?.grams || 270,
        category: linkedProduct?.category || 'roasted-edamame',
      },
    };
  });

  return (
    <>
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Trust Strip / Clean Label Marquee */}
      <TrustMarquee />

      {/* 3. Section 1: Assorted Combos */}
      <ProductGrid
        products={comboProducts}
        title="Assorted Combos"
        sectionId="shopify-section-template--29572451434860__popular-products"
        paddingClass="section-template--29572451434860__popular-products-padding"
      />

      {/* 4. Brand Feature Trio */}
      <BrandTrio />

      {/* 5. Parallax Banner */}
      <ParallaxBanner />

      {/* 6. Section 2: Single Flavour Combos */}
      <ProductGrid
        products={singleFlavourProducts}
        title="Single Flavour Combos"
        sectionId="shopify-section-template--29572451434860__popular_products_XLFRx7"
        paddingClass="section-template--29572451434860__popular_products_XLFRx7-padding"
      />

      {/* 7. What People Thinks (UGC Reviews Carousel) */}
      <ReviewsCarousel reviews={formattedReviews} />

      {/* 8. Lifestyle Food Image Carousel */}
      <LifestyleImageCarousel />

      {/* 9. Social Media Follow Banner */}
      <SocialMediaFollow />
    </>
  );
}
