import React from "react";
import "./HomePage.css";
import myntraLogo from "../assets/Myntra-logo.png";
import banner from "../assets/banner.png";
function HomePage() {
  return (
    <>
      {/* Promotional Banners */}
      <div className="promo-banners">
        <div className="promo-banner left">
          <span className="promo-text">FLAT ₹400 OFF</span>
        </div>
        <div className="promo-banner right">
          <span className="promo-text">
            On Your 1st Purchase Via Myntra App!
          </span>
          <div className="myntra-logo-small">
            <img src={myntraLogo} alt="Myntra Logo" width={50} height={30} />
          </div>
        </div>
      </div>

      {/* Main Promotional Banner */}
      <div className="main-banner">
        <img src={banner} alt="Main Banner" width={1400} height={600} />
      </div>

      {/* Sponsor Section */}
      <div className="sponsor-section">
        <div className="sponsor-item">
          <div className="sponsor-label">ASSOCIATE SPONSOR</div>
          <div className="sponsor-logo">🏇 U.S. POLO ASSN. SINCE 1890</div>
          <span className="sponsor-arrow">→</span>
        </div>
        <div className="sponsor-item">
          <div className="sponsor-label">TITLE SPONSOR</div>
          <div className="sponsor-logo">🐆 PUMA</div>
          <span className="sponsor-arrow">→</span>
        </div>
        <div className="sponsor-item">
          <div className="sponsor-label">ASSOCIATE SPONSOR</div>
          <div className="sponsor-logo">JACK&JONES</div>
          <span className="sponsor-arrow">→</span>
        </div>
      </div>

      {/* Cashback Section */}
      <div className="cashback-section">
        <div className="cashback-content">
          <div className="bank-logos">
            <span className="bank-logo">🛒 Flipkart</span>
            <span className="bank-logo">🏦 AXIS BANK</span>
          </div>
          <div className="cashback-text">Flat 7.5% Cashback*</div>
        </div>
      </div>

      {/* Floating Notification */}
      <div className="floating-notification">🔔</div>
    </>
  );
}

export default HomePage;
