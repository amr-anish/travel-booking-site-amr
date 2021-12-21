import React, { Component } from 'react';
import axios from 'axios';
import { backendUrlUser } from '../BackendURL';





import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';

import { Dialog } from 'primereact/dialog'



const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })




class ViewBooking extends Component {
    constructor() {
        super();
        this.state = {
            bookingData: [],
            errorMessage: "",
            index: "",
            userid: sessionStorage.getItem("userId"),
            username: sessionStorage.getItem("userName"),
            createcard: false,
            successMessage: "",

            formErrorMessage: "",
            oldWallet: sessionStorage.getItem("wallet"),
            newWallet: 0



        }
    }


    componentDidMount() {
        if (this.state.userid != null) {
            this.packages()
        } else {
            this.setState({ formErrorMessage: "Please Login to View you Planned Trips" })

        }

    }
    packages = () => {
        axios.get(backendUrlUser + '/getbooking')
            .then(response => {
                let data = response.data
                this.setState({ bookingData: data })
                this.setState({ createcard: true })
                //console.log(this.state.bookingData);


                ////console.log(this.state.userid,this.state.username);
            })
            .catch(error => {
                this.setState({ formErrorMessage: error.message })
            })
        // //console.log(response);
    }


    deleteBooking = (id, refund) => {
        //  //console.log("Inside Delete ",id,refund (0.4))
        //this.setState({newWallet:(refund*100)+this.state.oldWallet})
        this.updatewallet(Number(this.state.oldWallet) + Number((refund * 40) / 100))
        console.log(Number(this.state.oldWallet) + Number((refund * 40) / 100))


        axios.delete(backendUrlUser + '/deletebooking/' + id)
            .then(response => {
                this.setState({ successMessage: "Booking cancelled-Refund will be added to Wallet", errorMessage: "" });

                setTimeout(() => {
                    this.packages();
                    this.setState({ successMessage: "", errorMessage: "" })
                }, 3000)
            }).catch(error => this.setState({ errorMessage: error.response.data.message, successMessage: "" })
            );


    }

    updatewallet = (refund) => {
        console.log(refund)
        let wallet_data = {
            userId: sessionStorage.getItem('userId'),
            amount: Number(refund)

        }
        axios.post(backendUrlUser + '/updatewallet', wallet_data)
            .then(response => {
                sessionStorage.setItem('wallet', refund)
            }).catch(error => {
                console.log(error);
            })
    }



    createcard = () => {


        let arr = [];
        let singlePackage = this.state.bookingData;
        singlePackage.filter((items) => {


            if (items["userId"] === sessionStorage.getItem("userId")) {
                arr.push(
                    <div className="container ">

                        <div className="column">

                            <div className="col-md-3 col-sm-6 viewitem">
                                <div className="viewcard viewitem-card card-block">
                                    <h4 className="viewcard-title text-right"></h4>



                                    <img className="viewimg" src="../assets/tticket.png" alt="destination will be there " />
                                    <h5 className="viewitem-card-title mt-3 mb-3">{items["destinationName"]}</h5>
                                    <div className="badge badge-info"><FaPlaneArrival />{"checkInDate : " + items["checkInDate"]}<em></em></div><br />
                                    <div className="badge badge-info"><FaPlaneDeparture />{"checkOutDate : " + items["checkOutDate"]}<em> </em></div><br />
                                    <br />
                                    <h5 className="text-dark mb-0"><HiUserGroup />{"Total Number of Persons " + items["noOfPersons"]}</h5>
                                    <div >
                                        <h4>  Total Charges </h4>
                                        <div className="text-center text-success"><h4>{formatter.format(items["totalCharges"])}</h4></div><br />

                                        <button className="btn btn-danger book " onClick={() => { this.deleteBooking(items["bookingId"], items["totalCharges"]) }}><MdCancel />Refund</button> <br /><br />
                                    </div>




                                </div></div> </div>

                    </div>

                )
            }
        }
        )
        return arr;
    }


    render() {
        //const singlePackage =  this.state.bookingData;
        // //console.log(this.createcard)

        return (
            <div className="viewbook" >
                <div>
                    <h3>  <span className="text-danger  ">{this.state.formErrorMessage}</span></h3>
                    <span className="text-danger dangerlabel">{this.state.errorMessage}</span>
                    <Dialog header="cancellation" visible={this.state.successMessage} >{this.state.successMessage}</Dialog>





                    {/* <h3> <span className="alert-success">{this.state.successMessage}</span></h3>    */}


                    <div>
                        <div>
                            {
                                this.state.createcard ?
                                    (
                                        <div className="vg" >
                                            {this.createcard()}
                                        </div>
                                    ) : null
                            }
                        </div>
                    </div>





                </div>
            </div>
        )
    }

}

export default ViewBooking;