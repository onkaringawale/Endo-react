import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useState } from "react";


const AddModel = ({show,handleClose,count,setCount,setLoading}) => {
    let randomID = Math.floor(Math.random() * 200);

    const [newData, setNewData] = useState({
      rule_id: randomID,
      title: "",
      page_name: "",
      page_url: "",
      rules: "",
      blurb_content: ""
    });

  // add new data

  // add new data

  const addNewData = () => {
    let newCount =count
    setLoading(true);
    const requestOptions={
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify(newData)
    }

    fetch('http://localhost:7071/api/insertPluginData',requestOptions)
    .then(response =>  response.json())
    .then(data =>{
      console.log(data);
       newCount++;
       setCount(newCount)
       })
    .catch(err => console.log(err))

  };

  return (
    <Modal
    size="md"
    show={show}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
    centered
  >
    <Modal.Header className="addModalHeader">
      <div>
      <h2  className='Modal_title'>Enter Blurb Details</h2>
      </div>
      <button type="button" aria-label="Close" className="modalCloseButton" onClick={handleClose}>X</button>
    </Modal.Header>
    <Modal.Body>

      <Form>
        <Table className="addPopupTable">
          <tbody>
            <tr>
                <td> <Form.Label>Title</Form.Label></td>
                <td><Form.Control
                  type="text"
                  autoComplete='off'
                  onChange={(e) =>
                    setNewData((item) => ({ ...item, title: e.target.value }))
                  }
                /></td>
            </tr>
            <tr>
                <td> <Form.Label>Page URL</Form.Label></td>
                <td> <Form.Control
                  type="text"
                  autoComplete='off'
                  onChange={(e) =>
                    setNewData((item) => ({
                      ...item,
                      page_url: e.target.value
                    }))
                  }
                /></td>
            </tr>
            <tr>
                <td> <Form.Label>Page Name</Form.Label></td>
                <td><Form.Control
                  type="text"
                  autoComplete='off'
                  onChange={(e) =>
                    setNewData((item) => ({
                      ...item,
                      page_name: e.target.value
                    }))
                  }
                /></td>
            </tr>
            <tr>
                <td><Form.Label>Label</Form.Label></td>
                <td><Form.Control
                  type="text"
                  autoComplete='off'
                  onChange={(e) =>
                    setNewData((item) => ({ ...item, rules: e.target.value }))
                  }
                /></td>
            </tr>
            <tr>
             
                <td> <Form.Label>Blurb Content</Form.Label></td>
                <td> <Form.Control
                  type="text"
                  autoComplete='off'
                  onChange={(e) =>
                    setNewData((item) => ({
                      ...item,
                      blurb_content: e.target.value
                    }))
                  }
                /></td>
           
            </tr>
          </tbody>
        </Table>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="success" onClick={() => { addNewData(); handleClose() }}>
        Save
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default AddModel
