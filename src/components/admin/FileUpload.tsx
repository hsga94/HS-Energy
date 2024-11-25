import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface Document {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const userEmail = localStorage.getItem("userEmail");
    const userType = localStorage.getItem("userType");
    
    if (!userEmail || !userType) {
      toast.error("Você precisa estar logado para fazer upload de arquivos.");
      return;
    }

    if (userType !== "admin") {
      toast.error("Apenas administradores podem fazer upload de arquivos.");
      return;
    }

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `uploads/${fileName}`;
      
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const docRef = await addDoc(collection(db, "documents"), {
        name: file.name,
        url: downloadURL,
        uploadedBy: userEmail,
        uploadedAt: serverTimestamp(),
        department: localStorage.getItem("userDepartment") || "general",
        type: file.type,
        size: file.size,
        path: filePath
      });
      
      const newDoc: Document = {
        id: docRef.id,
        name: file.name,
        url: downloadURL,
        uploadedAt: new Date(),
      };
      
      setDocuments(prev => [...prev, newDoc].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success("Arquivo enviado com sucesso!");
      
      setFile(null);
      const form = e.target as HTMLFormElement;
      form.reset();
    } catch (error: any) {
      console.error("Erro ao enviar arquivo:", error);
      toast.error(`Erro ao enviar arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            disabled={isUploading}
          />
          <Button type="submit" disabled={!file || isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>

      {documents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Documentos Enviados</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span>{doc.name}</span>
                <span className="text-sm text-gray-500">
                  {doc.uploadedAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};