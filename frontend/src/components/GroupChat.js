import React, { useState } from "react";
import "./GroupChat.css";
import men_shoes_1 from "../assets/men_shoes/men_shoes_1.png";
const GroupChat = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Family Shopping",
      lastMessage: "3 products shared",
      time: "2:30 PM",
      unreadCount: 2,
      products: [
        {
          id: 1,
          name: "Winter Jacket",
          price: "₹2,999",
          image: "/src/assets/men_jackets/men_jacket_11.png",
          votes: 5,
          userVote: 0, // -1 for downvote, 0 for no vote, 1 for upvote
        },
        {
          id: 2,
          name: "Casual Shirt",
          price: "₹1,299",
          image: "/src/assets/men_shirts/men_shirt_11.png",
          votes: 3,
          userVote: 0,
        },
      ],
    },
    {
      id: 2,
      name: "Friends Group",
      lastMessage: "1 product shared",
      time: "1:15 PM",
      unreadCount: 0,
      products: [
        {
          id: 3,
          name: "Running Shoes",
          price: "₹4,999",
          image: men_shoes_1,
          votes: 8,
          userVote: 0,
        },
      ],
    },
    {
      id: 3,
      name: "Office Colleagues",
      lastMessage: "2 products shared",
      time: "12:45 PM",
      unreadCount: 5,
      products: [
        {
          id: 4,
          name: "Formal Shirt",
          price: "₹1,599",
          image: "/src/assets/men_shirts/men_shirt_12.png",
          votes: 2,
          userVote: 0,
        },
        {
          id: 5,
          name: "Leather Shoes",
          price: "₹3,499",
          image: "/src/assets/men_shoes/men_shoes_2.png",
          votes: 6,
          userVote: 0,
        },
      ],
    },
  ]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setnewGroupMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableUsers] = useState([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
    { id: 5, name: "Eve" },
  ]);
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const handleSearchMembers = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectMember = (user) => {
    setnewGroupMembers((prevMembers) =>
      prevMembers.includes(user)
        ? prevMembers.filter((member) => member.id !== user.id)
        : [...prevMembers, user]
    );
  };

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      setShowCreateGroup(false);
      setShowUserSelectionModal(true);
    }
    console.log(groups);
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleVote = (groupId, productId, voteType) => {
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            products: group.products.map((product) => {
              if (product.id === productId) {
                let newVotes = product.votes;
                let newUserVote = product.userVote;

                // Handle vote logic
                if (product.userVote === 0) {
                  // No previous vote
                  newVotes += voteType;
                  newUserVote = voteType;
                } else if (product.userVote === voteType) {
                  // Same vote - remove it
                  newVotes -= voteType;
                  newUserVote = 0;
                } else {
                  // Different vote - change it
                  newVotes = newVotes - product.userVote + voteType;
                  newUserVote = voteType;
                }

                return {
                  ...product,
                  votes: newVotes,
                  userVote: newUserVote,
                };
              }
              return product;
            }),
          };
        }
        return group;
      })
    );

    // Update selected group if it's the same
    if (selectedGroup && selectedGroup.id === groupId) {
      const updatedGroup = groups.find((g) => g.id === groupId);
      if (updatedGroup) {
        setSelectedGroup(updatedGroup);
      }
    }
  };

  const handleCreateGroupWithMembers = () => {
    if (newGroupName.trim() && newGroupMembers.length > 0) {
      const newGroup = {
        id: groups.length + 1, // Simple ID generation
        name: newGroupName,
        lastMessage: "No messages yet",
        time: new Date().toLocaleTimeString(),
        unreadCount: 0,
        products: [], // No products initially
        members: newGroupMembers, // Add selected members to the group
      };
      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setShowUserSelectionModal(false);
      setNewGroupName("");
      setnewGroupMembers([]);
      setSearchTerm("");
    }
  };

  return (
    <div className="group-chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Groups</h2>
        </div>

        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`group-item ${
                selectedGroup?.id === group.id ? "selected" : ""
              }`}
              onClick={() => handleGroupClick(group)}
            >
              <div className="group-avatar">
                {group.name.charAt(0).toUpperCase()}
              </div>
              <div className="group-info">
                <div className="group-name">{group.name}</div>
                <div className="group-last-message">{group.lastMessage}</div>
              </div>
              <div className="group-meta">
                <div className="group-time">{group.time}</div>
                {group.unreadCount > 0 && (
                  <div className="unread-badge">{group.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="create-group-section">
          <button
            className="create-group-btn"
            onClick={() => setShowCreateGroup(true)}
          >
            <span className="plus-icon">+</span>
            Create New Group
          </button>
        </div>
      </div>

      <div className="main-content">
        {selectedGroup ? (
          <div className="chat-panel">
            <div className="chat-header">
              <h3>{selectedGroup.name}</h3>
              <div className="group-header-actions">
                <button
                  className="group-members-btn"
                  onClick={() => setShowMembersModal(true)}
                >
                  <span className="three-dots">&#x22EE;</span>
                </button>
              </div>
              <p>{selectedGroup.products.length} products shared</p>
            </div>
            <div className="products-container">
              {selectedGroup.products.length > 0 ? (
                selectedGroup.products.map((product, idx) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="product-price">{product.price}</p>
                      <p className="product-sender">
                        Sent by:{" "}
                        {selectedGroup.members &&
                        selectedGroup.members.length > 0
                          ? selectedGroup.members[
                              idx % selectedGroup.members.length
                            ].name
                          : "Unknown"}
                      </p>
                    </div>
                    <div className="voting-section">
                      <button
                        className={`vote-btn upvote ${
                          product.userVote === 1 ? "active" : ""
                        }`}
                        onClick={() =>
                          handleVote(selectedGroup.id, product.id, 1)
                        }
                      >
                        👍
                      </button>
                      <span className="vote-count">{product.votes}</span>
                      <button
                        className={`vote-btn downvote ${
                          product.userVote === -1 ? "active" : ""
                        }`}
                        onClick={() =>
                          handleVote(selectedGroup.id, product.id, -1)
                        }
                      >
                        👎
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>No products shared yet</p>
                  <p>Share your first product to get started!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="welcome-message">
            <h3>Welcome to Group Shopping!</h3>
            <p>Select a group from the sidebar to view shared products</p>
          </div>
        )}
      </div>

      {showCreateGroup && (
        <div className="modal-overlay">
          <div className="create-group-modal">
            <h3>Create New Group</h3>
            <input
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="group-name-input"
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCreateGroup(false);
                  setNewGroupName("");
                }}
              >
                Cancel
              </button>
              <button className="create-btn" onClick={handleCreateGroup}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserSelectionModal && (
        <div className="modal-overlay">
          <div className="create-group-modal">
            <h3>Select Group Members</h3>
            <input
              type="text"
              placeholder="Search users"
              value={searchTerm}
              onChange={handleSearchMembers}
              className="group-name-input"
            />
            {searchTerm && (
              <div className="search-results-list">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`user-item ${
                        newGroupMembers.some((member) => member.id === user.id)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleSelectMember(user)}
                    >
                      {user.name}
                    </div>
                  ))
                ) : (
                  <p className="no-users-found">No users found</p>
                )}
              </div>
            )}
            <div className="selected-members">
              <h4>Selected Members:</h4>
              {newGroupMembers.length > 0 ? (
                <ul className="selected-members-list">
                  {newGroupMembers.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No members selected</p>
              )}
            </div>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowUserSelectionModal(false);
                  setnewGroupMembers([]);
                  setSearchTerm("");
                }}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateGroupWithMembers}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      {showMembersModal && (
        <div className="modal-overlay">
          <div className="create-group-modal">
            <h3>Group Members</h3>
            <ul className="selected-members-list">
              {(selectedGroup.members || []).map((member) => (
                <li key={member.id}>{member.name}</li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowMembersModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
