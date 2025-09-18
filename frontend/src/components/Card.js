import React, { useState, useEffect } from "react";
import "./Card.css";

const mockGroups = [
  { id: 1, name: "Family Shopping" },
  { id: 2, name: "Friends Group" },
  { id: 3, name: "Office Colleagues" },
];

const Card = ({ images, name, description, price, originalPrice }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const discount = originalPrice - price;

  useEffect(() => {
    let interval;
    if (hovered) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 1500); // Change image every 1.5 seconds
    } else {
      setCurrentImage(0); // Reset to first image when not hovered
    }

    return () => clearInterval(interval);
  }, [hovered, images.length]);

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleShareToGroups = () => {
    // Here you would trigger the actual share logic
    setShowModal(false);
    setSelectedGroups([]);
    // Optionally show a toast/notification
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroups([]);
  };

  return (
    <>
      <div
        className={`card ${hovered ? "hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="image-container">
          <img
            src={images[currentImage]}
            alt={name}
            className="product-image"
          />
          <div className="rating-overlay">⭐ 4.2 | 1.6k</div>
        </div>

        <div className="card-content">
          <h3 className="product-name">{name}</h3>
          <p className="product-description">{description}</p>
          <div className="price-section">
            <span className="price">Rs. {price}</span>
            {originalPrice && (
              <span className="original-price">Rs. {originalPrice}</span>
            )}
            {discount > 0 && (
              <span className="discount"> (Rs. {discount} OFF)</span>
            )}
          </div>

          {hovered && (
            <div className="hover-info">
              <button className="wishlist-button">♡ Add to Wishlist</button>
              <button className="share-button" onClick={handleShareClick}>
                Share in group
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="create-group-modal">
            <h3>Select Groups to Share</h3>
            <div
              style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}
            >
              {mockGroups.map((group) => (
                <div
                  key={group.id}
                  className={`user-item${
                    selectedGroups.includes(group.id) ? " selected" : ""
                  }`}
                  style={{
                    display: "flex",
                    alignItems: "left",
                    cursor: "pointer",
                    padding: "10px 15px",
                    borderBottom: "1px solid #f0f2f5",
                    background: selectedGroups.includes(group.id)
                      ? "#e8f4fd"
                      : "#fff",
                    color: selectedGroups.includes(group.id)
                      ? "#ff3f6c"
                      : "#3b4a54",
                    fontWeight: selectedGroups.includes(group.id) ? 500 : 400,
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onClick={() => handleGroupSelect(group.id)}
                >
                  <span
                    style={{
                      marginRight: 12,
                      display: "flex",
                      alignItems: "left",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupSelect(group.id);
                    }}
                  >
                    <span
                      className={`custom-checkbox${
                        selectedGroups.includes(group.id) ? " checked" : ""
                      }`}
                      style={{
                        width: 20,
                        height: 20,
                        border: "2px solid #ff3f6c",
                        borderRadius: 6,
                        display: "inline-block",
                        background: selectedGroups.includes(group.id)
                          ? "#ff3f6c"
                          : "#fff",
                        transition: "background 0.2s, border-color 0.2s",
                        position: "relative",
                        marginRight: 4,
                      }}
                    >
                      {selectedGroups.includes(group.id) && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          style={{
                            position: "absolute",
                            top: 2,
                            left: 2,
                            display: "block",
                          }}
                        >
                          <polyline
                            points="1,7 5,11 13,3"
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeWidth: 2.5,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }}
                          />
                        </svg>
                      )}
                    </span>
                  </span>
                  {group.name}
                </div>
              ))}
            </div>
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleShareToGroups}
                disabled={selectedGroups.length === 0}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
