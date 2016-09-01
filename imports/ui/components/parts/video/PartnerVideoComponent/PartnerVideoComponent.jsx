import React from 'react';
import { getUserStatus } from '/imports/api/collections/users';

export const PartnerVideoComponent = React.createClass({
  propTypes: {
    user: React.PropTypes.object.isRequired,
    stream: React.PropTypes.object,
  },
  render: function () {
    return (
      <div className="chat-sidebar-avatar top" >
        <video
          ref="video"
          className={"avatar-image " + getUserStatus(this.props.user.status)}
          src={URL.createObjectURL(this.props.stream)}
          autoPlay
        />
      </div>
    );
  }
});

