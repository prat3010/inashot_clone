import React from 'react';
import { notFound } from 'next/navigation';
import LifestyleImageCarousel from '@/components/LifestyleImageCarousel';
import SocialMediaFollow from '@/components/SocialMediaFollow';

interface PolicyData {
  title: string;
  content: string;
}

const POLICIES: Record<string, PolicyData> = {
  'shipping-policy': {
    title: 'Shipping Policy',
    content: `
      <p>We process all orders within 24-48 business hours. Standard shipping across India typically takes 3-5 business days depending on your location.</p>
      <p>Free standard shipping is applicable on all orders above ₹499. For orders below ₹499, a nominal shipping fee of ₹50 is applied at checkout.</p>
      <p>Once your order has been dispatched, you will receive an SMS and email notification with your AWB tracking link.</p>
    `,
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: `
      <p>Due to the perishable nature of our functional food products, we cannot accept returns once packages are opened.</p>
      <p>If you receive a damaged, expired, or incorrect item, please notify us within 48 hours of delivery at hello@inashot.life with photos of the damaged package. We will immediately issue a free replacement or 100% refund.</p>
    `,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: `
      <p>At IN'A SHOT, we respect your personal privacy. We only collect the necessary information (name, address, email, phone number) required to fulfill and deliver your orders securely.</p>
      <p>We do not sell, rent, or trade your personal data with any third-party marketing companies.</p>
    `,
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: `
      <p>By accessing or purchasing from inashot.life, you agree to be bound by these Terms of Service.</p>
      <p>All prices listed on our website are inclusive of applicable GST taxes. We reserve the right to modify prices and bundle offers at any time without prior notice.</p>
    `,
  },
};

export function generateStaticParams() {
  return [
    { handle: 'shipping-policy' },
    { handle: 'refund-policy' },
    { handle: 'privacy-policy' },
    { handle: 'terms-of-service' },
  ];
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const policy = POLICIES[handle];

  if (!policy) {
    notFound();
  }

  return (
    <div className="policy-page">
      <div className="page-header container" style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
        <h1 className="h2 title--page" style={{ textAlign: 'center' }}>
          {policy.title}
        </h1>
      </div>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '6rem' }}>
        <div
          className="rte"
          style={{ lineHeight: 1.8, fontSize: '1.6rem' }}
          dangerouslySetInnerHTML={{ __html: policy.content }}
        />
      </div>
      <LifestyleImageCarousel />
      <SocialMediaFollow />
    </div>
  );
}
