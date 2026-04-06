import type { ResumeData } from '../types/resume';

/** All skills for ATS and non-Executive templates: grouped entries flattened, else flat `skills`. */
export function getFlattenedSkills(data: ResumeData): string[] {
  const groups = data.skillGroups;
  if (groups && groups.length > 0) {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const g of groups) {
      for (const s of g.skills) {
        const t = s.trim();
        if (!t) continue;
        const key = t.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push(t);
        }
      }
    }
    return out;
  }
  return data.skills || [];
}
