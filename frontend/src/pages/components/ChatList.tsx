import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Row, Form, Dropdown} from "react-bootstrap";
import type { messageListProps } from "../../types";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { MdOutlineStorm } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { deleteChat, renameChat } from "../../functions/chat";
import { UID } from "../../functions/variables/common";
import { makeErrorToast } from "../../functions/common/common";
const ChatList: React.FC<messageListProps> = ({
  sidebar,
  setSidebar,
  setChatId,
  chatId,
  chatList,
  setChatList
}) => {
  const nav = useNavigate();
  const dropdownRef = useRef(null);
  const [openRename, setOpenRename] = useState<boolean>(true);
  const [renameValue, setRenameValue] = useState<string>("")

  // set the chat id to the state and set the chat id value to the query params 
  const handleRetrieveChat = async (docId: string) => {
    setOpenRename(true)
    setChatId(docId);
    nav(`?id=${docId}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
    const {value}=e.target;
    setRenameValue(value.trim())
  }

  // function to toggling the sidebar values
  const hideSidebar = () => {
    setSidebar(!sidebar);
  };

  // function for Rename the chat
  const handleRenameChat = async(e:any, chatId:string, chatName:string)=>{
    try {
      e.preventDefault()
      if(chatName.trim()==renameValue.trim() || renameValue.trim() == ""){
        return true
      }
      const response = await renameChat({userId:UID, c_id:chatId, c_n:renameValue});
      if(response.code==200 && response.success){
        const updatedName = response.data.value;
        const updatedArray = chatList.map((data) => {
          if (data._id === chatId) {
            return { ...data, chatName: updatedName };
          }
          return data;
        });
        setChatList(updatedArray)
      }

      setRenameValue("");
      setOpenRename(true);
    } catch (error) {
      console.error(error);
      makeErrorToast("Failed to update chat name")
    }
  };

  // function for delete the chat
  const handleDeleteChat = async(chatId:string)=>{
    try {
      const response = await deleteChat({userId:UID, c_id:chatId});
      if(response.code==200&&response.success){
        const updatedChatList = chatList.filter((data)=>data._id!=response.data.value);
        setChatList(updatedChatList)
      }
    } catch (error) {
      console.error(error)
      makeErrorToast("Failed to delete chat")
    }
  };

  return (
    <>
      <Row
        className="ps-3"
        style={{
          height: "100vh",
          background: "#171717",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{ height: "10%", minHeight: "60px" }}
          className="d-flex justify-content-between align-items-center"
        >
          <div className="p-2 hover-icons" onClick={() => handleRetrieveChat("auto")}>
            <MdOutlineStorm size={22} color="white" />
          </div>

          <div
            className="hover-icons p-1"
            style={{ cursor: "pointer" }}
            onClick={hideSidebar}
          >
            <TbLayoutSidebarFilled size={25} color="white" />
          </div>
        </div>

        <div>
          <div
            className="p-1 text-white d-flex gap-2 align-items-center chat-item"
            onClick={() => handleRetrieveChat("auto")}
          >
            <TbEdit size={20} />
            <p className="mb-0">New Chat</p>
          </div>
        </div>

        {/* Chat List */}
        <div
          className="chat-list-bar"
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {chatList?.map((data, index) => (
            <div
              key={index}
              style={{ height: "35px" }}
              className={`d-flex justify-content-between align-items-center text-white ${openRename ? "pe-2" : "pe-0"} my-1 chat-item chat-item-${
                data._id === chatId ? "active" : "inActive"
              }`}
              
            >
              {data._id === chatId ? (
                <Form onSubmit={(e)=>handleRenameChat(e, data._id,data.chatName)}>
                  <Form.Control
                    type="text"
                    defaultValue={data.chatName}
                    readOnly={openRename}
                    className="ps-2"
                    onChange={handleChange}
                    style={{
                      background: "transparent",
                      border: openRename ? "none" : "1px solid white",
                      color: "white",
                      height: "80%",
                    }}
                    onClick={(e)=>handleRenameChat(e, data._id,data.chatName)}
                  />
                </Form>
              ) : (
                <p className="my-2 p-2 w-100" onClick={() => handleRetrieveChat(data._id)}> {data.chatName}</p>
              )}
              {(data._id === chatId && openRename)&& (
                <Dropdown ref={dropdownRef}>
                  <Dropdown.Toggle className="p-0" style={{background:"unset", border:"none"}}>
                    <BiDotsHorizontalRounded />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>setOpenRename(false)}>Rename</Dropdown.Item>
                    <Dropdown.Item onClick={()=>handleDeleteChat(chatId)}>Delete</Dropdown.Item>
                  </Dropdown.Menu>

                </Dropdown>
              )}
            </div>
          ))}
        </div>
      </Row>
    </>
  );
};

export default ChatList;
