import { SyllabusSubject } from '../types';

export const JEE_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'jee-phys',
    name: 'Physics',
    color: '#38bdf8', // sky
    units: [
      {
        id: 'phys-mech',
        name: 'Mechanics',
        chapters: [
          {
            id: 'p-kinematics',
            name: 'Kinematics in 1D & 2D',
            status: 'completed',
            subtopics: ['1D Motion', 'Vectors & Projectile', 'Relative Velocity'],
            resources: [
              { id: 'r1', title: 'HC Verma Vol 1 Chapter 3', type: 'book' },
              { id: 'r2', title: 'Projectile Formula Cheatsheet', type: 'notes' }
            ]
          },
          {
            id: 'p-nlm',
            name: 'Laws of Motion & Friction',
            status: 'completed',
            subtopics: ["Newton's Laws", 'Friction Coefficients', 'Constraint Relations'],
            resources: [{ id: 'r3', title: 'HC Verma Ch 5 Friction Problems', type: 'book' }]
          },
          {
            id: 'p-wep',
            name: 'Work, Energy & Power',
            status: 'learning',
            subtopics: ['Work-Energy Theorem', 'Conservative Forces', 'Potential Energy Curves', 'Power'],
            resources: [{ id: 'r4', title: 'Physics Galaxy WEP Advanced Video', type: 'video' }]
          },
          {
            id: 'p-rbd',
            name: 'Rotational Motion & Dynamics',
            status: 'learning',
            subtopics: ['Moment of Inertia', 'Torque & Angular Momentum', 'Rolling Motion', 'Collision in Rotation'],
            resources: [{ id: 'r5', title: 'Irodov Selected Problems', type: 'book' }]
          },
          {
            id: 'p-gravitation',
            name: 'Gravitation & Keplers Laws',
            status: 'not_started',
            subtopics: ['Gravitational Field', 'Potential Energy', 'Orbital Velocity & Escape Velocity'],
            resources: []
          }
        ]
      },
      {
        id: 'phys-electro',
        name: 'Electrodynamics',
        chapters: [
          {
            id: 'p-electrostatics',
            name: 'Electrostatics & Gauss Law',
            status: 'revision',
            subtopics: ['Coulombs Law', 'Electric Field & Potential', 'Gauss Flux Theorem', 'Conductors'],
            resources: [{ id: 'r6', title: 'Class Notes - Electrostatics', type: 'notes' }]
          },
          {
            id: 'p-capacitance',
            name: 'Capacitors & Dielectrics',
            status: 'not_started',
            subtopics: ['Parallel Plate Capacitor', 'Dielectric Insertion', 'RC Circuits Transients'],
            resources: []
          },
          {
            id: 'p-current-elec',
            name: 'Current Electricity',
            status: 'completed',
            subtopics: ["Kirchhoff's Laws", 'Wheatstone Bridge', 'Potentiometer & Meter Bridge'],
            resources: []
          },
          {
            id: 'p-emi-ac',
            name: 'EMI & Alternating Current',
            status: 'not_started',
            subtopics: ['Faradays Law & Lenz Law', 'Self & Mutual Inductance', 'LCR Resonance Circuits'],
            resources: []
          }
        ]
      },
      {
        id: 'phys-modern',
        name: 'Modern Physics & Optics',
        chapters: [
          {
            id: 'p-ray-optics',
            name: 'Ray Optics & Optical Instruments',
            status: 'learning',
            subtopics: ['Refraction at Spherical Surfaces', 'Lens Makers Formula', 'Prism Dispersion', 'Microscope/Telescope'],
            resources: []
          },
          {
            id: 'p-wave-optics',
            name: 'Wave Optics & Interference',
            status: 'not_started',
            subtopics: ['Huygens Principle', 'Youngs Double Slit Experiment', 'Diffraction & Polarization'],
            resources: []
          },
          {
            id: 'p-photoelectric',
            name: 'Photoelectric Effect & Nuclear Physics',
            status: 'revision',
            subtopics: ['Einsteins Photoelectric Eq', 'Bohr Model of Hydrogen', 'Radioactivity & Nuclear Fission'],
            resources: [{ id: 'r7', title: 'Modern Physics NCERT Highlights', type: 'notes' }]
          }
        ]
      }
    ]
  },
  {
    id: 'jee-chem',
    name: 'Chemistry',
    color: '#34d399', // emerald
    units: [
      {
        id: 'chem-physical',
        name: 'Physical Chemistry',
        chapters: [
          {
            id: 'c-mole',
            name: 'Mole Concept & Stoichiometry',
            status: 'completed',
            subtopics: ['Molarity & Normality', 'Limiting Reagent', 'Redox Titrations'],
            resources: [{ id: 'rc1', title: 'RC Mukherjee Physical Chem', type: 'book' }]
          },
          {
            id: 'c-thermo',
            name: 'Thermodynamics & Thermochemistry',
            status: 'learning',
            subtopics: ['First Law & Enthalpy', 'Entropy & Gibbs Free Energy', 'Spontaneity Criteria'],
            resources: [{ id: 'rc2', title: 'Thermodynamics Formula Map', type: 'notes' }]
          },
          {
            id: 'c-equilibrium',
            name: 'Chemical & Ionic Equilibrium',
            status: 'not_started',
            subtopics: ['Le Chateliers Principle', 'Buffer Solutions', 'Solubility Product Ksp'],
            resources: []
          },
          {
            id: 'c-electrochem',
            name: 'Electrochemistry & Solutions',
            status: 'revision',
            subtopics: ['Nernst Equation', 'Faradays Laws of Electrolysis', 'Colligative Properties & Van’t Hoff'],
            resources: []
          }
        ]
      },
      {
        id: 'chem-organic',
        name: 'Organic Chemistry',
        chapters: [
          {
            id: 'c-goc',
            name: 'General Organic Chemistry (GOC)',
            status: 'completed',
            subtopics: ['Inductive & Resonance Effects', 'Hyperconjugation & Aromaticity', 'Carbocation Stability', 'Acid-Base Strength'],
            resources: [{ id: 'rc3', title: 'MS Chouhan Advanced Problems', type: 'book' }]
          },
          {
            id: 'c-hydrocarbons',
            name: 'Hydrocarbons & Reaction Mechanisms',
            status: 'learning',
            subtopics: ['Electrophilic Addition to Alkenes', 'Free Radical Halogenation', 'Ozonolysis'],
            resources: []
          },
          {
            id: 'c-carbonyl',
            name: 'Aldehydes, Ketones & Carboxylic Acids',
            status: 'not_started',
            subtopics: ['Aldol & Cannizzaro Condensation', 'Grignard Reaction', 'Named Organic Reactions'],
            resources: [{ id: 'rc4', title: 'Master Reaction Map PDF', type: 'notes' }]
          }
        ]
      },
      {
        id: 'chem-inorganic',
        name: 'Inorganic Chemistry',
        chapters: [
          {
            id: 'c-chemical-bonding',
            name: 'Chemical Bonding & Molecular Structure',
            status: 'completed',
            subtopics: ['VSEPR Theory', 'Hybridization', 'Molecular Orbital Theory (MOT)', 'Hydrogen Bonding'],
            resources: [{ id: 'rc5', title: 'NCERT Line by Line Notes', type: 'notes' }]
          },
          {
            id: 'c-coordination',
            name: 'Coordination Compounds',
            status: 'revision',
            subtopics: ['IUPAC Nomenclatures', 'Crystal Field Theory (CFT)', 'Isomerism in Complexes'],
            resources: []
          },
          {
            id: 'c-pblock',
            name: 'p-Block & d-Block Elements',
            status: 'not_started',
            subtopics: ['Trends in Group 15-18', 'Transition Elements & Lanthanide Contraction'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'jee-maths',
    name: 'Mathematics',
    color: '#a78bfa', // violet
    units: [
      {
        id: 'maths-calculus',
        name: 'Calculus',
        chapters: [
          {
            id: 'm-lcd',
            name: 'Limits, Continuity & Differentiability',
            status: 'completed',
            subtopics: ['L-Hopital Rule', 'Expansion Series', 'Continuity in Intervals', 'Differentiability Tests'],
            resources: [{ id: 'rm1', title: 'Cengage Calculus Book 1', type: 'book' }]
          },
          {
            id: 'm-aod',
            name: 'Applications of Derivatives (AOD)',
            status: 'learning',
            subtopics: ['Monotonicity & Maxima/Minima', 'Tangents & Normals', 'Mean Value Theorems'],
            resources: []
          },
          {
            id: 'm-integral',
            name: 'Definite & Indefinite Integration',
            status: 'learning',
            subtopics: ['Standard Substitutions', 'King & Queen Properties', 'Leibniz Rule', 'Reduction Formulas'],
            resources: [{ id: 'rm2', title: 'Integration 100 Advanced Problems', type: 'notes' }]
          },
          {
            id: 'm-diff-eq',
            name: 'Differential Equations & Area Under Curve',
            status: 'not_started',
            subtopics: ['Linear Differential Equations', 'Homogeneous Equations', 'Area between intersecting curves'],
            resources: []
          }
        ]
      },
      {
        id: 'maths-algebra',
        name: 'Algebra',
        chapters: [
          {
            id: 'm-matrices',
            name: 'Matrices & Determinants',
            status: 'completed',
            subtopics: ['Cramers Rule', 'Adjoint & Inverse', 'System of Linear Equations', 'Matrix Properties'],
            resources: []
          },
          {
            id: 'm-complex',
            name: 'Complex Numbers & Quadratic Equations',
            status: 'revision',
            subtopics: ['De Moivre Theorem', 'Cube Roots of Unity', 'Geometry of Complex Numbers', 'Location of Roots'],
            resources: []
          },
          {
            id: 'm-pnc',
            name: 'Permutations, Combinations & Probability',
            status: 'not_started',
            subtopics: ['Principle of Inclusion-Exclusion', 'Multinomial Theorem', 'Bayes Theorem', 'Random Variables'],
            resources: [{ id: 'rm3', title: 'Black Book Advanced Algebra', type: 'book' }]
          }
        ]
      },
      {
        id: 'maths-vector-3d',
        name: 'Vectors & 3D Coordinate Geometry',
        chapters: [
          {
            id: 'm-vectors',
            name: 'Vector Algebra',
            status: 'completed',
            subtopics: ['Dot & Cross Products', 'Scalar Triple Product (STP)', 'Vector Triple Product (VTP)'],
            resources: []
          },
          {
            id: 'm-3d',
            name: '3D Geometry',
            status: 'learning',
            subtopics: ['Direction Cosines & Ratios', 'Equations of Line in 3D', 'Shortest Distance between Skew Lines'],
            resources: []
          }
        ]
      }
    ]
  }
];

export const NEET_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'neet-bio',
    name: 'Biology (Botany & Zoology)',
    color: '#10b981',
    units: [
      {
        id: 'bio-genetics',
        name: 'Genetics & Evolution',
        chapters: [
          {
            id: 'b-principles-inheritance',
            name: 'Principles of Inheritance and Variation',
            status: 'completed',
            subtopics: ['Mendelian Genetics', 'Chromosomal Theory', 'Linkage & Crossing Over', 'Pedigree Analysis'],
            resources: [{ id: 'rb1', title: 'NCERT Biology Class 12th', type: 'book' }]
          },
          {
            id: 'b-molecular-basis',
            name: 'Molecular Basis of Inheritance',
            status: 'learning',
            subtopics: ['DNA Structure & Replication', 'Transcription & Genetic Code', 'Translation & Operon Model'],
            resources: [{ id: 'rb2', title: 'DNA Replication Diagram Notes', type: 'notes' }]
          }
        ]
      },
      {
        id: 'bio-human-physio',
        name: 'Human Physiology',
        chapters: [
          {
            id: 'b-neural',
            name: 'Neural Control and Coordination',
            status: 'completed',
            subtopics: ['Nerve Impulse Transmission', 'Human Brain Anatomy', 'Reflex Arc & Sensory Organs'],
            resources: []
          },
          {
            id: 'b-chemical-coord',
            name: 'Chemical Coordination and Integration',
            status: 'revision',
            subtopics: ['Endocrine Glands & Hormones', 'Mechanism of Hormone Action'],
            resources: []
          },
          {
            id: 'b-circulation',
            name: 'Body Fluids and Circulation',
            status: 'not_started',
            subtopics: ['Blood Groups & Coagulation', 'Cardiac Cycle & ECG', 'Double Circulation'],
            resources: []
          }
        ]
      },
      {
        id: 'bio-cell',
        name: 'Cell Biology & Biotechnology',
        chapters: [
          {
            id: 'b-cell-cycle',
            name: 'Cell Cycle and Cell Division',
            status: 'completed',
            subtopics: ['Mitosis Stages', 'Meiosis I & II Crossing Over', 'Cell Cycle Regulation'],
            resources: []
          },
          {
            id: 'b-biotech-principles',
            name: 'Biotechnology: Principles and Processes',
            status: 'learning',
            subtopics: ['Recombinant DNA Technology', 'Restriction Enzymes', 'PCR & Gel Electrophoresis'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'neet-chem',
    name: 'Chemistry',
    color: '#38bdf8',
    units: JEE_SYLLABUS[1].units
  },
  {
    id: 'neet-phys',
    name: 'Physics',
    color: '#f59e0b',
    units: JEE_SYLLABUS[0].units
  }
];

export const GATE_CS_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'gate-core-cs',
    name: 'Core Computer Science',
    color: '#6366f1',
    units: [
      {
        id: 'cs-dsa',
        name: 'Data Structures & Algorithms',
        chapters: [
          {
            id: 'cs-asymptotic',
            name: 'Asymptotic Analysis & Recurrences',
            status: 'completed',
            subtopics: ['Big-O, Omega, Theta', 'Master Theorem', 'Divide & Conquer Recurrences'],
            resources: [{ id: 'rg1', title: 'CLRS Algorithms Reference', type: 'book' }]
          },
          {
            id: 'cs-trees-graphs',
            name: 'Trees, Graphs & Dynamic Programming',
            status: 'learning',
            subtopics: ['BST & AVL Trees', 'Dijkstra & Bellman-Ford', '0/1 Knapsack & LCS'],
            resources: []
          }
        ]
      },
      {
        id: 'cs-os',
        name: 'Operating Systems',
        chapters: [
          {
            id: 'cs-process',
            name: 'Processes, Threads & CPU Scheduling',
            status: 'completed',
            subtopics: ['Preemptive Scheduling', 'Context Switching', 'Process States'],
            resources: [{ id: 'rg2', title: 'Silberschatz OS Book', type: 'book' }]
          },
          {
            id: 'cs-sync-deadlocks',
            name: 'Process Synchronization & Deadlocks',
            status: 'revision',
            subtopics: ['Semaphores & Mutex', 'Peterson Algorithm', 'Bankers Algorithm'],
            resources: []
          },
          {
            id: 'cs-memory',
            name: 'Virtual Memory & Paging',
            status: 'not_started',
            subtopics: ['Page Replacement Algorithms', 'TLB & Inverted Page Tables', 'Thrashing'],
            resources: []
          }
        ]
      },
      {
        id: 'cs-dbms',
        name: 'Database Management Systems',
        chapters: [
          {
            id: 'cs-er-relational',
            name: 'Relational Model & Normalization',
            status: 'completed',
            subtopics: ['1NF, 2NF, 3NF, BCNF', 'Lossless Join & Dependency Preservation', 'Functional Dependencies'],
            resources: []
          },
          {
            id: 'cs-transactions',
            name: 'Transactions & Concurrency Control',
            status: 'learning',
            subtopics: ['ACID Properties', 'Serializability & Conflict Equivalence', 'Two Phase Locking (2PL)'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'gate-systems',
    name: 'Computer Systems & Architecture',
    color: '#ec4899',
    units: [
      {
        id: 'cs-cn',
        name: 'Computer Networks',
        chapters: [
          {
            id: 'cs-network-layers',
            name: 'Transport Layer & TCP/IP Congestion',
            status: 'learning',
            subtopics: ['TCP 3-way Handshake', 'Flow Control (Sliding Window)', 'Slow Start & Congestion Avoidance'],
            resources: []
          },
          {
            id: 'cs-routing',
            name: 'IP Addressing, Subnetting & Routing',
            status: 'revision',
            subtopics: ['CIDR & Subnet Calculations', 'Distance Vector & Link State Routing'],
            resources: []
          }
        ]
      },
      {
        id: 'cs-coa',
        name: 'Computer Organization & Architecture',
        chapters: [
          {
            id: 'cs-pipelining',
            name: 'Instruction Pipelining & Cache Memory',
            status: 'not_started',
            subtopics: ['Pipeline Hazards (Data/Control/Structural)', 'Cache Mapping (Direct, Associative)', 'Write-through vs Write-back'],
            resources: []
          }
        ]
      }
    ]
  }
];

export const UPSC_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'upsc-polity',
    name: 'Indian Polity & Constitution',
    color: '#3b82f6',
    units: [
      {
        id: 'polity-const',
        name: 'Constitutional Framework',
        chapters: [
          {
            id: 'u-preamble-fr',
            name: 'Preamble, Fundamental Rights & DPSP',
            status: 'completed',
            subtopics: ['Article 14-32 In-Depth', 'Basic Structure Doctrine', 'Directive Principles vs FR'],
            resources: [{ id: 'ru1', title: 'M. Laxmikanth Indian Polity', type: 'book' }]
          },
          {
            id: 'u-parliament-judiciary',
            name: 'Union Executive, Parliament & Judiciary',
            status: 'learning',
            subtopics: ['President & Governor Powers', 'Parliamentary Committees', 'Supreme Court & Judicial Review'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'upsc-history',
    name: 'Modern History & Art Culture',
    color: '#f97316',
    units: [
      {
        id: 'hist-freedom',
        name: 'Indian Freedom Struggle',
        chapters: [
          {
            id: 'u-national-movement',
            name: 'Gandhian Era & Mass Movements',
            status: 'completed',
            subtopics: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Quit India Movement 1942'],
            resources: [{ id: 'ru2', title: 'Spectrum Modern History', type: 'book' }]
          }
        ]
      }
    ]
  },
  {
    id: 'upsc-economy',
    name: 'Indian Economy & Macroeconomics',
    color: '#10b981',
    units: [
      {
        id: 'econ-macro',
        name: 'Fiscal Policy & Banking',
        chapters: [
          {
            id: 'u-monetary-policy',
            name: 'RBI Monetary Policy & Inflation',
            status: 'learning',
            subtopics: ['Repo Rate & CRR/SLR', 'CPI vs WPI Inflation', 'NPA Management in Banks'],
            resources: []
          }
        ]
      }
    ]
  }
];

export const CAT_SYLLABUS: SyllabusSubject[] = [
  {
    id: 'cat-quant',
    name: 'Quantitative Aptitude (QA)',
    color: '#8b5cf6',
    units: [
      {
        id: 'cat-arithmetic',
        name: 'Arithmetic',
        chapters: [
          {
            id: 'cat-tsdp',
            name: 'Time, Speed & Distance, Work',
            status: 'completed',
            subtopics: ['Relative Speed & Trains', 'Boats & Streams', 'Races & Escalators'],
            resources: [{ id: 'rcat1', title: 'Arun Sharma QA for CAT', type: 'book' }]
          },
          {
            id: 'cat-percent-pl',
            name: 'Percentages, Profit & Loss, SI-CI',
            status: 'completed',
            subtopics: ['Successive Percentage Change', 'Faulty Weights & Discounts', 'Effective Interest Rates'],
            resources: []
          }
        ]
      },
      {
        id: 'cat-algebra',
        name: 'Algebra & Geometry',
        chapters: [
          {
            id: 'cat-quadratics',
            name: 'Functions, Quadratics & Logarithms',
            status: 'learning',
            subtopics: ['Roots Transformation', 'Logarithmic Inequalities', 'Composite & Inverse Functions'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'cat-dilr',
    name: 'Data Interpretation & Logical Reasoning',
    color: '#06b6d4',
    units: [
      {
        id: 'cat-lr',
        name: 'Logical Reasoning & Games',
        chapters: [
          {
            id: 'cat-arrangements',
            name: 'Matrix Arrangements & Tournaments',
            status: 'learning',
            subtopics: ['Round-Robin Tournaments', 'Knockout Matches', 'Seating Arrangement Constraints'],
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'cat-varc',
    name: 'Verbal Ability & Reading Comprehension',
    color: '#f43f5e',
    units: [
      {
        id: 'cat-rc',
        name: 'Reading Comprehension',
        chapters: [
          {
            id: 'cat-rc-passages',
            name: 'Critical Reasoning & RC Analysis',
            status: 'revision',
            subtopics: ['Philosophy & Economics Passages', 'Author Tone & Main Idea Extraction', 'Para Jumbles & Summary'],
            resources: []
          }
        ]
      }
    ]
  }
];

export function getDefaultSyllabusForExam(exam: string): SyllabusSubject[] {
  const normalized = exam.toLowerCase();
  if (normalized.includes('neet')) return NEET_SYLLABUS;
  if (normalized.includes('gate')) return GATE_CS_SYLLABUS;
  if (normalized.includes('upsc')) return UPSC_SYLLABUS;
  if (normalized.includes('cat')) return CAT_SYLLABUS;
  return JEE_SYLLABUS;
}
