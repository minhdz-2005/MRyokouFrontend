import React from 'react';
import { useTranslation } from 'react-i18next';

const I18nDemo = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="i18n-demo p-4">
      <h2>🌐 Internationalization Demo</h2>
      <div className="current-language mb-3">
        <strong>Current Language:</strong> {i18n.language}
      </div>
      
      <div className="demo-content">
        <h3>Common Translations:</h3>
        <ul>
          <li><strong>Home:</strong> {t('common.home')}</li>
          <li><strong>About:</strong> {t('common.about')}</li>
          <li><strong>Tours:</strong> {t('common.tours')}</li>
          <li><strong>Explore:</strong> {t('common.explore')}</li>
          <li><strong>Login:</strong> {t('common.login')}</li>
          <li><strong>Signup:</strong> {t('common.signup')}</li>
        </ul>

        <h3>Admin Translations:</h3>
        <ul>
          <li><strong>Dashboard:</strong> {t('admin.dashboard.title')}</li>
          <li><strong>Tour Management:</strong> {t('admin.tours.title')}</li>
          <li><strong>Add Tour:</strong> {t('admin.tours.addTour')}</li>
          <li><strong>Edit Tour:</strong> {t('admin.tours.editTour')}</li>
        </ul>

        <h3>Form Translations:</h3>
        <ul>
          <li><strong>Required:</strong> {t('forms.validation.required')}</li>
          <li><strong>Email:</strong> {t('forms.validation.email')}</li>
          <li><strong>Add:</strong> {t('forms.buttons.add')}</li>
          <li><strong>Edit:</strong> {t('forms.buttons.edit')}</li>
          <li><strong>Delete:</strong> {t('forms.buttons.delete')}</li>
        </ul>

        <h3>Messages:</h3>
        <ul>
          <li><strong>Success Created:</strong> {t('messages.success.created')}</li>
          <li><strong>Success Updated:</strong> {t('messages.success.updated')}</li>
          <li><strong>Error General:</strong> {t('messages.error.general')}</li>
          <li><strong>Confirm Delete:</strong> {t('messages.confirm.delete')}</li>
        </ul>
      </div>
    </div>
  );
};

export default I18nDemo; 