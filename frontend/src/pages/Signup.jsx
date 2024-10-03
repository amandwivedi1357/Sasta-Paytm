import { Button } from "../components/Buttun"
import { BottomWarning } from "../components/ButtonWarning"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/Inputbox"
import { SubHeading } from "../components/Subheading"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleClick = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/user/signup", {
                firstName,
                lastName,
                username,
                password
            });
            
            console.log("Signup successful:", response.data);
            localStorage.setItem("token",response.data.token)
            navigate('/dashboard')
            // You can add further logic here, such as redirecting the user or showing a success message
        } catch (error) {
            console.error("Signup failed:", error);
            // Handle errors, such as displaying an error message to the user
        }
    };
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={(e)=>setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
        <InputBox onChange={(e)=>setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
        <InputBox onChange={(e)=>setUsername(e.target.value)} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChange={(e)=>setPassword(e.target.value)} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button
          onClick={handleClick}
          label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}