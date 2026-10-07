"server-only";

import { backend } from "@/server/backend";
import type { WebEvent, WebProgramme, MediaAsset, VettingSummary } from "./types";

export async function getBranchEvents(): Promise<WebEvent[]> {
  try {
    return await backend<WebEvent[]>("/web-cms/events");
  } catch {
    return [
      {
        id: "evt_1",
        unitId: "parish-mount-zion",
        unitName: "Mount Zion Parish",
        title: "2026 Annual Revival & Anointing Night",
        description: "Join us for 3 power-packed days of spiritual renewal, divine healing, and praise.",
        category: "REVIVAL",
        startDate: "2026-10-15T18:00:00Z",
        endDate: "2026-10-17T21:00:00Z",
        venue: "Mount Zion Main Auditorium, Lagos",
        bannerUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
        registrationOpen: true,
        ticketCapacity: 1200,
        status: "APPROVED_LIVE",
        submittedByHandlerId: "usr_handler_mz",
        submittedAt: "2026-10-01T09:00:00Z",
        vettedAt: "2026-10-02T10:00:00Z",
        vettedByHandlerId: "usr_super_admin",
      },
      {
        id: "evt_2",
        unitId: "parish-mount-zion",
        unitName: "Mount Zion Parish",
        title: "Youth Leadership Conference 2026",
        description:
          "Empowering young leaders across the district with spiritual, career, and ministry skills.",
        category: "CONFERENCE",
        startDate: "2026-11-05T09:00:00Z",
        venue: "Grace Hall, Mount Zion",
        bannerUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        registrationOpen: true,
        ticketCapacity: 450,
        status: "PENDING_REVIEW",
        submittedByHandlerId: "usr_handler_mz",
        submittedAt: "2026-10-06T14:30:00Z",
      },
      {
        id: "evt_3",
        unitId: "parish-mount-zion",
        unitName: "Mount Zion Parish",
        title: "Praise & Thanksgiving Concert",
        description: "Special evening of worship featuring the Choir of Cherubim & Seraphim.",
        category: "SPECIAL_PROGRAMME",
        startDate: "2026-12-01T17:00:00Z",
        venue: "Mount Zion Grounds",
        bannerUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800",
        registrationOpen: false,
        status: "NEEDS_REVISION",
        reviewNotes: "Please upload a higher-resolution banner image and update venue details.",
        submittedByHandlerId: "usr_handler_mz",
        submittedAt: "2026-10-04T11:20:00Z",
      },
    ];
  }
}

export async function getVettingQueue(): Promise<{
  events: WebEvent[];
  programmes: WebProgramme[];
  summary: VettingSummary;
}> {
  try {
    const data = await backend<{ events: WebEvent[]; programmes: WebProgramme[]; summary: VettingSummary }>(
      "/web-cms/vetting",
    );
    return data;
  } catch {
    const events = await getBranchEvents();
    const pendingEvents = events.filter((e) => e.status === "PENDING_REVIEW");
    const approved = events.filter((e) => e.status === "APPROVED_LIVE");
    const revision = events.filter((e) => e.status === "NEEDS_REVISION");

    const programmes: WebProgramme[] = [
      {
        id: "prog_101",
        unitId: "district-lagos-central",
        unitName: "Lagos Central District",
        title: "Q4 District Ministerial Summit",
        theme: "Expanding Kingdom Boundaries",
        scheduleDate: "2026-11-12T10:00:00Z",
        speakers: ["His Eminence Elder Dr. A. Johnson", "Senior Apostle M. Adeleke"],
        status: "PENDING_REVIEW",
        submittedByHandlerId: "usr_district_admin",
        submittedAt: "2026-10-05T16:00:00Z",
      },
    ];

    return {
      events: pendingEvents,
      programmes,
      summary: {
        pendingEventsCount: pendingEvents.length,
        pendingProgrammesCount: programmes.length,
        approvedCount: approved.length,
        revisionRequestedCount: revision.length,
      },
    };
  }
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  try {
    return await backend<MediaAsset[]>("/web-cms/media");
  } catch {
    return [
      {
        id: "med_1",
        fileName: "esocs_official_emblem.png",
        fileSize: 482100,
        mimeType: "image/png",
        cdnUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600",
        uploadedAt: "2026-10-01T08:00:00Z",
        uploadedByHandlerId: "usr_super_admin",
      },
      {
        id: "med_2",
        fileName: "revival_banner_2026.jpg",
        fileSize: 1240000,
        mimeType: "image/jpeg",
        cdnUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
        uploadedAt: "2026-10-02T12:30:00Z",
        uploadedByHandlerId: "usr_handler_mz",
      },
    ];
  }
}
