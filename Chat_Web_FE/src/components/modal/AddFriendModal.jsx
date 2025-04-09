import React,{useState} from "react";
import PhoneInput from "react-phone-input-2";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useDashboardContext } from "../../context/Dashboard_context";
import { AiOutlineClose } from "react-icons/ai";

const data = [
 {
    id: "1",
    name: "Nguyễn Văn A",
    phoneNumber: "123 456 789",
    avatar: "https://i.pravatar.cc/300?img=1",
 },
  {
    id: "2",
    name: "Trần Văn B",
    phoneNumber: "123 456 789",
    avatar: "https://i.pravatar.cc/300?img=2",
  },

];

const ItemCurrentlyFriend = ({ item }) => {
  return (
    <Row  className="g-0 pt-2" style={{cursor: 'pointer'}}>
      <Col xs="auto" className="d-flex align-items-center p-2">
        <div
          className="overflow-hidden"
          style={{ width: "40px", height: "40px" }}
        >
                             
          <img src={item.avatar} alt="" className="rounded-circle img-fluid object-fit-cover" />
        </div>
      </Col>
          
      <Col className="d-flex flex-column justify-content-center p-2">
        <div className="" style={{fontSize: '1.03rem', fontWeight: '500'}}>{item.name}</div>
        <div className="text-muted" style={{fontSize: '0.8rem'}}>(+84) {item.phoneNumber}</div>
      </Col>                    
    </Row>
  )
}

const AddFriendModal = () => {
  const { addFriendModalRef, setShowAddFriendModal } = useDashboardContext();

  const [phone, setPhone] = useState("");

  console.log("AddFriendModal");
  return (
    <div ref={addFriendModalRef}>
      <Container
        className="h-100 d-flex flex-column"
        fluid
      >
        <div className="d-flex align-items-center w-100 border-bottom pb-1">
          <span className="fs-5 fw-semibold me-auto">Thêm bạn</span>
          <AiOutlineClose 
            role="button"
            className="d-flex align-items-center justify-content-center btn rounded-circle p-1"
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            size={32}
            onClick={() => setShowAddFriendModal(false)}
          />
        </div>

        <div className="mb-3">
          <PhoneInput
            country={'vn'}
            onlyCountries={["vn"]}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            containerClass="position-relative pt-3 rounded-1 fs-6 fw-semibold"
            inputClass="form-control w-100"
            placeholder="+84 123 456 789"
            specialLabel="Số điện thoại"
          />
        </div>
        
        <div>
          <span className="fs-6 text-muted fw-normal">Kết quả gần đây</span>

        {/* output */}
          {data.map((item) => (
            <ItemCurrentlyFriend key={item.id} item={item} />
          ))}

        </div>

        {/* button */}
        <div className="d-flex align-items-center py-3 px-4 border-top">
          <div className="d-flex align-items-center ms-auto gap-3">
              <button className="btn btn-light px-4 py-2"
                onClick={() => setShowAddFriendModal(false)}
              >Hủy</button>
              <button
                  className="btn btn-primary px-3 py-2 text-white"
                  onClick={() => {
                      // Xử lý logic ở đây
                      setShowAddFriendModal(false);
                  }}
              >
                  Tìm kiếm
              </button>
          </div>
        </div>

      
      </Container>
    </div>
  );
};

export default AddFriendModal;
