"use client";

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { MediaFolder } from '@/types/media';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
  currentFolder: MediaFolder | null;
  folders: MediaFolder[];
  onFolderSelect: (folder: MediaFolder | null) => void;
  getFolderById: (folders: MediaFolder[], folderId: string) => MediaFolder | null;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentFolder,
  folders,
  onFolderSelect,
  getFolderById,
}) => {
  const getPath = (folder: MediaFolder | null): MediaFolder[] => {
    if (!folder) return [];
    
    const path: MediaFolder[] = [];
    let current = folder;
    
    while (current) {
      path.unshift(current);
      if (current.parentId) {
        current = getFolderById(folders, current.parentId);
      } else {
        current = null;
      }
    }
    
    return path;
  };

  const path = getPath(currentFolder);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => onFolderSelect(null)}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {path.map((folder, index) => (
        <React.Fragment key={folder.id}>
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 font-medium"
            onClick={() => onFolderSelect(folder)}
          >
            {folder.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};