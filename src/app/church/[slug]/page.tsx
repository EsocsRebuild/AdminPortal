import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2, Calendar, Clock, MapPin, Megaphone, Phone, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crest } from "@/components/icons/logo";

interface ParishData {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  pastor: {
    name: string;
    title: string;
    avatarUrl?: string;
  };
  services: Array<{
    title: string;
    day: string;
    time: string;
    description: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    date: string;
    summary: string;
  }>;
  givingFundId: string;
}

const mockParishes: Record<string, ParishData> = {
  "mount-zion": {
    slug: "mount-zion",
    name: "Mount Zion Parish",
    tagline: "A sanctuary of worship, spiritual growth, and community transformation.",
    address: "12 Mount Zion Way, Surulere, Lagos, Nigeria",
    phone: "+234 (0) 803 123 4567",
    email: "mountzion@esocs.org",
    pastor: {
      name: "Senior Apostle D. A. Okunola",
      title: "Parish Pastor & Sub-District Chairman",
    },
    services: [
      {
        title: "Sunday Divine Service & Communion",
        day: "Sundays",
        time: "09:00 AM - 12:30 PM",
        description: "Join us for praise, worship, prophetic teaching, and holy communion.",
      },
      {
        title: "Midweek Power & Mercy Hour",
        day: "Wednesdays",
        time: "05:30 PM - 07:00 PM",
        description: "Intercessory prayers, deliverance, and spiritual warfare teachings.",
      },
      {
        title: "Koinonia Fellowship & Youth Bible Study",
        day: "Fridays",
        time: "06:00 PM - 07:30 PM",
        description: "Interactive word study, mentoring, and fellowship for youths.",
      },
    ],
    announcements: [
      {
        id: "1",
        title: "Annual Mount Zion Covenant Convention 2026",
        date: "October 15 - 18, 2026",
        summary: "Join us for 4 days of divine visitation, healing, and prophetic empowerment.",
      },
      {
        id: "2",
        title: "Harvest & Stewardship Committee Registration",
        date: "October 8, 2026",
        summary: "Volunteer members are invited to register for the upcoming Harvest Planning Team.",
      },
    ],
    givingFundId: "fund-mount-zion-general",
  },
  surulere: {
    slug: "surulere",
    name: "Surulere Central Parish",
    tagline: "Empowering lives through the eternal Gospel of Christ.",
    address: "88 Western Avenue, Surulere, Lagos, Nigeria",
    phone: "+234 (0) 802 987 6543",
    email: "surulere@esocs.org",
    pastor: {
      name: "Special Apostle F. A. Johnson",
      title: "Parish Minister-in-Charge",
    },
    services: [
      {
        title: "Sunday Restoration Service",
        day: "Sundays",
        time: "08:30 AM - 11:45 AM",
        description: "Encounter God's presence through sacred songs and anointed preaching.",
      },
    ],
    announcements: [
      {
        id: "3",
        title: "Parish Welfare Outreach Drive",
        date: "October 12, 2026",
        summary: "Food distribution and free medical checks for community elders.",
      },
    ],
    givingFundId: "fund-surulere-general",
  },
};

import { backend } from "@/server/backend";

async function getParishData(slug: string): Promise<ParishData | null> {
  try {
    const u = await backend<{
      name: string;
      slug: string;
      tagline?: string;
      address?: string;
      locality?: string;
      phones?: string[];
      email?: string;
      leaders?: { name: string; role: string; photoUrl?: string }[];
      socialLinks?: { facebook?: string; youtube?: string; instagram?: string };
    }>(`/public/units/${encodeURIComponent(slug)}`, { auth: false });
    if (u) {
      return {
        name: u.name,
        slug: u.slug,
        tagline: u.tagline || "Holy Order of the Cherubim and Seraphim",
        address: u.address || u.locality || "Cathedral Sanctuary",
        phone: u.phones?.[0] || "+234 800 000 0000",
        email: u.email || "info@esocs.org",
        pastor: {
          name: u.leaders?.[0]?.name || "Parish Presiding Minister",
          title: u.leaders?.[0]?.role || "Minister-in-Charge",
        },
        services: [
          { title: "Divine Worship", day: "Sunday", time: "09:00 AM - 12:30 PM", description: "Liturgical devotion and corporate communion." },
          { title: "Midweek Spiritual Awakening", day: "Wednesday", time: "05:30 PM - 07:30 PM", description: "Bible study and spiritual intercession." },
          { title: "Spiritual Warfare & Vigil", day: "Friday", time: "11:00 PM - 03:00 AM", description: "Deliverance and nocturnal prayer." },
        ],
        announcements: [
          {
            id: "ann-1",
            title: "Sunday Harvest & Thanksgiving Service",
            date: "Upcoming Sunday",
            summary: "Corporate prayer, liturgical procession, and family thanksgiving.",
          },
        ],
        givingFundId: "fund-general",
      };
    }
  } catch {
    // Network fallback
  }

  return mockParishes[slug] ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parish = await getParishData(slug);
  if (!parish) return { title: "Parish Not Found | ESOCS" };
  return {
    title: `${parish.name} | Eternal Sacred Order of the Cherubim and Seraphim`,
    description: parish.tagline,
  };
}

