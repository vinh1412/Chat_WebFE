import { useDispatch, useSelector } from "react-redux";
import { setContactOption } from "../../redux/friendSlice"; // đường dẫn đúng với cấu trúc project
import { FaUserFriends, FaUsers, FaUserPlus } from "react-icons/fa";
import "../../assets/css/ContactBar.css";

const ContactBar = () => {
    const dispatch = useDispatch();
    const active = useSelector((state) => state.friend.contactOption);

    return (
        <div className="contact-bar__contact-bar">
            <div
                className={`contact-bar__contact-item ${active === 0 ? "active" : ""}`}
                onClick={() => dispatch(setContactOption(0))}
            >
                <FaUserFriends className="contact-bar__icon" />
                <span>Danh sách bạn bè</span>
            </div>

            <div
                className={`contact-bar__contact-item ${active === 1 ? "active" : ""}`}
                onClick={() => dispatch(setContactOption(1))}
            >
                <FaUsers className="contact-bar__icon" />
                <span>Danh sách nhóm và cộng đồng</span>
            </div>

            <div
                className={`contact-bar__contact-item ${active === 2 ? "active" : ""}`}
                onClick={() => dispatch(setContactOption(2))}
            >
                <FaUserPlus className="contact-bar__icon" />
                <span>Lời mời kết bạn</span>
            </div>
        </div>
    );
};

export default ContactBar;
