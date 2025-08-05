// src/components/Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight
} from 'react-icons/fa';
import { TbPlaneDeparture } from 'react-icons/tb';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row gy-4">

            {/* Brand & Description */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-brand">
                <TbPlaneDeparture className="brand-icon" />
                <span className="brand-name">MTRAVEL</span>
              </div>
              <p className="footer-description">
                {t('footer.brand.description')}
              </p>
              <div className="social-links">
                <a href="#" className="social-link facebook"><FaFacebookF /></a>
                <a href="#" className="social-link instagram"><FaInstagram /></a>
                <a href="#" className="social-link twitter"><FaTwitter /></a>
                <a href="#" className="social-link youtube"><FaYoutube /></a>
              </div>
            </div>

            <div className="col-lg-1 col-md-6"></div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">{t('footer.quickLinks.title')}</h5>
              <ul className="footer-links">
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/">{t('footer.quickLinks.home')}</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/tour">{t('footer.quickLinks.tours')}</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/explore">{t('footer.quickLinks.explore')}</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/about">{t('footer.quickLinks.about')}</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-1 col-md-6"></div>

            {/* Contact Info */}
            <div className="col-lg-5 col-md-6">
              <h5 className="footer-title">{t('footer.contact.title')}</h5>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{t('footer.contact.address')}</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>{t('footer.contact.phone')}</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>{t('footer.contact.email')}</span>
                </li>
              </ul>

              {/* Newsletter Subscription */}
              <div className="newsletter">
                <h6>{t('footer.newsletter.title')}</h6>
                <p>{t('footer.newsletter.description')}</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder={t('footer.newsletter.placeholder')} 
                    className="form-control" 
                  />
                  <button type="submit" className="btn-subscribe">
                    {t('footer.newsletter.button')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="copyright">
                &copy; {currentYear} <strong>MTRAVEL</strong>. {t('footer.copyright')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;