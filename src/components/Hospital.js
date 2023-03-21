import React, { Component } from 'react';
import ReactDOM from "react-dom";
import './Admin.css';
import './List.css';
import Web3 from "web3";
import Blood from '../abis/Blood.json';
class Hospital extends Component {
    constructor(props) {
    super(props)
    this.state = {show: false,
      filter: '',
      cty: '',
      id:'',
      h_name:'',
      h_number:'',
      newuser_name:'',
      date:'',
      newuser_number:'',
      newuser_email:'',
      amount_blood:'',
      city:'',
      blood:{},
      account:'',

    }

  }
    async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
    async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  async loadBlockchainData() {
    let _this = this;
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Blood.networks[networkId]
    if(networkData) {
      const blood = new web3.eth.Contract(Blood.abi, networkData.address)
      _this.setState({blood: blood })
    }
  }
  
    useBag(newThis) {
    newThis.state.blood.methods.useBag(newThis.state.id ,
      newThis.state.h_name 
    ,newThis.state.h_number
    ,newThis.state.newuser_name
    ,newThis.state.newuser_number
    ,newThis.state.date
    ,newThis.state.newuser_email
    ,newThis.state.amount_blood
    ,newThis.state.city).send({ from: this.state.account})
   .on('confirmation', (reciept) => {
    this.setState({ loading: false })
    window.location.reload()
  })
  }

  showModal = () => {
    console.log("here")
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  changeFilter = (type1, type2) => {
    this.setState({ filter: type1, cty: type2})
  }
  render() {
        const acc_type = this.state.acc_type;
    let dothis;

    // console.log(this.state.h_name);
    console.log(this.state.date);
    return (
      <div id="content" style={{ justifyContent: 'center', width: '100%' }}>
        <h1 className="head">Welcome <strong>{this.props.usertype[this.props.account].name}.</strong></h1>
        <br />
        <h4 style={{ justifyContent: 'center' }}>Your Current Inventory</h4>
        {/* <form onSubmit={(event) => {
          event.preventDefault()
        }}>> */}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Blood Group</th>
                <th scope="col">Expiry</th>
                <th scope="col">Usage Status</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.sort((a, b) => b.expiry - a.expiry).reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner === this.props.account) {
                  let a = bag.id.toNumber()
                  console.log(a)
                  const expiry = (new Date(bag.expiry * 1000))
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{bag.owner_name} <br /> {bag.bank} </td>
                      <td>{bag.blood_group}</td>
                      <td>{expiry.toString().slice(0,15)}</td>
                      <th scope="row">
                    <button className="btn btn-primary float-right" 
                    name={bag.id.toNumber()}
                 disabled={bag.expired || expiry.toJSON().slice(0,10) < new Date().toJSON().slice(0,10) ? true : bag.used ? true : false}
                    style={{backgroundColor: 'green', display: 'flex', justifyContent: 'right', marginBottom: 10}}
                    type="button" onMouseOver={(event) => {
                           this.setState({id:event.target.name});
                         }} onClick={this.showModal}>
{(bag.expired || expiry < new Date().toJSON().slice(0,10)) ? "Bag Expired" : (bag.used ? "Bag used" : "Mark bag as used")}
        </button>
                      </th>
                    </tr>
                  )
                }
                // <button
                //           name={bag.id.toNumber()}
                //           className="btn btn-primary"
                //           disabled={bag.expired || expiry.toJSON().slice(0,10) < new Date().toJSON().slice(0,10) ? true : bag.used ? true : false}
                //           onClick={(event) => {
                //             this.props.useBag(event.target.name);
                //           }}>{(bag.expired || expiry < new Date().toJSON().slice(0,10)) ? "Bag Expired" : (bag.used ? "Bag used" : "Mark bag as used")}</button>
              })}
            </tbody>
          </table>
      <p>&nbsp;</p>
        
        <List prs = {this.props} show={this.state.show} _this={this} 
