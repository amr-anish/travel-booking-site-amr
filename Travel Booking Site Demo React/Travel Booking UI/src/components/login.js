import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/container';
import Typography from '@material-ui/core/Typography';

import { CgLogIn } from "react-icons/cg";
import { FaRegHandPointRight } from "react-icons/fa";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginform: {
                contactNo: "",
                password: ""
            },
            loginformErrorMessage: {
                contactNo: "",
                password: ""
            },
            loginformValid: {
                contactNo: false,
                password: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
    }


    handleRegister = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { loginform } = this.state;
        this.setState({
            loginform: { ...loginform, [name]: value }
        });
        this.validateField(name, value);
        // //console.log(this.state.loginform[name], name);
    }

    login = () => {
        const { loginform } = this.state;
        axios.post(backendUrlUser + '/login', loginform)
            .then(response => {
                //console.log(response);
                let userId = response.data.userId;
                sessionStorage.setItem("contactNo", response.data.contactNo);
                sessionStorage.setItem("userId", userId);
                sessionStorage.setItem("userName", response.data.name);
                sessionStorage.setItem("email", response.data.emailId);
                sessionStorage.setItem("wallet", response.data.wallet)

                this.setState({ userId: userId, successMessage: "User Logged in successfully" })
                this.setState({ loadHome: true, userId: userId }, () => {
                    window.location.reload();
                })

            }).catch(error => {
                //console.log(error);
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message })
                } else {
                    this.setState({ errorMessage: error.message })
                }
                sessionStorage.clear();
            })

        // //console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.login();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.loginformErrorMessage;
        let formValid = this.state.loginformValid;
        switch (fieldName) {
            case "contactNo":
                let cnoRegex = /^[1-9]\d{9}$/
                if (!value || value === "") {
                    fieldValidationErrors.contactNo = "Please enter your contact Number";
                    formValid.contactNo = false;
                } else if (!value.match(cnoRegex)) {
                    fieldValidationErrors.contactNo = "Contact number should be a valid 10 digit number";
                    formValid.contactNo = false;
                } else {
                    fieldValidationErrors.contactNo = "";
                    formValid.contactNo = true;
                }
                break;
            case "password":
                let pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{7,20}$/
                if (!value || value === "") {
                    fieldValidationErrors.password = "Password is manadatory";
                    formValid.password = false;
                } else if (!value.match(pwdRegex)) {
                    fieldValidationErrors.password = "Please Enter a valid password"
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            loginformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />

        if (this.state.loadRegister === true) return <Redirect to={'/register'} />

        return (

            <div className="login" >
                <table className="hg"><tr className="hg"></tr>
                    <Container component="main" maxWidth="xs"  >

                        <br />

                        <div className="lgbox">
                            <div className="card-body text-dark">
                                <div>
                                    <Typography variant="h4" component="h1"  >Login</Typography>
                                    <form className="form" onSubmit={this.handleSubmit}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="uContactNo"
                                            label="Contact Number"
                                            name="contactNo"
                                            onChange={this.handleChange}
                                            value={this.state.loginform.contactNo} />
                                        <br />
                                        {this.state.loginformErrorMessage.contactNo ? (<span name='contactNoError' className="text-danger">
                                            {this.state.loginformErrorMessage.contactNo}
                                        </span>)
                                            : null}
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="password"
                                            name="password"
                                            label="Password"
                                            type="password"
                                            value={this.state.loginform.password}
                                            onChange={this.handleChange} />
                                        <br />
                                        {this.state.loginformErrorMessage.password ? (<span name='passwordError' className="text-danger">
                                            {this.state.loginformErrorMessage.password}
                                        </span>)
                                            : null}<br />
                                        <span><span className="text-danger">*</span> marked feilds are mandatory</span>
                                        <br />


                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            disabled={!this.state.loginformValid.buttonActive}
                                        >
                                            <CgLogIn />  Login
                                        </Button>
                                        <br />
                                        <br />


                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"

                                            onClick={this.handleRegister}>
                                            <FaRegHandPointRight />   Click here to register</Button>

                                    </form>
                                    <span className="text-danger">{this.state.errorMessage}</span>
                                    <span className="text-success">{this.state.successMessage}</span>
                                </div>
                            </div>
                        </div>
                    </Container></table>
            </div>


        )
    }
}

export default Login;