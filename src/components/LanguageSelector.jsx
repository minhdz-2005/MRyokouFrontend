import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'vi', name: t('header.vietnamese'), flag: 'VN' },
        { code: 'en', name: t('header.english'), flag: 'EN' },
        { code: 'ja', name: t('header.japanese'), flag: 'JP' }
    ];

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode) => {
        i18n.changeLanguage(languageCode);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="language-selector" ref={dropdownRef}>
            <button
                className="language-selector-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('header.selectLanguage')}
            >
                <span className="language-flag text-dark">{currentLanguage.flag}</span>
                <span className="language-name text-dark">{currentLanguage.name}</span>
                <i className={`fas fa-chevron-down language-arrow ${isOpen ? 'rotated' : ''}  text-dark`}></i>
            </button>
            
            {isOpen && (
                <div className="language-dropdown">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`language-option ${i18n.language === language.code ? 'active' : ''}`}
                            onClick={() => handleLanguageChange(language.code)}
                        >
                            <span className="language-flag">{language.flag}</span>
                            <span className="language-name">{language.name}</span>
                            {i18n.language === language.code && (
                                <i className="fas fa-check language-check"></i>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector; 