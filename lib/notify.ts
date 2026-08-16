"use client";

import { toast } from "sonner";
import { feel } from "./feel";

/**
 * Toasts, with the matching feedback attached.
 *
 * Every confirmation on this site is a toast, so this is the one place a
 * success or a failure can be felt as well as read. Calling `toast` directly
 * still works and still shows the message; it just arrives silently, which is
 * the drift this wrapper exists to prevent. Import `notify`, not `toast`.
 *
 * Deliberately a thin pass-through: the arguments are Sonner's own, so there is
 * nothing here to keep in sync when Sonner's API grows.
 */
export const notify = {
  success: (...args: Parameters<typeof toast.success>) => {
    feel("success");
    return toast.success(...args);
  },
  error: (...args: Parameters<typeof toast.error>) => {
    feel("warning");
    return toast.error(...args);
  },
  /** Neutral information. No feedback: nothing happened, so nothing is felt. */
  message: (...args: Parameters<typeof toast.message>) => toast.message(...args),
};
