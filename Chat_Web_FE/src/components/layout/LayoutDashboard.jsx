import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import Modal from "../../components/modal/Modal";
import DashboardSideBar from "../../modules/dashboard/DashboardSideBar";
import DashboardOptionList from "../../modules/dashboard/DashboardOptionList";
import Overlay from "../common/Overlay";

const LayoutDashboard = () => {
  return (
    <>
      <Modal />
      {/* Layout chung */}
      <Container
        fluid
        className="vh-100 min-vh-100 overflow-hidden bg-light p-0"
      >
        {/* Làm mờ phần nền khi mở modal*/}
        <Overlay />

        <Row className="g-0">
          <Col xs="auto">
            <DashboardSideBar />
          </Col>

          <Col xs="auto">

            {/* Chứa list conservation và list option contact */}
            <DashboardOptionList />
          </Col>

          {/* Hiển thị các element con của layout (vd: DashboardPage) */}
          <Col className="flex-grow-1 vh-100 min-vh-100 overflow-auto">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LayoutDashboard;
