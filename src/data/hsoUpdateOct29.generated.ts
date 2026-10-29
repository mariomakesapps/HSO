/* Catalogue update of 2026-10-29.
   - OCT29_REMOVED: NYC DYCD "Out of School Time" sites at elementary, intermediate
     and middle schools (P.S., I.S., M.S., C.E.S.), which serve younger grades, not high
     school. Their old URLs go to the NYC hub.
   - OCT29_FIXES: rewritten descriptions for thin listings, each from the
     program's official page. */

import type { Opportunity } from "@/data/opportunities";

export const OCT29_FIXES: Record<string, Partial<Opportunity>> = {
};

export const OCT29_REMOVED: Record<string, string> = {
  "nyc-dycd-out-of-school-time-c-e-s-c-i-s-218-rafael-herna-2": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-113-ronald-edmonds-school": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-126-albert-shanker-school": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-171-abraham-lincoln-schoo": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-311-essence-school": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-7-elias-bernstein-school": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-i-s-77-i-s-77": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-m-s-223-m-s-223-the-labora": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-m-s-584-m-s-584-upper-acad": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-p-s-i-s-111-adolph-s-ochs-s": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-p-s-i-s-124-osmond-a-church": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-p-s-i-s-225-eileen-e-zaglin": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-p-s-i-s-42-robert-vernam-sch": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-p-s-i-s-12-tag-young-scholars": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-c-e-s-42-claremont-school": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-c-e-s-55-benjamin-franklin-sc": "/nyc-programs-for-high-school-students",
  "nyc-dycd-out-of-school-time-c-e-s-88-the-sidney-silverste": "/nyc-programs-for-high-school-students",
};
