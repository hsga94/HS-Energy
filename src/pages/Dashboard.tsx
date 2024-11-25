import { useState, useEffect } from "react";
import { PDFViewer } from "@/components/pdf/PDFViewer";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { FileText, Menu, ArrowLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

const Dashboard = () => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const q = query(collection(db, "documents"), orderBy("name", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
        }))
        .filter((doc) => doc.name && doc.name.trim() !== "");
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

  if (selectedDoc) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow fixed top-0 right-0 left-0 z-10">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedDoc(null)}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-semibold text-primary">{selectedDoc.name}</h1>
            </div>
          </div>
        </header>

        <main className="pt-16 px-4">
          <PDFViewer 
            url={selectedDoc.url} 
            allowDownload={userType === "admin"}
          />
        </main>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-primary">Documentos</h1>
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

        <main className="px-4 py-8 mt-16">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Lista de Documentos</h2>
              {documents.length === 0 ? (
                <p className="text-gray-500">Nenhum documento disponível.</p>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4 mb-2 md:mb-0">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <span className="font-medium">{doc.name}</span>
                          <p className="text-sm text-gray-500">
                            {doc.uploadedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => setSelectedDoc(doc)}>
                        Visualizar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;