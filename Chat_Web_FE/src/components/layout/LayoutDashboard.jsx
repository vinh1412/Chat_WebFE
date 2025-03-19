import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import Modal from "../../components/modal/Modal";
import DashboardSideBar from "../../modules/dashboard/DashboardSideBar";
import Overlay from "../common/Overlay";

const LayoutDashboard = () => {
  return (
    <>
        <Modal />
        <Container fluid className="vh-100 min-vh-100 overflow-hidden bg-light p-0">
            <Overlay />
            <Row className="g-0">
                    <Col xs="auto">
                        <DashboardSideBar />
                    </Col>
                    <Col className="flex-grow-1 vh-100 min-vh-100 overflow-auto">
                        <Outlet />
                    </Col>
                </Row>
        </Container>
    </>
  );
}

export default LayoutDashboard;
