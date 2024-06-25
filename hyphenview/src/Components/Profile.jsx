import React from "react";
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  console.log(user, "User");

  const history = useNavigate();
  const handelClicklogout = () => {
    history("/hyphenview");
  };

  return (
    <div id="user-profile-page" className="container-fluid">
      <div id="welcome-message">
        <h1>
          "Welcome User, to the <span id="company-title">HyphenView</span>{" "}
          family! We're thrilled to have you join us."
        </h1>
      </div>
      <div id="user-details-info-container">
        <Card id="user-details-actual-info-container">
          <Card.Img
            id="user-details-image"
            variant="top"
            src="https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?size=626&ext=jpg&ga=GA1.1.779468804.1713432646&semt=ais"
          />
          <Card.Body id="user-details-information">
            <Card.Title id="groupName">{user.groupname}</Card.Title>
            <Card.Text id="userName">{user.user_email_id}</Card.Text>
          </Card.Body>
        </Card>
      </div>

      <div id="logout-button-container">
      <Button variant="dark" type="button" onClick={handelClicklogout}>
          Logout
     </Button>
      </div>
    </div>
  );
};

export default Profile;
