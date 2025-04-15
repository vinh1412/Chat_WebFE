import React, { useState, useMemo } from "react";
import { FaSearch, FaSortAlphaDown, FaFilter, FaCheck, FaUserFriends } from "react-icons/fa"; // Added FaUserFriends here
import "../../assets/css/ListFriend.css";
import  useFriend from "../../hooks/useFriend"; // Adjust the import path as necessary
import Loading from "../../components/common/Loading"; // Adjust the import path as necessary

const ListFriend = () => {

    const { friendList, isLoadingFriends } = useFriend(); // Assuming you have a hook to get the friend list
    const [loading, setLoading] = useState(false); // Local loading state for the component

    const friends = useMemo(() => {
        if(isLoadingFriends) return [];
        return friendList?.response || []; // Use the response from the friendList or an empty array if loading
    }, [isLoadingFriends, friendList]);

    console.log("Friends:", friends); // Debugging line to check the friends data
        

    const [search, setSearch] = useState("");
    const [sortOpen, setSortOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterSubOpen, setFilterSubOpen] = useState(false); // To handle subcategory dropdown
    const [sortBy, setSortBy] = useState("Tên (A-Z)");
    const [filterBy, setFilterBy] = useState("Tất cả");

    const filteredFriends = friends
        .filter(friend => friend.displayName.toLowerCase().includes(search.toLowerCase()) && (filterBy === "Tất cả" || friend.category === filterBy))
        .sort((a, b) => {
            if (sortBy === "Tên (A-Z)") {
                return a.displayName.localeCompare(b.displayName);
            } else if (sortBy === "Tên (Z-A)") {
                return b.displayName.localeCompare(a.displayName);
            }
            return 0;
        });

    const handleSortSelect = (option) => {
        setSortBy(option);
        setSortOpen(false);
    };

    const handleFilterSelect = (option) => {
        setFilterBy(option);
        setFilterOpen(false);
        setFilterSubOpen(false); // Close subcategory dropdown
    };

    const handleCategorySelect = (category) => {
        setFilterBy(category);
        setFilterSubOpen(false);
        setFilterOpen(false);
    };

    return (
        <div className="group-list-wrapper">
            <div className="ListFriend__header">
                <FaUserFriends />
                <span>Danh sách bạn bè</span>
            </div>
            <div className="friend-header">
                <h3>Bạn bè ({filteredFriends.length})</h3>
                <div className="friend-controls">
                    <div className="search-box">
                        <FaSearch className="icon" />
                        <input
                            type="text"
                            placeholder="Tìm bạn"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="dropdown-container" onMouseLeave={() => setSortOpen(false)}>
                        <div className="sort-box" onClick={() => setSortOpen(!sortOpen)}>
                            <FaSortAlphaDown />
                            <span>{sortBy}</span>
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {sortOpen && (
                            <div className="dropdown">
                                <div
                                    className={`dropdown-item ${sortBy === "Tên (A-Z)" ? "selected" : ""}`}
                                    onClick={() => handleSortSelect("Tên (A-Z)")}
                                >
                                    {sortBy === "Tên (A-Z)" && <FaCheck className="mr-2" />}
                                    <span>Tên (A-Z)</span>
                                </div>
                                <div
                                    className={`dropdown-item ${sortBy === "Tên (Z-A)" ? "selected" : ""}`}
                                    onClick={() => handleSortSelect("Tên (Z-A)")}
                                >
                                    {sortBy === "Tên (Z-A)" && <FaCheck className="mr-2" />}
                                    <span>Tên (Z-A)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="dropdown-container" onMouseLeave={() => setFilterOpen(false)}>
                        <div className="filter-box" onClick={() => setFilterOpen(!filterOpen)}>
                            <FaFilter />
                            <span>{filterBy}</span>
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {filterOpen && (
                            <div className="dropdown">
                                <div
                                    className={`dropdown-item ${filterBy === "Tất cả" ? "selected" : ""}`}
                                    onClick={() => handleFilterSelect("Tất cả")}
                                >
                                    {filterBy === "Tất cả" && <FaCheck className="mr-2" />}
                                    <span>Tất cả</span>
                                </div>
                                <div className="dropdown-item" onClick={() => setFilterSubOpen(!filterSubOpen)}>
                                    <span>Phân loại</span>
                                </div>
                                {filterSubOpen && (
                                    <div className="dropdown-submenu">
                                        <div
                                            className={`dropdown-item ${filterBy === "Công việc" ? "selected" : ""}`}
                                            onClick={() => handleCategorySelect("Công việc")}
                                        >
                                            {filterBy === "Công việc" && <FaCheck className="mr-2" />}
                                            <span>Công việc</span>
                                        </div>
                                        <div
                                            className={`dropdown-item ${filterBy === "Cá nhân" ? "selected" : ""}`}
                                            onClick={() => handleCategorySelect("Cá nhân")}
                                        >
                                            {filterBy === "Cá nhân" && <FaCheck className="mr-2" />}
                                            <span>Cá nhân</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="friend-list">
                <div className="alphabet-header">A</div>
                {filteredFriends.map((friend) => (
                    <div className="friend-item" key={friend.userId}>
                        <img src={friend.avatar} alt={friend.displayName} className="avatar" />
                        <span className="name">{friend.displayName}</span>
                        <div className="options">...</div>
                    </div>
                ))} 
            </div>

            <Loading loading={isLoadingFriends} /> {/* Loading component to show loading state */}
        </div>
    );
};

export default ListFriend;
