import Navbar from "../components/Navbar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useState } from "react";

function Documents() {
  const [documents, setDocuments] = useLocalStorage("documents", []);
  const [fileName, setFileName] = useState("");

  const addDocument = () => {
    if (!fileName) return;
    const newDoc = {
      id: Date.now(),
      name: fileName,
      type: "Manual Interno",
      uploadedBy: "Supervisor",
      date: new Date().toLocaleString(),
    };
    setDocuments([...documents, newDoc]);
    setFileName("");
  };

  const deleteDocument = (id) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Gestión Documental</h2>
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            placeholder="Nombre del documento"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={addDocument}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            + Subir
          </button>
        </div>
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nombre</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Subido por</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td className="p-2">{doc.name}</td>
                <td className="p-2">{doc.type}</td>
                <td className="p-2">{doc.uploadedBy}</td>
                <td className="p-2">{doc.date}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documents;
