import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios, { isAxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";

function LoginPage(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
   async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        try {
      //Send the email and password to the backend API
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: email,
        password: password,
      });
      //console.log("Data received from backend:", response.data);

      // If successful, log the token we get back//response.data.token
      console.log(console.log('Login successful! Token:', response.data.token));
      // TODO: In a real app, we would save this token and redirect the user.
      
      // Save the token to the browser's local storage
      localStorage.setItem('token', response.data.token);

      //
      // Redirect the user to the dashboard page
      navigate('/');
      

    } catch (err) {
      // If there's an error, log it to the console
      if(isAxiosError(err)) {
        console.error('Login failed:', err.response ? err.response.data : err.message);
    }
    }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">

            <Card className="w-full max-w-sm">

                <CardHeader> 
                    <CardTitle>Login</CardTitle>
                    
                </CardHeader>

                <form onSubmit={handleLogin}>
            <CardContent>
                    
                        <div>
                            <Label htmlFor="email">Email </Label>
                                <Input type="email" id="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                           
                        </div>

                        <div>
                            <Label htmlFor="password"> Password </Label>
                                <Input type="password" id="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                            
                        </div>

                    
            </CardContent>
            <CardFooter>
                    
                        <Button type="submit">Login</Button>
                    
                    </CardFooter>
                    
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="underline">Sign Up</Link>

                    </p>

                    </form>
            </Card>
        </div>
    )

   
}
 export default LoginPage;