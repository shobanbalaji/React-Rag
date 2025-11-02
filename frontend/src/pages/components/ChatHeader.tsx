import React from "react";
import { Row, Col } from "react-bootstrap";
import { BsLayoutSidebar } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { USER_NAME } from "../../functions/variables/common";

// Define only the props you need
interface ChatHeaderProps {
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ sidebar, setSidebar }) => {

  const nav = useNavigate();

  
    const handleLogout = () =>{
    try {
      sessionStorage.setItem("userCred", "");
      localStorage.setItem("userCred", "");
      nav("/")
    } catch (error) {
    }
  };

  return (
    <>
      <Row
        className="align-items-center justify-content-between ms-3  me-1 text-white"
        id="chat-header-wrapper"
        style={{ borderBottom: "1px solid rgb(76 74 74)", height: "60px" }}
      >
        <Col md={10} className="d-flex gap-3 align-items-center">
          <BsLayoutSidebar
            size={16}
            color="white"
            className="sidebar-mobile"
            onClick={() => setSidebar(!sidebar)}
          />
          <p className="fw-bold mb-0">Storm AI</p>
        </Col>

        <Col md={2}>
          <div className="d-flex align-items-center justify-content-end gap-3">
            <p className="mb-0">Share</p>
            <span>
              <IoIosLogOut size={20} style={{cursor:"pointer"}} onClick={handleLogout}/>
            </span>
            {/* <img
              alt="Profile"
              className="rounded-pill border"
              style={{ width: "25px", height: "25px" }}
            /> */}

            <div className="bg-warning rounded-pill d-flex justify-content-center align-items-start" style={{height:"2rem", width:"2rem", fontSize:"1.20rem"}}> {USER_NAME?.slice(0,1)}</div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChatHeader;
