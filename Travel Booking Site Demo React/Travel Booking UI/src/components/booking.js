import React, { Component } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import axios from 'axios';
import { backendUrlUser } from '../BackendURL';
import { MdThumbDown } from 'react-icons/md';
import { FiCheckSquare } from 'react-icons/fi';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
class booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            noOfPer: Number(sessionStorage.getItem("noOfPer")),
            date: String(sessionStorage.getItem("checkInDate")),
            flights: Boolean(sessionStorage.getItem("flight")),
            charge: sessionStorage.getItem("Charge"),
            checkOut: "",
            destId: sessionStorage.getItem("destId"),
            dest: JSON.parse(sessionStorage.getItem("dest")),
            getSlotAvailability: {
                type: sessionStorage.getItem("type"),
                destId: sessionStorage.getItem("destId"),
            },
            bookformErrorMessage: {
                noOfPer: "",
                date: "",
            },
            bookformvalid: {
                noOfper: false,
                date: false,
                buttonActive: false
            },
            booking: {
                userId: "",
                destId: "",
                destinationName: "",
                checkInDate: "",
                checkOutDate: "",
                noOfPersons: 0,
                totalCharges: 0
            },

            destData: [],
            successMessage: "",
            errorMessage: "",
            calculateState: true,
            slotAvailabilityData: [],
            availableSlot: 0,
            updateAvailableSlots: {
                destId: "",
                slots: 0,
                type: "",
            },
            bookedData: [],
            oldWallet: Number(sessionStorage.getItem('wallet')),
            newWallet: 0
        }

    }


    getTheBookedData = () => {
        this.setState({successMessage:""})
        this.setState({errorMessage:""})
        axios.get(backendUrlUser + '/getbooking')
            .then(response => {
                let data = response.data
                this.setState({ bookedData: data })

                //  //console.log(this.state.bookedData);
                this.getSlotAvailability()




                ////console.log(this.state.userid,this.state.username);
            })
            .catch(error => {
                this.setState({ errorMessage: error.message })
            })
    }
    bookingTheDest = () => {
        //console.log("Booked ");
        let bookingFile = this.state.booking;
        ////console.log(sessionStorage)
        bookingFile.userId = sessionStorage.getItem('userId');
        bookingFile.destId = sessionStorage.getItem('destId');
        bookingFile.destinationName = this.state.dest.name;
        bookingFile.checkInDate = this.state.date;
        bookingFile.checkOutDate = this.state.checkOut;
        bookingFile.noOfPersons = this.state.noOfPer;
        bookingFile.totalCharges = this.state.charge;
        this.setState({ booking: bookingFile })
        // //console.log(this.state.booking)

        let slotsUpdatedData = this.state.updateAvailableSlots;
        slotsUpdatedData.destId = sessionStorage.getItem('destId');
        slotsUpdatedData.type = sessionStorage.getItem('type');
        slotsUpdatedData.slots = this.state.availableSlot;
        this.setState({ updateAvailableSlots: slotsUpdatedData })


        // //console.log(this.state.updateAvailableSlots)
        axios.put(backendUrlUser + "/updateSlots", this.state.updateAvailableSlots)
            .then(response => {
                // //console.log("Slots Updated");

                axios.post(backendUrlUser + "/booking", this.state.booking)
                    .then(response => {
                        // //console.log(response);
                        this.setState({ successMessage: "Booking is done successfully" })
                        this.updatewallet();
                        



                    }).catch(error => {
                        // this.setState({errorMessage:""})
                        if (error.response.status) {
                            this.setState({ errorMessage: "Some Failure Occured please try again later.!" })
                        }
                        if (error.response) {
                            this.setState({ errorMessage: error.response.message })
                        } else {
                            this.setState({ errorMessage: error.message })
                        }

                    })


            }).catch(error => {
                // this.setState({errorMessage:""})
                if (error.response.status) {
                    this.setState({ errorMessage: "Some Failure Occured please try again later.!" })
                }
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message })
                } else {
                    this.setState({ errorMessage: error.message })
                }

            })






    }
    updatewallet = () => {
        let wallet_data = {
            userId: sessionStorage.getItem('userId'),
            amount: Number(this.state.newWallet)

        }
        axios.post(backendUrlUser + '/updatewallet', wallet_data)
            .then(response => {
                sessionStorage.setItem('wallet', this.state.newWallet)
            }).catch(error => {
                console.log(error);
            })
    }


    componentDidMount = () => {
        this.getTheBookedData()
    }

   
    checkDate = (checkOutDate) => {
        console.log(checkOutDate);
        this.state.bookedData.filter(elements => {

            if (new Date(checkOutDate) > new Date(elements["checkOutDate"])) {
                this.setState({ errorMessage: "" })
            }
            else {
                this.setState({ errorMessage: "You Have another booking on that given date", calculateState: false })
               
            }

        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

    }
    handleChange = (event) => {
        this.setState({ calculateState: false })
        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;

        } else {
            value = target.value;
        }

        this.setState({
            [name]: value
        });
        this.validateField(name, value);
    }
    validateField = (fieldname, value) => {
        let formValidError = this.state.bookformErrorMessage;
        let formValid = this.state.bookformvalid;
        switch (fieldname) {
            case "noOfPer":
                if (value == "") {
                    formValidError.noOfPer = "This field can't be empty!";
                    formValid.noOfper = false;
                } else if (value < 1) {
                    formValidError.noOfPer = "No of persons can't be less than 1";
                    formValid.noOfper = false;
                } else if (value > 5) {
                    formValidError.noOfPer = "No of persons can't be greater than 5";
                    formValid.noOfper = false;
                } else {
                    formValidError.noOfPer = "";
                    formValid.noOfper = true;
                    this.setState({ availableSlot: this.state.slotAvailabilityData[0]["availability"] });
                }
                break;
            case "date":
                // this.setTripEndDate()
                if (value === "") {
                    formValidError.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkDate.getTime()) {
                        formValidError.date = "The booking date cannot be past date";
                        formValid.date = false;
                    } else {
                        formValidError.date = "";
                        formValid.date = true;
                        this.setTripEndDate();
                    }
                }
                break;
            default: break;
        }
        formValid.buttonActive = formValid.noOfper && formValid.date;
        this.setState({
            loginFormErrorMessage: formValidError,
            formValid: formValid,
            successMessage: ""

        });

    }
    setTripEndDate = () => {

        var days = this.state.dest.noOfNights; // Days you want to subtract
        var date = new Date(this.state.date);
        var last = new Date(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var day = last.getDate();
        var month = last.getMonth() + 1;
        var year = last.getFullYear();
        let checkOutDate = year + "-" + month + "-" + day;
        this.setState({ checkOut: checkOutDate })



        this.checkDate(checkOutDate)




    }

    getSlotAvailability = () => {
     
        const { getSlotAvailability } = this.state;
        axios.post(backendUrlUser + '/getavailability', getSlotAvailability)
            .then(response => {
          
                this.setState({ slotAvailabilityData: response.data })
                this.setState({ availableSlot: this.state.slotAvailabilityData[0]["availability"] });
           
                this.setTripEndDate()
                this.chargecalculation();
            })
            .catch(error => {
                this.setState({ errorMessage: "Sorry !! Data is not currently Avalaible" })
            })


    }
    chargecalculation = () => {
        
        let chargeperson = this.state.dest.chargesPerPerson;
        let noOfPerson = this.state.noOfPer;
        let flight = this.state.flights;
        let price = 0
  
        if (flight) {
            price = noOfPerson * chargeperson;
            price = price + (noOfPerson * 1000);
        } else {
            price = noOfPerson * chargeperson;
        }
        

        let availability = this.state.slotAvailabilityData[0]["availability"];
        availability = availability - noOfPerson;
        if (availability >= 0) {
            this.setState({ availableSlot: availability })
        
            this.setState({ calculateState: true })
            this.setState({ errorMessage: "" })

            if ((this.state.oldWallet - price) < 0) {
                this.setState({ errorMessage: "No Sufficient Amount Money available in the wallet." })
            } else {
                this.setState({ newWallet: Number(this.state.oldWallet - price) })
                sessionStorage.setItem("wallet", this.state.newWallet)
             
            }
        }
        else {
            this.setState({ errorMessage: "Not Enough slots available for booking" })
        }
        this.setState({ charge: price })
        this.setTripEndDate();
       }

    showpackagespots = () => {
        let spotsarr = [];
        let firstContent = (
            <div key={0} className="text-justify">
                <h3>DAY WISE ITINERARY</h3>
                <h5>Day1</h5>
                {this.state.dest ? <div>{this.state.dest.details.itinerary.dayWiseDetails.firstDay}  </div> : null}
            </div>
        );
        spotsarr.push(firstContent);
        if (this.state.dest) {
            this.state.dest.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packagespots, index) => {
                let content = (
                    <div key={index + 1} className="text-justify">
                        <h5>Day{this.state.dest.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packagespots) + 2}</h5>
                        <div>{packagespots}</div>
                    </div>
                );
                spotsarr.push(content)
            });
            let lastContent = (
                <div key={50} className="text-justify">
                    <h5>Day{this.state.dest.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.dest.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        //**This itinerary is just a suggestion, it can be modified as per the requiremnts of travelers **//
                    </div>
                </div>
            );
            spotsarr.push(lastContent)
            return spotsarr;
        }
        else {
            return null;
        }
    }
    showpackageinfo = () => {
        let packageInfo = this.state.dest.details.itinerary.packageInclusions;
        if (this.state.dest) {
            return packageInfo.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }


    render() {

        return (
            <div className="booking-page">
                <div className="container-fluid">
                    <div className="row mt-5 mb-5">
                        <div className="col-md-6 offset-1">
                            <Fieldset legend="Overiew" collapsed={false} toggleable={true} style={{ width: '65%', marginTop: '15px' }}>
                                {this.state.dest.details.about}
                            </Fieldset>

                            <Fieldset legend="Package Included" collapsed={true} toggleable={true} style={{ width: '65%', marginTop: '15px' }}>
                                {this.showpackageinfo()}

                            </Fieldset>
                            <Fieldset legend="Itinerary" collapsed={true} toggleable={true} style={{ width: '65%', marginTop: '15px' }}>

                                {this.showpackagespots()}
                            </Fieldset>
                            <br />
                        </div>
                        <div className="col-md-4 offset-.5">
                            <form className="form formbg bg-light shadow p-4 mb-4" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <h4>Let's Book it</h4>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Number of Persons"
                                        type="number"
                                        id="noOfPer"
                                        name="noOfPer"
                                        value={this.state.noOfPer}
                                        onChange={this.handleChange} />

                                    {this.state.bookformErrorMessage.noOfPer ?
                                        <span className="text-danger"><MdThumbDown />{this.state.bookformErrorMessage.noOfPer}</span> : null}
                                </div>

                                <div className="form-group">
                                    <TextField
                                        label="Trip Start Date"
                                        variant="outlined"
                                        margin="normal"
                                        type="date"
                                        id="date"
                                        name="date"
                                        InputLabelProps={{ shrink: true, }}
                                        fullWidth
                                        value={this.state.date}
                                        onChange={this.handleChange} />

                                    {this.state.bookformErrorMessage.date ?
                                        <span className="text-danger"><MdThumbDown />{this.state.bookformErrorMessage.date}</span> : null}
                                </div>

                                <div className="form-group">
                                    <label>Include Flight Fare:</label>&nbsp;&nbsp;
                                    <InputSwitch name="flights" id="flights"
                                        checked={this.state.flights}
                                        onChange={this.handleChange}
                                    />
                                </div>



                                <div className="form-group" >
                                    <Button id="butcalc" variant="contained" color="primary" onClick={this.getTheBookedData} >Calculate Fare & Trip Date</Button><span className="text-danger">*</span>
                                    &nbsp;
                                    <h3> Fare : {this.state.charge}$ </h3>
                                    <h5> Your Trips Ends on: {this.state.checkOut} </h5>
                                </div>

                                <div className="form-group" >
                                    <Button variant="contained" color="primary" disabled={!this.state.calculateState} id="Book" onClick={this.bookingTheDest} ><FiCheckSquare />Booking</Button>&nbsp;

                                </div>
                                <span className="text-danger">{this.state.errorMessage}</span>
                                <span className="text-success">{this.state.successMessage}{this.state.calculateState}</span>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
export default booking;