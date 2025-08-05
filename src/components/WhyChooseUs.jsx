// src/components/WhyChooseUs.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './WhyChooseUs.css';
import { 
  BsGlobe2, 
  BsClockHistory, 
  BsStarFill, 
  BsShieldCheck,
  BsPeopleFill,
  BsCashCoin,
  BsHeartFill,
  BsAwardFill
} from 'react-icons/bs';
import { GiModernCity, GiIsland } from 'react-icons/gi';
import { FaUmbrellaBeach, FaMountain } from 'react-icons/fa';



const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BsGlobe2 />,
      title: t('whyChooseUs.features.diverseDestinations.title'),
      description: t('whyChooseUs.features.diverseDestinations.description'),
      stat: t('whyChooseUs.features.diverseDestinations.stat'),
      destinations: [
        <GiModernCity key="city" />,
        <FaUmbrellaBeach key="beach" />,
        <FaMountain key="mountain" />,
        <GiIsland key="island" />
      ]
    },
    {
      icon: <BsClockHistory />,
      title: t('whyChooseUs.features.quickBooking.title'),
      description: t('whyChooseUs.features.quickBooking.description'),
      stat: t('whyChooseUs.features.quickBooking.stat')
    },
    {
      icon: <BsStarFill />,
      title: t('whyChooseUs.features.highRating.title'),
      description: t('whyChooseUs.features.highRating.description'),
      stat: t('whyChooseUs.features.highRating.stat'),
      rating: 5
    },
    {
      icon: <BsShieldCheck />,
      title: t('whyChooseUs.features.safetyGuarantee.title'),
      description: t('whyChooseUs.features.safetyGuarantee.description'),
      stat: t('whyChooseUs.features.safetyGuarantee.stat')
    },
    {
      icon: <BsPeopleFill />,
      title: t('whyChooseUs.features.professionalGuides.title'),
      description: t('whyChooseUs.features.professionalGuides.description'),
      stat: t('whyChooseUs.features.professionalGuides.stat')
    },
    {
      icon: <BsCashCoin />,
      title: t('whyChooseUs.features.competitivePricing.title'),
      description: t('whyChooseUs.features.competitivePricing.description'),
      stat: t('whyChooseUs.features.competitivePricing.stat')
    },
    {
      icon: <BsHeartFill />,
      title: t('whyChooseUs.features.dedicatedService.title'),
      description: t('whyChooseUs.features.dedicatedService.description'),
      stat: t('whyChooseUs.features.dedicatedService.stat')
    },
    {
      icon: <BsAwardFill />,
      title: t('whyChooseUs.features.prestigiousAwards.title'),
      description: t('whyChooseUs.features.prestigiousAwards.description'),
      stat: t('whyChooseUs.features.prestigiousAwards.stat')
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span>{t('whyChooseUs.header.title')}</span> {t('whyChooseUs.header.highlight')}?
          </h2>
          <p className="section-subtitle">
            {t('whyChooseUs.header.subtitle')}
          </p>
          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-icon">
              <BsStarFill />
            </div>
            <div className="divider-line"></div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className={`feature-card ${feature.highlight ? 'highlight-card' : ''}`} 
              key={index}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              
              {feature.stat && (
                <div className="feature-stat">
                  {feature.stat}
                </div>
              )}
              
              {feature.rating && (
                <div className="feature-rating">
                  {[...Array(feature.rating)].map((_, i) => (
                    <BsStarFill key={i} />
                  ))}
                </div>
              )}
              
              {feature.destinations && (
                <div className="feature-destinations">
                  {feature.destinations.map((icon, i) => (
                    <span key={i}>{icon}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="customer-testimonial">
          <div className="testimonial-content">
            <blockquote>
              "{t('whyChooseUs.testimonial.quote')}"
            </blockquote>
            <div className="customer-info">
              <div className="customer-avatar">
                <img src="../src/images/banner.jpg" alt="Khách hàng" />
              </div>
              <div className="customer-details">
                <h4>{t('whyChooseUs.testimonial.customer.name')}</h4>
                <p>{t('whyChooseUs.testimonial.customer.title')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;