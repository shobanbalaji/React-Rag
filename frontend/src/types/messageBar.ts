export interface MessageBarProps {
  message: string;
  setMessage: (msg: string) => void;
  chatId: string
  setChatId: (id: string) => void;
}