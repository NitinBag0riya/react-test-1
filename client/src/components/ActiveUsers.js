import React, { Component } from 'react';
import "../App.css";
import { Header,Menu,Container,Button,Grid,Image,List, Form } from "semantic-ui-react";
import Pusher from "pusher-js";

class ActiveUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeUsers: []
    };
  }

  componentWillMount() {
    //   Pusher.logToConsole = true;
    this.pusher = new Pusher("375b50047c7705f219a4", {
      cluster: "ap2",
      encrypted: true
    });

    this.channel = this.pusher.subscribe("presence-my-channel");
  }

  componentDidMount() {
 
      this.channel.bind("pusher:subscription_succeeded", function(members) {
          console.log(members);
          this.setState({
            username: "User" + members.me.id,
            activeUsers: [],
            activeUsers: Object.keys(members.members)
          });
        }, this);



  }

  render() {
    {
      console.log(this.state.activeUsers);
    }
    return <List divided relaxed>
        {this.state.activeUsers.map(data => {
          return <List.Item style={{ paddingLeft: "5px" }}>
              <Image avatar src="https://react.semantic-ui.com/assets/images/avatar/small/christian.jpg" />
              <List.Content className="listText">
                <b>{"User" + data}</b>
              </List.Content>
            </List.Item>;
        })}
      </List>;
  }
}


export default ActiveUsers;