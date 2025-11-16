import { useEffect, useState, useRef} from "react";

// UI Components
import { Row, Col,} from "react-bootstrap";
import { BsLayoutSidebar } from "react-icons/bs";
import { IoIosFlash } from "react-icons/io";
import {motion, AnimatePresence} from "framer-motion"

// Components
import MessageBar from "../components/MessageBar";
import ChatList from "../components/ChatList";
import ChatHeader from "../components/ChatHeader";

// Functions
import { fetchConversation, getUserChats } from "../../functions/chat";
import { makeErrorToast } from "../../functions/common/common";

// Constants & Types
import { UI_ERROR_MESSAGE } from "../../functions/variables/common";
import type { chatListProps, conversationDataProps } from "../../types";
import ChatViewer from "../components/ChatViewer";

const index = () => {
  const [message, setMessage] = useState<string>("");
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string>("");
  const [chatMode, setChatMode] = useState<string>("auto");
  const [chatList, setChatList] = useState<chatListProps[]>([]);
  const [sidebarPointer, setSidebarPointer] = useState<boolean>(false);
  const [conversationData, setConversationData] = useState<conversationDataProps[]>([]);
  const [requestProgress, setRequestProgress] = useState<boolean>(false)
  const [autoScroll, setAutoScroll] = useState <Boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // get the chat id based on the params values
  useEffect(() => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width <= 768 && height <= 1024) {
      setSidebar(false);
    }

    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get("id");
    const chatMode = params.get("mode");
    if (paramValue) {
      setChatId(paramValue);
      setChatMode(chatMode ?? "auto")
    }
  }, []);

  // fetch the user conversation based on chat and user ids / this useEffect render everyTime when the chatId change
  useEffect(() => {
    if (!chatId) return; // prevent fetch on initial/default state
  
    const fetchConversationData = async () => {
      try {
        setAutoScroll(!autoScroll)
        const response = await fetchConversation({ chatId });
        setConversationData(response.data);
        setAutoScroll(!autoScroll)
      } catch (error) {
        makeErrorToast(UI_ERROR_MESSAGE);
      }
    };
  
    fetchConversationData();
  }, [chatId]);

  // get all user chat data for side bar - this render one time
  useEffect(() => {
    const getChatData = async () => {
      try {
        setIsLoading(true);
        const { code, success, data } = await getUserChats();
        if (code === 500 && !success) {
          makeErrorToast("Failed to fetch chat history");
          setIsLoading(false);
        }
        setChatList(data);
        setIsLoading(false);
      } catch (error) {
        makeErrorToast(UI_ERROR_MESSAGE);
        setIsLoading(false);
      }
    };
    getChatData();
  }, []);


  // render sidebar list immediately
  useEffect(() => {
    const fetchUserChatList = async () => {
      const { code, success, data } = await getUserChats();
      if (code === 500 && !success) {
        makeErrorToast("Failed to fetch chat history");
      }
      setChatList(data);
    };
    fetchUserChatList();
  }, [chatId]);

  // useEffect for scroll down the page to the bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationData]);


  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationData, requestProgress, autoScroll]);


const sidebarVariants = {
  open: { x: 0 },
  closed: { x: '-100%' }, // Slides fully out to the left
};


  return (
    <div
      className="rag-container"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <Row className="justify-content-between" style={{ height: "100%" }}>
        {/* Sidebar */}
        <Col
          md={sidebar ? 2 : 1}
          className= {`p-0 chat-sidebar sidebar ${sidebar ? "sidebar-true":"sidebar-false"}`} 
          style={{
            ...(!sidebar && {
              width: "80px",
              background: "transparent",
              borderRight: "1px solid #0000002b",
            }),
          }}
        >
          {!sidebar && (
            <div
              className="p-1 hover-icons text-center mt-3"
              style={{ cursor: "pointer", marginInline:"28px 21px"}}
              onMouseEnter={() => setSidebarPointer(true)}
              onMouseLeave={() => setSidebarPointer(false)}
              onClick={() => {
                setSidebar(!sidebar);
                setSidebarPointer(false);
              }}
            >
              {sidebarPointer ? (
              <BsLayoutSidebar size={16} color="white" />
              ) : (
                <IoIosFlash size={22} color="#ffc51c" />
              )}
            </div>
          )}


          {sidebar && (

          <AnimatePresence>
            <motion.div
            className="sidebar-transition h-100"
            initial="closed" // Start from the 'closed' state
            animate="open"   // Animate to the 'open' state
            exit="closed"    // Animate back to 'closed' when unmounted
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 200, damping: 50 }} // Nice springy feel
            >
            <ChatList
              sidebar={sidebar}
              setSidebar={setSidebar}
              setChatId={setChatId}
              chatId={chatId}
              chatList={chatList}
              setChatList={setChatList}
              isLoading={isLoading}
            />
          </motion.div>
          </AnimatePresence>
          )}

        </Col>

        {/* Main Chat Area */}
        <Col className="px-0 flex flex-column" md={sidebar && 10}>
          <ChatHeader setSidebar={setSidebar} sidebar ={sidebar}/>

          {/* Scrollable Chat Content */}
          <div
            className={`d-flex justify-content-center chat-viewer ${conversationData?.length === 0 ? "content-min" : "content-max"}`}
            ref={scrollContainerRef}
            style={{
              overflowY: "auto",
              overflowX:"hidden"
            }}
          >
            <div className={`mt-3 chat-content `} style={{height: conversationData?.length === 0 ? "25vh" : "78vh", width:"55%"}}>
              {conversationData?.length > 0 ? (
                conversationData?.map((data, index) => (
                  <div key={index}>
                  <ChatViewer key={index} response={data.response} request = {data.message} responsive = {data.responsive} viewContainerRef = {bottomRef}  />
                  </div>
                ))
              ) : ( conversationData?.length ==0  &&
                <h3 className="text-center text-white intro-text">
                  What are you working on?
                </h3>
              )}
              {
                requestProgress && 
              <div className="blink-progress my-3"/>
              }
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Message Bar Fixed at Bottom */}
          <div className="px-5 ms-5 py-2 d-flex justify-content-center" style={{position:"relative", top:"60px"}} id="message-bar-wrapper">
            <MessageBar
              setMessage={setMessage}
              message={message}
              setChatId={setChatId}
              chatId={chatId}
              setConversationData={setConversationData}
              setRequestProgress={setRequestProgress}
              setChatMode={setChatMode}
              chatMode={chatMode}
            />
          </div>

        </Col>

      </Row>
    </div>
  );
};

export default index;
