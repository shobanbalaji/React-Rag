import React, { useEffect, useState } from "react";
import { Col, Row, Form} from "react-bootstrap";
import type{ messageList, messageListProps } from "../../types";
import { TbLayoutSidebarFilled } from "react-icons/tb";

const ChatList: React.FC <messageListProps> = ({sidebar, setSidebar, setChatId, chatId }) => {

  const [chatData, setChatData] = useState<messageList[]>([]);

    // retrieve chat
  const handleRetrieveChat = async(docId: string)=>{
    setChatId(docId)
  };

  const hideSidebar = ()=>{
   setSidebar(!sidebar) 
  }

  useEffect(() => {
    setChatData([
      {
        id: "001",
        chatName: "General Chat",
        createdAt: "2025-06-01T08:00:00Z",
        updatedAt: "2025-06-05T12:00:00Z",
      },
      { id: "002", chatName: "Tech Talk", createdAt: "2025-06-02T09:30:00Z" },
      { id: "003", chatName: "Random", updatedAt: "2025-06-05T14:00:00Z" },
      { id: "004", chatName: "Gaming" },
      {
        id: "005",
        chatName: "Sports Fans",
        createdAt: "2025-06-03T10:15:00Z",
        updatedAt: "2025-06-06T11:30:00Z",
      },
      { id: "006", chatName: "Book Club", createdAt: "2025-06-01T12:00:00Z" },
      { id: "007", chatName: "Movies" },
      {
        id: "008",
        chatName: "Work Group",
        createdAt: "2025-06-04T09:00:00Z",
        updatedAt: "2025-06-06T08:00:00Z",
      },
      { id: "009", chatName: "Music Lovers" },
      {
        id: "010",
        chatName: "Travel Buddies",
        updatedAt: "2025-06-05T17:45:00Z",
      },
      { id: "011", chatName: "Foodies", createdAt: "2025-06-02T13:30:00Z" },
      { id: "012", chatName: "Fitness" },
      { id: "013", chatName: "Photography", createdAt: "2025-06-03T14:00:00Z" },
      { id: "014", chatName: "Science", updatedAt: "2025-06-06T15:00:00Z" },
      { id: "015", chatName: "Art Lovers" },
      { id: "016", chatName: "Coding Help", createdAt: "2025-06-01T16:00:00Z" },
      { id: "017", chatName: "Parenting" },
      {
        id: "018",
        chatName: "Pets",
        createdAt: "2025-06-02T18:15:00Z",
        updatedAt: "2025-06-05T19:00:00Z",
      },
      { id: "019", chatName: "Environment" },
      { id: "020", chatName: "Politics" },
      {
        id: "021",
        chatName: "Gaming Friends",
        createdAt: "2025-06-04T20:00:00Z",
      },
      { id: "022", chatName: "Language Exchange" },
      { id: "023", chatName: "Meditation", updatedAt: "2025-06-06T21:30:00Z" },
      { id: "024", chatName: "Business", createdAt: "2025-06-03T22:00:00Z" },
      { id: "025", chatName: "Photography Club" },
      { id: "026", chatName: "Anime Fans", createdAt: "2025-06-05T23:45:00Z" },
      { id: "027", chatName: "DIY Projects" },
      {
        id: "028",
        chatName: "History Buffs",
        updatedAt: "2025-06-04T07:00:00Z",
      },
      { id: "029", chatName: "Motivation" },
      {
        id: "030",
        chatName: "Travel Diaries",
        createdAt: "2025-06-06T08:30:00Z",
        updatedAt: "2025-06-06T10:30:00Z",
      },
    ]);
  },[]);



  return (
    <>
      <Row className="px-3" style={{ overflowY: "scroll", height: "100vh", background:"#171717"}}>

        <div className="d-flex my-2">
        <div style={{cursor:"pointer"}} onClick={hideSidebar}> <TbLayoutSidebarFilled size={25} color="white" /></div>
        </div>

        {chatData.map((data, index) => (
          <Col md={12} key={index} className={`d-flex align-items-center text-white ps-2 my-1 chat-item chat-item-${data.id === chatId ? 'active' : 'inActive'}`} onClick={()=>handleRetrieveChat(data.id)}>
            {" "}
            <Form.Control type="text" defaultValue={data.chatName} readOnly = {data.id === chatId ? false : true}  style={{background:"transparent", border:"none", color:"white", height:"80%"}}/>
            
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ChatList;
