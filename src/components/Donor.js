import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import Blood from '../abis/Blood.json';
import './Admin.css';
import './Donor.scss';
import Parser from 'html-react-parser';
import {ReactNotifications } from 'react-notifications-component'
import {store} from 'react-notifications-component'
import 'animate.css/animate.css'
import 'react-notifications-component/dist/theme.css'
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
class Donor extends Component {  
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
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    const address = accounts.toString()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Blood.networks[networkId]
    if(networkData , address) {
      const blood = new web3.eth.Contract(Blood.abi, networkData.address)
      this.setState({blood: blood })
      const userCount = await blood.methods.donorD1(address).call()
      const newuser = userCount.hospital_number
      const userNumber = userCount.newuserNumber
      const UserNum = BigNumber(userNumber)
      const StrUserNum = UserNum.toString()
      const hospitalNumber = BigNumber(newuser)
      const string = hospitalNumber.toString()
      this.setState({ h_number: string})
      this.setState({ newuser_name: userCount.newuser_name})
      this.setState({ date: userCount.date })
      this.setState({ newuser_number: StrUserNum})
      this.setState({ newuser_email: userCount.newuser_email })
      this.setState({ amount_blood: userCount.amountBlood})
      this.setState({ city: userCount.city })
    }
  }


  render() {
    return (
      <div id="content" style={{justifyContent:'center', width:'100%'}}>

        <div>
        <ReactNotifications/>
        {console.log(this.props.notification," see")}
        {this.props.notification.map((bag, key) => {
          console.log(bag.toString()," bag")
          var use = bag.toString()
          console.log(use)
          store.addNotification({
            title: "Congratulations!",
            message: "Your blood bag no: " + use + " has been used. Thank you for donating",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        })}
      </div>
        <h1 className="head">Welcome <strong>{this.props.usertype[this.props.account].name}.</strong></h1>
        <p>&nbsp;</p>
        <h3 >Your BloodBags</h3>
        <br/>
            { this.props.bloodbags.reverse().slice(0,10).map((bag, key) => {
              const expiry = (new Date(bag.expiry * 1000)).toJSON().slice(0,10)
              const trig = '<h4 > Bag ID :- ' + (bag.id).toString() + ' <h4> <h6>click to view details</h6>'
              if (bag.donor === this.props.account){
              return(
                <Collapsible 
                triggerStyle={{ background: 'darkgray' }}
                triggerClassName="CustomTriggerCSS"
                triggerOpenedClassName="CustomTriggerCSS--open"
                contentOuterClassName="CustomOuterContentCSS"
                contentInnerClassName="CustomInnerContentCSS"
                transitionTime={400} easing={'cubic-bezier(0.175, 0.885, 0.32, 2.275)'} trigger={Parser(trig)}>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th  scope="col">Collector Bank</th>
                      <th  scope="col">Collector Hospital</th>
                      <th scope="col">Collector Hospital Number</th>
                      <th scope="col">Blood Group</th>
                      <th scope="col">Expiry Status</th>
                      <th scope="col">Usage Status</th>
                    </tr>
                  </thead>
          
                  <tbody id="Blood bag list">
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{this.props.usertype[bag.bank].name} <br /> {bag.bank}<small></small> </td>
                      <td>{this.props.usertype[bag.owner].name} <br /> {bag.owner} <small></small> </td>
                      <td>{this.state.h_number}</td>
                      <td>{bag.blood_group}</td>
                      <td>{bag.expired ? "true" : expiry < new Date().toJSON().slice(0,10) ? "true" : "false"}</td>
                      <td>{bag.used.toString()}</td>
                  </tbody>
                </table>
                                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Donee Name</th>
                      <th scope="col">Donee Number</th>
                      <th scope="col">Donee Email</th>
                      <th scope="col">Donee Address</th>
                      <th scope="col">Date</th>
                      <th scope="col">Blood Amount</th>
                    </tr>
                  </thead>
          
                  <tbody id="Blood bag list">
                      <th scope="row">{bag.id.toString()}</th>
                      <td>{this.state.newuser_name} </td>
                      <td>{this.state.newuser_number} </td>
                      <td>{this.state.newuser_email} </td>
                      <td>{this.state.city} </td>
                      <td>{this.state.date} </td>
                      <td>{this.state.amount_blood}</td>
                  </tbody>
                </table>
                </Collapsible>
              )
              }
            })} 
      </div>
      
    );
  }
}

export default Donor;
