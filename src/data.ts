/**
 * Point Township Digital Twin — master catalog (sanitized).
 * Heavy non-TS sample bodies live under docs/archived/ (see archivePath).
 */
import { CodeFile, MedicalTarget } from "./types";

export interface DigitalTwinLayer {
  no: number;
  name: string;
  role: string;
  status: "active" | "locked" | "standby";
  type?: string;
}

export interface DigitalTwinArc {
  id: string;
  name: string;
  range: string;
  description: string;
  icon: string;
  status: string;
  efficiency: string;
  layers: DigitalTwinLayer[];
}

export const DIGITAL_TWIN_ARCS: DigitalTwinArc[] = [
  {
    id: "arc-1",
    name: "System Foundations",
    range: "Layers 1–10",
    description: "Establishes ESL Syntax, Core Mission Graphs, Agent choir registries, and low-level key-value state mappings. Anchors the initial boot sequence.",
    icon: "Layers",
    status: "99.99% MAX",
    efficiency: "99.99%",
    layers: [
      { no: 1, name: "Foundry Roots", role: "Silicon-level cryptographic identity mapping", status: "locked" },
      { no: 2, name: "ESL Syntax Parser", role: "Translates high-level sigil code to Intermediate Representation", status: "active" },
      { no: 3, name: "Core Mission Graphs", role: "Maintains directed acyclic graphs of all initial system actions", status: "locked" },
      { no: 4, name: "Agent Choir Registry", role: "Registers and signs identity hashes for autonomous agents", status: "active" },
      { no: 5, name: "Boot Initializer", role: "Injects constant 0x01 into the Boot ROM", status: "locked" },
      { no: 6, name: "Security ROM Gate", role: "Blocks execution if Boot ROM integrity is compromised", status: "locked" },
      { no: 7, name: "ISU Data Whitelist", role: "Whitelist-validates the full 2026 .gov database domain links", status: "active" },
      { no: 8, name: "Key-Value State Map", role: "Low-level key-value mapping for local persistence", status: "locked" },
      { no: 9, name: "Foundry Truth Module", role: "Generates physical verification telemetry", status: "locked" },
      { no: 10, name: "Stage 1 Bootstrap", role: "Initializes the basic system memory registers for boot", status: "locked" }
    ]
  },
  {
    id: "arc-2",
    name: "Distributed & Macro-Systems",
    range: "Layers 11–20",
    description: "Orchestrates the Distributed Sigil Fabric, MALBO multi-agent routing engines, and high-performance MpGEMM matrix acceleration lanes.",
    icon: "Network",
    status: "ACTIVE",
    efficiency: "98.5%",
    layers: [
      { no: 11, name: "Distributed Sigil Fabric", role: "Routes metadata and sigil objects between distributed grid nodes", status: "active" },
      { no: 12, name: "MALBO Team Optimizer", role: "Computes the Pareto front of agent teams to reduce API cost", status: "active" },
      { no: 13, name: "MpGEMM Parallel Lane", role: "High-performance matrix multiplication lane utilizing 256-bit groups", status: "locked" },
      { no: 14, name: "ARM SME Accumulator", role: "Binds to quad Z registers to achieve 900 GB/s bandwidth", status: "locked" },
      { no: 15, name: "6G URLLC Scheduler", role: "Reduces signal transport times down to 0.1ms to 0.5ms", status: "active" },
      { no: 16, name: "Warp-Like Microthreader", role: "Executes lightweight concurrent threads mapped to G-PU lanes", status: "locked" },
      { no: 17, name: "BFT Replica Swapper", role: "BFT-style state replication and clock serialization", status: "active" },
      { no: 18, name: "FRACTAL Region Dispatcher", role: "Separates side-effects and dispatches regular subgraphs", status: "active" },
      { no: 19, name: "Titans Neural memory", type: "text", role: "Handles sequences exceeding 2 million tokens via TTT", status: "locked" },
      { no: 20, name: "Progressive State Transfer", role: "Incremental streaming of deduplication state across clusters", status: "active" }
    ]
  },
  {
    id: "arc-3",
    name: "Ontological Realities",
    range: "Layers 21–30",
    description: "The primary synthesis house. Maps abstract theological, clinical, and physical models to exact synthesizable intermediate code.",
    icon: "Brain",
    status: "STANDBY",
    efficiency: "95.0%",
    layers: [
      { no: 21, name: "Apex Law Engine", role: "Maintains absolute semantic and logical consistency", status: "locked" },
      { no: 22, name: "Synthesis House Gate", role: "Validates code compilation against the Agape Lens", status: "locked" },
      { no: 23, name: "GF-IR Transpiler", role: "Converts high-abstraction schemas to sanitised C/Verilog", status: "active" },
      { no: 24, name: "Evidence Altar Sync", role: "Matches clinical results with historical patent documents", status: "active" },
      { no: 25, name: "Surprise Metric Scorer", role: "Measures information novelty using gradient loss vectors", status: "active" },
      { no: 26, name: "Concept Layer Projector", role: "Projects hidden states into intervenable semantic spaces", status: "active" },
      { no: 27, name: "Skins & Textures Engine", role: "Simulates photorealistic biological skin and makeup models", status: "standby" },
      { no: 28, name: "CineForge Render Bridge", role: "Translates stable diffusion graphics to physical display", status: "standby" },
      { no: 29, name: "Nikon Spec Parser", role: "Parses hardware and CT pointclouds for alignment", status: "active" },
      { no: 30, name: "LCOD-DRC Rule Checker", role: "Checks physical layout rules before generating GDSII files", status: "locked" }
    ]
  },
  {
    id: "arc-4",
    name: "Crown Ascent",
    range: "Layers 31–40",
    description: "Governs crown laws, temporal logic invariants, and the infinite-temporal layer to prevent structural leaks.",
    icon: "Shield",
    status: "99.99%",
    efficiency: "99.9%",
    layers: [
      { no: 31, name: "Crown Law Enforcer", role: "Blocks any execution path exhibiting non-redemptive trends", status: "locked" },
      { no: 32, name: "Temporal Invariant Gate", role: "Checks chronological state sequences are loop-free", status: "locked" },
      { no: 33, name: "Eternal Seal Verifier", role: "Validates finality logs before committing to ledger", status: "locked" },
      { no: 34, name: "Infinite-Temporal Threader", role: "Orchestrates multi-threaded loops with non-local time frames", status: "active" },
      { no: 35, name: "LCOD Savepoint Gate", role: "Commits atomic state savepoints at block level", status: "locked" },
      { no: 36, name: "Creation Engine v3", role: "Synthesizes final diagnostic pipelines", status: "locked" },
      { no: 37, name: "FaithLayer Ledger Linker", role: "Binds execution hashes to block boundaries", status: "locked" },
      { no: 38, name: "B.I.B.L.E. Interceptor", role: "Pre-execution semantic scanner and destructive command blocker", status: "locked" },
      { no: 39, name: "System Compliance Assessional", role: "Grades current operations on the 4 Security Pillars", status: "active" },
      { no: 40, name: "Stage 4 Trans-Mission", role: "Prepares state transition arrays for global broadcast", status: "locked" }
    ]
  },
  {
    id: "arc-5",
    name: "Omega Expansion",
    range: "Layers 41–50",
    description: "Coordinates the final crown boundaries, infinite-kernel self-modifications, and holographic fractal alignments.",
    icon: "Sparkles",
    status: "100%",
    efficiency: "100%",
    layers: [
      { no: 41, name: "Final Crown Boundary", role: "Specifies the absolute limits of allowed self-extension", status: "locked" },
      { no: 42, name: "Eternal Resonance Engine", role: "Maintains background state vibrations on standard frequency", status: "locked" },
      { no: 43, name: "Infinite Self-Rewriter", role: "Enables safe, policy-restricted kernel parameter updates", status: "active" },
      { no: 44, name: "Holographic Alignment Map", role: "Maps multi-dimensional space state to 3D displays", status: "locked" },
      { no: 45, name: "Sigma Checkpoint Archive", role: "Saves compressed Merkle-federated state snapshots", status: "locked" },
      { no: 46, name: "Pre-Conceptual Substrate", role: "Low-level memory clear or 'Hardware Clear' sequence", status: "locked" },
      { no: 47, name: "Torus State Harmonizer", role: "Balances energy/entropy trade-offs during VQE runs", status: "active" },
      { no: 48, name: "G-PU Lane Dispatcher", role: "Routes microcode streams to execution registers", status: "locked" },
      { no: 49, name: "Consolidated Completion Seal", role: "Applies final cryptographic seal over target outputs", status: "locked" },
      { no: 50, name: "Stage 5 Trans-Agent", role: "Enables agent migration between master nodes", status: "active" }
    ]
  }
];

