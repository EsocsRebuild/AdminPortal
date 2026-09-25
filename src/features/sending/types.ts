export type DnsStatus = "pending" | "verified" | "failed";

export interface SendingDomain {
  id: string;
  domain: string;
  status: DnsStatus;
  /** Records to add at the domain's DNS provider (SPF, DKIM, DMARC, return-path). */
  records: {
    purpose: string;
    type: "TXT" | "CNAME" | "MX";
    host: string;
    value: string;
    status: DnsStatus;
  }[];
  lastCheckedAt: string | null;
}

export interface SendingSettings {
  organisationName: string;
  /** Required in every marketing email by anti-spam law. */
  postalAddress: string | null;
  defaultFromName: string | null;
  defaultFromEmail: string | null;
  defaultReplyTo: string | null;
  domains: SendingDomain[];
}
