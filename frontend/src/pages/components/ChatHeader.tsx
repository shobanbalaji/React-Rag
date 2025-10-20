import React from "react";
import { Row, Col } from "react-bootstrap";
import { BsLayoutSidebar } from "react-icons/bs";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

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
      console.error(error)
    }
  };

  return (
    <>
      <Row
        className="align-items-center justify-content-between ms-3 text-white"
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
            <img
              alt="Profile"
              className="rounded-pill border"
              style={{ width: "25px", height: "25px" }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ChatHeader;
