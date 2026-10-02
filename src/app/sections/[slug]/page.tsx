import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, CheckCircle2, FileText, Newspaper, Users2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SectionData {
  slug: string;
  name: string;
  motto: string;
  vision: string;
  executiveBoard: Array<{
    name: string;
    role: string;
  }>;
  programmes: Array<{
    title: string;
    date: string;
    location: string;
    description: string;
    registrationOpen: boolean;
    formSlug?: string;
  }>;
  news: Array<{
    id: string;
    title: string;
    date: string;
    category: string;
    excerpt: string;
  }>;
}

const mockSections: Record<string, SectionData> = {
  "women-fellowship": {
    slug: "women-fellowship",
    name: "Women Fellowship (National Wing)",
    motto: "Virtue, Prayer, and Christian Stewardship",
    vision: "To raise spiritually vibrant, virtuous women of integrity in the church and society.",
    executiveBoard: [
      { name: "Mother in Israel E. A. Adebayo", role: "National President" },
      { name: "Senior Mother O. F. Williams", role: "General Secretary" },
      { name: "Mother S. O. Balogun", role: "National Treasurer" },
    ],
    programmes: [
      {
        title: "Annual National Women Conference 2026",
        date: "November 12 - 15, 2026",
        location: "Cathedral HQ, Lagos & Virtual Stream",
        description: "4-day spiritual retreat focusing on Christian marriage, health, and leadership.",
        registrationOpen: true,
        formSlug: "women-conference-2026",
      },
    ],
    news: [
      {
        id: "wf-1",
        title: "Women Fellowship Welfare Outreach Donates N2M to Orphanages",
        date: "September 28, 2026",
        category: "Welfare & Charity",
        excerpt:
          "The National Women Executive Board presented food items and medical supplies across Lagos state.",
      },
    ],
  },
  "youth-fellowship": {
    slug: "youth-fellowship",
    name: "Youth Fellowship & Young Adults Wing",
    motto: "Arise, Shine; For Thy Light Is Come",
    vision: "Mobilizing a generation of kingdom-minded youths for spiritual impact and excellence.",
    executiveBoard: [
      { name: "Bro. Emmanuel Okeke", role: "National Youth Leader" },
      { name: "Sis. Grace Danjuma", role: "Secretary General" },
    ],
    programmes: [
      {
        title: "National Youth Leadership & Empowerment Retreat",
        date: "December 4 - 6, 2026",
        location: "ESOCS Youth Camp Ground, Abeokuta",
        description: "Capacity building, tech skills workshops, and intense spiritual revival.",
        registrationOpen: true,
        formSlug: "youth-retreat-2026",
      },
    ],
    news: [
      {
        id: "yf-1",
        title: "Registration Opens for 2026 Youth Camp (Seat Limit: 120)",
        date: "October 1, 2026",
        category: "Events",
        excerpt: "Early bird registration is now open with live seat capacity tracking.",
      },
    ],
  },
};

import { backend } from "@/server/backend";

async function getSectionData(slug: string): Promise<SectionData | null> {
  try {
    const u = await backend<any>(`/public/units/${encodeURIComponent(slug)}`, { auth: false });
    if (u) {
      return {
        name: u.name,
        slug: u.slug,
        motto: u.tagline || (Array.isArray(u.about) ? u.about[0] : "") || "Walking in righteousness and faith.",
        vision: (Array.isArray(u.about) && u.about.length > 1 ? u.about[1] : u.tagline) || "Autonomous ministerial arm of the Holy Order dedicated to spiritual growth and service.",
        executiveBoard: Array.isArray(u.leaders) && u.leaders.length > 0
          ? u.leaders.map((l: any) => ({ name: l.name, role: l.role }))
          : [{ name: "Executive Directorate", role: "Administration" }],
        programmes: [
          {
            title: "Weekly Assembly & Fellowship",
            date: "Every Sunday, 09:00 AM",
            location: u.locality || "Cathedral Sanctuary",
            description: "Fellowship gathering, Bible study, and ministerial coordination.",
            registrationOpen: false,
          },
        ],
        news: [
          {
            id: "news-1",
            title: `${u.name} Directorate Updates`,
            date: "Current Season",
            category: "Announcements",
            excerpt: "Stay connected with upcoming programs, service rosters, and ministry initiatives.",
          },
        ],
      };
    }
  } catch {
    // Fall back to seeded mock sections if offline or unseeded
  }

  return mockSections[slug] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = await getSectionData(slug);
  if (!section) return { title: "Section Not Found | ESOCS" };
  return {
    title: `${section.name} | ESOCS Order`,
    description: section.motto,
  };
}

export default async function SectionPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = await getSectionData(slug);

  if (!section) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-amber-500/10 via-surface to-background py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start gap-4">
            <Badge tone="neutral" className="gap-1.5 px-3 py-1">
              <Users2 className="size-3.5 text-amber-500" />
              <span>National Fellowship & Directorate Section</span>
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{section.name}</h1>
            <p className="text-lg font-medium text-primary italic">&ldquo;{section.motto}&rdquo;</p>
            <p className="max-w-2xl text-base text-muted-foreground">{section.vision}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 md:col-span-2">
            {/* Programmes & Conferences */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Calendar className="size-5 text-amber-500" /> Upcoming Programmes & Conferences
              </h2>
              <div className="grid gap-4">
                {section.programmes.map((prog) => (
                  <Card key={prog.title} className="space-y-3 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{prog.title}</h3>
                      {prog.registrationOpen && <Badge tone="success">Registration Open</Badge>}
                    </div>
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {prog.date} • {prog.location}
                    </div>
                    <p className="text-sm text-muted-foreground">{prog.description}</p>

                    {prog.formSlug && (
                      <div className="pt-2">
                        <Button asChild size="sm">
                          <Link href={`/f/${prog.formSlug}`}>
                            <FileText className="mr-2 size-4" />
                            Register Online Now
                          </Link>
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Fellowship News Stream */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Newspaper className="size-5 text-amber-500" /> Fellowship News & Updates
              </h2>
              <div className="grid gap-4">
                {section.news.map((item) => (
                  <Card key={item.id} className="p-5">
                    <div className="flex items-center gap-2 text-2xs font-semibold text-muted-foreground">
                      <Badge tone="outline">{item.category}</Badge>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.excerpt}</p>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="space-y-4 p-6">
              <h3 className="border-b border-border pb-2 text-base font-bold">Executive Board</h3>
              <div className="space-y-3">
                {section.executiveBoard.map((exec) => (
                  <div key={exec.name} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    <div>
                      <div className="font-semibold">{exec.name}</div>
                      <div className="text-2xs text-muted-foreground">{exec.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
