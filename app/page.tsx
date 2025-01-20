'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<string>('No response yet...');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Genera la URL de vista previa
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!selectedFile) {
      setApiResponse('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setApiResponse(`Error: ${error.message}`);
      } else {
        setApiResponse('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-700 text-center">Number Prediction</h1>
        <label htmlFor="fileInput" className="block text-gray-600 font-medium">
          Upload an image:
        </label>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="block w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Predict
        </button>
      </form>

      {previewUrl && (
        <div className="mt-4 w-md max-w-md">
          <h2 className="text-lg font-bold text-gray-700 text-center">Image Preview</h2>
          <img
            src={previewUrl}
            alt="Selected preview"
            className="mt-2 w-full rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="mt-8 w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-700 text-center">API Response</h2>
        <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-sm text-gray-800 overflow-auto">
          {apiResponse}
        </pre>
      </div>
    </div>
  );
}

export default App;
