import { Link, useNavigate } from "react-router-dom";
import { FileText, Upload, UserPlus, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    const storedEmail = localStorage.getItem("userEmail");
    const storedName = localStorage.getItem("userName");
    
    setIsAdmin(userType === "admin");
    setUserEmail(storedEmail || "");
    setUserName(storedName || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start mt-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
      
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Documentos</span>
            </Link>
          </li>
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>Área Administrativa</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Cadastro de Usuário</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};