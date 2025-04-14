import { useSelector } from "react-redux";
import ListFriend from "../contact/ListFriend";
import GroupList from "../contact/GroupList";


const DashboardContact = () => {
    const contactOption = useSelector((state) => state.friend.contactOption);
    return (
        <div>
            {contactOption === 0 && <ListFriend />}
            {contactOption === 1 && <GroupList/>}
        </div>
    );
};

export default DashboardContact;