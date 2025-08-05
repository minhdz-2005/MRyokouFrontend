// src/components/AboutIntro.jsx
import React from 'react';
import './AboutIntro.css';
import { useTranslation } from 'react-i18next';
import { 
  FaGlobeAsia, 
  FaHandsHelping, 
  FaRegSmile,
  FaMapMarkedAlt,
  FaHeart,
  FaLightbulb
} from 'react-icons/fa';
import { TbBeach, TbMountain, TbBuildingCommunity } from 'react-icons/tb';

const AboutIntro = () => {
  const { t } = useTranslation();
  return (
    <section className="about-intro">
      <div className="container">
        {/* Header với hình nền parallax */}
        <div className="intro-header">
          <div className="intro-overlay">
            <h1 className="intro-title">{t('about.story.title')}</h1>
            <p className="intro-subtitle">
              {t('about.story.subtitle')}
            </p>
          </div>
        </div>

        {/* Giới thiệu công ty */}
        <div className="company-intro">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="intro-image">
                <div className="image-placeholder">
                  <TbBeach className="floating-icon icon-1" />
                  <TbMountain className="floating-icon icon-2" />
                  <TbBuildingCommunity className="floating-icon icon-3" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="intro-content">
                <h2 className="section-title">
                  <span className="title-highlight">{t('about.intro.title')}</span>
                </h2>
                <p className="intro-text">
                  {t('about.intro.description1')}
                </p>
                <p className="intro-text">
                  {t('about.intro.description2')}
                </p>
                <div className="stats-container">
                  <div className="stat-item ms-5">
                    <div className="stat-number">50,000+</div>
                    <div className="stat-label">{t('about.stats.customers')}</div>
                  </div>
                  <div className="stat-item ms-5">
                    <div className="stat-number">1,000+</div>
                    <div className="stat-label">{t('about.stats.tours')}</div>
                  </div>
                  <div className="stat-item ms-5">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">{t('about.stats.satisfaction')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các giá trị cốt lõi */}
        <div className="core-values">
          <h2 className="section-title text-center">
            <span className="title-highlight">{t('about.values.title')}</span>
          </h2>
          <p className="section-subtitle text-center">
            {t('about.values.subtitle')}
          </p>

          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">
                <FaGlobeAsia />
              </div>
              <h3 className="value-title">{t('about.values.mission.title')}</h3>
              <p className="value-description">
                {t('about.values.mission.description')}
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHandsHelping />
              </div>
              <h3 className="value-title">{t('about.values.commitment.title')}</h3>
              <p className="value-description">
                {t('about.values.commitment.description')}
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaRegSmile />
              </div>
              <h3 className="value-title">{t('about.values.vision.title')}</h3>
              <p className="value-description">
                {t('about.values.vision.description')}
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHeart />
              </div>
              <h3 className="value-title">{t('about.values.culture.title')}</h3>
              <p className="value-description">
                {t('about.values.culture.description')}
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3 className="value-title">{t('about.values.innovation.title')}</h3>
              <p className="value-description">
                {t('about.values.innovation.description')}
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaMapMarkedAlt />
              </div>
              <h3 className="value-title">{t('about.values.responsibility.title')}</h3>
              <p className="value-description">
                {t('about.values.responsibility.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;