import React from 'react';
import { Overlay as BootstrapOverlay } from 'react-bootstrap';
import { useDashboardContext } from "../../context/Dashboard_context";


const Overlay = () => {
    const { showAddFriendModal } = useDashboardContext();

    return (
        <BootstrapOverlay
            className={`overlay ${showAddFriendModal ? "show" : ""}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40,
                visibility: 'hidden',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                opacity: 0,
            }}
        />
    );
};

export default Overlay;