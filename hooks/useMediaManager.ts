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
              },
              {
                id: 'f6',
                name: 'coucher-soleil.jpg',
                type: 'image',
                size: 1800000,
                url: 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                thumbnail: 'https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg?auto=compress&cs=tinysrgb&dpr=1&h=200&w=300',
                createdAt: new Date('2024-01-17'),
                modifiedAt: new Date('2024-01-17'),
                tags: ['vacances', 'coucher-soleil'],
                isFavorite: true
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

  const deleteFolder = useCallback((folderId: string) => {
    setState(prev => ({
      ...prev,
      folders: removeFolderFromTree(prev.folders, folderId),
      currentFolder: prev.currentFolder?.id === folderId ? null : prev.currentFolder
    }));
  }, []);

  const removeFolderFromTree = (folders: MediaFolder[], folderId: string): MediaFolder[] => {
    return folders.filter(folder => folder.id !== folderId).map(folder => ({
      ...folder,
      children: removeFolderFromTree(folder.children, folderId)
    }));
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

  const setSortBy = useCallback((sortBy: 'name' | 'date' | 'size' | 'type') => {
    setState(prev => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: 'asc' | 'desc') => {
    setState(prev => ({ ...prev, sortOrder }));
  }, []);

  const toggleFileSelection = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      selectedFiles: prev.selectedFiles.includes(fileId)
        ? prev.selectedFiles.filter(id => id !== fileId)
        : [...prev.selectedFiles, fileId]
    }));
  }, []);

  const selectAllFiles = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFiles: filteredFiles.map(file => file.id)
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedFiles: [] }));
  }, []);

  const toggleFileFavorite = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      folders: prev.folders.map(folder => ({
        ...folder,
        files: folder.files.map(file => 
          file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
        ),
        children: folder.children.map(child => ({
          ...child,
          files: child.files.map(file => 
            file.id === fileId ? { ...file, isFavorite: !file.isFavorite } : file
          )
        }))
      }))
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
      let aValue: any = a[state.sortBy];
      let bValue: any = b[state.sortBy];
      
      if (state.sortBy === 'date') {
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
      }
      
      const modifier = state.sortOrder === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * modifier;
      if (aValue > bValue) return 1 * modifier;
      return 0;
    });
  }, [state.currentFolder, state.searchQuery, state.sortBy, state.sortOrder]);

  const allFiles = useMemo(() => {
    const getAllFiles = (folders: MediaFolder[]): MediaFile[] => {
      let files: MediaFile[] = [];
      folders.forEach(folder => {
        files = [...files, ...folder.files];
        if (folder.children.length > 0) {
          files = [...files, ...getAllFiles(folder.children)];
        }
      });
      return files;
    };
    return getAllFiles(state.folders);
  }, [state.folders]);

  const favoriteFiles = useMemo(() => {
    return allFiles.filter(file => file.isFavorite);
  }, [allFiles]);

  const recentFiles = useMemo(() => {
    return [...allFiles]
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
      .slice(0, 10);
  }, [allFiles]);

  return {
    state,
    updateFolder,
    createFolder,
    deleteFolder,
    toggleFolder,
    setCurrentFolder,
    setSearchQuery,
    setViewMode,
    setSortBy,
    setSortOrder,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    toggleFileFavorite,
    filteredFiles,
    allFiles,
    favoriteFiles,
    recentFiles,
    getFolderById
  };
};