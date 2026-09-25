export interface Notification {
  id: string;
  title: string;
  body: string | null;
  /** In-app link to open, e.g. "/members/123". */
  href: string | null;
  tone: "info" | "success" | "warning" | "danger";
  read: boolean;
  createdAt: string;
}
