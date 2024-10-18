import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle, Settings } from 'lucide-react';
import { Resource } from '../types';
import debounce from 'lodash/debounce';

// ... (previous code remains unchanged)

const ImportResources: React.FC<ImportResourcesProps> = ({ onImport }) => {
  // ... (previous state declarations remain unchanged)

  const fetchResults = useCallback(async (page: number) => {
    if (apiCallCount >= API_CALL_LIMIT) {
      setError('API rate limit exceeded. Please try again later.');
      return;
    }

    const cacheKey = `${currentPlatform.id}-${searchTerm}-${page}`;
    const cachedResult = cache[cacheKey];

    if (cachedResult && Date.now() - cachedResult.timestamp < 300000) { // 5 minutes cache
      setResources(cachedResult.data);
      setTotalPages(Math.ceil(cachedResult.data.length / 10));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${currentPlatform.apiUrl}?${currentPlatform.searchParams
        .replace('{query}', encodeURIComponent(searchTerm))
        .replace('{page}', page.toString())}`;

      const response = await fetch(url);
      setApiCallCount(prevCount => prevCount + 1);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data[currentPlatform.resultKey]) {
        throw new Error(`Invalid response format from ${currentPlatform.name} API`);
      }

      const transformedData = data[currentPlatform.resultKey].map(currentPlatform.itemTransform);

      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: { data: transformedData, timestamp: Date.now() }
      }));

      setResources(transformedData);
      setTotalPages(Math.ceil(transformedData.length / 10));
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError(`Failed to fetch resources from ${currentPlatform.name}. ${error instanceof Error ? error.message : 'Please try again or select a different platform.'}`);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, currentPlatform, apiCallCount, cache]);

  // ... (rest of the component remains unchanged)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* ... (previous JSX remains unchanged) */}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* ... (rest of the JSX remains unchanged) */}
    </div>
  );
};

export default ImportResources;