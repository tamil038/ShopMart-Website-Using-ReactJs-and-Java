import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function send(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    toast.success('Message sent! We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <main className="page container">
      <h1>Contact Us</h1>
      <div className="contact-layout">
        <form className="card form" onSubmit={send}>
          <div className="field">
            <label htmlFor="cname">Your Name</label>
            <input id="cname" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
          </div>
          <div className="field">
            <label htmlFor="cemail">Your Email</label>
            <input
              id="cemail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="cmsg">Message</label>
            <textarea
              id="cmsg"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="How can we help?"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Send Message
          </button>
        </form>

        <div className="info">
          <div className="card info-item">
            <span className="icon">📍</span>
            <div>
              <strong>Head Office</strong>
              <p>ShopMart Technologies, Chennai, India</p>
            </div>
          </div>
          <div className="card info-item">
            <span className="icon">✉️</span>
            <div>
              <strong>Email</strong>
              <p>support@shopmart.example</p>
            </div>
          </div>
          <div className="card info-item">
            <span className="icon">📞</span>
            <div>
              <strong>Phone</strong>
              <p>+91 90000 00000</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
