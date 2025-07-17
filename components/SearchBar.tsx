"use client";

import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des fichiers et dossiers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-accent"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <span className="font-medium">Type de fichier</span>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem>Images</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Vidéos</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Documents</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Audio</DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="font-medium">Taille</span>
          </DropdownMenuItem>
          <DropdownMenuCheckboxItem>Moins de 1 MB</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>1-10 MB</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem>Plus de 10 MB</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};