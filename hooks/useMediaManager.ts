import { useState, useCallback, useMemo } from 'react';
import { MediaFolder, MediaFile, MediaManagerState } from '@/types/media';

export const useMediaManager = () => {
  const [state, setState] = useState<MediaManagerState>({
    folders: [
      {
        id: '1',
        name: 'Photos',
        path: '/photos',
        children: [
          {
            id: '2',
            name: 'Vacances 2024',
            path: '/photos/vacances-2024',
            parentId: '1',
            children: [],
            files: [
              {
                id: 'f1',
                name: 'plage.jpg',
                type: 'image',
                size: 2048000,
                url: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                thumbnail: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200&w=300',
                createdAt: new Date('2024-01-15'),
                modifiedAt: new Date('2024-01-15'),
                tags: ['vacances', 'plage'],
                isFavorite: true
              },
              {
                id: 'f2',
                name: 'montagne.jpg',
                type: 'image',
                size: 1536000,
                url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                thumbnail: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200&w=300',
                createdAt: new Date('2024-01-16'),
                modifiedAt: new Date('2024-01-16'),
                tags: ['vacances', 'montagne'],
                isFavorite: false
              }
            ],
            createdAt: new Date('2024-01-15'),
            modifiedAt: new Date('2024-01-16'),
            isExpanded: false,
            color: '#3b82f6'
          },
          {
            id: '3',
            name: 'Famille',
            path: '/photos/famille',
            parentId: '1',
            children: [],
            files: [
              {
                id: 'f3',
                name: 'reunion.jpg',
                type: 'image',
                size: 1024000,
                url: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200&w=300',
                createdAt: new Date('2024-01-10'),
                modifiedAt: new Date('2024-01-10'),
                tags: ['famille'],
                isFavorite: true
              }
            ],
            createdAt: new Date('2024-01-10'),
            modifiedAt: new Date('2024-01-10'),
            isExpanded: false,
            color: '#059669'
          }
        ],
        files: [],
        createdAt: new Date('2024-01-01'),
        modifiedAt: new Date('2024-01-16'),
        isExpanded: true,
        color: '#3b82f6'
      },
      {
        id: '4',
        name: 'Vidéos',
        path: '/videos',
        children: [],
        files: [
          {
            id: 'f4',
            name: 'demo.mp4',
            type: 'video',
            size: 10485760,
            url: '#',
            createdAt: new Date('2024-01-20'),
            modifiedAt: new Date('2024-01-20'),
            tags: ['demo'],
            isFavorite: false
          }
        ],
        createdAt: new Date('2024-01-20'),
        modifiedAt: new Date('2024-01-20'),
        isExpanded: false,
        color: '#ea580c'
      },
      {
        id: '5',
        name: 'Documents',
        path: '/documents',
        children: [],
        files: [
          {
            id: 'f5',
            name: 'rapport.pdf',
            type: 'document',
            size: 512000,
            url: '#',
            createdAt: new Date('2024-01-25'),
            modifiedAt: new Date('2024-01-25'),
            tags: ['travail'],
            isFavorite: false
          }
        ],
        createdAt: new Date('2024-01-25'),
        modifiedAt: new Date('2024-01-25'),
        isExpanded: false,
        color: '#7c3aed'
      }
    ],
    currentFolder: null,
    selectedFiles: [],
    searchQuery: '',
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const updateFolder = useCallback((folderId: string, updates: Partial<MediaFolder>) => {
    setState(prev => ({
      ...prev,
      folders: updateFolderInTree(prev.folders, folderId, updates)
    }));
  }, []);

  const updateFolderInTree = (folders: MediaFolder[], folderId: string, updates: Partial<MediaFolder>): MediaFolder[] => {
    return folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, ...updates };
      }
      if (folder.children.length > 0) {
        return {
          ...folder,
          children: updateFolderInTree(folder.children, folderId, updates)
        };
      }
      return folder;
    });
  };

  const createFolder = useCallback((parentId: string, name: string) => {
    const newFolder: MediaFolder = {
      id: Date.now().toString(),
      name,
      path: `${parentId}/${name}`,
      parentId,
      children: [],
      files: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
      isExpanded: false,
      color: '#6b7280'
    };

    setState(prev => ({
      ...prev,
      folders: addFolderToTree(prev.folders, parentId, newFolder)
    }));
  }, []);

  const addFolderToTree = (folders: MediaFolder[], parentId: string, newFolder: MediaFolder): MediaFolder[] => {
    return folders.map(folder => {
      if (folder.id === parentId) {
        return {
          ...folder,
          children: [...folder.children, newFolder],
          modifiedAt: new Date()
        };
      }
      if (folder.children.length > 0) {
        return {
          ...folder,
          children: addFolderToTree(folder.children, parentId, newFolder)
        };
      }
      return folder;
    });
  };

  const toggleFolder = useCallback((folderId: string) => {
    updateFolder(folderId, { isExpanded: !getFolderById(state.folders, folderId)?.isExpanded });
  }, [state.folders, updateFolder]);

  const getFolderById = (folders: MediaFolder[], folderId: string): MediaFolder | null => {
    for (const folder of folders) {
      if (folder.id === folderId) return folder;
      const found = getFolderById(folder.children, folderId);
      if (found) return found;
    }
    return null;
  };

  const setCurrentFolder = useCallback((folder: MediaFolder | null) => {
    setState(prev => ({ ...prev, currentFolder: folder }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  }, []);

  const setViewMode = useCallback((mode: 'grid' | 'list') => {
    setState(prev => ({ ...prev, viewMode: mode }));
  }, []);

  const toggleFileSelection = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.includes(fileId)
        ? prev.selectedFiles.filter(id => id !== fileId)
        : [...prev.selectedFiles, fileId]
    }));
  }, []);

  const filteredFiles = useMemo(() => {
    if (!state.currentFolder) return [];
    
    let files = state.currentFolder.files;
    
    if (state.searchQuery) {
      files = files.filter(file => 
        file.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        file.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
    }
    
    return files.sort((a, b) => {
      const aValue = a[state.sortBy];
      const bValue = b[state.sortBy];
      const modifier = state.sortOrder === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });
  }, [state.currentFolder, state.searchQuery, state.sortBy, state.sortOrder]);

  return {
    state,
    updateFolder,
    createFolder,
    toggleFolder,
    setCurrentFolder,
    setSearchQuery,
    setViewMode,
    toggleFileSelection,
    filteredFiles,
    getFolderById
  };
};