import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import sidecard from '../Images/sideCard.svg'

const Cards = ({handleEdit,handleShow,apiData,setapiData,setAddNEw,handledeletePopupShow,count,setdeleteId,setLoading, loading}) => {
 
  useEffect(() => {
    fetch("http://localhost:7071/api/getPluginData")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setapiData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err)
        setLoading(false);
      })
  }, [count]);


  return (
    <div className="buttonAndCards">
        <div>
        <Button
          variant="primary"
          className="addBlurb"
          onClick={() => {
            handleShow();
            setAddNEw(true);
          }}
        >
          <i className="fa-solid fa-plus"></i>  Add Blurb
        </Button>
          
        </div>
        <div>
          {apiData.length === 0 ? <></> : <>
              
            {apiData && apiData.length > 0 ? (

              <ul className="cardContainer">
                {apiData.map((obj,index) => (
                  <>
                  <li className="li" key={obj._id}>
                    <div className="titleContainer">
                      <div className="cardTitle">
                        <img src={sidecard} alt="" className="sidecardImg" />
                        <p className="card-title">{obj.title}</p>
                      </div>

                      <div className="buttons">
                        <button style={{all:'unset'}}
                         onClick={() => {
                            handleShow();
                            setAddNEw(false);
                            handleEdit(obj.rule_id);
                          }}>
                        <i className="fa-solid fa-pencil editBtn"></i>
                        </button>
                       
                        <button style={{all:'unset'}}  
                        onClick={() => { handledeletePopupShow();setdeleteId(obj.rule_id) }}>
                        <i className="fa-solid fa-trash-can deleteBtn"></i>
                        </button>
                       
                      </div>
                    </div>

                    <table>
                      <thead>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="contentTitle">
                            URL <span>:</span>
                          </td>
                          <td className="contentData"><a href={obj.page_url}>{obj.page_url}</a></td>
                        </tr>
                        <tr>
                          <td className="contentTitle">
                            Page Name <span>:</span>
                          </td>
                          <td className="contentData">{obj.page_name}</td>
                        </tr>
                        <tr>
                          <td className="contentTitle">
                            Label <span>:</span>
                          </td>
                          <td className="contentData">{obj.rules}</td>
                        </tr>
                        <tr>
                          <td className="contentTitle">
                            Blurb Content <span>:</span>
                          </td>
                          <td className="contentData">
                            <div className="contentDataBrb">{obj.blurb_content}</div>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot></tfoot>
                    </table>
                 
                  </li>
            
                  </> 
                ))}
              </ul>
            ) : (
              <></>
            )}
          </>}
        </div>

      </div>
  );
};

export default Cards;
