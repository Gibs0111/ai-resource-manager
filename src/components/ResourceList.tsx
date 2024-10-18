import React from 'react';
import { Resource } from '../types';

interface ResourceListProps {
  resources: Resource[];
  onSelectResource: (resource: Resource) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onSelectResource }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold p-4 border-b">Resources</h2>
      <ul className="divide-y divide-gray-200">
        {resources.map((resource) => (
          <li
            key={resource.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectResource(resource)}
          >
            <h3 className="font-medium">{resource.name}</h3>
            <p className="text-sm text-gray-500">{resource.description.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;