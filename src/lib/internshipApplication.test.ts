import { describe, expect, it } from "vitest";
import {
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  RESUME_PATH_PATTERN,
  resumeContentType,
  resumeProblem,
  resumeStoragePath,
  timeZoneOptions,
} from "@/lib/internshipApplication";

const ID = "0b9f7c1e-2a4d-4f6b-9c8e-1d2e3f4a5b6c";

describe("resume upload rules", () => {
  it("requires a resume", () => {
    expect(resumeProblem(null)).toMatch(/attach your resume/);
  });
  it("accepts PDF and Word files up to 5 MB", () => {
    expect(resumeProblem({ name: "Jordan Rivera Resume.pdf", size: 120_000 })).toBeNull();
    expect(resumeProblem({ name: "resume.DOCX", size: 80_000 })).toBeNull();
    expect(resumeProblem({ name: "resume.doc", size: RESUME_MAX_BYTES })).toBeNull();
  });
  it("rejects other file types, empty files and files over 5 MB", () => {
    expect(resumeProblem({ name: "resume.png", size: 1000 })).toMatch(/PDF or a Word file/);
    expect(resumeProblem({ name: "resume", size: 1000 })).toMatch(/PDF or a Word file/);
    expect(resumeProblem({ name: "resume.pdf", size: 0 })).toMatch(/empty/);
    expect(resumeProblem({ name: "resume.pdf", size: RESUME_MAX_BYTES + 1 })).toMatch(/over 5 MB/);
  });
  it("picks the content type from the extension", () => {
    expect(resumeContentType("a.pdf")).toBe("application/pdf");
    expect(resumeContentType("a.docx")).toBe("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    expect(RESUME_ACCEPT).toContain(".pdf");
  });
});

describe("resume storage path", () => {
  it("puts the file in a random folder with a clean name the server will accept", () => {
    const p = resumeStoragePath(ID, "Jordan Rivera — Resume (final).pdf");
    expect(p).toBe(`${ID}/Jordan-Rivera-Resume-final.pdf`);
    expect(RESUME_PATH_PATTERN.test(p)).toBe(true);
  });
  it("falls back to a safe name and keeps the extension", () => {
    const p = resumeStoragePath(ID, "....docx");
    expect(p).toBe(`${ID}/resume.docx`);
    expect(RESUME_PATH_PATTERN.test(p)).toBe(true);
  });
  it("rejects paths outside the expected shape", () => {
    expect(RESUME_PATH_PATTERN.test(`../${ID}/a.pdf`)).toBe(false);
    expect(RESUME_PATH_PATTERN.test(`${ID}/a.exe`)).toBe(false);
    expect(RESUME_PATH_PATTERN.test("not-a-uuid/a.pdf")).toBe(false);
  });
});

describe("time zone suggestions", () => {
  it("lists common U.S. zones first without duplicates", () => {
    const zones = timeZoneOptions();
    expect(zones[0]).toBe("America/New_York");
    expect(new Set(zones).size).toBe(zones.length);
  });
});
