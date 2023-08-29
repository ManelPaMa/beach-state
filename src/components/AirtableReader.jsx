import React, { useEffect, useRef, useState } from 'react';
import AirtableConnection from '../database/Airtable';
import '../stylesheets/AirtableReader.css'
import { AiOutlineSend } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";

function AirtableReader() {

  // defalut messages
  const message1 =     
  <p>
    Do you want to see beaches states in Maresme? Write <strong>'yes'</strong> to see the full list or write a <strong>city</strong> or <strong>flag colour</strong> to filter the data:
  </p>

  const message2 = 
  <p>
    Here you have the information, now you can specify a <strong>city</strong> or <strong>flag colour</strong> to see the filtered data, you can also write <strong>yes</strong> to see the whole list or <strong>reset</strong> to clear the screen:
  </p>

  const message3= 
  <p>
    <strong>Welcome to beach state page</strong>
  </p>
  const message4= ": ";

  const airtableConnection = new AirtableConnection();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([
    <div>
          {message3}
          {message1}
          <br />
        </div>
  ]);

  const [filteredData, setFilteredData] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Reset command function
    if (userInput.toLowerCase() === "reset") {
      setConversation([
        <div>
          {message3}
          {message1}
          <br />
        </div>
      ]);
      setUserInput("");
      return;
    }
  // Yes = show all beavhes - No = no show anithing
  if (userInput.toLowerCase() === 'yes' || userInput.toLowerCase() === 'no') {
      try {
        const base = airtableConnection.base()
        const dataJSON = await airtableConnection.getBeaches(base);
        const data = JSON.parse(dataJSON);
        console.log(data)

        const itemsText = data.map((item) => (
        <div key={item.id}>
          <p><strong>Name:</strong> {item.name} <strong>City:</strong> {item.city} <strong>Flag:</strong> {item.flag}</p>
          <br />
        </div>
        ));
        setFilteredData(null);
        setConversation((prevConversation) => [
          ...prevConversation,
          <div className="userField">
          <hr />
          <div style={{ marginTop: "5px" }}></div>
          <AiOutlineUser />
          {message4 +
          userInput}  
          </div>,
           <hr />,
           <div style={{ marginTop: "10px" }}></div>,
           <p>{itemsText}</p>,
             <p>{message2}</p>,
           <br />
        ]);
      } catch (error) {
        setConversation((prevConversation) => [
          ...prevConversation,
          'Error fetching data from Airtable', 
        <br/>,
        <br/>,
        <hr/>,
        <div style={{ marginTop: "10px" }}>
          {message2}
        </div>,
        <br/>
      ]);
      }
    } else if (filteredData) {
      // Filter the information by city or flag
      const filteredItems = filteredData.filter((item) =>
      Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(userInput.toLowerCase())
    )
  );

      if (filteredItems.length > 0) {
        const filteredText = filteredItems.map((item) => (
          <div>
              <p><strong>Name:</strong> {item.name} <strong>City:</strong> {item.city} <strong>Flag: </strong>{item.flag}</p>
            <br />
          </div>
        ));
              //message to continue action  
              setConversation((prevConversation) => [
                ...prevConversation,
                <div className="userField">
                <hr/>
                <div style={{ marginTop: "5px" }}></div>
                <AiOutlineUser />
                {message4 +
                userInput}  
                </div>,
                <hr/>,
                <div style={{ marginTop: "10px" }}></div>,
                <b><p>You search all beaches with {userInput} value</p></b>,
                <br />,
                <p>{filteredText}</p>,
                <p>{message2}</p>,
                <br />
      
              ]);
          } else {
            // message when it does not find the filter received inside the api
            setConversation((prevConversation) => [
              ...prevConversation,
              <div className="userField">
                <hr />
                <div style={{ marginTop: "5px" }}></div>
                <AiOutlineUser />
                {message4 +
                userInput}  
                </div>,
                <hr />,
                <div style={{ marginTop: "10px" }}></div>,
              'No matching data found, please write other option.',
              <br/>,
                <p>{message2}</p>,
              <br />
            ]);
      
          }
          } else {
            //Message with bad information
            setConversation((prevConversation) => [
              ...prevConversation,
              <div className="userField">
                <hr />
                <div style={{ marginTop: "5px" }}></div>
                <AiOutlineUser />
                {message4 +
                userInput}  
                </div>,
                <hr />,
                <div style={{ marginTop: "10px" }}></div>,
              'Please answer the question with one valid option.',
              <br/>,
                {message2},
              <br />
            ]);
          }
      
          setUserInput(''); // Clean the input
        };


  useEffect(() => {
    
    inputRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);


  useEffect(() => {
    if (filteredData === null) {
      fetchFilteredData();
    }
  }, [filteredData]);

    //Contection filtered data
    const fetchFilteredData = async () => {
      try {
        const base = airtableConnection.base()
        const dataJSON = await airtableConnection.getBeaches(base);
        const data = JSON.parse(dataJSON);
        setFilteredData(data);
      } catch (error) {
        setConversation((prevConversation) => [
          ...prevConversation,
          'Error fetching data from Airtable',
          <br/>
        ]);
      }
    };



  return (
    <div className="chat-container">
      <div className="messages">
        {conversation}
        <div ref={inputRef}></div>
      </div>
        <form onSubmit={handleSubmit} className="input-container">
          <div className="input-wrapper">
            <input type="text" value={userInput} className="user-input" onChange={handleInputChange} placeholder="Write here..."/>
            <button type="submit" className="send-button"><AiOutlineSend /></button>
          </div>
        </form>
    </div>
  );
}

export default AirtableReader;