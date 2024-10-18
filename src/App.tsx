import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Code, Save, PlusCircle } from 'lucide-react';
import ResourceList from './components/ResourceList';
import SearchBar from './components/SearchBar';
import ResourceDetails from './components/ResourceDetails';
import ImportResources from './components/ImportResources';
import { Resource } from './types';

function App() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'import'>('list');

  useEffect(() => {
    const storedResources = localStorage.getItem('aiResources');
    if (storedResources) {
      setResources(JSON.parse(storedResources));
    }
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSaveResource = (resource: Resource) => {
    const existingIndex = resources.findIndex(r => r.id === resource.id);
    let updatedResources;
    if (existingIndex !== -1) {
      updatedResources = [...resources];
      updatedResources[existingIndex] = resource;
    } else {
      updatedResources = [...resources, { ...resource, id: Date.now().toString() }];
    }
    setResources(updatedResources);
    localStorage.setItem('aiResources', JSON.stringify(updatedResources));
  };

  const handleImportResources = (importedResources: Resource[]) => {
    const updatedResources = [...resources, ...importedResources];
    setResources(updatedResources);
    localStorage.setItem('aiResources', JSON.stringify(updatedResources));
    setCurrentView('list');
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Code className="mr-2" /> AI Resource Hub
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" onClick={() => setCurrentView('list')} className="hover:text-blue-200"><Search className="inline mr-1" /> Resources</a></li>
              <li><a href="#" onClick={() => setCurrentView('import')} className="hover:text-blue-200"><PlusCircle className="inline mr-1" /> Import</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {currentView === 'list' ? (
          <>
            <SearchBar onSearch={handleSearch} />
            <div className="mt-8 flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 pr-0 md:pr-4 mb-4 md:mb-0">
                <ResourceList
                  resources={filteredResources}
                  onSelectResource={setSelectedResource}
                />
              </div>
              <div className="w-full md:w-2/3 pl-0 md:pl-4">
                <ResourceDetails
                  resource={selectedResource}
                  onSave={handleSaveResource}
                />
              </div>
            </div>
          </>
        ) : (
          <ImportResources onImport={handleImportResources} />
        )}
      </main>
    </div>
  );
}

export default App;