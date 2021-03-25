function validtaeEmail(input) {
    let curr = input.split("").reverse().join("");
    let a = curr.split("@")[0]+"@"
    let email = curr.substring(a.length).trim()
   console.log(email);
    if (email.match("[\\s+$]")) {
        return "User name cannot be contained in spaces"
    }else if(email[0]==="." || email[email.length-1]==="."){
        return "Sorry, the first and last character of the username must be an ascii character (a-z) or a number (0-9)"
    }
     else if (email.match("[@#$%^&*(){}/<>?\\[\\]!,]")) {
        return " username must not have special characters"
    } else if (email.match("(?=.*[0-9,.])(?=.*[a-z,.])")) {
        return true
    }
    else if (email.length < 6 || email.lenthh > 20) {
        return "Username must be between 6 and 20 characters"
    } else {
        return "Sorry, only letters (a-z), numbers (0-9) and periods (.) Are allowed."
    }

}
function getEmail(input){
    let curr = input.split("").reverse().join("");
    let a = curr.split("@")[0]+"@"
    let email = curr.substring(a.length).trim()
    return email.split("").reverse().join("")+a.split("").reverse("").join("")
}

module.exports = {
    validtaeEmail,
    getEmail
}