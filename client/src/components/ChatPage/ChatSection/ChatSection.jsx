/* eslint-disable react/prop-types */

import { useContext, useEffect, useRef, useState } from "react";
import {
  GetChatroomParticipants,
  InviteUserToChatroom,
} from "../../../services/ChatroomsService";
import ChatWebsocketClient from "../../../services/ChatWebsocketClient";
import { AuthContext } from "../../../features/AuthContext";
import { getAccessTokenFromLocalStorage } from "../../../features/AuthContextHelper";

// eslint-disable-next-line react/prop-types
const ChatSection = ({ chatroom }) => {
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const { userAuth } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const chatClientRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const messageText = event.target.value;

      chatClientRef.current.send(
        JSON.stringify({
          message: messageText,
          sender_username: userAuth.user.username,
        })
      );

      event.target.value = "";
    }
  };

  const handleSendInvite = async () => {
    const reponse = await InviteUserToChatroom(chatroom.id, username);
    console.log(reponse);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    if (chatClientRef.current !== null) {
      chatClientRef.current.close();
      chatClientRef.current = null;
    }

    setParticipants([]);
    setMessages([]);

    GetChatroomParticipants(chatroom.id)
      .then((participants) => {
        setParticipants(participants);
      })
      .then(() => {
        const socket = ChatWebsocketClient(
          chatroom.id,
          getAccessTokenFromLocalStorage()
        );

        socket.addEventListener("message", (event) => {
          const receivedMessage = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });

        chatClientRef.current = socket;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroom]);

  return (
    <div className="basis-3/4 bg-gray-200">
      {chatClientRef.current !== null > 0 && (
        <div className="flex flex-row shadow-md h-screen">
          <div className="basis-3/4 bg-purple-200 flex flex-col">
            <div className="flex flex-col flex-1 mb-6 px-20 pt-6 gap-2 overflow-auto">
              {messages &&
                messages.length > 0 &&
                messages.map((message, index) => (
                  <div
                    className="bg-teal-300 rounded w-fit p-2 py-4"
                    key={index}
                  >
                    {message.sender_username}: {message.message}
                  </div>
                ))}
            </div>
            <div className="justify-items-end mb-6 px-20">
              <input
                className="shadow appearance-none border rounded w-full py-5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="text"
                type="text"
                placeholder="Enter message and press Enter key..."
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className="basis-1/4 bg-purple-400">
            <h1 className="text-center font-bold text-xl p-4">
              {chatroom.name}
            </h1>
            <div className="flex flex-col">
              {participants &&
                participants.length > 0 &&
                participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex flex-row justify-center"
                  >
                    <p>@{participant.username}</p>
                  </div>
                ))}
            </div>
            <div className="p-4">
              <div className="text-lg font-bold ">Invite user</div>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="username"
                type="text"
                placeholder="username..."
                onChange={handleUsernameChange}
              />
              <button
                onClick={handleSendInvite}
                className="bg-teal-500 hover:bg-teal-700 font-semibold py-2 px-4 rounded text-white mt-2"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
