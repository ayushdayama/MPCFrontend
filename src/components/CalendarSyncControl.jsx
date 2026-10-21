import { useEffect, useState } from "react";
import { CalendarSync, CalendarX, Link2, Unlink } from "lucide-react";
import { apiBase, apiFetch } from "../utils/api";

function CalendarSyncControl() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get("calendar_sync");
    if (result === "syncing") setMessage("Google Calendar linked; syncing recorded dates.");
    if (result === "connected") setMessage("Google Calendar connected. Use Sync when you want to add recorded dates.");
    if (result === "cancelled") setMessage("Google Calendar connection was cancelled.");
    if (result === "error") setMessage("Calendar connection did not complete. Retry and approve the requested Calendar access.");
    if (result === "permission") setMessage("Google did not grant Calendar access. Reconnect and allow Calendar permissions.");
    if (result) window.history.replaceState({}, "", window.location.pathname);

    let active = true;
    apiFetch(`${apiBase}/calendar/status`)
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch(() => {
        if (active) setMessage("Calendar status is unavailable. Please sign in again.");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status?.sync_status !== "queued" && status?.sync_status !== "syncing") return undefined;
    const interval = window.setInterval(() => {
      apiFetch(`${apiBase}/calendar/status`)
        .then(setStatus)
        .catch(() => window.clearInterval(interval));
    }, 2000);
    return () => window.clearInterval(interval);
  }, [status?.sync_status]);

  useEffect(() => {
    const isSyncMessage = message === "Syncing recorded dates."
      || message === "Google Calendar linked; syncing recorded dates.";
    const isDesyncMessage = message === "Removing Cycle Sense calendar entries.";
    if (status?.sync_status === "ready" && isSyncMessage) {
      setMessage("All recorded cycle dates are synced.");
    } else if (status?.sync_status === "ready" && isDesyncMessage) {
      setMessage("Cycle Sense calendar entries removed.");
    } else if (status?.sync_status === "error" && (isSyncMessage || isDesyncMessage)) {
      setMessage("");
    }
  }, [message, status?.sync_status]);

  const connectCalendar = async () => {
    setBusy(true);
    setMessage("");
    try {
      const result = await apiFetch(`${apiBase}/calendar/connect`, { method: "POST" });
      window.location.assign(result.authorization_url);
    } catch {
      setMessage("Could not start Google Calendar connection. Check backend OAuth settings.");
      setBusy(false);
    }
  };

  const syncCalendar = async () => {
    setBusy(true);
    setMessage("");
    try {
      await apiFetch(`${apiBase}/calendar/sync`, { method: "POST" });
      setStatus((current) => ({ ...current, sync_status: "queued" }));
      setMessage("Syncing recorded dates.");
    } catch {
      setMessage("Could not start the Calendar sync.");
    } finally {
      setBusy(false);
    }
  };

  const disconnectCalendar = async () => {
    setBusy(true);
    try {
      await apiFetch(`${apiBase}/calendar/disconnect`, { method: "POST" });
      setStatus({ connected: false, sync_status: "idle" });
      setMessage("Signed out of Google. Existing Calendar entries were left untouched.");
    } catch {
      setMessage("Could not disconnect Google Calendar.");
    } finally {
      setBusy(false);
    }
  };

  const desyncCalendar = async () => {
    const confirmed = window.confirm(
      "Delete all Cycle Sense cycle events from this Google Calendar? Your Google account will remain connected."
    );
    if (!confirmed) return;

    setBusy(true);
    setMessage("");
    try {
      await apiFetch(`${apiBase}/calendar/desync`, { method: "POST" });
      setStatus((current) => ({ ...current, sync_status: "queued" }));
      setMessage("Removing Cycle Sense calendar entries.");
    } catch {
      setMessage("Could not remove Cycle Sense calendar entries.");
    } finally {
      setBusy(false);
    }
  };

  const syncing = status?.sync_status === "queued" || status?.sync_status === "syncing";

  return (
    <div className="calendar-sync" aria-label="Google Calendar sync">
      <div className="calendar-sync__controls">
        {status === null ? (
          <span className="calendar-sync__account">Checking Google Calendar…</span>
        ) : status.connected ? (
          <>
            <span className="calendar-sync__account">
              Calendar: {status.email || "Connected"}
            </span>
            <button type="button" className="calendar-sync__button" onClick={syncCalendar} disabled={busy || syncing} title="Sync all recorded cycle dates">
              <CalendarSync size={16} aria-hidden="true" /> Sync
            </button>
            <button type="button" className="calendar-sync__button" onClick={desyncCalendar} disabled={busy || syncing} title="Delete Cycle Sense events without signing out">
              <CalendarX size={16} aria-hidden="true" /> De-sync
            </button>
            <button type="button" className="calendar-sync__button" onClick={disconnectCalendar} disabled={busy || syncing} title="Sign out of Google; leave existing events in the calendar">
              <Unlink size={16} aria-hidden="true" /> Sign out of Google
            </button>
          </>
        ) : (
          <button type="button" className="calendar-sync__button" onClick={connectCalendar} disabled={busy}>
            <Link2 size={16} aria-hidden="true" /> Connect Google Calendar
          </button>
        )}
      </div>
      {(message || status?.sync_error) && (
        <span className="calendar-sync__message" role="status">
          {status?.sync_error || (
            status?.sync_status === "manual_required"
              ? "New cycle dates are not synced. Press Sync when you want to update Google Calendar."
              : message
          )}
        </span>
      )}
    </div>
  );
}

export default CalendarSyncControl;
