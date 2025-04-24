// PremiumFeatureLock.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PremiumFeatureLock = ({ featureName, currentPlan }) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <>
            <div className="locked-feature-overlay" onClick={() => setShowModal(true)}>
                <div className="locked-content">
                    <i className="bi bi-lock-fill"></i>
                    <p>Premium Feature</p>
                </div>
                {children}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upgrade Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The "{featureName}" feature is only available for Premium users.</p>
                    <p>Your current plan: <strong>{currentPlan}</strong></p>
                    
                    <div className="d-grid gap-2 mt-4">
                        <Button variant="warning" href="/subscribe">
                            Upgrade to Premium
                        </Button>
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                            Maybe Later
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PremiumFeatureLock;
