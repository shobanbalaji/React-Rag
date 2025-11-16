import { BiBookOpen, BiSearch } from "react-icons/bi";
import { BsMic } from "react-icons/bs";
import { PiPaperclip } from "react-icons/pi";

const PromptBar = () => {
  return (
    <div className="prompt-wrapper">
      <form className="prompt-form">
        <div className="prompt-container">
          <div className="prompt-textarea-wrapper">
            <textarea
              id="prompt-textarea"
              placeholder="Ask anything"
              className="prompt-textarea"
              rows={1}
            />
          </div>

          <div className="prompt-actions">
            <div className="left-actions">
              <button type="button" className="action-btn">
                <PiPaperclip size={20} />
                <span>Attach</span>
              </button>

              <button type="button" className="action-btn">
                <BiSearch size={20} />
                <span>Search</span>
              </button>

              <button type="button" className="action-btn">
                <BiBookOpen size={18} />
                <span>Study</span>
              </button>
            </div>

            <div className="right-actions">
              <button type="button" className="voice-btn">
                <BsMic size={20} />
                <span>Voice</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PromptBar;
