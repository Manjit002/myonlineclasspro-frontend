import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns true only after the component has hydrated on the client.
 *
 * Used to guard rendering that depends on client-only state (like the
 * resolved theme) that the server can't know in advance -- next-themes
 * itself recommends this exact guard for the same reason a "no flash of
 * wrong theme" toggle needs it.
 *
 * Implemented with useSyncExternalStore rather than a
 * useState+useEffect pair: both eventually produce the same "false on
 * server, true after hydration" result, but useSyncExternalStore's
 * getServerSnapshot/getSnapshot split is the API React designed for
 * exactly this server-vs-client value mismatch, and it does so without
 * an effect calling setState -- avoiding the extra render pass a
 * setState-in-effect pattern causes.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