export default async function ParishPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parish = await getParishData(slug);

  if (!parish) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner Section with Official Web Hero Background & Crest */}
      <section className="relative overflow-hidden border-b border-border bg-slate-950 py-16 md:py-24 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/hero-mount-zion.webp"
            alt="ESOCS Cathedral"
            fill
            priority
            className="object-cover object-center opacity-30 filter contrast-125 saturate-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start gap-5">
            <div className="flex items-center gap-4">
              <Crest size={56} priority className="ring-2 ring-amber-400/80 shadow-xl shadow-amber-950/50" />
              <div>
                <Badge tone="neutral" className="gap-1.5 px-3 py-1 bg-amber-400/10 border-amber-400/30 text-amber-400 font-semibold">
                  <Building2 className="size-3.5 text-amber-400" />
                  <span>Official ESOCS Parish Portal</span>
                </Badge>
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl font-brand text-white mt-1">{parish.name}</h1>
              </div>
            </div>
            <p className="max-w-2xl text-lg text-slate-300">{parish.tagline}</p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-950/40" asChild>
                <a href="#services">
                  <Calendar className="mr-2 size-4" />
                  Service Schedule & Worship
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800" asChild>
                <a href="#contact">
                  <Phone className="mr-2 size-4" />
                  Contact Pastoral Team
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Main Column */}
          <div className="space-y-8 md:col-span-2">
            {/* Pastoral Leadership Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCheck className="size-7" />
                </div>
                <div>
                  <div className="text-2xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Pastoral Leadership
                  </div>
                  <h2 className="text-xl font-bold">{parish.pastor.name}</h2>
                  <p className="text-sm text-muted-foreground">{parish.pastor.title}</p>
                </div>
              </div>
            </Card>

            {/* Service Times Schedule */}
            <section id="services" className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Clock className="size-5 text-primary" /> Service Schedule & Worship Times
              </h2>
              <div className="grid gap-4">
                {parish.services.map((svc) => (
                  <Card key={svc.title} className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{svc.title}</h3>
                      <Badge tone="outline">{svc.day}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                      <Clock className="size-3.5" />
                      <span>{svc.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{svc.description}</p>
                  </Card>
                ))}
              </div>
            </section>

            {/* Announcements Stream */}
            <section className="space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Megaphone className="size-5 text-primary" /> Parish Announcements & News
              </h2>
              <div className="grid gap-4">
                {parish.announcements.map((ann) => (
                  <Card key={ann.id} className="border-l-4 border-l-primary p-5">
                    <span className="text-2xs font-medium text-muted-foreground">{ann.date}</span>
                    <h3 className="text-base font-semibold">{ann.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{ann.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="space-y-4 p-6">
              <h3 className="border-b border-border pb-2 text-base font-bold">Location & Contact</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{parish.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="size-4 shrink-0 text-primary" />
                  <span>{parish.phone}</span>
                </div>
              </div>
            </Card>

            <Card className="space-y-3 bg-surface-muted/60 p-6 text-center">
              <h4 className="text-sm font-semibold">Need Pastoral Counseling?</h4>
              <p className="text-xs text-muted-foreground">
                Our pastors are available for spiritual guidance, prayers, and home visits.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Request Pastoral Call
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
