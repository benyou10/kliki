'use client';

import React from 'react';
import './contact.css';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <main className="contact-main container">
      <div className="contact-header">
        <h1 className="hero-title">
          {t('contactHeroTitle').split('[').map((part, i) => {
            if (part.includes(']')) {
              const [highlight, rest] = part.split(']');
              return (
                <React.Fragment key={i}>
                  <span className="text-gradient">{highlight}</span>
                  {rest}
                </React.Fragment>
              );
            }
            return part;
          })}
        </h1>
        <p className="hero-subtitle">{t('contactHeroSubtitle')}</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card glass">
            <Mail className="info-icon" size={24} />
            <h3>{t('contactEmailTitle')}</h3>
            <p>hello@kliki.dz</p>
          </div>

          <div className="info-card glass">
            <MessageSquare className="info-icon" size={24} />
            <h3>{t('contactChatTitle')}</h3>
            <p>{t('contactChatValue')}</p>
          </div>

          <div className="info-card glass">
            <MapPin className="info-icon" size={24} />
            <h3>{t('contactHqTitle')}</h3>
            <p>{t('contactHqValue')}</p>
          </div>
        </div>

        <form className="contact-form glass">
          <h2>{t('contactFormTitle')}</h2>
          <div className="form-group">
            <label htmlFor="name">{t('contactName')}</label>
            <input type="text" id="name" placeholder={t('contactNamePh')} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('contactEmailLabel')}</label>
            <input type="email" id="email" placeholder="you@company.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('contactMsg')}</label>
            <textarea id="message" rows={5} placeholder={t('contactMsgPh')} required></textarea>
          </div>

          <button type="submit" className="button-primary full-width">{t('contactSend')}</button>
        </form>
      </div>
    </main>
  );
}
