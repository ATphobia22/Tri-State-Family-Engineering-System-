export interface ReasoningStep {
  id: string;
  name: string;
  status: "pending" | "running" | "resolved" | "failed";
  output?: string;
  timestamp: string;
}

export interface RalphIteration {
  depth: number;
  thought: string;
  action: string;
  observation: string;
  status: "active" | "complete" | "reset";
}

export interface Qubit {
  x: number;
  y: number;
  type: "data" | "stabilizer_x" | "stabilizer_z";
  error: boolean;
  syndrome: boolean;
  matched: boolean;
}

export interface MedicalTarget {
  name: string;
  gene: string;
  mutation: string;
  plddt: number;
  cure: string;
  editor: string;
  smiles: string;
}

/** Catalog entry for code samples. Prefer archivePath over inlined content. */
export interface CodeFile {
  name: string;
  path: string;
  category: string;
  language: string;
  /** Optional short display snippet (must be valid TS string; no footnote markers). */
  content?: string;
  /** Preferred: path under docs/archived/ for full sample body. */
  archivePath?: string;
  description?: string;
}
