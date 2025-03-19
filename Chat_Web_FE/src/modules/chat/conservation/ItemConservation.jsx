import React from "react";
import {Row, Col, Button} from "react-bootstrap";

const ItemConservation = ({item}) => {
    return (
        <Row key={item.id} className="g-0 border-bottom pt-2" style={{cursor: 'pointer'}}>
            <Col xs="auto" className="d-flex align-items-center p-2">
                <div
                    className="overflow-hidden"
                    style={{ width: "48px", height: "48px" }}
                >
                    {item.isGroup ? (
                         <div className="d-flex flex-wrap">
                            {item.members.slice(0,4).map((member, index) => (
                                <img key={index} src={member.avatar} alt="" className="rounded-circle" style={{width:'24px', height:'24px'}} />                                    
                            ))}
                        </div>
                    ) : (
                        <img src={item.avatar} alt="" className="rounded-circle img-fluid object-fit-cover" />
                    )}
                           
                </div>
            </Col>

            <Col className="d-flex flex-column justify-content-center p-2">
                <div className="" style={{fontSize: '1.1rem', fontWeight: '500'}}>{item.name}</div>
                <div className="text-muted" style={{fontSize: '0.9rem'}}>{item.message}</div>
            </Col>
            <Col xs="auto" className="d-flex flex-column justify-content-center p-2" style={{fontSize: '0.8rem'}}>
                <div className="text-muted">{item.time}</div>
            </Col>
        </Row>
    )
};

export default ItemConservation;