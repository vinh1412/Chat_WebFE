import { useSelector } from "react-redux";
import ListFriend from "../contact/ListFriend";
import GroupList from "../contact/GroupList";
import ListFriendRequest from "../contact/ListFriendRequest";


const DashboardContact = () => {
    const contactOption = useSelector((state) => state.friend.contactOption);
    return (
        <div>
            {contactOption === 0 && <ListFriend />}
            {contactOption === 1 && <GroupList/>}
            {contactOption === 2 && <ListFriendRequest />}

        </div>
    );
};

export default DashboardContact;