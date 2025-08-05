import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, DollarSign, Users, Plane, Calendar, Compass, AlertCircle, ChevronDown } from 'lucide-react';
import './TravelGuide.css'

const TravelGuide = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState(null);

  const travelGuideData = [
    {
      title: t('travelGuide.sections.packing.title'),
      icon: <Plane className="icon-size" />,
      color: "primary",
      points: t('travelGuide.sections.packing.points', { returnObjects: true })
    },
    {
      title: t('travelGuide.sections.weather.title'),
      icon: <Calendar className="icon-size" />,
      color: "success",
      points: t('travelGuide.sections.weather.points', { returnObjects: true })
    },
    {
      title: t('travelGuide.sections.budget.title'),
      icon: <DollarSign className="icon-size" />,
      color: "warning",
      points: t('travelGuide.sections.budget.points', { returnObjects: true })
    },
    {
      title: t('travelGuide.sections.tourType.title'),
      icon: <Compass className="icon-size" />,
      color: "info",
      points: t('travelGuide.sections.tourType.points', { returnObjects: true })
    }
  ];

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <>
      <div className="travel-guide-container py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="hero-icon">
              <MapPin size={40} color="white" />
            </div>
            <h1 className="main-header display-4 mb-4">
              {t('travelGuide.header.title')}
            </h1>
            <p className="lead text-muted col-lg-8 mx-auto">
              {t('travelGuide.header.subtitle')}
            </p>
          </div>

          {/* Guide Cards */}
          <div className="row g-4 mb-5">
            {travelGuideData.map((section, index) => (
              <div key={index} className={`col-lg-6 ${expandedCard === index ? 'col-12' : ''}`}>
                <div className="card guide-card h-100">
                  <div 
                    className={`card-header card-header-custom bg-${section.color} text-white p-4`}
                    onClick={() => toggleCard(index)}
                    role="button"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-3">
                          {React.cloneElement(section.icon, { color: "white" })}
                        </div>
                        <h5 className="mb-0 fw-bold">
                          {section.title}
                        </h5>
                      </div>
                      <ChevronDown 
                        className={`chevron-icon ${expandedCard === index ? 'rotated' : ''}`} 
                        size={24} 
                        color="white"
                      />
                    </div>
                  </div>

                  <div className={`card-body card-body-custom ${expandedCard === index ? 'card-body-expanded' : ''} p-4`}>
                    <div className="mb-3">
                      {section.points.map((point, i) => (
                        <div key={i} className="point-item">
                          <span className="text-dark">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    {expandedCard !== index && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-link btn-sm text-muted p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(index);
                          }}
                        >
                          <small>{t('travelGuide.content.viewMore')} <ChevronDown size={16} className="ms-1" /></small>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="tips-section p-4 mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="icon-container me-3" style={{background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'}}>
                <AlertCircle size={24} color="white" />
              </div>
              <h3 className="mb-0 fw-bold text-warning-emphasis">{t('travelGuide.content.importantNotes')}</h3>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-semibold text-warning-emphasis d-flex align-items-center mb-2">
                  <Clock size={16} className="me-2" />
                  {t('travelGuide.content.bestTime.title')}
                </h6>
                <p className="small text-warning-emphasis mb-0">
                  {t('travelGuide.content.bestTime.description')}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-semibold text-warning-emphasis d-flex align-items-center mb-2">
                  <Users size={16} className="me-2" />
                  {t('travelGuide.content.safety.title')}
                </h6>
                <p className="small text-warning-emphasis mb-0">
                  {t('travelGuide.content.safety.description')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section text-white p-5 text-center">
            <h3 className="fw-bold mb-3">{t('travelGuide.content.cta.title')}</h3>
            <p className="mb-4 opacity-75">
              {t('travelGuide.content.cta.subtitle')}
            </p>
            <Link to={'/tour'}>
              <button className="cta-button">
                {t('travelGuide.content.cta.button')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelGuide;