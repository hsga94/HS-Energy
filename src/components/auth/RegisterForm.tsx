import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserList } from "./UserList";
import { UserForm } from "./UserForm";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { User } from "@/types/firebase";

export const RegisterForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to users collection
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = async (userToDelete: User) => {
    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao excluir usuário. Tente novamente.");
    }
  };

  return (
    <div className="space-y-8">
      <UserForm 
        initialData={editingUser || undefined}
        onSuccess={() => setEditingUser(null)}
      />

      <UserList 
        users={users} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
      />
    </div>
  );
};