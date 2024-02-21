import Logo from '../Images/HanoverLogo.png'
const Sidebar = () => {
  return (
   <>
   <div className='mainDiv'>
            <div className="Sidebar">
        <div>
          <div className="Logo">
            <img src={Logo} alt="" />
          </div>
          <ul className="menu">
            <div id="temp" ><li>Endorsement</li></div>
          </ul>
        </div>
      </div>
      </div>
   </>
  )
}

export default Sidebar;