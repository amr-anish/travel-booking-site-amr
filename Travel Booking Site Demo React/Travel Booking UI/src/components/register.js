import React, { Component } from "react";
import axios from "axios";
import { Redirect } from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/container';
import Typography from '@material-ui/core/Typography';
import { FaRegCheckSquare } from "react-icons/fa";
import { CgLogIn } from "react-icons/cg";
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerform: {
                contactNo: "",
                password: "",
                email: "",
                name: ""
            },
            registerformErrorMessage: {
                contactNo: "",
                password: "",
                name: "",
                email: ""
            },
            registerformValid: {
                contactNo: false,
                password: false,
                name: false,
                email: false,
                buttonActive: false
            },
            successMessage: "",
            errorMessage: "",
            loadHome: false,
            loadRegister: false,
            userId: ""
        }
    }

    handleClick = () => {
        this.setState({ loadRegister: true })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const { registerform } = this.state;
        this.setState({
            registerform: { ...registerform, [name]: value }
        });
        this.validateField(name, value);
        //console.log(this.state.registerform[name], name);
    }

    register = () => {
        const { registerform } = this.state;
        this.setState({ successMessage: "", errorMessage: "" })

        axios.post(backendUrlUser + "/register", registerform)
            .then(response => {
                //console.log(response);
                //         let userId = response.data.userId;
                this.setState({ successMessage: "User Registered in successfully" })



            }).catch(error => {
                // this.setState({errorMessage:""})
                if (error.response.status) {
                    this.setState({ errorMessage: "The User is Already Registered.!!" })
                }
                if (error.response) {
                    this.setState({ errorMessage: error.response.data.message })
                } else {
                    this.setState({ errorMessage: error.message })
                }

            })
        // //console.log(this.state.loginform.contactNo, this.state.loginform.password);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.register();
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.registerformErrorMessage;
        let formValid = this.state.registerformValid;
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
                    fieldValidationErrors.password = "Please Enter a valid password with atleast length of 7 with 1 Capital letter 1 Small letter 1 special Character "
                    formValid.password = false;
                } else {
                    fieldValidationErrors.password = "";
                    formValid.password = true;
                }
                break;
            case "name":
                //console.log("Name validation");
                let nregex = /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
                if (!value || value === "") {
                    fieldValidationErrors.name = "Name is manadatory";
                    formValid.name = false;
                } else if (!value.match(nregex)) {
                    fieldValidationErrors.name = "Please Enter a valid Name"
                    formValid.name = false;
                } else {
                    fieldValidationErrors.name = "";
                    formValid.name = true;
                }
                break;
            case "email":
                let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                //console.log("email validation");
                if (!value || value === "") {
                    fieldValidationErrors.email = "Email is manadatory";
                    formValid.email = false;
                } else if (!value.match(emailRegex)) {
                    fieldValidationErrors.email = "Please Enter a valid Email";
                    formValid.email = false;
                } else {
                    fieldValidationErrors.email = "";
                    formValid.email = true;
                }
                break;
            default:
                break;
        }
        formValid.buttonActive = formValid.contactNo && formValid.password && formValid.email && formValid.name;
        this.setState({
            registerformErrorMessage: fieldValidationErrors,
            registerformValid: formValid,
            successMessage: ""
        });
    }

    render() {
        // if (this.state.loadHome === true) return <Redirect to={'/home/' + this.state.userId} />
        if (this.state.loadRegister === true) return <Redirect to={'/login'} />
        return (
            <div className="registerbg">
                <Container component="main" maxWidth="sm">
                    <div className="rcard">
                        <div className="card-body text-dark">
                            <div>
                                <Typography variant="h4" component="h1">Lets Wander !! Join Now</Typography>
                                <form onSubmit={this.handleSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        name="name"
                                        label="Name"
                                        autoFocus
                                        value={this.state.registerform.name}
                                        onChange={this.handleChange} />
                                    {this.state.registerformErrorMessage.name ? (<span className="text-danger">
                                        {this.state.registerformErrorMessage.name}
                                    </span>) : null}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        value={this.state.registerform.email}
                                        onChange={this.handleChange} />
                                    {this.state.registerformErrorMessage.email ? (<span className="text-danger">
                                        {this.state.registerformErrorMessage.email}
                                    </span>) : null}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="number"
                                        id="contactno"
                                        name="contactNo"
                                        label="Contact Number"
                                        value={this.state.registerform.contactNo}
                                        onChange={this.handleChange} />
                                    {this.state.registerformErrorMessage.contactNo ? (<span className="text-danger">
                                        {this.state.registerformErrorMessage.contactNo}
                                    </span>) : null}
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="password"
                                        name="password"
                                        label="Password"
                                        type="password"
                                        value={this.state.registerform.password}
                                        onChange={this.handleChange} />
                                    {this.state.registerformErrorMessage.password ? (<span className="text-danger">
                                        {this.state.registerformErrorMessage.password}
                                    </span>) : null}<br />
                                    <span><span className="text-danger">*</span> marked feilds are mandatory</span>
                                    <br />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="green"
                                        disabled={!this.state.registerformValid.buttonActive}>
                                        <FaRegCheckSquare /> Register </Button>


                                </form>
                                <br />
                                <span className="text-danger dangerlabel">{this.state.errorMessage} </span><br />
                                <span className="text-success successlabel">{this.state.successMessage} </span> <br />
                                {/* <!--can be a button or a link based on need --> */}
                                <Button variant="contained" color="primary" fullWidth onClick={this.handleClick} ><CgLogIn />Login</Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Register;