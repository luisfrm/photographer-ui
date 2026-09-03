"use client";

import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getSettingsAction } from "@/app/panel/actions";
import WorkHoursEditor from "@/components/panel/settings/WorkHoursEditor";
import GoogleCalendarCard from "@/components/panel/settings/GoogleCalendarCard";
import type { PanelSettings } from "@/types/scheduling";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PanelSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSettingsAction().then((result) => {
      setSettings(result.data);
      setError(result.error);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your availability, timezone and calendar integrations.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            Failed to load settings: {error}
          </p>
        </div>
      )}

      {isLoading ? (
        <SettingsSkeleton />
      ) : settings ? (
        <div className="space-y-6">
          <WorkHoursEditor initialData={settings} />
          <Suspense fallback={<SettingsSkeleton />}>
            <GoogleCalendarCard />
          </Suspense>
        </div>
      ) : null}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-3">
        <Skeleton className="h-10 w-full max-w-sm rounded-md" />
      </div>
      <div className="p-6 border border-gray-200 rounded-lg bg-white space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
      <div className="p-6 border border-gray-200 rounded-lg bg-white">
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}