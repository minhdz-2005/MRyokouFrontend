import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'vi', name: t('header.vietnamese'), flag: '🇻🇳' },
      { code: 'en', name: t('header.english'), flag: '🇺🇸' },
      { code: 'ja', name: t('header.japanese'), flag: '🇯🇵' }
    ];
  };

  return {
    currentLanguage: getCurrentLanguage(),
    availableLanguages: getAvailableLanguages(),
    changeLanguage,
    t
  };
}; 