"use client";

import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  FolderPlus,
  Star,
  Clock,
  Home
} from 'lucide-react';
import { MediaFolder } from '@/types/media';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FolderTreeProps {
  folders: MediaFolder[];
  currentFolder: MediaFolder | null;
  onFolderSelect: (folder: MediaFolder | null) => void;
  onToggleFolder: (folderId: string) => void;
  onCreateFolder: (parentId: string, name: string) => void;
  onUpdateFolder: (folderId: string, updates: Partial<MediaFolder>) => void;
  onDeleteFolder: (folderId: string) => void;
  onShowFavorites: () => void;
  onShowRecent: () => void;
  favoriteCount: number;
  recentCount: number;
}

interface FolderNodeProps {
  folder: MediaFolder;
  level: number;
  isSelected: boolean;
  onSelect: (folder: MediaFolder) => void;
  onToggle: (folderId: string) => void;
  onCreateFolder: (parentId: string, name: string) => void;
  onUpdateFolder: (folderId: string, updates: Partial<MediaFolder>) => void;
  onDeleteFolder: (folderId: string) => void;
}

const FolderNode: React.FC<FolderNodeProps> = ({
  folder,
  level,
  isSelected,
  onSelect,
  onToggle,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(folder.name);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleEdit = () => {
    setIsEditing(true);
    setEditName(folder.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editName !== folder.name) {
      onUpdateFolder(folder.id, { name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(folder.id, newFolderName.trim());
      setNewFolderName('');
    }
    setIsCreating(false);
  };

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folder.name}" ?`)) {
      onDeleteFolder(folder.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'edit' | 'create') => {
    if (e.key === 'Enter') {
      if (action === 'edit') handleSaveEdit();
      else handleCreateFolder();
    } else if (e.key === 'Escape') {
      if (action === 'edit') setIsEditing(false);
      else setIsCreating(false);
    }
  };

  const fileCount = folder.files.length + folder.children.reduce((acc, child) => acc + child.files.length, 0);

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer hover:bg-accent/50 group transition-all duration-200",
          isSelected && "bg-accent font-medium shadow-sm",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {folder.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-accent/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(folder.id);
            }}
          >
            {folder.isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {folder.isExpanded && folder.children.length > 0 ? (
            <FolderOpen className="h-4 w-4 flex-shrink-0" style={{ color: folder.color }} />
          ) : (
            <Folder className="h-4 w-4 flex-shrink-0" style={{ color: folder.color }} />
          )}
          
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => handleKeyPress(e, 'edit')}
              className="h-6 py-0 text-sm flex-1"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0" onClick={() => onSelect(folder)}>
              <span className="truncate text-sm flex-1">{folder.name}</span>
              {fileCount > 0 && (
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                  {fileCount}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent/70"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreating(true);
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent/70"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Renommer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreating(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouveau dossier
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isCreating && (
        <div style={{ paddingLeft: `${(level + 1) * 16 + 8}px` }} className="px-2 py-1">
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-muted-foreground" />
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onBlur={handleCreateFolder}
              onKeyDown={(e) => handleKeyPress(e, 'create')}
              placeholder="Nom du dossier"
              className="h-6 py-0 text-sm flex-1"
              autoFocus
            />
          </div>
        </div>
      )}

      {folder.isExpanded && folder.children.map((child) => (
        <FolderNode
          key={child.id}
          folder={child}
          level={level + 1}
          isSelected={isSelected}
          onSelect={onSelect}
          onToggle={onToggle}
          onCreateFolder={onCreateFolder}
          onUpdateFolder={onUpdateFolder}
          onDeleteFolder={onDeleteFolder}
        />
      ))}
    </div>
  );
};

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  currentFolder,
  onFolderSelect,
  onToggleFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onShowFavorites,
  onShowRecent,
  favoriteCount,
  recentCount,
}) => {
  return (
    <div className="space-y-2">
      {/* Quick Access */}
      <div className="space-y-1">
        <Button
          variant={currentFolder === null ? "default" : "ghost"}
          size="sm"
          className="w-full justify-start h-9"
          onClick={() => onFolderSelect(null)}
        >
          <Home className="h-4 w-4 mr-2" />
          Tous les fichiers
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-9"
          onClick={onShowFavorites}
        >
          <Star className="h-4 w-4 mr-2" />
          Favoris
          {favoriteCount > 0 && (
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {favoriteCount}
            </span>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-9"
          onClick={onShowRecent}
        >
          <Clock className="h-4 w-4 mr-2" />
          Récents
          {recentCount > 0 && (
            <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {recentCount}
            </span>
          )}
        </Button>
      </div>

      <div className="h-px bg-border my-3" />

      {/* Folder Tree */}
      <div className="space-y-1">
        {folders.map((folder) => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            isSelected={currentFolder?.id === folder.id}
            onSelect={onFolderSelect}
            onToggle={onToggleFolder}
            onCreateFolder={onCreateFolder}
            onUpdateFolder={onUpdateFolder}
            onDeleteFolder={onDeleteFolder}
          />
        ))}
      </div>
    </div>
  );
};