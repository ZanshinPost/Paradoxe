import { stopVideoPeer } from './peer';
import { chatVideoUpdate } from './update';

export function chatVideoListenToConnections(contact, peer) {
  return (dispatch, getState) => {
    _.each(peer.connections, connections => {
      connections.forEach(connection => {
        connection.on('close', () => {
          const videoState = getState().chats[contact.username].videoCall;

          if (videoState.isHangingUp) {
            dispatch(chatVideoUpdate(contact, {
              isHangingUp: false,
            }));
          } else {
            dispatch(chatVideoConnectionLost(contact, peer))
          }
        });
      });
    });
  };
}

export function chatVideoConnectionLost(contact, peer) {
  return dispatch => {
    dispatch(stopVideoPeer(contact, peer));
  };
}