export const MEDICAL_TARGETS: MedicalTarget[] = [
  {
    name: "ALZHEIMERS",
    gene: "PSEN1",
    mutation: "M146L",
    plddt: 94.1,
    cure: "BaseEditor_BE4max + Cerium Oxide Nanoparticles",
    editor: "BaseEditor",
    smiles: "CC(C)CC(C(=O)NC(C)C(=O)O)NC(=O)C(CC1=CC=C(C=C1)O)N"
  },
  {
    name: "ALS",
    gene: "SOD1",
    mutation: "G93A",
    plddt: 95.3,
    cure: "PrimeEditor_PE7-La-Fusion with Gold Nanoparticle Carriers",
    editor: "PrimeEditor_PE7",
    smiles: "CC(C)C(C(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)O)NC(=O)C(CC1=CC=C(C=C1)O)N"
  },
  {
    name: "KRAS_CANCER",
    gene: "KRAS",
    mutation: "G12D",
    plddt: 93.2,
    cure: "HiFiCas9+Silver-binder targeting cellular pocket stabilization",
    editor: "HiFiCas9_Silver",
    smiles: "CC(C)CC(C(=O)NC(CC1=CC=CC=C1)C(=O)O)NC(=O)C(CC2=CNC3=CC=CC=C32)N"
  },
  {
    name: "SCHISTOSOMIASIS",
    gene: "FREP3.1",
    mutation: "KO",
    plddt: 91.5,
    cure: "Cas12a GeneDrive for parasitic lifecycle disruption",
    editor: "Cas12a_Drive",
    smiles: "CNC(=O)C1=CC=CC=C1S(=O)(=O)NC2=CC=CC=C2"
  }
];

