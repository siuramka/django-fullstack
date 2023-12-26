import { useEffect, useState } from "react";
import {
  AcceptInvitation,
  DenyInvitation,
  GetInvitations,
} from "../../../services/InvitationsService";

const InvitationsSection = ({ handleRefresh }) => {
  const [invitations, setInvitations] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleAccept = async (chatroomId, invitationId) => {
    const response = await AcceptInvitation(chatroomId, invitationId);
    if (response) {
      handleRefresh();
      setRefresh(!refresh);
    }
  };

  const handleDeny = async (chatroomId, invitationId) => {
    const response = await DenyInvitation(chatroomId, invitationId);
    if (response) {
      handleRefresh();
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    GetInvitations().then((invitationData) => {
      setInvitations(invitationData);
    });
  }, [refresh]);

  return (
    <div className="basis-3/4 bg-gray-200">
      <div className="flex flex-col p-4 px-10">
        {invitations && invitations.length > 0 ? (
          invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="p-5 bg-teal-200 mb-2 flex flex-row justify-between"
            >
              @{invitation.sender.username} has invited you to join #
              {invitation.chat_room.name} channel.
              <div>
                <button
                  className="bg-teal-500 hover:bg-teal-700 font-semibold py-2 px-4 rounded text-white mt-2 ml-2"
                  onClick={() =>
                    handleAccept(invitation.chat_room.id, invitation.id)
                  }
                >
                  Accept
                </button>
                <button
                  className="bg-teal-500 hover:bg-teal-700 font-semibold py-2 px-4 rounded text-white mt-2 ml-2"
                  onClick={() =>
                    handleDeny(invitation.chat_room.id, invitation.id)
                  }
                >
                  Deny
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>You have no new invitations.</div>
        )}
      </div>
    </div>
  );
};

export default InvitationsSection;
