import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";


const EditModal = ({show,handleClose,count,setCount,editData,setEditData,setLoading}) => {

  const handleEditData = (e)=>{
    const {name,value}=e.target;
    setEditData((previousData)=>({...previousData,[name]:value}))
    console.log(editData)
  }

 

     // update details
  let updateData = () => {debugger;
    setLoading(true)
    let newCount =count
    const updateData = {
      method:"PUT",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify(editData)
    }
    fetch('http://localhost:7071/api/updatePluginData',updateData)
    .then((resp)=> resp.json())
    .then(data =>{
    console.log(data)
    newCount++;
    setCount(newCount)
    })
    .catch(err => console.log(err))
  };
  return (
    <Modal
    show={show}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
    centered
  >
   <Modal.Header className="editModalHeader">
      <div>
      <h2  className='Modal_title'>Edit Blurb Details</h2>
      </div>
      <button type="button" aria-label="Close" className="modalCloseButton" onClick={handleClose}>X</button>
    </Modal.Header>
    <Modal.Body>
      <Form>

      <Table className="editPopupTable">
          <tbody>
            <tr>
                <td> <Form.Label>Title</Form.Label></td>
                <td>  <Form.Control
                      name="title"
                      type="text"
                      autoComplete='off'
                      value={editData.title}
                      onChange={(e) => handleEditData(e)}
                /></td>
            </tr>
            <tr>
                <td> <Form.Label>Page URL</Form.Label></td>
                <td> <Form.Control
                  type="text"
                  name="page_url"
                  autoComplete='off'
                  value={editData.page_url}
                  onChange={(e) =>handleEditData(e)
                  }
                /></td>
            </tr>
            <tr>
                <td> <Form.Label>Page Name</Form.Label></td>
                <td> <Form.Control
                      name="page_name"
                      type="text"
                      autoComplete='off'
                      value={editData.page_name}
                      onChange={(e) => handleEditData(e)}
                    /></td>
            </tr>
            <tr>
                <td><Form.Label>Label</Form.Label></td>
                <td> <Form.Control
                      name="rules"
                      type="text"
                      autoComplete='off'
                      value={editData.rules}
                      onChange={(e) => handleEditData(e)}
                    /></td>
            </tr>
            <tr>
             
                <td> <Form.Label>Blurb Content</Form.Label></td>
                <td>  <Form.Control
                      name="blurb_content"
                      type="text"
                      value={editData.blurb_content}
                      onChange={(e) => handleEditData(e)}
                    /></td>
           
            </tr>
          </tbody>
        </Table>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="success"
        onClick={() => {
          updateData();
          handleClose();
        }}
      >
        Update
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default EditModal
