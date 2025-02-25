import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";

const FileUpload = ({ type }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:3000/api/upload/${type}`, formData);
      setMessage("Archivo subido correctamente");
    } catch (error) {
      setMessage("Error al subir el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <Form.Group>
        <Form.Label>Subir {type} (Excel)</Form.Label>
        <Form.Control type="file" accept=".xlsx" onChange={handleFileChange} />
      </Form.Group>
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? <Spinner size="sm" animation="border" /> : "Subir Archivo"}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;
