import { LoginForm } from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Sistema de Gestão da Qualidade
          </h1>
          <h2 className="text-xl text-gray-600 mt-2">
            Documentação
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;