import React from 'react';
import { getUserStatus } from '/imports/api/collections/users';

export const MyVideoComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object,
  },
  render: function () {
    return (
      <div className="chat-sidebar-avatar bottom" >
        <video
          className={"avatar-image " + getUserStatus(this.props.user.status)}
          src={URL.createObjectURL(this.props.stream)}
          muted
          autoPlay
        />
      </div>
    );
  }
});