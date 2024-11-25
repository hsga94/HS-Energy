import { Button } from "@/components/ui/button";
import { UserPen, Trash2 } from "lucide-react";

interface User {
  id: string;
  fullName: string;
  department: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserList = ({ users, onEdit, onDelete }: UserListProps) => {
  if (users.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Usuários Cadastrados</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-gray-50 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{user.fullName}</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{user.department}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(user)}
                  className="h-8 w-8"
                >
                  <UserPen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(user)}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div>{user.email}</div>
              <div>{user.phone}</div>
              <div>{user.isAdmin ? "Administrador" : "Usuário"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};