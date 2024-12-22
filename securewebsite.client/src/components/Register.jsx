import { useEffect } from 'react';

function Register() {
    document.title = "Register";

    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user) {
            document.location = "/";
        }
    })
    return (
        <section className="register-page-wrapper page">
            <div className="register-page">
                <header>
                    <h1>Register page</h1>
                </header>
                <p className="message"></p>
                <div className="form-holder">
                    <form action="#" className="register" onSubmit={registerHandler}>
                        <label htmlFor="name">Name</label>
                        <br />
                        <input type="name" name="Name" id="name" required/>
                        <br />
                        <label htmlFor="email">Email</label>
                        <br />
                        <input type="email" name="Email" id="email" required/>
                        <br />
                        <label htmlFor="password">Password</label>
                        <br />
                        <input type="password" name="PasswordHash" id="password" required/>
                        <br /> 
                        <input type="submit" value="Register" className="register btn" />
                    </form>
                </div>
                <div className="my-5">
                    <span>Or </span>
                    <a href="/login">Login</a>
                </div>
            </div>
        </section>
    );

    async function registerHandler(e) {
        e.preventDefault();
        const form_ = e.target, submitter = document.querySelector('input.login');

        const formData = new FormData(form_, submitter), dataToSend = {}
    
        for(const [key, value] of formData) {
            dataToSend[key] = value;
        }

        //create username
        const newUserName = dataToSend.Name.trim().split(" ");
        dataToSend.UserName = newUserName.join(""); 


        const response = await fetch("api/SecureWebsite/register", {
            method : "POST",
            credentials : "include",
            body : JSON.stringify(dataToSend),
            headers : {
                "content-type" : "Application/json",
                "Accept" : "application/json"
            }
        })

        const data = await response.json();

        if(response.ok) {
            document.location.href = "/login";
        }

        const messageEl = document.querySelector(".message");
        if(data.message) {
            messageEl.innerHTML = data.message;
        } else {
            let errorMessage = "<div>Attention please</div><div class='normal'>"
            data.errors.forEach(error => {
                errorMessage += error.description + " "
            })
            errorMessage += "</div>"
            messageEl.innerHTML = errorMessage;
        }

        console.log("Login error ", data)
    }
}

export default Register;