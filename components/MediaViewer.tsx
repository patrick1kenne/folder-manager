"use client";

import React from 'react';
import { 
  Image, 
  Video, 
  FileText, 
  Music, 
  Grid3X3, 
  List,
  Heart,
  Download,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { MediaFile } from '@/types/media';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MediaViewerProps {
  files: MediaFile[];
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: MediaFile['type']) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />;
    case 'video': return <Video className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    case 'document': return <FileText className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getFileTypeColor = (type: MediaFile['type']) => {
  switch (type) {
    case 'image': return 'bg-green-100 text-green-800';
    case 'video': return 'bg-purple-100 text-purple-800';
    case 'audio': return 'bg-blue-100 text-blue-800';
    case 'document': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const FileCard: React.FC<{
  file: MediaFile;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
}> = ({ file, isSelected, onSelect }) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group",
        isSelected && "ring-2 ring-blue-500"
      )}
      onClick={() => onSelect(file.id)}
    >
      <CardContent className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
          {file.type === 'image' && file.thumbnail ? (
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-400">
                {getFileIcon(file.type)}
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="h-4 w-4 mr-2" />
                  {file.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {file.isFavorite && (
            <div className="absolute top-2 left-2">
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-sm truncate">{file.name}</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <Badge variant="secondary" className={cn("text-xs", getFileTypeColor(file.type))}>
              {file.type}
            </Badge>
          </div>
          
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {file.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{file.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const FileRow: React.FC<{
  file: MediaFile;
  isSelected: boolean;
  onSelect: (fileId: string) => void;
}> = ({ file, isSelected, onSelect }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-accent group transition-colors",
        isSelected && "bg-accent"
      )}
      onClick={() => onSelect(file.id)}
    >
      <div className="flex-shrink-0">
        {file.type === 'image' && file.thumbnail ? (
          <img 
            src={file.thumbnail} 
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm truncate">{file.name}</h3>
          {file.isFavorite && (
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <Badge variant="secondary" className={cn("text-xs", getFileTypeColor(file.type))}>
            {file.type}
          </Badge>
          <span>{file.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {file.tags.length > 0 && (
          <div className="flex gap-1">
            {file.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="h-4 w-4 mr-2" />
                {file.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export const MediaViewer: React.FC<MediaViewerProps> = ({
  files,
  viewMode,
  selectedFiles,
  onFileSelect,
  onViewModeChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {files.length} fichier{files.length > 1 ? 's' : ''}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <Image className="h-12 w-12 mx-auto" />
          </div>
          <p className="text-muted-foreground">Aucun fichier dans ce dossier</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={onFileSelect}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              isSelected={selectedFiles.includes(file.id)}
              onSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};