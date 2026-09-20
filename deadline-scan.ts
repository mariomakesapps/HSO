import { allOpportunities } from "@/data/opportunities";

const now = new Date();
const cutoff = new Date(now.getTime() + 45 * 86400000);
const open = allOpportunities
  .filter((o) => o.deadline)
  .map((o) => ({ ...o, t: new Date(o.deadline as string).getTime() }))
  .filter((o) => !Number.isNaN(o.t) && o.t > now.getTime() && o.t <= cutoff.getTime())
  .sort((a, b) => a.t - b.t);

console.log("total in catalog:", allOpportunities.length);
console.log("open with deadline within 45d:", open.length);
for (const o of open.slice(0, 12)) {
  const days = Math.ceil((o.t - now.getTime()) / 86400000);
  console.log(JSON.stringify({
    title: o.title, org: o.org, category: o.category, deadline: o.deadline, days,
    cost: o.cost, grades: o.grades, location: o.location, format: o.format,
    fields: o.fields, url: o.url, blurb: o.blurb,
  }));
}
