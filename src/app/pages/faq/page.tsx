import { db, schema } from '@/lib/db';
import FaqAccordion from '@/components/FaqAccordion';
import LifestyleImageCarousel from '@/components/LifestyleImageCarousel';
import SocialMediaFollow from '@/components/SocialMediaFollow';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Frequently Asked Questions | IN'A SHOT",
  description:
    'Common questions about our roasted edamame, seed cycling rhythms, diabetic suitability, and ingredients.',
};

export default function FaqPage() {
  const faqs = db.select().from(schema.faqs).all();

  return (
    <>
      <FaqAccordion faqs={faqs} title="Frequently Asked Questions" />
      <LifestyleImageCarousel />
      <SocialMediaFollow />
    </>
  );
}
