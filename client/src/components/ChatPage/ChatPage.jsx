import { useEffect, useState } from "react";
import { GetChatrooms } from "../../services/ChatroomsService";
import ChatSection from "./ChatSection/ChatSection";
import InvitationsSection from "./InvitationsSection/InvitationsSection";
import CreateChatSection from "./CreateChatSection/CreateChatSection";

const ChatPage = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [invitationsTab, setInvitationsTab] = useState(false);
  const [createChannelTab, setCreateChannelTab] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleSelectChatroom = (chatroom) => {
    const updatedChatrooms = chatrooms.map((room) => ({
      ...room,
      selected: room.id === chatroom.id,
    }));

    setSelectedChatroom(chatroom);
    setChatrooms(updatedChatrooms);
    setInvitationsTab(false);
    setCreateChannelTab(false);
  };

  const deselectChatrooms = () => {
    const updatedChatrooms = chatrooms.map((room) => ({
      ...room,
      selected: false,
    }));
    setChatrooms(updatedChatrooms);
  };

  const handleInvitationsTab = () => {
    deselectChatrooms();
    setInvitationsTab(true);
    setSelectedChatroom(null);
    setCreateChannelTab(false);
  };

  const handleCreateChannelTab = () => {
    deselectChatrooms();
    setInvitationsTab(false);
    setSelectedChatroom(false);
    setCreateChannelTab(true);
  };

  const handleRefreshChatrooms = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    GetChatrooms().then((chatroomData) => {
      const initializedChatrooms = chatroomData.map((room) => ({
        ...room,
        selected: false,
      }));
      setChatrooms(initializedChatrooms);
    });
  }, [refresh]);

  return (
    <div className="pt-8 pb-8">
      <div className="flex flex-row bg-white shadow-md h-screen">
        <div className="basis-1/4 bg-purple-700 text-white">
          <a
            onClick={handleInvitationsTab}
            className="bg-purple-700 hover:bg-purple-900 grid justify-items-center py-6 font-bold cursor-pointer"
          >
            Invitations
          </a>
          <a
            onClick={handleCreateChannelTab}
            className="bg-purple-700 hover:bg-purple-900 grid justify-items-center py-6 font-bold cursor-pointer"
          >
            Create Channel
          </a>
          {chatrooms && chatrooms.length > 0 ? (
            chatrooms.map((chatroom) => (
              <a
                key={chatroom.id}
                onClick={() => handleSelectChatroom(chatroom)}
                className={
                  chatroom.selected
                    ? "bg-purple-900 hover:bg-purple-900 grid justify-items-center py-6 cursor-pointer"
                    : "bg-purple-700 hover:bg-purple-900 grid justify-items-center py-6 cursor-pointer"
                }
              >
                #{chatroom.name}
              </a>
            ))
          ) : (
            <a className="bg-purple-700 grid justify-items-center py-6 font-bold">
              No Channels Available.
            </a>
          )}
        </div>
        {!invitationsTab && !createChannelTab && selectedChatroom && (
          <ChatSection chatroom={selectedChatroom} />
        )}
        {invitationsTab && (
          <InvitationsSection handleRefresh={handleRefreshChatrooms} />
        )}
        {createChannelTab && (
          <CreateChatSection handleRefresh={handleRefreshChatrooms} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
