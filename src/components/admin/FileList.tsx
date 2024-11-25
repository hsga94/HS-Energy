import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db, storage } from "@/lib/firebase";
import { collection, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

interface Document {
  id: string;
  name: string;
  url: string;
  path: string;
  uploadedAt: Date;
}

export const FileList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const q = query(collection(db, "documents"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          path: doc.data().path,
          uploadedAt: doc.data().uploadedAt?.toDate() || new Date(),
        }))
        .filter(doc => doc.name && doc.name.trim() !== "")
        .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (document: Document) => {
    try {
      // Delete from Storage
      const storageRef = ref(storage, document.path);
      await deleteObject(storageRef);
      
      // Delete from Firestore
      await deleteDoc(doc(db, "documents", document.id));
      
      toast.success("Arquivo excluído com sucesso!");
    } catch (error: any) {
      console.error("Erro ao excluir arquivo:", error);
      toast.error(`Erro ao excluir arquivo: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivos Carregados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <p className="text-gray-500">Nenhum arquivo carregado.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};