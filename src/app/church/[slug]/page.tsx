import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Wallet,
  Mail,
  HeartHandshake,
  Church,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crest } from "@/components/icons/logo";
import { backend } from "@/server/backend";
import { getSession } from "@/server/session";

interface ParishPublicData {
  id: string;
  slug: string;
  name: string;
  kind: string;
  parentName?: string | null;
  tagline?: string | null;
  address?: string | null;
  locality?: string | null;
  phones?: string[];
  email?: string | null;
  leaders?: { name: string; role: string }[];
}

interface WebEventItem {
  id: string;
  title: string;
  type: string;
  summary?: string;
  description?: string;
  startsAt: string;
  location?: string | null;
  capacity?: number | null;
  registrationEnabled?: boolean;
}

async function getParishData(slug: string): Promise<ParishPublicData | null> {
  try {
    const res = await backend<ParishPublicData>(`/public/units/${encodeURIComponent(slug)}`, {
      auth: false,
    });
    return res ?? null;
  } catch {
    return null;
  }
}

async function getUnitPublicEvents(unitId: string): Promise<WebEventItem[]> {
  try {
    const res = await backend<{ items?: WebEventItem[] } | WebEventItem[]>("/events", {
      auth: false,
      query: { unitId },
    });
    return Array.isArray(res) ? res : res?.items || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const parish = await getParishData(slug);
  if (!parish) return { title: "Parish Not Found | ESOCS" };
  return {
    title: `${parish.name} | Eternal Sacred Order of the Cherubim and Seraphim`,
    description:
      parish.tagline ||
      `Official portal and service schedule for ${parish.name}, ${parish.parentName || "The Holy Order"}.`,
  };
}

export default async function ParishPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  const { slug } = await params;
  const parish = await getParishData(slug);

  if (!parish) {
    notFound();
  }

  const events = await getUnitPublicEvents(parish.id);

  // Derive factual, dignified location text
  const locationText =
    parish.address ||
    (parish.locality
      ? `${parish.locality}, Rivers State`
      : parish.parentName
        ? `${parish.name}, ${parish.parentName}, Nigeria`
        : `${parish.name}, Nigeria`);

  const primaryPhone =
    parish.phones && parish.phones.length > 0 && parish.phones[0] !== "+234 800 000 0000"
      ? parish.phones[0]
      : null;

  const contactEmail = parish.email || "secretariat@esocs.org";

  const liturgicalServices = [
    {
      title: "Sunday Divine Worship & Corporate Communion",
      day: "Sundays",
      time: "09:00 AM - 12:30 PM",
      description:
        "Sacred liturgical devotion, scriptural sermon, and apostolic communion with the congregation.",
      badge: "Main Service",
    },
    {
      title: "Midweek Spiritual Awakening & Bible Exegesis",
      day: "Wednesdays",
      time: "05:30 PM - 07:30 PM",
      description: "In-depth Bible study, congregational intercessory prayer, and theological grounding.",
      badge: "Spiritual Growth",
    },
    {
      title: "Nocturnal Vigil & Deliverance Hour",
      day: "1st & 3rd Fridays",
      time: "11:00 PM - 03:00 AM",
      description: "Prophetic prayer vigil, personal spiritual warfare, and family intercession.",
      badge: "Prayer Vigil",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Admin Preview Mode Bar (Visible when admin is signed in) */}
      {session && (
        <aside
          aria-label="Admin Preview Mode"
          className="sticky top-0 z-50 flex items-center justify-between border-b border-amber-500/30 bg-slate-900/95 px-4 py-2.5 backdrop-blur-xl sm:px-8"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex size-2 animate-pulse rounded-full bg-emerald-400" />
            <Badge tone="primary" className="text-2xs tracking-wider uppercase">
              ADMIN PREVIEW MODE
            </Badge>
            <span className="hidden text-xs text-slate-300 sm:inline">
              Live previewing <strong className="text-amber-400">{parish.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin-web/dashboard"
              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-2xs font-bold text-amber-400 transition-colors hover:bg-amber-500/20"
            >
              ← Back to Web Studio
            </Link>
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-2xs font-semibold text-slate-300 transition-colors hover:bg-slate-700 hover:text-white sm:flex"
            >
              <Church className="size-3 text-amber-400" />
              Main Church Admin
            </Link>
          </div>
        </aside>
      )}

      {/* 2. Official Public Website Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 px-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4">
          <Link href={`/church/${parish.slug}`} className="group flex items-center gap-3">
            <Crest
              size={38}
              priority
              className="shadow-md ring-2 shadow-amber-950/40 ring-amber-400/80 transition-transform group-hover:scale-105"
            />
            <div>
              <span className="block font-brand text-xs font-extrabold tracking-wide text-white sm:text-sm">
                THE ETERNAL SACRED ORDER
              </span>
              <span className="text-3xs block font-semibold tracking-wider text-amber-400 uppercase sm:text-2xs">
                {parish.name}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-6 text-xs font-medium text-slate-300 md:flex">
            <a href="#about" className="transition-colors hover:text-amber-400">
              About
            </a>
            <a href="#services" className="transition-colors hover:text-amber-400">
              Worship Times
            </a>
            <a href="#events" className="transition-colors hover:text-amber-400">
              Events
            </a>
            <a href="#giving" className="transition-colors hover:text-amber-400">
              Giving
            </a>
            <a href="#contact" className="transition-colors hover:text-amber-400">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-bold text-amber-300 transition-all hover:bg-amber-400/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand/hero-mount-zion.webp"
            alt="ESOCS Cathedral"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-25 contrast-125 saturate-110 filter"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold tracking-wide text-amber-400 uppercase">
                <Building2 className="size-3.5" />
                Official Diocesan Assembly
              </span>
              {parish.parentName && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs font-medium text-slate-300">
                  {parish.parentName}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="font-brand text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {parish.name}
              </h1>
              <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
                {parish.tagline ||
                  "The Holy Order of the Cherubim and Seraphim — A sanctuary of holiness, prayer, scriptural truth, and apostolic fellowship."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                className="bg-amber-500 font-bold text-slate-950 shadow-lg shadow-amber-950/40 hover:bg-amber-400"
                asChild
              >
                <a href="#services">
                  <Calendar className="mr-2 size-4" />
                  Service Schedule & Worship
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                asChild
              >
                <a href="#giving">
                  <Wallet className="mr-2 size-4 text-amber-400" />
                  Online Giving & Tithes
                </a>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-300 hover:bg-slate-800/60 hover:text-white"
                asChild
              >
                <a href="#contact">Contact Secretariat →</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Body Grid */}
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-8">
        {/* About & Diocesan Jurisdiction Banner */}
        <section id="about" className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs">
            <span className="text-2xs font-semibold tracking-wider text-amber-400 uppercase">
              Ecclesiastical Alignment
            </span>
            <div className="mt-1 text-base font-bold text-white">
              {parish.parentName || "Central Holy Order"}
            </div>
            <p className="mt-1 text-xs text-slate-400">Diocesan Headquarters Governance</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs">
            <span className="text-2xs font-semibold tracking-wider text-emerald-400 uppercase">
              Assembly Status
            </span>
            <div className="mt-1 text-base font-bold text-white">Active Parish Directorate</div>
            <p className="mt-1 text-xs text-slate-400">Regular Divine Services & Sacraments</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xs">
            <span className="text-2xs font-semibold tracking-wider text-indigo-400 uppercase">
              Ecclesiastical Seat
            </span>
            <div className="mt-1 text-base font-bold text-white">Rivers & Niger Delta Division</div>
            <p className="mt-1 text-xs text-slate-400">Diocesan Registry & Archives</p>
          </div>
        </section>

        {/* Worship Service Schedule & Times */}
        <section id="services" className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 font-brand text-2xl font-bold text-white">
                <Clock className="size-6 text-amber-400" />
                Liturgical Worship Schedule
              </h2>
              <p className="text-xs text-slate-400">
                Weekly Divine services, intercessory gatherings, and apostolic communion times.
              </p>
            </div>
            <Badge tone="neutral" className="border-slate-700 bg-slate-800 text-slate-300">
              All Services Open to the Public
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {liturgicalServices.map((svc) => (
              <Card
                key={svc.title}
                className="flex flex-col justify-between border-slate-800 bg-slate-900/80 p-5 shadow-md transition-all hover:border-slate-700"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-2xs font-semibold text-amber-400">
                      {svc.day}
                    </span>
                    <span className="text-2xs font-medium text-slate-400">{svc.badge}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{svc.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Clock className="size-3.5" />
                    <span>{svc.time}</span>
                  </div>
                  <p className="pt-1 text-xs leading-relaxed text-slate-300">{svc.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-2xs text-slate-400">
                  <span>Location: Main Sanctuary</span>
                  <span className="text-emerald-400">Holy Order Rite</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Real Events & Programmes Section */}
        <section id="events" className="space-y-6">
          <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 font-brand text-2xl font-bold text-white">
                <Calendar className="size-6 text-emerald-400" />
                Upcoming Events & Conferences
              </h2>
              <p className="text-xs text-slate-400">
                Parish rallies, revival assemblies, and diocesan convocations.
              </p>
            </div>
            {session && (
              <Link href="/admin-web/events" className="text-xs font-semibold text-amber-400 hover:underline">
                + Manage Events in Studio →
              </Link>
            )}
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
              <Calendar className="size-8 text-slate-600" />
              <h3 className="mt-2 text-sm font-semibold text-white">No Special Conferences Scheduled</h3>
              <p className="mt-1 max-w-md text-xs text-slate-400">
                Join our regular Sunday Divine Worship and Midweek Bible studies. Upcoming revival events will
                be published here once approved.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {events.map((evt) => (
                <Card
                  key={evt.id}
                  className="border-slate-800 bg-slate-900/80 p-5 transition-all hover:border-slate-700"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-2xs font-semibold text-emerald-400">
                        {evt.type}
                      </span>
                      <span className="text-2xs text-slate-400">
                        {new Date(evt.startsAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{evt.title}</h3>
                    <p className="line-clamp-2 text-xs text-slate-300">{evt.description || evt.summary}</p>
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-2xs text-slate-400">
                      <span>Venue: {evt.location || `${parish.name} Sanctuary`}</span>
                      {evt.registrationEnabled && (
                        <span className="font-semibold text-emerald-400">Registration Open</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Giving & Stewardship Section */}
        <section id="giving" className="space-y-6">
          <div className="rounded-3xl border border-amber-500/30 bg-linear-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="size-5 text-amber-400" />
                  <span className="text-xs font-bold tracking-wide text-amber-400 uppercase">
                    Stewardship & Tithing
                  </span>
                </div>
                <h2 className="font-brand text-2xl font-bold text-white sm:text-3xl">
                  Support the Ministry & Kingdom Work
                </h2>
                <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                  &ldquo;Bring ye all the tithes into the storehouse, that there may be meat in mine
                  house...&rdquo; (Malachi 3:10). Your sacred tithes, offerings, and building pledges support
                  the ongoing expansion, ministerial welfare, and missionary outreach of {parish.name}.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5">
                <Button className="bg-amber-500 text-xs font-bold text-slate-950 shadow-lg shadow-amber-950/40 hover:bg-amber-400">
                  <Wallet className="mr-1.5 size-4" />
                  Request Church Remittance Account
                </Button>
                {session && (
                  <Link
                    href="/giving"
                    className="text-center text-xs font-semibold text-amber-400 hover:underline"
                  >
                    View Parish Giving Ledgers (Admin) →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Location & Secretariat Contact Section */}
        <section id="contact" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Location & Secretariat Card */}
          <Card className="border-slate-800 bg-slate-900/80 p-6 shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="size-5 text-amber-400" />
                <h3 className="text-lg font-bold">Parish Secretariat & Location</h3>
              </div>
              <p className="text-xs text-slate-300">
                Official parish sanctuary and administrative seat. Visitors and worshippers are warmly
                welcomed.
              </p>

              <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <div>
                    <strong className="block text-white">Sanctuary Address</strong>
                    <span className="text-slate-400">{locationText}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <div>
                    <strong className="block text-white">Secretariat Email</strong>
                    <span className="text-slate-400">{contactEmail}</span>
                  </div>
                </div>

                {primaryPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-amber-400" />
                    <div>
                      <strong className="block text-white">Direct Telephone</strong>
                      <span className="text-slate-400">{primaryPhone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Pastoral Assistance Card */}
          <Card className="border-slate-800 bg-slate-900/80 p-6 shadow-md">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white">
                <HeartHandshake className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold">Pastoral Counseling & Prayer</h3>
              </div>
              <p className="text-xs text-slate-300">
                The pastoral team of {parish.name} is available to offer spiritual counsel, home prayers, and
                baptismal preparation.
              </p>

              <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs">
                <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <span className="text-2xs font-bold text-amber-400 uppercase">Pastoral Secretariat</span>
                  <p className="text-xs text-slate-300">
                    Submit your prayer requests, marriage counseling inquiries, or thanksgiving testimonies
                    directly to the pastoral registry.
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-slate-700 bg-slate-800/60 text-xs text-slate-200 hover:bg-slate-700"
                  asChild
                >
                  <a
                    href={`mailto:${contactEmail}?subject=Pastoral Inquiry - ${encodeURIComponent(parish.name)}`}
                  >
                    <Mail className="mr-2 size-3.5" />
                    Send Pastoral Message
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* 5. Official World-Class Church Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900 py-12 text-slate-400">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <Crest size={40} priority className="shadow-lg ring-1 ring-amber-400/80" />
              <div>
                <span className="block font-brand text-sm font-bold text-white">
                  THE ETERNAL SACRED ORDER OF THE CHERUBIM AND SERAPHIM
                </span>
                <span className="block text-2xs text-amber-400">{parish.name} · Mount of Salvation</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link href="/login" className="transition-colors hover:text-amber-400">
                Church Governance Admin
              </Link>
              <span>•</span>
              <Link href="/admin-web/login" className="transition-colors hover:text-amber-400">
                Web Studio Portal
              </Link>
              <span>•</span>
              <Link href="/ordination" className="transition-colors hover:text-amber-400">
                Ordination Portal System
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-2xs text-slate-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} The Eternal Sacred Order of the Cherubim and Seraphim. All rights
              reserved.
            </p>
            <p>Holy Order Ecclesiastical Portal Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
