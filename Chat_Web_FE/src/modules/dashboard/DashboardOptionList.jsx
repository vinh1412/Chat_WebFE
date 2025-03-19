//Bao gồm list conservation và list option contact (danh sách lời mời kết bạn, danh sách bạn bè,....)

import React from "react";
import { Container,  } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const DashboardOptionList = () => {
    const dispatch = useDispatch();
    const currentTab = useSelector((state) => state.chat.currentTab);
  return (
    <Container fluid className="d-flex flex-column p-0" style={{ width: '344px', backgroundColor: 'gray', minHeight: '100vh' }}>
        {/* List conservation */}
        {currentTab === "Chat" && (

            <p>List conservations</p>
        )}

        {currentTab === "Contact" && (
            <p>List contact</p>
        )}
    </Container>
  );
}

export default DashboardOptionList;