import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Header,Menu,Container,Button,Grid,Image,List, Form } from "semantic-ui-react";
import ActiveUsers from "./components/ActiveUsers";
import Pusher from 'pusher-js';
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      username: "",
      messages: [],
      activeUsers: [],
      myID : '',
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.inputMessage = this.inputMessage.bind(this);
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
    // this.pusher.connection.bind('connected', function(data) {
    //   console.log(data);
    // })

    this.channel.bind("pusher:subscription_succeeded",function(members) {
        console.log(members);
      //its bad practice re-rendering over time but how to avoid this interval use of shouldComponentUpdate or else. help me. 
        setInterval(() => {
        this.setState({
          username: "User" + members.me.id,
          activeUsers: Object.keys(members.members),
          myID : members.myID
        });
      },1000);
      },
      this
    );

    this.channel.bind("my-event",function(data) {
        this.setState({
          messages: this.state.messages.concat(data)
        });
      },this);
  }


  inputMessage(event) {
    this.setState({ value: event.target.value });
  }

  sendMessage(event) {
    event.preventDefault();
    if (this.state.value !== "") {
      axios.post("/message/send", {
        username: this.state.username,
        message: this.state.value
      });
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
      this.setState({
        username: "",
        value: ""
      });
    }
  }

  render() {
    return (
      <Container fluid>
        {/* <Menu stackable>
          <Menu.Item>Pusher ReactJS</Menu.Item>
          <Menu.Item name="features">Features</Menu.Item>
        </Menu> */}
        <Grid>
          <Grid.Column floated="left" width={3}>
            <Header as="h3">Active Users</Header>

            <List divided relaxed>
              {this.state.activeUsers.map(data => {
                return (
                  <List.Item style={{ paddingLeft: "5px" }}>
                    <Image
                      avatar
                      src="https://react.semantic-ui.com/assets/images/avatar/small/christian.jpg"
                    />
                    <List.Content className="listText">
                      <b>{"User" + data}</b>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Grid.Column>

          <Grid.Column floated="left" width={13}>
            <div className="chatBlock">
              <List>
                {this.state.messages.map(data => {
                  return <List.Item>
                      <p className={"User" + this.state.myID == data.username ? "me" : "notme"}>
                        <b>@{data.username}</b> {data.message}
                      </p>
                    </List.Item>;
                })}
              </List>
            </div>

            <Form>
              <Form.Group>
                <Form.Input
                  placeholder="Type Message..."
                  value={this.state.value}
                  onChange={this.inputMessage}
                  width={16}
                />
                {<Button
                  onClick={this.sendMessage}
                  type="submit"
                  content=""
                  icon="send"
                  className="uiBtn"
                />}
              </Form.Group>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default App;
