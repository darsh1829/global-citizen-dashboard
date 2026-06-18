import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/services/api";

function LoginPage(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    
   async function handleLogin(e: React.FormEvent){
        e.preventDefault();
        setError(null);
        try {
      // FIX: Now uses the centralized api.ts service instead of a hardcoded
      // axios call to localhost — this respects VITE_API_URL in production
      const data = await loginUser(email, password);

      // Save the token to the browser's local storage
      localStorage.setItem('token', data.token);

      // Redirect the user to the dashboard page
      navigate('/');

    } catch (err) {
      if(isAxiosError(err)) {
        console.error('Login failed:', err.response ? err.response.data : err.message);
        setError(err.response?.data?.error || "Login failed. Please check your credentials.");
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

                    {error && (
                        <p className="text-sm text-red-500 mb-4">{error}</p>
                    )}

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