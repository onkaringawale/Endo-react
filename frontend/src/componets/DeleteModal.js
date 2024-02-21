import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


const DeleteModal = ({deleteId,setdeleteId,handledeletePopupClose,deletePopup,count,setCount,setLoading}) => {

    const handleDelete = (id) => {
        setLoading(true)
        let newCount = count
          setdeleteId('')
    
        const deleteId={
          method:"DELETE",
          headers:{"Content-Type": "application/json"},
          body:JSON.stringify({"rule_id":id})
        }
    
        fetch('http://localhost:7071/api/deletePluginData',deleteId)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          newCount++;
          setCount(newCount)
        
        })
        .catch(err => console.log(err))
      }
    return (
        <div>

            <Modal
                className="modalMain"
                size="sm"
                show={deletePopup}
                onHide={handledeletePopupClose}
                backdrop="static"
                keyboard={false}
                centered >
                <Modal.Header className="deleteModalHeader">
                    <div></div>
                    <button type="button" aria-label="Close" className="modalCloseButton" onClick={handledeletePopupClose}>X</button>
                </Modal.Header>
                <Modal.Body style={{ padding: "20px 0px" }}>
                    <h2 class="deleteModelBody">Do You Want To Delete The Blurb?</h2>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { handleDelete(deleteId); handledeletePopupClose() }}>
                        Yes
                    </Button>
                    <Button onClick={() => { handledeletePopupClose(); setdeleteId('') }}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteModal;
