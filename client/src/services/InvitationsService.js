import api from "../api/api";

export const GetInvitations = async () => {
  try {
    const response = await api.get("chatrooms/invitations");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const AcceptInvitation = async (chatroomId, invitationId) => {
  try {
    const response = await api.put(
      `chatrooms/${chatroomId}/invitations/${invitationId}`,
      { accepted: true }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const DenyInvitation = async (chatroomId, invitationId) => {
  try {
    const response = await api.delete(
      `chatrooms/${chatroomId}/invitations/${invitationId}`
    );
    if (response.status === 204) {
      return response;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};
