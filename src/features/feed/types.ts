export type FeedItemType = "event" | "ordination" | "announcement" | "bulletin" | "milestone";

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  unitName: string;
  provinceName: string;
  timestamp: string;
  mediaUrl?: string | null;
  badgeText?: string;
  actionUrl?: string;
  actionText?: string;
  stats: {
    amens: number;
    shares: number;
    comments: number;
  };
}

