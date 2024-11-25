import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { User } from "@/types/firebase";

interface UserFormProps {
  initialData?: User;
  onSuccess?: () => void;
}

export const UserForm = ({ initialData, onSuccess }: UserFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        department: initialData.department,
        email: initialData.email,
        phone: initialData.phone,
        password: "",
        isAdmin: initialData.isAdmin,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (initialData?.id) {
        // Update existing user
        await updateDoc(doc(db, "users", initialData.id), {
          ...formData,
          updatedAt: new Date(),
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Create new user
        await addDoc(collection(db, "users"), {
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast.success("Usuário cadastrado com sucesso!");
      }
      
      onSuccess?.();
      
      setFormData({
        fullName: "",
        department: "",
        email: "",
        phone: "",
        password: "",
        isAdmin: false,
      });
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erro ao salvar usuário. Tente novamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Input
          type="text"
          name="fullName"
          placeholder="Nome Completo"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          name="department"
          placeholder="Setor"
          value={formData.department}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="tel"
          name="phone"
          placeholder="(XX) XXXXX-XXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required={!initialData}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAdmin"
          checked={formData.isAdmin}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, isAdmin: checked === true }))
          }
        />
        <label
          htmlFor="isAdmin"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Administrador
        </label>
      </div>
      <Button type="submit" className="w-full">
        {initialData ? "Atualizar" : "Cadastrar"}
      </Button>
    </form>
  );
};