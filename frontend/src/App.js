import { useState } from 'react';
import './App.css';
import AddModel from './componets/AddModel';
import Cards from './componets/Cards';
import EditModal from './componets/EditModal';
import Header from './componets/Header';
import Sidebar from './componets/Sidebar';
import DeleteModal from './componets/DeleteModal';
import LoaderComponent from './componets/reactLoader';

function App() {
  const [apiData, setapiData] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteId, setdeleteId] = useState('');
  let [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);

  const [addNew, setAddNEw] = useState(false);
  const [count, setCount] = useState(0)



  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handledeletePopupClose = () => setDeletePopup(false);
  const handledeletePopupShow = () => setDeletePopup(true);
 

  const [editData, setEditData] = useState({
    rule_id: '',
    title: "",
    page_name: "",
    page_url: "",
    rules: "",
    blurb_content: ""
  })
 // fetch edit details to form

 const handleEdit = (id) => {
  apiData.forEach((item) => {
    if (item.rule_id === id) {
       setEditData({
        rule_id: item.rule_id,
        title: item.title,
        page_name:item.page_name,
        page_url:item.page_url,
        rules: item.rules,
        blurb_content: item.blurb_content
      })

    }
  });
  
};

  return (
 <>
    <Header></Header>
    <Sidebar /> 

    <div className='mainBody'>
    <Cards handleEdit={handleEdit} handleShow={handleShow} apiData={apiData} setapiData={setapiData} setAddNEw={setAddNEw}
    handledeletePopupShow={handledeletePopupShow} count={count}  setdeleteId={setdeleteId} setLoading={setLoading} loading={loading}/>

    </div>
    {addNew ? (
        <AddModel show={show} handleClose={handleClose} count={count} setCount={setCount} setLoading={setLoading}/>
      ) : (
        <EditModal  show={show} handleClose={handleClose} count={count} setCount={setCount}
        editData={editData} setEditData={setEditData} setLoading={setLoading} />
        )}

      
      <DeleteModal deleteId={deleteId}   setdeleteId={setdeleteId} handledeletePopupClose={handledeletePopupClose}
      deletePopup={deletePopup} count={count} setCount={setCount} setLoading={setLoading}/>

        <div className="loaders">
        <LoaderComponent loading={loading} />

        </div>

        {/* code for  disable click when loader is in running */}
        {loading ? document.body.classList.add("pointerEvent"):document.body.classList.remove("pointerEvent") }
 </>
   
  );
}

export default App;
