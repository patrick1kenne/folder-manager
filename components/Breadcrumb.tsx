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
  isSpecialView?: boolean;
  specialViewTitle?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentFolder,
  folders,
  onFolderSelect,
  getFolderById,
  isSpecialView = false,
  specialViewTitle
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
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-muted-foreground hover:text-foreground"
        onClick={() => onFolderSelect(null)}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {isSpecialView ? (
        <>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{specialViewTitle}</span>
        </>
      ) : (
        path.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 font-medium text-foreground hover:bg-accent"
              onClick={() => onFolderSelect(folder)}
            >
              {folder.name}
            </Button>
          </React.Fragment>
        ))
      )}
    </div>
  );
};