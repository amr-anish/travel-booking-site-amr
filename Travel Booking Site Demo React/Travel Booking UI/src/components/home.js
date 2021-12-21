import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';


import HotPackage from './hotDeals';

import StarRating from './starRating';
import { ImSearch, ImYoutube } from 'react-icons/im';
import { MdEmail, MdPhone } from 'react-icons/md';
import { FaAddressCard } from 'react-icons/fa';

import { getwallet } from './wallet';
//import {backendUrlUser,backendUrlPackage,backendUrlBooking} from '../BackendURL';

class Home extends Component {
    state = {

        packagePage: false,
        successMessage: "",
        homePage: "",
        emailId: "",
        loadSearch: false,
        search: ""

    };

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value })
    }

    handleClick = (event) => {
        event.preventDefault();
        this.setState({ successMessage: "Thank you for subscribing. Updates will be sent to the subscribing Email ID" });
    }
    handleSearch = (event) => {


        if (this.state.search !== null) {
            this.setState({ loadSearch: true });
            // //console.log(this.state.search, this.state.loadSearch);

        }
    }

    componentDidMount = () => {
        getwallet()


    }


    render() {
        //console.log( sessionStorage);
        if (this.state.loadSearch === true) {
            //console.log(this.state.search, this.state.loadSearch); 
            return <Redirect to={'/search/' + this.state.search} />
        }

        return (
            <div className="home">
                <header className="masthead book-page" id="page-top">
                    <div className="container d-flex h-100 align-items-center">
                        <div className="mx-auto text-center">
                            <h1 className="wanderfont">Let'sTravel</h1><br />
                            <h2 className="expbtn">Travel makes one modest. You see what a tiny place you occupy in the world.</h2>

                            <div className="form-inline d-flex">
                                <input
                                    type="text"
                                    className="form-control-lg flex-fill"
                                    name="search"
                                    value={this.state.search}
                                    id="search"
                                    placeholder="Where?"
                                    onChange={this.handleChange}
                                />&nbsp;


                            </div>
                            <button className="btn btn-primary btn1 mx-auto  " onClick={this.handleSearch}><ImSearch /></button>
                        </div>
                    </div>
                </header>

                <section id="about" className="about-section text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <h2 className="text-white mb-4">Unleash the traveller inside you</h2>
                                <p className="about-paragraph text-center">When someone makes a travel plan, the first few things they want to sort out, are flights, accommodation, and other amenities for a convenient holiday.
                                    To enjoy holidays, you want to have the basics taken care of, especially for family vacations and honeymoon trips.
                                    You want your accommodation, return flight bookings, meals of the days, and other traveling formalities sorted beforehand.
                                    At <Link to="/">Lets Travel</Link>, we take care of all the requirements to ensure that you get to enjoy the best of your holiday, exploring and experiencing the destination.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="hotDeals" className="hotdealbg">
                    <HotPackage />
                </section>

                <section id="signup" className="signup-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-10 col-lg-8 mx-auto text-center">
                                <h2 className="text-white mb-5"><ImYoutube />Subscribe to receive updates!</h2>
                                <form className="form-inline d-flex">
                                    <input
                                        type="email"
                                        className="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0"
                                        id="inputEmail"
                                        name="emailId"
                                        value={this.state.emailId}
                                        onChange={this.handleChange}
                                        placeholder="Enter email address..."
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary mx-auto"
                                        onClick={this.handleClick}
                                    >
                                        <ImYoutube /> Subscribe
                                    </button>
                                </form>
                            </div>
                        </div>
                        <br />
                        {this.state.successMessage ?
                            <span className="text-danger text-center">{this.state.successMessage}</span> :
                            null}
                    </div>
                </section>
                <section id="starRating" className="starRating-section">
                    <div className="container">
                        <p><b>Rate Us:</b></p>
                        <StarRating />
                    </div>
                </section>


                <section className="contact-section bg-black">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0"><FaAddressCard />Address</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">Nagercoil India</div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0"><MdEmail />Email</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50"><Link to="/home">anishamr25@gmail.com</Link></div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="card py-4 h-100">
                                    <div className="card-body text-center">
                                        <h4 className="text-uppercase m-0"><MdPhone />Phone</h4>
                                        <hr className="my-4" />
                                        <div className="small text-black-50">+91 7708795857</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        )
    }
}

export default Home;