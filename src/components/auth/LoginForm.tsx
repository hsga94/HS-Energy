import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((email === "admin@admin.com.br" || email === "admin") && password === "admin") {
      localStorage.setItem("userType", "admin");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", "Administrador");
      toast.success("Login de administrador realizado com sucesso!");
      navigate("/admin");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        
        if (userData.password === password) {
          localStorage.setItem("userType", userData.isAdmin ? "admin" : "user");
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", userData.fullName);
          
          toast.success("Login realizado com sucesso!");
          navigate(userData.isAdmin ? "/admin" : "/dashboard");
          return;
        }
      }
      
      toast.error("Email ou senha inválidos!");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm mx-auto">
      <div className="space-y-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          required
          className="text-left"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="text-left"
        />
      </div>
      <Button type="submit" className="w-full">
        Entrar
      </Button>
    </form>
  );
};