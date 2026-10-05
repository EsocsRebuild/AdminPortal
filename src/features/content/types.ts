export interface PageItem {
  id: string;
  title: string;
  slug: string;
  path: string;
  parentId?: string | null;
  summary?: string | null;
  template: string;
  showInNavigation: boolean;
  sortOrder: number;
  status: "Draft" | "Published" | "Scheduled" | "Archived";
  publishedAt?: string | null;
  scheduledFor?: string | null;
  updatedAt?: string | null;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  authorName?: string | null;
  category?: string | null;
  tags: string[];
  isFeatured: boolean;
  status: "Draft" | "Published" | "Scheduled" | "Archived";
  publishedAt?: string | null;
  scheduledFor?: string | null;
}

export interface SermonItem {
  id: string;
  title: string;
  slug: string;
  seriesId?: string | null;
  seriesTitle?: string | null;
  preacher: string;
  preachedOn: string;
  scriptureReferences: string[];
  summary?: string | null;
  notes?: string | null;
  videoUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  durationSeconds?: number | null;
  tags: string[];
  status: "Draft" | "Published" | "Scheduled" | "Archived";
  publishedAt?: string | null;
}

export interface SeriesItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  startsOn?: string | null;
  endsOn?: string | null;
  sermonCount: number;
}
