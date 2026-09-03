"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, Loader2, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  disconnectGoogleAction,
  getGoogleConnectionAction,
} from "@/app/panel/actions";

export default function GoogleCalendarCard() {
  const searchParams = useSearchParams();
  const [connection, setConnection] = useState<{
    connected: boolean;
    email: string | null;
  } | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    getGoogleConnectionAction().then(setConnection);
  }, []);

  // Surface the OAuth result once, then scrub the query param.
  useEffect(() => {
    if (toastShown.current) return;
    const result = searchParams.get("google");
    if (!result) return;
    toastShown.current = true;

    if (result === "connected") {
      toast.success("Google Calendar connected!");
    } else if (result === "missing_config") {
      toast.error(
        "Google Calendar is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your environment."
      );
    } else if (result === "error") {
      toast.error(
        "Could not connect Google Calendar. Please try again or re-authorize."
      );
    }

    window.history.replaceState(null, "", "/panel/settings");
  }, [searchParams]);

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar? Existing events stay in your calendar.")) {
      return;
    }
    setIsDisconnecting(true);
    const result = await disconnectGoogleAction();
    if (result.error) {
      toast.error(`Failed to disconnect: ${result.error}`);
    } else {
      setConnection({ connected: false, email: null });
      toast.success("Google Calendar disconnected.");
    }
    setIsDisconnecting(false);
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Google Calendar
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 max-w-md">
              When connected, every new booking is added to your Google
              Calendar automatically. Clients also receive a calendar invite.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        {connection === null ? (
          <Button size="sm" disabled>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Checking…
          </Button>
        ) : connection.connected ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Connected{connection.email ? ` as ${connection.email}` : ""}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Disconnect
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" asChild>
              <Link href="/api/google/auth">
                <Calendar className="h-4 w-4 mr-2" />
                Connect with Google
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <AlertCircle className="h-3.5 w-3.5" />
              You'll be redirected to Google to authorize access.
            </span>
          </>
        )}
      </div>
    </div>
  );
}