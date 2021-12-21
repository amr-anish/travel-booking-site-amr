import React, { Component } from 'react';
import './App.css';
import { getwallet } from './components/wallet';
import { BrowserRouter as Router, Route, Switch, Link, } from "react-router-dom";
import Login from './components/login';
import Home from './components/home';
import TravelDetails from './components/travelDetails';
import Register from './components/register';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import HotPackage from './components/hotDeals';
import ViewBooking from './components/viewBooking';
import Booking from './components/booking';
import { CgLogIn, CgLogOut } from 'react-icons/cg';
import { FaAtlassian, FaUserCircle } from 'react-icons/fa';
import { GiDetour, GiWallet } from 'react-icons/gi';
import { GoPackage } from 'react-icons/go';
import { ImFire } from 'react-icons/im';
import { backendUrlUser } from './BackendURL';
import axios from "axios";
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { IoAddSharp } from 'react-icons/io5';
import TextField from '@material-ui/core/TextField';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

      logged_userId: sessionStorage.getItem("userId"),
      logged_userName: sessionStorage.getItem("userName"),
      dialog_visible: false,
      logged_out: false,
      wallet: sessionStorage.getItem("wallet"),
      walletDialog: false,
      Money: 0,
      update: 0,

      loginform: {
        userId: sessionStorage.getItem("userId"),

      }
    }
  }

  handleChange = (event) => {
    this.setState({ calculateState: false })
    const target = event.target;
    const name = target.name;
    let value = target.value;
    this.setState({
      [name]: value
    });
  }
  onClick = () => {
    this.setState({ dialog_visible: true });
  };
  addMoney = () => {
    this.setState({ walletDialog: true });
  };


  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.wallet != sessionStorage.getItem("wallet")) {
      this.setState({ wallet: sessionStorage.getItem("wallet") })
    }
  }


  addMoneyToWallet = async (e) => {
    e.preventDefault();
    this.onHide()    
    let wallet_data = {
      userId: this.state.logged_userId,
      amount: Number(this.state.Money) + Number(this.state.wallet)
    }
    await axios.post(backendUrlUser + '/updatewallet', wallet_data)
      .then(response => { }).catch(error => {
        console.log(error);
      })
    await getwallet()
    this.setState({ wallet: sessionStorage.getItem("wallet") })
  }

  onHide = () => {
    this.setState({ dialog_visible: false, walletDialog: false });
  };

  logout = () => {
    this.setState({ dialog_visible: false });
    sessionStorage.clear();
    this.setState({ logged_out: true });
    window.location.reload();
  };

  confirm_logout = () => {
    this.setState({ dialog_visible: true });
  };

  updateMoney = () => {
    this.setState({ wallet: sessionStorage.getItem("wallet") })
  }
  wallet_update = () => {
    this.setState({ update: this.state.update + 1 })
  }

  render() {
    return (
      <div>
        <Router>
          <div className="App">
            <nav className="navbar navbar-expand-md  navbar-dark"   >
              <div className="navbar-header">
                <Link className="navbar-brand" to="/"><FaAtlassian />Start Wandering</Link>
              </div>
              <ul className="navbar-nav ml-auto">
                {this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" to=""><FaUserCircle />
                      Welcome :
                      {this.state.logged_userName}
                    </Link>
                  </li>
                ) : null}
                {this.state.logged_userId ? (
                  <li className="nav-item nav-link">
                    <button style={{ padding: 0 }} className="btn nav-link " onClick={this.wallet_update} ><IoRefreshCircleOutline /> </button>
                  </li>
                ) : null}
                {this.state.logged_userId ? (
                  <li className="nav-item nav-link"><GiWallet />
                    Wallet :{this.state.wallet}$
                  </li>
                ) : null}
                {this.state.logged_userId ? (
                  <li className="nav-item nav-link">
                    <button style={{ padding: 0 }} className="btn nav-link  " onClick={this.addMoney} ><IoAddSharp /> </button>
                  </li>
                ) : null}
                <li className="nav-item">
                  <Link className="nav-link" to="/hotdeals"><ImFire />Hot Deals </Link>
                </li>

                {this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/viewbookings"><GiDetour />Planned Trips</Link>
                  </li>
                ) : null}

                <li className='nav-item'>
                  <Link className='nav-link' to='/packages'><GoPackage />Explore</Link>
                </li>

                {!this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      {" "}<CgLogIn />
                      Login
                    </Link>
                  </li>
                ) : null}
                {this.state.logged_userId ? (
                  <li className="nav-item">
                    <Link className="nav-link" onClick={this.confirm_logout} to="">
                      {" "}<CgLogOut />
                      Logout
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <Dialog
              header="Wallet"
              visible={this.state.walletDialog}
              style={{ width: "30vw" }}
              onHide={this.onHide}>
              <h5>Enter the Amount of Money you want to Add to Wallet</h5>
              <label>Amount : </label>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Money"
                type="number"
                id="Money"
                name="Money"
                value={this.state.Money}
                onChange={this.handleChange} />


              <Button label="Add" icon="pi pi-check" onClick={this.addMoneyToWallet} className="p-button-secondary" />{" "}
              <Button label="Cancel" icon="pi pi-times" onClick={this.onHide} />
            </Dialog>
            <Dialog
              header="Confirmation to logout:"
              visible={this.state.dialog_visible}
              // style={{width:"30vw"}}
              onHide={this.onHide}>
              <h5>Are you sure you want to logout</h5>
              <Button label="Logout" icon="pi pi-check" onClick={this.logout} className="p-button-secondary" />{" "}
              <Button label="Cancel" icon="pi pi-times" onClick={this.onHide} />
            </Dialog>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/home/:userId" component={Home}></Route>
              <Route exact path="/register" component={Register}></Route>
              <Route exact path="/packages" component={TravelDetails}></Route>
              <Route path="/search/:search" component={TravelDetails}></Route>{/* Destinations with search*/}
              <Route path='/hotdeals' component={HotPackage}></Route>
              <Route path='/viewbookings' component={ViewBooking}></Route>
              <Route path='/booking/:destId' component={Booking}></Route>

            </Switch>
          </div>
        </Router>
        <footer className="bg-black text-center text-white-50">
          Copyright &copy; ANISH M RAGHAVENDRA 2021
        </footer>
      </div>
    );
  }
}
export default App;
