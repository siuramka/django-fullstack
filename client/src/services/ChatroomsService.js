import api from "../api/api";

export const GetChatrooms = async () => {
  try {
    const response = await api.get("chatrooms");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const GetChatroomParticipants = async (chatroomId) => {
  try {
    const response = await api.get(`chatrooms/${chatroomId}/participants`);
    if (response.status === 200) {
      return response.data.participants;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const InviteUserToChatroom = async (chatroomId, username) => {
  try {
    const response = await api.post(`chatrooms/${chatroomId}/invitations`, {
      username,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const CreateChatroom = async (name) => {
  try {
    const response = await api.post(`chatrooms`, {
      name,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};
