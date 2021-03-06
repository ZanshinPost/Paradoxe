import { Meteor } from 'meteor/meteor';
import Server from 'socket.io';

import { findUserByLoginToken, userHasContact } from '/imports/api/collections/users';
import { USER_INITIALIZE } from '/imports/api/socket/user';
import {
  CHAT_VIDEO_OPEN,
  CHAT_VIDEO_PLAY,
  CHAT_VIDEO_PAUSE,
  CHAT_VIDEO_SEEK_TO,
  CHAT_VIDEO_CLOSE
} from '/imports/api/socket/videos';

Meteor.startup(function () {
  const server = new Server();

  Meteor.users.update({}, {
    $set: {
      'profile.sockets': [],
    }
  }, { multi: true });

  server.on('connection', Meteor.bindEnvironment(socket => {
    socket.on(USER_INITIALIZE, Meteor.bindEnvironment(options => {
      const user = findUserByLoginToken(options.userId, options.loginToken, {
        fields: {
          _id: 1,
        },
      });

      if (user) {
        Meteor.users.update(user._id, {
          $push: {
            'profile.sockets': socket.id,
          },
        });
      }
    }));

    const getUser = () => Meteor.users.findOne({
      'profile.sockets': {
        $in: [socket.id],
      },
    });

    socket.on('disconnect', Meteor.bindEnvironment(() => {
      const user = getUser();

      if (user) {
        Meteor.users.update(user._id, {
          $pull: {
            'profile.sockets': socket.id,
          },
        });
      }
    }));

    // Chat YouTube videos
    const handleVideoEvent = event => {
      socket.on(event, Meteor.bindEnvironment(options => {
        const user = getUser();

        if (user && options.contactId && userHasContact(user, options.contactId)) {
          const contact = Meteor.users.findOne(options.contactId, {
            fields: {
              'profile.sockets': 1,
            },
          });

          contact.profile.sockets.forEach(contactSocketId => {
            const emitOptions = {
              contactId: user._id,
              videoId: options.videoId,
            };

            if (options.seconds) {
              emitOptions.seconds = options.seconds;
            }

            server.to(contactSocketId).emit(event, emitOptions);
          });
        }
      }));
    };

    [
      CHAT_VIDEO_OPEN,
      CHAT_VIDEO_PLAY,
      CHAT_VIDEO_PAUSE,
      CHAT_VIDEO_SEEK_TO,
      CHAT_VIDEO_CLOSE,
    ].forEach(handleVideoEvent);
  }));

  server.listen(Meteor.settings.socket.port);
});
