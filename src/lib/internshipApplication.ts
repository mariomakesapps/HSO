/**
 * Rules for the HSO internship application (/volunteer): the resume upload and the
 * time zone field. Kept apart from the page so they can be tested.
 *
 * Resumes go to the private `internship-resumes` storage bucket. Applicants can upload
 * but never read files there; the HR email gets a time-limited download link made by
 * the send-form-notification function.
 */

export const RESUME_BUCKET = "internship-resumes";
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

/** Value for the file input's `accept` attribute. */
export const RESUME_ACCEPT = Object.entries(RESUME_TYPES)
  .flatMap(([ext, type]) => [`.${ext}`, type])
  .join(",");

function extension(name: string): string {
  const m = /\.([a-z0-9]+)$/i.exec(name.trim());
  return m ? m[1].toLowerCase() : "";
}

/** Null when the file is fine, otherwise a message to show the applicant. */
export function resumeProblem(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || !file.name) return "Please attach your resume (PDF or Word).";
  if (!RESUME_TYPES[extension(file.name)]) return "Your resume needs to be a PDF or a Word file (.pdf, .doc or .docx).";
  if (file.size <= 0) return "That resume file looks empty. Please pick it again.";
  if (file.size > RESUME_MAX_BYTES) return "Your resume is over 5 MB. Please upload a smaller file.";
  return null;
}

/** The content type to upload with, from the file name (browsers sometimes leave it blank). */
export function resumeContentType(name: string): string {
  return RESUME_TYPES[extension(name)] ?? "application/octet-stream";
}

/**
 * Storage path for a resume: a random folder (so applicants can't guess or overwrite
 * each other's files) and a cleaned-up file name HR will recognise.
 * Matches RESUME_PATH_PATTERN, which the email function checks again server-side.
 */
export function resumeStoragePath(id: string, fileName: string): string {
  const ext = extension(fileName) || "pdf";
  const base = fileName
    .trim()
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80) || "resume";
  return `${id}/${base}.${ext}`;
}

export const RESUME_PATH_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[\w.-]{1,90}\.(pdf|docx?)$/;

/** The applicant's own time zone from the browser, or "" if the browser won't say. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

const COMMON_TIME_ZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Puerto_Rico",
];

/** Suggestions for the time zone field: common U.S. zones first, then every zone the browser knows. */
export function timeZoneOptions(): string[] {
  let all: string[] = [];
  try {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    all = intl.supportedValuesOf?.("timeZone") ?? [];
  } catch {
    all = [];
  }
  return [...COMMON_TIME_ZONES, ...all.filter((z) => !COMMON_TIME_ZONES.includes(z))];
}