handleClose={this.hideModal} 
         filter={this.state.filter} cty={this.state.cty}
         changeFilter={this.changeFilter}>
        </List>
        <h4 style={{ justifyContent: 'center' }}>Available blood bags
        </h4>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Collector Bank's (Name and Address)</th>
                <th scope="col">Current Owner's Name and Address</th>
                <th scope="col">Blood Group</th>
                <th scope="col">City</th>
                <th scope="col">Expiry</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody id="Options list">
              {this.props.bags.sort((a, b) => b.expiry - a.expiry).reverse().slice(0, 10).map((bag, key) => {
                if (bag.owner !== this.props.account && bag.used !== true && 
                  (!bag.expired && (new Date(bag.expiry * 1000).toJSON().slice(0,10)) >= new Date().toJSON().slice(0,10))) 
                  {
                  let a = bag.id.toNumber()
                  console.log(a)
                  console.log(bag.expiry,"expiry")
                  const expiry = (new Date(bag.expiry * 1000)).toString()
                  return (
                    <tr key={key}>
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{this.props.usertype[bag.bank].name} <br /> {bag.bank} </td>
                      <td>{this.props.usertype[bag.owner].name} <br /> {bag.owner} </td>
                      <td>{bag.blood_group}</td>
                      <td>{bag.city.charAt(0).toUpperCase() + bag.city.slice(1)}</td>
                      <td>{expiry.slice(0,15)}</td>
                      <th scope="row">
                        <button
                          name={bag.id.toNumber()}
                          className="btn btn-primary"
                          onClick={(event) => {
                            this.props.h_placeOrder(event.target.name)
                          }}>Order Blood</button></th>
                    </tr>
                  )
                }
              })}
            </tbody>
          </table>
        {/* </form> */}
      </div>
    );
  }
}

const List = ({ handleClose, show, prs, filter, cty, changeFilter , _this , }) => {
  const showHideClassname = show ? "modal display-block" : "modal display-none";
  var i = 0
  return (
      <div  className={showHideClassname}>
      <section className="modal-main">
      <p>&nbsp;</p>
      <div>
      <form class='form-inline' onSubmit={(event) => {
          event.preventDefault()
                //             this.props.useBag(event.target.name);
        //                             //           name={bag.id.toNumber()}

        //             onClick={(event) => {
                //             this.props.useBag(event.target.name);
                //           }}>
          const type1 = event.target[0].value
          const type2 = event.target[1].value
          changeFilter(type1, type2.toLowerCase())
        }}>
              <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              className="form-control"
              name="h_name"
              disabled
               value={_this.props.usertype[_this.props.account].name}
              onChange= {(e)=>_this.setState({h_name:e.target.value})}
              placeholder="Hospital Name" 
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              className="form-control"
              name="h_number"
              onChange= {(e)=>_this.setState({h_number:e.target.value})}
              placeholder="Hospital contact number" 
               required/> 
          </div>
              <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              name="newuser_number"
              className="form-control"
              onChange= {(e)=>_this.setState({newuser_name:e.target.value})}
              placeholder="User Name" 
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              name="newuser_number"
              className="form-control"
              placeholder="User Number" 
                  onChange= {(e)=>_this.setState({newuser_number:e.target.value})}
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="email"
              name="newuser_email"
              className="form-control"
              placeholder="User Email" 
              onChange={(e)=>_this.setState({newuser_email:e.target.value})}
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="date"
              name="amount_blood"
              className="form-control"
              onChange={(e)=>_this.setState({date:e.target.value})}
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              name="amount_blood"
              className="form-control"
              placeholder="Blood amount" 
              onChange={(e)=>_this.setState({amount_blood:e.target.value})}
               required/> 
          </div>
          <div className="form-group py-2 px-5">
            <input 
              id="bloodtype"
              type="text"
              className="form-control"
              name="city"
                  onChange={(e)=>_this.setState({city:e.target.value})}
              placeholder="City" 
               required/> 
          </div>
          <button type="submit" onClick={()=>_this.useBag(_this)} className="btn btn-primary mx-5">Submit Details</button>
        </form>
        </div>
    <button className="btn btn-primary" 
          style={{margin:'auto', display: 'block',backgroundColor: 'red', display: 'flex', justifyContent: 'center'}}
           onClick={handleClose}>close</button>
          <br/>
              <br/>
          <br/>
      </section>
      </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);

export default Hospital;
