import React, { useEffect, useState, useRef } from "react";
import "./MainPage.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { hasJWT } from "../authentication/authentication";
import girl from "./girl.png";
import { useNavigate } from "react-router-dom";
import "./calendarStyle.scss";
import CustomToolbar from "./customToolbar";
import { message } from "antd";

const localizer = momentLocalizer(moment);
const userRole = localStorage.getItem("role");

function convertStringToDate(str) {
  const dateParts = str.split("T")[0].split("-");
  const timeParts = str.split("T")[1].split(":");

  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Months are zero-based (0-11)
  const day = parseInt(dateParts[2]);
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);

  return new Date(year, month, day, hour, minute);
}

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]);
  const navigate = useNavigate();
  const calendarContainerRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);
  const [isFetchAndSync, setIsFetchAndSync] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const toggleModuleList = () => {
    setIsVisible(!isVisible)
  };  

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable2"

const successCal = () => {
  messageApi.open({
    key,
    type: "success",
    content: "Done, fetched & synchronized successfully!",
    style: {
      marginTop: "60px",
      color: 'green',
    },
  });
};

const errorCal = () => {
  messageApi.open({
    key,
    type: "error",
    content: "Fetch & Sync failed",
    style: {
      marginTop: "60px",
      color: 'red',
    },
  });
};

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    setTimeout(() => {
    fetch("/api/calendar/", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        let listaEvents = [];
        console.log(result);
        result.forEach((event) => {
          listaEvents.push({
            title: event.name,
            desc: event.desc, 
            start: convertStringToDate(event.starts),
            end: convertStringToDate(event.ends),
          });
        });

        console.log(listaEvents);

        setEvents(listaEvents);
      })
      .catch((error) => console.log("error", error));
    }, 80);
}, [checkboxes]);

  const handleJoinFree = () => {
    navigate("/register");
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization", `Bearer ${localStorage.getItem("token")}`
    );
    
    var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
    };
    
    fetch("/api/enrolled/getEnrollments", requestOptions)
      .then((response) =>         
          response.json()
    )
      .then((result) => {
        let moduleList = [];      
        console.log("Set Checkboxes " + result);
        result.forEach((moduleItem) => {
          moduleList.push({
            id: moduleItem.id,
            name: moduleItem.name,
            isChecked: moduleItem.isChecked
          });
        });
        moduleList.sort((a, b) => a.name > b.name ? 1 : -1); // sort list modules in moduleList by module name attribute      
        setCheckboxes(moduleList);
       })
      .catch((error) => console.error(error));    
    }, []);


  useEffect(() => {
    const handleResize = () => {
      if (calendarContainerRef.current) {
        const width = calendarContainerRef.current.offsetWidth;
        const height = Math.floor(width / 2);
        setCalendarHeight(height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

   

  async function FetchAllEventsFromGoogleAndSync() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
        "Authorization", `Bearer ${localStorage.getItem("token")}`
    );  
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };    
      
    setIsFetchAndSync(true);
    const eventList = await fetch("/api/calendar/fetchAndSync", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not fetch resource")
      }
      return response.json()
    })
    .then(data => {
      setIsFetchAndSync(false)
      console.log(data)
      successCal()
      return data;
    })
    .catch((error) => {
      setIsFetchAndSync(false)
      console.log("error", error)
      errorCal();
    });
    console.log(eventList);
 }

 const handleCheckboxState = async (moduleId) => {
    const newCheckboxes = [...checkboxes];
    const index = newCheckboxes.findIndex(checkbox => checkbox.id === moduleId);
    newCheckboxes[index].isChecked = !newCheckboxes[index].isChecked;
    setCheckboxes(newCheckboxes);

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );
      
      var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
      };

      await fetch(`/api/enrolled/${moduleId}/updateCheckboxState`, requestOptions)
      .then(response => {
          if (!response.ok) {
              throw new Error("Could not update checkbox state")
          }
          console.log(response.json)
          response.json()
      })
      .then(data => {
          console.log(data)
          return data
      })
      .catch((error) => {
          console.log("error", error)
      });

  };  
  

  return (
    <div className="main-page">
      {hasJWT() ? (
        <div>
          <div className="left-panel" ref={calendarContainerRef} style={{ width: isVisible ? '80%' : '100%'}}>
            <h1 className="heading">Welcome to Educator!</h1>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: calendarHeight }}
              max={moment("2024-05-05T23:00:00").toDate()}
              min={moment("2024-05-05T08:00:00").toDate()}              
              components={{
                toolbar: (props) => <CustomToolbar {...props} toggleModuleList={toggleModuleList} />,
              }}
            />
          </div>
          {isVisible && <div className="right-panel">
            <h4>My Modules</h4>
            <div className="module-list">            
               {checkboxes.map((checkbox, index) => (                
                <label key={checkbox.id} className="module-list-container">
                  <input
                  
                  style={{paddingLeft: 5, cursor: "pointer"}}
                  type="checkbox"
                  className="checkbox"
                  checked={checkbox.isChecked}
                  onChange={() => handleCheckboxState(checkbox.id)}
                  >
                  </input>
                  {checkbox.name}
                </label>
              ))}
            </div>
          </div>
          }
          {userRole === "Admin" && (
            <div className="down-section">
              {contextHolder}
            <>
              <button
                className="fetchAndSync-button"
                onClick={() => FetchAllEventsFromGoogleAndSync()}
                disabled={isFetchAndSync}
              > 
                {!isFetchAndSync ? "Fetch And Sync" : "Fetching..."}
              </button>
            </>
          </div>  
          )}
          </div>
      ) : (
        <main className="app-main">
          <div className="left-section">
            <p className="left-text">
              "Streamline your studies with our university course scheduling
              program - never miss a class again!"
            </p>
            <button className="orange-button" onClick={handleJoinFree}>
              Join Free
            </button>
          </div>
          <div className="right-section">
            <img src={girl} alt="placeholder" />
          </div>
        </main>
      )}
    </div>
  );
};

export default MainPage;