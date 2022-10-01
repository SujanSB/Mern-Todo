import React, { useState, useEffect } from "react";

import axios from "axios";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

function Home() {
  const [task, setTask] = useState([]);

  const [newtask, setNewTask] = useState('');
  const [newsubtask, setNewSubTask] = useState('');

  // const[refresh,setRefresh]=useState(false)

  const getAllTask=()=>{
    axios
    .get(`http://localhost:8080/api/task/alltask`)
    // .then((res) => res.json())
    .then((data) => {
      // console.log("k aayo?", data.data);
      setTask(data.data);
    });
  }

  useEffect(() => {
    getAllTask()
  }, [newtask,newsubtask]);


const handleTaskAdd=()=>{
    if(newtask !== "" || newtask !== null){

        axios.post(`http://localhost:8080/api/task/add`,{title:newtask}).then(res=>{
            setNewTask('')
            console.log(res)
        }).catch(err=>console.log(err))
    }
}
const handleSubTaskAdd=(task_id)=>{
    if(newsubtask !== "" || newsubtask !== null){

        axios.post(`http://localhost:8080/api/task/addsubtask`,{title:newsubtask,subtaskOf:task_id}).then(res=>{
            setNewSubTask('')
            console.log(res)
        }).catch(err=>console.log(err))
    }
}




  const handleChange = (e, id) => {

    const currentstatus = e.target.checked;
    axios
      .put(`http://localhost:8080/api/task/${id}`, {
        status: currentstatus === true ? "complete" : "pending",
      })
      .then((data) => {
        getAllTask()
        console.log(data);
      });
     

  };
  const handleSubChange = (e, id) => {
    const currentsubstatus = e.target.checked;
    axios
    .put(`http://localhost:8080/api/task/subtask/${id}`, {
      status: currentsubstatus === true ? "complete" : "pending",
    })
    .then((data) => {
      // window.location.reload()
      getAllTask()
      console.log(data);
    });
  };
//NOTE :
// you need to refresh the browser if all the subtask are completed and want checked on title of main task

  return (
    <div className="relative shadow-lg p-2 bg-white my-12 m-auto md:w-[500px] flex flex-col text-center">
      <div className="bg-white p-3">
        <div className="text-3xl font-poppins text-center">
          <p>TO-DO App</p>
        </div>
        <div className="flex flex-row mt-8 justify-center ">
          <input
            
            type="text"
            value={newtask}
            onChange={e=>setNewTask(e.target.value)}
            className="appearance-none rounded relative block w-8/12 p-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="What to do?"
          />
          <button className="p-3 bg-cyan-500 rounded-md ml-4" onClick={()=>handleTaskAdd()}>New List</button>
        </div>
      </div>
      <Accordion allowZeroExpanded={true}>
        {task.map((each) => {
            let sum = 0;

            each.subtasks.forEach((element) => {
              if( element.status=== "complete" ){
                 sum += 1;
              } 
             
            });
          return (
            <AccordionItem key={each._id} className="border-2 border-gray-700 my-1  text-poppins">
              <AccordionItemHeading>
                <AccordionItemButton className="visibility-0 py-4 text-left text-2lg flex flex-row relative">
                  <input
                    type="checkbox"
                    className="mx-3 text-lg" 
                    style={{ 
                      width: "22px",
                      height: "22px"
                    }}
                    defaultChecked={(each.status == "complete" || sum === each.subtasks.length) ? true : false }
                    onChange={(e) => handleChange(e, each._id)}
                  />

                      <p className="capitalize  ">{each.title} <span className="absolute right-4 bottom-0 text-right text-gray-400">{sum} out of {each.subtasks.length} <i className="fa fa-angle-down"/></span> </p>
                
                  
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                {each.subtasks.map((eachsub) => {
                  return (
                    <div key={eachsub._id} className="flex flex-row px-3 py-2 border-2 border-gray my-1">
                      <input
                        type="checkbox"
                        className="mx-3"
                        defaultChecked={
                          eachsub.status == "complete" ? true : false
                        }
                        onChange={(e) => handleSubChange(e, eachsub._id)}
                      />
                      <p className="capitalize text-poppins">{eachsub.title}</p>
                    </div>
                  );
                })}
                <div className="flex flex-row mt-2 justify-center ">
          <input
            
            type="text"
            value={newsubtask}
            onChange={e=>setNewSubTask(e.target.value)}
            className="appearance-none rounded relative block w-8/12 p-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="What are the steps?"
          />
          <button className=" px-2 bg-white border-2 border-gray-700 rounded-md ml-4" onClick={()=>handleSubTaskAdd(each._id)}>New Step</button>
        </div>
              </AccordionItemPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default Home;
