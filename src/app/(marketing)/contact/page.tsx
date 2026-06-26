import React from 'react';
import './contact.css';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <main className="contact-main container">
      <div className="contact-header">
        <h1 className="hero-title">Get in <span className="text-gradient">Touch</span></h1>
        <p className="hero-subtitle">Let's discuss how Kliki can hyper-personalize your Algerian platform.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="info-card glass">
            <Mail className="info-icon" size={24} />
            <h3>Email Us</h3>
            <p>hello@kliki.dz</p>
          </div>
          
          <div className="info-card glass">
            <MessageSquare className="info-icon" size={24} />
            <h3>Live Chat</h3>
            <p>Available 9h - 17h (Algiers Time)</p>
          </div>
          
          <div className="info-card glass">
            <MapPin className="info-icon" size={24} />
            <h3>Headquarters</h3>
            <p>Alger, Algérie 🇩🇿</p>
          </div>
        </div>

        <form className="contact-form glass">
          <h2>Send a Message</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your Name" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Work Email</label>
            <input type="email" id="email" placeholder="you@company.com" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">How can we help?</label>
            <textarea id="message" rows={5} placeholder="Tell us about your recommendation needs..." required></textarea>
          </div>

          <button type="submit" className="button-primary full-width">Send Message</button>
        </form>
      </div>
    </main>
  );
}
