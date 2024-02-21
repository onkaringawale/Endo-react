
import UserLogo from '../Images/UserImage.svg';
import Hexagon from '../Images/Hexagon.svg';
import LogOut from '../Images/LogOut.png';
import Home from '../Images/G2.svg';

const Header = () => {
  return (
    <div className="ContentDivs" >
    <header className="App-header">
      <div className="headDiv">
        <div className="WelcomeDiv">
          <img src={Hexagon} alt="" /><span>Endorsement plugin DEV</span>
        </div>
        <div className='headerImg' style={{}}>
        <img src={Home} alt='' className='homeImg' />
        <div className="UserDiv">
          <img src={UserLogo} alt="user" />
          <div className='userName'>
            <div>Welcome AABOT145</div>
            <div>AABOT145</div>

          </div>
          <div className="LogOut">
            <button type="button" >Logout <img src={LogOut} alt="" /></button>
          </div>
        </div>
        </div>
      </div>
    </header>

  </div>
  )
}

export default Header
