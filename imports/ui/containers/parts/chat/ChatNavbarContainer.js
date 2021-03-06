import { connect } from 'react-redux';

import { getUserStatus, userHasBlockedContact } from '/imports/api/collections/users';
import { fileListToArray } from '/imports/api/collections/files';

import { filesDropped } from '/imports/actions/chats/file/dropped';
import { startVideoCall } from '/imports/actions/chats/video/start';
import { stopVideoCall } from '/imports/actions/chats/video/stop';
import { sendNudge } from '/imports/actions/chats/contact/nudge';
import { removeContact } from '/imports/actions/chats/contact/remove';
import { blockContact } from '/imports/actions/chats/contact/block';
import { unblockContact } from '/imports/actions/chats/contact/unblock';

import { ChatNavbarComponent } from '/imports/ui/components/parts/chat/ChatNavbarComponent';

const mapStateToProps = (state, props) => {
  return {
    user: state.user,
    contactStatus: getUserStatus(props.contact.status),
    userHasBlockedContact: userHasBlockedContact(state.user, props.contact._id),
    currentVideoCall: !!state.chats[props.contact.username].videoCall.call,
    videoCallRinging: !!state.chats[props.contact.username].videoCall.isRinging,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    fileListToArray,
    startUploadFiles: files => {
      dispatch(filesDropped(props.contact, files));
    },
    startVideoCall: () => {
      dispatch(startVideoCall(props.contact));
    },
    stopVideoCall: () => {
      dispatch(stopVideoCall(props.contact));
    },
    sendNudge: () => {
      dispatch(sendNudge(props.contact));
    },
    removeContact: () => {
      dispatch(removeContact(props.contact));
    },
    blockContact: () => {
      dispatch(blockContact(props.contact));
    },
    unblockContact: () => {
      dispatch(unblockContact(props.contact));
    },
  };
};

export const ChatNavbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatNavbarComponent);
