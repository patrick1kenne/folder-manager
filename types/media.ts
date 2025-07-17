export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  createdAt: Date;
  modifiedAt: Date;
  tags: string[];
  isFavorite: boolean;
}

export interface MediaFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children: MediaFolder[];
  files: MediaFile[];
  createdAt: Date;
  modifiedAt: Date;
  isExpanded: boolean;
  color?: string;
}

export interface MediaManagerState {
  folders: MediaFolder[];
  currentFolder: MediaFolder | null;
  selectedFiles: string[];
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
}