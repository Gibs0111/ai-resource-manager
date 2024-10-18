import React, { useState } from 'react';
import { Resource } from '../types';
import { Save, ExternalLink, Code, Copy } from 'lucide-react';

interface ResourceDetailsProps {
  resource: Resource | null;
  onSave: (resource: Resource) => void;
}

const ResourceDetails: React.FC<ResourceDetailsProps> = ({ resource, onSave }) => {
  const [notes, setNotes] = useState('');

  if (!resource) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Select a resource to view details</p>
      </div>
    );
  }

  const handleSave = () => {
    onSave({ ...resource, notes });
  };

  const handleCopyForBolt = () => {
    const boltPrompt = `Resource: ${resource.name}\nURL: ${resource.url}\nDescription: ${resource.description}\nNotes: ${notes}\n\nPlease help me integrate this resource into my current project.`;
    navigator.clipboard.writeText(boltPrompt);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{resource.name}</h2>
      <p className="text-gray-600 mb-4">{resource.description}</p>
      <div className="mb-4 flex space-x-4">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center"
        >
          <ExternalLink className="mr-1 w-4 h-4" /> Visit Resource
        </a>
        <button
          onClick={handleCopyForBolt}
          className="text-green-500 hover:underline flex items-center"
        >
          <Copy className="mr-1 w-4 h-4" /> Copy for bolt.new
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Add your notes here..."
        ></textarea>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Save className="mr-2" /> Save Resource
        </button>
        <button
          onClick={() => window.open('https://bolt.new', '_blank')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Code className="mr-2" /> Open in bolt.new
        </button>
      </div>
    </div>
  );
};

export default ResourceDetails;