import { notFound } from 'next/navigation';
import { db, schema } from '@/lib/db';
import { eq, ne } from 'drizzle-orm';
import ProductDetailWithBundles from '@/components/ProductDetailWithBundles';
import CleanLabelMarquee from '@/components/CleanLabelMarquee';
import ProductMarkers from '@/components/ProductMarkers';
import ProductGrid from '@/components/ProductGrid';
import WhatPeopleThinks, { ReviewItem } from '@/components/WhatPeopleThinks';
import FaqAccordion from '@/components/FaqAccordion';
import LifestyleImageCarousel from '@/components/LifestyleImageCarousel';
import SocialMediaFollow from '@/components/SocialMediaFollow';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;

  // 1. Fetch product by handle
  const product = db
    .select()
    .from(schema.products)
    .where(eq(schema.products.handle, handle))
    .get();

  if (!product) {
    notFound();
  }

  // 2. Fetch bundle tiers for this product
  const rawTiers = db
    .select()
    .from(schema.bundleTiers)
    .where(eq(schema.bundleTiers.productId, product.id))
    .all();

  const bundleTiers = rawTiers.map((t) => ({
    id: t.id,
    packCount: t.packCount,
    weightGrams: t.weightGrams,
    price: t.price,
    compareAtPrice: t.compareAtPrice,
    discountPercent: t.discountPercent || 0,
    badge: t.badge,
  }));

  let parsedImages: string[] = [];
  try {
    parsedImages = JSON.parse(product.images);
  } catch {
    parsedImages = [product.featuredImage];
  }

  let parsedMacros = { protein: '13G PLANT PROTEIN', fiber: 'HIGH IN FIBRE', sugar: '0% SUGAR' };
  try {
    if (product.macros) parsedMacros = JSON.parse(product.macros);
  } catch {}

  let parsedFaqs = [];
  try {
    if (product.faqs) parsedFaqs = JSON.parse(product.faqs);
  } catch {}

  const formattedProduct = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    category: product.category,
    description: product.description,
    featuredImage: product.featuredImage,
    images: parsedImages,
    badge: product.badge,
    inStock: product.inStock,
    grams: product.grams || 270,
    macros: parsedMacros,
    ingredients: product.ingredients || undefined,
    faqs: parsedFaqs,
  };

  // 3. Recommended products
  const rawRecs = db
    .select()
    .from(schema.products)
    .where(ne(schema.products.id, product.id))
    .limit(4)
    .all();

  const recommendedProducts = rawRecs.map((p) => {
    let imgs: string[] = [];
    try {
      imgs = JSON.parse(p.images);
    } catch {
      imgs = [p.featuredImage];
    }
    return {
      id: p.id,
      handle: p.handle,
      title: p.title,
      category: p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      featuredImage: p.featuredImage,
      images: imgs,
      badge: p.badge,
      inStock: p.inStock,
      grams: p.grams || 270,
    };
  });

  // 4. Testimonials / Reviews
  const rawReviews = db.select().from(schema.reviews).all();
  const formattedReviews: ReviewItem[] = rawReviews.map((r) => ({
    id: r.id,
    authorName: r.authorName || 'Verified Buyer',
    authorHandle: r.authorHandle,
    rating: r.rating,
    quote: r.quote,
    product: {
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.featuredImage,
      packCount: product.category === 'roasted-edamame' ? 9 : 8,
      grams: product.grams || 270,
      category: product.category,
    },
  }));

  // 5. Product FAQs
  const defaultFaqs = [
    {
      id: 'faq-1',
      question: 'How is In A Shot roasted edamame prepared?',
      answer:
        'Our edamame is slowly dry-roasted to perfection, never deep-fried in oil. We season it lightly with cold-pressed oils and natural Indian spices.',
    },
    {
      id: 'faq-2',
      question: 'Is it suitable for weight-loss and diabetic diets?',
      answer:
        'Yes! With 13g of plant protein, 0g added sugar, and high fiber, it provides sustained energy without causing sugar spikes.',
    },
    {
      id: 'faq-3',
      question: 'What is the shelf life?',
      answer:
        'Each pack has a shelf life of 6 months. Once opened, consume immediately for optimal crunch.',
    },
  ];

  const faqsToRender = parsedFaqs.length > 0 ? parsedFaqs : defaultFaqs;

  return (
    <>
      {/* 1. Main Product Section with Gallery & Bundlex */}
      <ProductDetailWithBundles product={formattedProduct} bundleTiers={bundleTiers} />

      {/* 2. Ticker Banner */}
      <CleanLabelMarquee />

      {/* 3. Most Recommended Products */}
      <ProductMarkers />

      {/* 4. Product Recommendations Slider */}
      <ProductGrid
        products={recommendedProducts}
        title="You May Also Like"
        sectionId="shopify-section-template--29572451697004__product-recommendations"
        paddingClass="section-template--29572451434860__popular-products-padding"
      />

      {/* 5. Testimonials */}
      <WhatPeopleThinks reviews={formattedReviews} />

      {/* 6. Product FAQ Accordion */}
      <FaqAccordion faqs={faqsToRender} title="Frequently Asked Questions" />

      {/* 7. Lifestyle Image Carousel */}
      <LifestyleImageCarousel />

      {/* 8. Social Media Follow */}
      <SocialMediaFollow />
    </>
  );
}
