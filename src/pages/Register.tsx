import { RegisterForm } from "@/components/auth/RegisterForm";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      <div className="md:ml-64">
        <header className="bg-white shadow fixed top-0 right-0 left-0 md:left-64 z-10">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-gray-600 mb-1">Sistema de Gestão da Qualidade</h2>
              <h1 className="text-2xl font-bold text-primary">Cadastro de Usuário</h1>
            </div>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <RegisterForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;