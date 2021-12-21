import React, { Component } from 'react';
import axios from 'axios';
import { backendUrlUser } from '../BackendURL';
import { Sidebar } from 'primereact/sidebar';
import { ProgressSpinner } from 'primereact/progressspinner'
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect } from 'react-router';
import { ImCalculator } from 'react-icons/im';
import { TiTick } from 'react-icons/ti';
import { MdCancel, MdThumbDown } from 'react-icons/md';
import { FcViewDetails } from 'react-icons/fc';
import { FiCheckCircle } from 'react-icons/fi';
import { GrOverview } from 'react-icons/gr'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';



const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
//console.log("load 1")  
const MyButton = styled(({ color, ...other }) => <Button{...other} />)({
    background: (props) =>
        props.color === 'red'
            ? 'linear-gradient(10deg,#FE6B8B 30%,#FF8E53 90%)'
            : 'linear-gradient(10deg,#2196F3 30%,#21CBF3 90%)',
    border: 0,
    borderRadius: 5,
    boxShadow: (props) =>
        props.color === 'red'
            ? '0 3px 5px 4px rgba(255, 105, 135,.3)'
            : '0 3px 5px 4px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 50px',
    margin: 6,
});



class HotPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destinationData: [],
            errorMessage: "",
            index: "",
            rightpanel: false,
            sidebarload: false,
            package: "",
            bookPage: false,
            chargecalculation: 0,
            bookForm: {
                noOfPer: 0,
                date: "",
                flights: false,

            },
            bookformErrorMessage: {
                noOfPer: "",
                date: ""
            },
            bookformvalid: {
                noOfper: false,
                date: false,
                buttonActive: false
            },
            calculateState: false,

        }
    }

    getItinerary = (aPackage) => {
        // alert("The package details are shown as a side-bar from left side");
        //console.log(aPackage)
        this.setState({ index: 0, rightpanel: true, package: aPackage })
    };
    openBooking = (aPackage) => {
        //alert("The package details are shown as a side-bar from left side");
        this.setState({ index: 2, rightpanel: true, package: aPackage })
    };
    componentDidMount() {

        this.packages()
    }

    packages = () => {
        axios.get(backendUrlUser + '/gethotdeals')
            .then(response => {
                //console.log(response);
                this.setState({ destinationData: response.data })
                //console.log(this.state.destinationData);
            })
            .catch(error => {
                this.setState({ errorMessage: "No Hot deals Available As of Now" })
            })
    }


    createcard = () => {
        let arr = []
        for (let singlePackage of this.state.destinationData) {

            arr.push(

                <div className="column">
                    <div className="cardnew1" key={singlePackage.destinationId}>
                        <div className="card-body row">
                            <h3 className="card-title">{singlePackage.name}</h3>
                            <h4 >Prices Starting From:</h4>

                            <div className="text-center text-success"><h5>{formatter.format(singlePackage.chargesPerPerson)}</h5></div><br />

                            <div >
                                <img className="image-container" alt="destination comes here" src={singlePackage.imageUrl} />
                                <div className="badge badge-info">{singlePackage.noOfNights}<em> Nights</em></div> <br />
                                <div className="badge badge-info">{singlePackage.availability}<em> Seats Avalaible </em></div>
                                {singlePackage.discount ? <div className="discount text-danger">{singlePackage.discount}% Instant Discount</div> : null}
                            </div>  <div >  <p>{singlePackage.details.about}</p>
                            </div>
                            <div><button className="btnviewexp" onClick={() => this.getItinerary(singlePackage)}><FcViewDetails />View Details</button></div>
                            <div><button className="btnbookexp" onClick={() => this.openBooking(singlePackage)}><FiCheckCircle />Book </button></div><br />
                        </div>
                    </div>
                </div>

            )

        }
        return arr
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.chargecalculation();
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
        const { bookForm } = this.state;
        this.setState({
            bookForm: { ...bookForm, [name]: value }
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
                }
                break;
            case "date":
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

    defaultBook = () => {
        let bookForm = {
            noOfPer: 0,
            date: "",
            flights: false
        }
        let bookformvalid = {
            noOfPer: false,
            date: false,
            buttonActive: false
        }
        this.setState({ chargecalculation: 0, rightpanel: false, bookForm: bookForm, bookformvalid: bookformvalid })
    }

    showpackageinfo = () => {
        let packageInfo = this.state.package.details.itinerary.packageInclusions;
        if (this.state.package) {
            return packageInfo.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }
    showpackagespots = () => {
        let spotsarr = [];
        let firstContent = (
            <div key={0} className="text-justify">
                <h3>DAY WISE ITINERARY</h3>
                <h5>Day1</h5>
                {this.state.package ? <div>{this.state.package.details.itinerary.dayWiseDetails.firstDay}  </div> : null}
            </div>
        );
        spotsarr.push(firstContent);
        if (this.state.package) {
            this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packagespots, index) => {
                let content = (
                    <div key={index + 1} className="text-justify">
                        <h5>Day{this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packagespots) + 2}</h5>
                        <div>{packagespots}</div>
                    </div>
                );
                spotsarr.push(content)
            });
            let lastContent = (
                <div key={50} className="text-justify">
                    <h5>Day{this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.package.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        <MdThumbDown /> //**This itinerary is just a suggestion, it can be modified as per the requiremnts of travelers **//
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

    loadBook = (destId) => {
        let user = sessionStorage.getItem("userId")
        this.setState({ errorMessage: "" })
        if (user != null) {
            sessionStorage.setItem('noOfPer', this.state.bookForm.noOfPer);
            sessionStorage.setItem('type', "H");
            sessionStorage.setItem('checkInDate', this.state.bookForm.date);
            sessionStorage.setItem('flight', this.state.bookForm.flights);
            sessionStorage.setItem('destId', destId);
            sessionStorage.setItem('Charge', this.state.chargecalculation);
            sessionStorage.setItem('bookingType', "hotdeals");
            sessionStorage.setItem('dest', JSON.stringify(this.state.package))
            this.setState({ show: false, bookPage: true, destId: destId, rightpanel: false, sidebarload: true })
        } else {
            this.setState({ errorMessage: "Please Login to Continue" })


        }

    }

    chargecalculation = () => {
        let chargeperson = this.state.package.chargesPerPerson;
        let noOfPerson = this.state.bookForm.noOfPer;
        let flight = this.state.bookForm.flights;
        let price = 0
        //console.log("person: ",noOfPerson)
        if (flight) {
            price = noOfPerson * chargeperson;
            price = price + (1000 * noOfPerson);
        } else {
            price = noOfPerson * chargeperson;
        }

        this.setState({ chargecalculation: price })
        this.setState({ calculateState: true })


    }


    render() {
        //const singlePackage =  this.state.destinationData;
        if (this.state.bookPage === true) return <Redirect to={'/booking/' + this.state.destId} />

        return (

            <div>

                {this.state.show ?
                    <div id="details" className="details-section">
                        <div className="text-center">
                            <ProgressSpinner></ProgressSpinner>
                        </div>
                    </div> : null
                }
                <div className="hotdealbg">
                    {
                        !this.state.sidebarload ?
                            (<div className="row">

                                {this.createcard()}

                            </div>
                            ) : null
                    }

                    <Sidebar visible={this.state.rightpanel} position="right" className="p-sidebar-lg" onHide={() => this.setState({ rightpanel: false })}>
                        <h2>{this.state.package.name}</h2>
                        <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })}>
                            <TabPanel header="Overview">
                                <div className="row">
                                    {this.state.package ?
                                        <div className="col-md-6 text-center">
                                            <img className="package-image" src={this.state.package.imageUrl} alt="destination will be there " />
                                        </div> : null}
                                    <div className="col-md-6">
                                        <h4>The package includes:</h4>
                                        <ul className="text-justify">
                                            {this.state.rightpanel ? this.showpackageinfo() : null}
                                        </ul>
                                    </div>
                                </div>
                                <div className="text-justify ">
                                    <GrOverview /> <h4>Tour Overview</h4>
                                    {this.state.package ? this.state.package.details.about : null}
                                </div>
                            </TabPanel>
                            <TabPanel header="Iternary">
                                {this.showpackagespots()}
                            </TabPanel>
                            <TabPanel header="Book">
                                <h4 className="text-success">Charges per person: $ {this.state.package.chargesPerPerson} </h4>
                                <form className='form' onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            label="Number of Persons"
                                            type="number"
                                            id="noOfPer"
                                            name="noOfPer"
                                            value={this.state.bookForm.noOfPer}
                                            onChange={this.handleChange} />

                                        {this.state.bookformErrorMessage.noOfPer ?
                                            <span className="text-danger"><MdThumbDown />{this.state.bookformErrorMessage.noOfPer}</span> : null}
                                    </div>
                                    <div>
                                        <TextField
                                            label="Trip Start Date"
                                            variant="outlined"
                                            margin="normal"
                                            type="date"
                                            id="date"
                                            name="date"
                                            InputLabelProps={{ shrink: true, }}
                                            fullWidth
                                            value={this.state.bookForm.date}
                                            onChange={this.handleChange} />

                                        {this.state.bookformErrorMessage.date ?
                                            <span className="text-danger"><MdThumbDown />{this.state.bookformErrorMessage.date}</span> : null}
                                    </div>
                                    <div className="form-group">
                                        <label><h5>Include Flight Fare:</h5></label>&nbsp;&nbsp;
                                        <InputSwitch name="flights" id="flights"
                                            checked={this.state.bookForm.flights}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="form-group" >
                                        <Button variant="contained" id="butcalc" color="primary" onClick={this.chargecalculation} ><ImCalculator />Calculate Fare</Button>&nbsp;
                                        <br />
                                        <h3> Fare : {this.state.chargecalculation}$</h3>
                                    </div>

                                    <div className="text-danger">{this.state.errorMessage}</div>
                                </form>
                                <div className="text-center">
                                    <MyButton variant="contained" color="blue" disabled={!(this.state.bookformvalid.buttonActive && this.state.calculateState)} className="btn btn-success"
                                        onClick={() => this.loadBook(this.state.package.destinationId)}><TiTick /> Book </MyButton>
                                    <MyButton variant="contained" type="button" color="red" onClick={this.defaultBook}><MdCancel />Cancel</MyButton>
                                </div>
                            </TabPanel>
                        </TabView>
                    </Sidebar>
                </div>
            </div>
        )
    }

}

export default HotPackage;