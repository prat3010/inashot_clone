import React from 'react';
import AboutSeedCycling from '@/components/AboutSeedCycling';
import LifestyleImageCarousel from '@/components/LifestyleImageCarousel';
import SocialMediaFollow from '@/components/SocialMediaFollow';

export const metadata = {
  title: "Brand Story — WE'RE THE SEED PEOPLE | IN'A SHOT",
  description:
    'Portioned, Purposeful & Personal functional snacking and seed cycling rhythm.',
};

export default function AboutUsPage() {
  return (
    <>
      {/* 1. Brand Philosophy Parallax Header */}
      <section
        id="shopify-section-template--29572451500396__image-parallax-with-text"
        className="shopify-section section-image-parallax-with-text overlay-section"
      >
        <div className="image-parallax-with-text-container color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background">
          <div className="image-parallax-with-text image-parallax-with-text--border-bottom section-template--29572451500396__image-parallax-with-text-padding">
            <div className="container image-parallax-with-text__container">
              <h2
                id="main-text-template--29572451500396__image-parallax-with-text"
                className="image-parallax-with-text__main-text h3 animated-text"
                data-section-id="template--29572451500396__image-parallax-with-text"
                data-animation-ready="true"
              >
                <span className="word" style={{ ['--word-index' as string]: 0 }}>WE’RE</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 1 }}>THE</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 2 }}>SEED</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 3 }}>PEOPLE</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 4 }}>PORTIONED,</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 5 }}>PURPOSEFUL</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 6 }}>&amp;</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 7 }}>PERSONAL</span>
              </h2>
              <p className="image-parallax-with-text__description body-large">
                We exist to make healthy, nutritious living so effortless, you do it without a second thought, every single day.
              </p>
            </div>

            {/* Floating Parallax Elements */}
            <div
              className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-1 position-15-9"
              style={{ visibility: 'visible' }}
            >
              <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
                <img
                  src="/scraped/images/Instagram-post---67-Topaz-Gigapixel-2x-scale.jpg"
                  alt=""
                  width={2160}
                  height={2700}
                  className="image-parallax-with-text__image"
                />
              </div>
            </div>

            <div
              className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-2 position-11-74"
              style={{ visibility: 'visible' }}
            >
              <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
                <img
                  src="/scraped/images/chilli_cheese_d573b18d-2bed-47a7-b1ac-40b17f4845cb.png"
                  alt=""
                  width={1023}
                  height={1537}
                  className="image-parallax-with-text__image"
                />
              </div>
            </div>

            <div
              className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-3 position-85-14"
              style={{ visibility: 'visible' }}
            >
              <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
                <img
                  src="/scraped/images/6_8f28a38b-1fe1-45ab-95be-a77e17e92e2e.png"
                  alt=""
                  width={1536}
                  height={1024}
                  className="image-parallax-with-text__image"
                />
              </div>
            </div>

            <div
              className="image-parallax image-parallax-with-text__image-wrapper image-parallax-with-text__image-wrapper--square image-parallax-with-text__image-wrapper--elem-4 position-93-75"
              style={{ visibility: 'visible' }}
            >
              <div className="image-parallax-with-text__image-inner-wrapper image-parallax-with-text__image-inner-wrapper--rounded" style={{ width: '144px' }}>
                <img
                  src="/scraped/images/1_19f31f44-1ea5-4791-acad-082ddb454f10.png"
                  alt=""
                  width={1093}
                  height={1438}
                  className="image-parallax-with-text__image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Image Collage Section */}
      <section
        id="shopify-section-template--29572451500396__image_collage_BPaBUM"
        className="shopify-section image-collage-section anim-active"
      >
        <div className="image-collage image-collage-template--29572451500396__image_collage_BPaBUM color-scheme-2808953a-3491-4eea-b87b-43455ad11a4d background section-template--29572451500396__image_collage_BPaBUM-padding image-collage--border-bottom">
          <div className="container">
            <div className="image-collage__text-content image-collage__text-content--center">
              <h2 className="image-collage__heading h2">
                <span className="word" style={{ ['--word-index' as string]: 0 }}>THIS</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 1 }}>IS</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 2 }}>WHAT</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 3 }}>WE&apos;RE</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 4 }}>ABOUT.</span>
                <br />
                <span className="word" style={{ ['--word-index' as string]: 5 }}>in&apos;</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 6 }}>a</span>{' '}
                <span className="word" style={{ ['--word-index' as string]: 7 }}>shot</span>
              </h2>
              <h3 className="image-collage__subheading h4">
                &ldquo;WE BELIEVE CONVENIENCE SHOULD NEVER COME AT THE COST OF NUTRITION, AND NUTRITION SHOULD NEVER BE COMPLICATED.&rdquo;
              </h3>
              <div className="image-collage__description body-normal rte">
                <p>
                  We believe the right amount is everything, nothing more, nothing less. Every portion we make is calculated with intention, so your body always gets exactly what it needs.
                </p>
                <p>
                  Showing up for your health should feel effortless. We made In A Shot easy to consume because real life comes with full schedules and busy mornings, so you have no possible reason to skip.
                </p>
                <p>
                  The future of nutrition is not in oversized packaging. It is in getting it exactly right, and for that reason we chose less over more, on purpose.
                </p>
              </div>
            </div>
          </div>

          <div className="image-collage__grid container">
            <div className="shopify-block image-collage-column">
              <div className="shopify-block image-collage-block">
                <div
                  className="image-collage-image-wrapper image-collage-image-wrapper--square image-collage-image-wrapper--border-top-left-radius image-collage-image-wrapper--border-bottom-left-radius image-collage-image-wrapper--border-top-right-radius image-collage-image-wrapper--border-bottom-right-radius"
                  style={{ paddingLeft: '10%', paddingRight: '0%' }}
                >
                  <img
                    src="/scraped/images/7_716b48f2-83ed-4bef-8a89-7401d173e819.png"
                    alt=""
                    width={1402}
                    height={1122}
                    className="image-collage-image"
                    style={{ objectFit: 'cover', borderRadius: '1.6rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="shopify-block image-collage-column">
              <div className="shopify-block image-collage-block">
                <div
                  className="image-collage-image-wrapper image-collage-image-wrapper--landscape image-collage-image-wrapper--border-top-left-radius image-collage-image-wrapper--border-bottom-left-radius image-collage-image-wrapper--border-top-right-radius image-collage-image-wrapper--border-bottom-right-radius"
                  style={{ paddingLeft: '0%', paddingRight: '10%' }}
                >
                  <img
                    src="/scraped/images/9.png"
                    alt=""
                    width={1536}
                    height={1024}
                    className="image-collage-image"
                    style={{ objectFit: 'cover', borderRadius: '1.6rem' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Verbatim Seed Cycling Rhythm Section */}
      <AboutSeedCycling />

      {/* 4. Lifestyle Food Carousel */}
      <LifestyleImageCarousel />

      {/* 5. Social Media Follow */}
      <SocialMediaFollow />
    </>
  );
}
