import React from "react";
import "./module.scss";
import graph from "./icons/graph.png";
import users from "./icons/users.png";
import ratingStar from "./icons/rating-star.png";
import { useNavigate } from "react-router-dom";

function Module(props) {
  const navigate = useNavigate();

  const handleGoToModule = () => {
    navigate(`/module?id=${props.id}`);
  };

  const handleEnrollClick = (event) => {
    event.stopPropagation(); // Stop event propagation to parent
    // Perform enroll logic...
  };

  return (
    <div className="module" onClick={handleGoToModule}>
      <div className="price-box">
        <p className="number">{props.price !== 0 ? props.price : "Free"}</p>
      </div>
      <div className="box">
        <div className="title">
          <p className="school">{props.school}</p>
          {/* <p className="school">SCHOOL NAME HERE</p> */}
          <div className="subject">
            <p className="subject-text">{props.subject}</p>
          </div>
        </div>

        {/* <p className="event-subtype">{props.subject_type}</p> */}
        <p className="subtype">{props.subject_type}</p>
        <div className="difficulty">
          <img src={graph} alt="" className="icon"></img>
          {/* <p className="event-difficulty">{props.difficulty}</p> */}
          <p className="difficulty-value">{props.difficulty}</p>
        </div>
        <div className="rating">
          <img src={ratingStar} alt="" className="icon" />
          <p className="number">{props.rating}</p>
        </div>
        <div className="enrolled">
          <img src={users} alt="" className="icon" />
          <p className="number">{props.enrolled}</p>
        </div>
        {/* <button className="enrolledButton" onClick={enrollStudents}> */}
        <button onClick={handleEnrollClick} className="enrolled-button">
          Enroll
        </button>
      </div>
    </div>
  );
}

export default Module;
