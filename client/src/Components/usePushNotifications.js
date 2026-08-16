import { useCallback, useEffect, useState } from "react";
import {
  getPushSyncState,
  subscribeToPush,
  unsubscribeFromPush,
} from "../firebase";

/**
 * Drives the Sidebar's push notification control.
 *
 * Deliberately does NOT keep state purely in React — every mount
 * re-checks permission + server status and reconciles, so refresh /
 * reopen / another-tab-changed-it all resolve to the true state
 * instead of a stale toggle.
 */
export function usePushNotifications(user) {
  const [state, setState] = useState({
    loading: true,
    supported: true,
    permission: "default",
    subscribed: false,
    error: null,
  });

  const sync = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const result = await getPushSyncState();
    setState({
      loading: false,
      supported: result.supported,
      permission: result.permission,
      subscribed: result.subscribed,
      error: result.error ? "sync-failed" : null,
    });
  }, []);

  useEffect(() => {
    // Only sync once we know who the user is — status is per-user.
    if (user) sync();
  }, [user, sync]);

  const enable = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const result = await subscribeToPush(user);

    if (result.success) {
      setState((s) => ({
        ...s,
        loading: false,
        permission: "granted",
        subscribed: true,
      }));
    } else {
      setState((s) => ({
        ...s,
        loading: false,
        permission:
          result.reason === "denied" ? "denied" : s.permission,
        subscribed: false,
        error: result.reason,
      }));
    }

    return result;
  }, [user]);

  const disable = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    const result = await unsubscribeFromPush();

    // Update UI optimistically to "off" even on partial failure —
    // re-sync will correct it if the server call actually failed,
    // but we never want the button to look "on" when the user just
    // asked to turn it off.
    setState((s) => ({
      ...s,
      loading: false,
      subscribed: false,
      error: result.success ? null : "disable-partial",
    }));

    return result;
  }, []);

  return { ...state, enable, disable, refresh: sync };
}
