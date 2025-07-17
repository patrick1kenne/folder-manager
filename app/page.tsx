"use client";

import React from 'react';
import { useMediaManager } from '@/hooks/useMediaManager';
import { FolderTree } from '@/components/FolderTree';
import { MediaViewer } from '@/components/MediaViewer';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SearchBar } from '@/components/SearchBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload, FolderPlus, RefreshCw } from 'lucide-react';

export default function Home() {
  const {
    state,
    createFolder,
    toggleFolder,
    setCurrentFolder,
    setSearchQuery,
    setViewMode,
    toggleFileSelection,
    filteredFiles,
    getFolderById,
    updateFolder
  } = useMediaManager();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestionnaire de Médias
          </h1>
          <p className="text-muted-foreground">
            Organisez et gérez vos fichiers média en toute simplicité
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Arborescence */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Dossiers</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => createFolder('1', 'Nouveau dossier')}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Nouveau dossier
                  </Button>
                </div>
                <Separator className="mb-4" />
                <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                  <FolderTree
                    folders={state.folders}
                    currentFolder={state.currentFolder}
                    onFolderSelect={setCurrentFolder}
                    onToggleFolder={toggleFolder}
                    onCreateFolder={createFolder}
                    onUpdateFolder={updateFolder}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <SearchBar
                      searchQuery={state.searchQuery}
                      onSearchChange={setSearchQuery}
                    />
                  </div>
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
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <Breadcrumb
                    currentFolder={state.currentFolder}
                    folders={state.folders}
                    onFolderSelect={setCurrentFolder}
                    getFolderById={getFolderById}
                  />
                  
                  <Separator />
                  
                  <div className="overflow-y-auto max-h-[calc(100vh-400px)]">
                    <MediaViewer
                      files={filteredFiles}
                      viewMode={state.viewMode}
                      selectedFiles={state.selectedFiles}
                      onFileSelect={toggleFileSelection}
                      onViewModeChange={setViewMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}