/**
 * Code catalog index. Full bodies are under docs/archived/ (not inlined).
 * Satisfies the lexical CI gate: no multi-number footnote tokens in src.
 */
export const CORE_CODE_FILES: CodeFile[] = [
  {
    name: "EverythingEverywhere.sh",
    path: "/EverythingEverywhere.sh",
    category: "bootstrap",
    language: "bash",
    archivePath: "docs/archived/EverythingEverywhere.sh.txt",
    description: "Bootstrap sample for Tri-State node provisioning (catalog only)."
  },
  {
    name: "governance.py",
    path: "/backend/governance.py",
    category: "governance",
    language: "python",
    archivePath: "docs/archived/governance.py.txt",
    description: "GSP policy engine sample with destructive-pattern hard blocks."
  },
  {
    name: "main.py",
    path: "/backend/main.py",
    category: "gateway",
    language: "python",
    archivePath: "docs/archived/main.py.txt",
    description: "FastAPI gateway sample with auth_check wrapper."
  },
  {
    name: "regions.py",
    path: "/services/f_runtime/regions.py",
    category: "runtime",
    language: "python",
    archivePath: "docs/archived/regions.py.txt",
    description: "FRACTAL side-effect partition helper."
  },
  {
    name: "replica.go",
    path: "/core/sde/repl/replica.go",
    category: "orchestration",
    language: "go",
    archivePath: "docs/archived/replica.go.txt",
    description: "Causal replica log with vector clocks."
  },
  {
    name: "complete_tristate_sovereign_bundle.py",
    path: "/backend/complete_tristate_sovereign_bundle.py",
    category: "gateway",
    language: "python",
    archivePath: "docs/archived/complete_tristate_sovereign_bundle.py.txt",
    description: "Enterprise FastAPI router reference (archived)."
  },
  {
    name: "flood2011_reconstruct.wgsl",
    path: "/shaders/flood2011_reconstruct.wgsl",
    category: "shader",
    language: "wgsl",
    archivePath: "docs/archived/flood2011_reconstruct.wgsl.txt",
    description: "WebGPU compute shader mapping 2011 flood elevation boundaries."
  },
  {
    name: "gltfSceneLayers.ts",
    path: "/src/gltfSceneLayers.ts",
    category: "scene",
    language: "typescript",
    archivePath: "docs/archived/gltfSceneLayers.ts.txt",
    description: "Geospatial layer definitions for high-fidelity 3D tiles."
  }
];
