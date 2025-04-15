import React from "react";

import { Container, Col, Row, Button } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

import { useDispatch } from "react-redux";
import { setShowSearch, setShowConversation } from "../../redux/slice/commonSlice";
import { searchUser } from "../../services/UserService";

const searchData = [
    {
        id: "1",
        name: "Nguyễn Văn A",
        avatar: "https://i.pravatar.cc/300?img=1",
    },
    {
        id: "2",
        name: "Trần Văn B",
        avatar: "https://i.pravatar.cc/300?img=2",
    },
    {
        id: "3",
        name: "Đinh Văn C",
        avatar: "https://i.pravatar.cc/300?img=1",
    },

    {
        id: "4",
        name: "Phan Văn Teo",
        avatar: "https://i.pravatar.cc/300?img=2",
    },
]

const ItemSerch = ({item}) => {
    const dispatch = useDispatch();

    return (
        <div key={item.id} className="overflow-hidden d-flex align-items-center gap-2 mb-2 mt-2"
            onClick={() => {dispatch(setShowConversation(true))}}
            style={{cursor: 'pointer'}}
        >
            <img src={item.avatar} alt="" className="rounded-circle img-fluid object-fit-cover" style={{ width: "48px", height: "48px" }} />
            <span className="ms-2">{item.display_name}</span>
        </div>
    )
}

const SearchSide = () => {
    const dispatch = useDispatch();

    const searchInputFocusRef = React.useRef(null);

    const [keyword, setKeyword] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    
    // tự động focus vào ô tìm kiếm khi mở search
    React.useEffect(() => {
        searchInputFocusRef.current?.focus();
    },[])

    // Hàm xử lý tìm kiếm
    const handleSearch = async (keyword) => {
        // Gọi API tìm kiếm người dùng
        try {
            const response = await searchUser(keyword);
            if(response.status === "SUCCESS") {
                if(response.response.length === 0) {
                    setSearchResults([]);
                } else {
                    setSearchResults(response.response);
                }
            }
            console.log("Kết quả tìm kiếm:", response.response);
           
        } catch (error) {
            console.error("Lỗi khi gọi API tìm kiếm:", error);
        }
    }

    React.useEffect(() => 
    {
        if(keyword) {
            handleSearch(keyword);
        }
    
    }, [keyword]);
  return (
    <>
        <Container
        fluid
        className="d-flex align-items-center justify-content-between p-3 w-100"
        >
            <Row className="g-0 rounded-2" style={{ backgroundColor: "#E5E7EB" }}>
                <Col xs="auto" className="d-flex align-items-center ps-2">
                <BsSearch />
                </Col>
                <Col className="flex-grow-1">
                <input
                    type="text"
                    className="form-control bg-transparent border-0 rounded-1"
                    placeholder="Tìm kiếm"
                    ref={searchInputFocusRef}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                </Col>
            </Row>
            <Row className="d-flex align-items-center">
                <Col xs="auto" onClick={() => {dispatch(setShowSearch(false))}} style={{cursor: 'pointer'}}>
                <span className="">Đóng</span>
                </Col>
            </Row>
        
        </Container>

        <Container fluid className="w-100 overflow-auto " style={{maxHeight: 'calc(100vh - 56px)'}}>
            {!keyword && (
                <>
                    <h6 className="mt-1">Tìm kiếm gần đây</h6>
                    {/* List tìm kiếm gần đây */}
                    <div className="d-flex flex-column gap-2 mt-2">
                        {/* {searchData.map((item) => (
                            <ItemSerch key={item.id} item={item} />
                        ))} */}
                    
                    </div>
                </>
            )}

            {keyword && (
                <>
                    <h6 className="mt-1">Kết quả tìm kiếm cho "{keyword}"</h6>
                    {/* List tìm kiếm gần đây */}
                    <div className="d-flex flex-column gap-2 mt-2">
                        {searchResults.map((item) => (
                            <ItemSerch key={item.id} item={item} />
                        ))}

                        {searchResults.length === 0 && (
                            <div className="text-center mt-2">Không tìm thấy kết quả nào</div>
                        )}
                    
                    </div>
                </>
            )}

        </Container>
    </>

  );
};

export default SearchSide;
