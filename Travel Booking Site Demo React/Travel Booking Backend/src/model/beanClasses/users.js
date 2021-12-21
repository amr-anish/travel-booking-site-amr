class User {
    constructor(obj) {
        this.userId = obj.userId;
        this.name = obj.name;
        this.emailId = obj.emailId;
        this.contactNo = obj.contactNo;
        this.password = obj.password;
        this.bookings = obj.bookings;
        this.wallet = obj.wallet;
    }
}

module.exports = User;