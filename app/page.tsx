"use client";

import React, { useState } from 'react';
import { useMediaManager } from '@/hooks/useMediaManager';
import { FolderTree } from '@/components/FolderTree';
import { MediaViewer } from '@/components/MediaViewer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchBar } from '@/components/SearchBar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus, RefreshCw, Settings, HardDrive } from 'lucide-react';

type ViewType = 'folder' | 'favorites' | 'recent';

export default function Home() {
  const {
    state,
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
    getFolderById,
    updateFolder
  } = useMediaManager();

  const [currentView, setCurrentView] = useState<ViewType>('folder');

  const handleShowFavorites = () => {
    setCurrentView('favorites');
    setCurrentFolder(null);
  };

  const handleShowRecent = () => {
    setCurrentView('recent');
    setCurrentFolder(null);
  };

  const handleFolderSelect = (folder: any) => {
    setCurrentView('folder');
    setCurrentFolder(folder);
  };

  const getCurrentFiles = () => {
    switch (currentView) {
      case 'favorites':
        return favoriteFiles;
      case 'recent':
        return recentFiles;
      default:
        return filteredFiles;
    }
  };

  const getCurrentTitle = () => {
    switch (currentView) {
      case 'favorites':
        return 'Favoris';
      case 'recent':
        return 'Fichiers récents';
      default:
        return state.currentFolder ? state.currentFolder.name : 'Tous les fichiers';
    }
  };

  const totalSize = allFiles.reduce((acc, file) => acc + file.size, 0);
  const formatTotalSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestionnaire de Médias
              </h1>
              <p className="text-muted-foreground">
                Organisez et gérez vos fichiers média en toute simplicité
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-2 rounded-lg border">
                <HardDrive className="h-4 w-4" />
                <span>{allFiles.length} fichiers • {formatTotalSize(totalSize)}</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
          
          <SearchBar
            searchQuery={state.searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-220px)] shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Navigation</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => createFolder('1', 'Nouveau dossier')}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-y-auto max-h-[calc(100vh-320px)]">
                  <FolderTree
                    folders={state.folders}
                    currentFolder={state.currentFolder}
                    onFolderSelect={handleFolderSelect}
                    onToggleFolder={toggleFolder}
                    onCreateFolder={createFolder}
                    onUpdateFolder={updateFolder}
                    onDeleteFolder={deleteFolder}
                    onShowFavorites={handleShowFavorites}
                    onShowRecent={handleShowRecent}
                    favoriteCount={favoriteFiles.length}
                    recentCount={recentFiles.length}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <Card className="h-[calc(100vh-220px)] shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Breadcrumb
                    currentFolder={state.currentFolder}
                    folders={state.folders}
                    onFolderSelect={handleFolderSelect}
                    getFolderById={getFolderById}
                    isSpecialView={currentView !== 'folder'}
                    specialViewTitle={currentView === 'favorites' ? 'Favoris' : currentView === 'recent' ? 'Récents' : undefined}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="pt-4">
                <div className="overflow-y-auto max-h-[calc(100vh-360px)]">
                  <MediaViewer
                    files={getCurrentFiles()}
                    viewMode={state.viewMode}
                    selectedFiles={state.selectedFiles}
                    sortBy={state.sortBy}
                    sortOrder={state.sortOrder}
                    onFileSelect={toggleFileSelection}
                    onViewModeChange={setViewMode}
                    onSortChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onSelectAll={selectAllFiles}
                    onClearSelection={clearSelection}
                    onToggleFavorite={toggleFileFavorite}
                    title={getCurrentTitle()}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}