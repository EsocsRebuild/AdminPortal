export const fieldTypes = [
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "date",
  "select",
  "radio",
  "checkboxes",
  "consent",
  "section",
] as const;
export type FieldType = (typeof fieldTypes)[number];

export const choiceTypes: FieldType[] = ["select", "radio", "checkboxes"];

export interface FieldOption {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description: string | null;
  placeholder: string | null;
  required: boolean;
  options: FieldOption[] | null;
  validation: { min?: number | null; max?: number | null; maxLength?: number | null } | null;
}

export const formStatuses = ["draft", "published", "closed"] as const;
export type FormStatus = (typeof formStatuses)[number];

export const formStatusLabels: Record<FormStatus, string> = {
  draft: "Draft",
  published: "Live",
  closed: "Closed",
};

export interface FormSettings {
  submitLabel: string;
  confirmationTitle: string;
  confirmationMessage: string;
  /** Optional https page to send people to after submitting. */
  redirectUrl: string | null;
  closesAt: string | null;
  responseLimit: number | null;
  /** Staff addresses told about each new response. */
  notifyEmails: string[];
  /** Adds respondents who tick the consent question to this audience. */
  audienceId: string | null;
}

export interface FormSummary {
  id: string;
  title: string;
  slug: string;
  status: FormStatus;
  responseCount: number;
  updatedAt: string;
  publishedAt: string | null;
}

export interface Form extends FormSummary {
  description: string | null;
  fields: FormField[];
  settings: FormSettings;
}

export type Answer = string | string[] | boolean | number | null;

export interface FormResponse {
  id: string;
  submittedAt: string;
  answers: Record<string, Answer>;
}

/** What the public page receives. No internal ids beyond field ids. */
export interface PublicForm {
  slug: string;
  title: string;
  description: string | null;
  status: FormStatus;
  fields: FormField[];
  settings: Pick<FormSettings, "submitLabel" | "confirmationTitle" | "confirmationMessage" | "redirectUrl">;
  organisationName: string;
}
