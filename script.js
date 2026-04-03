// Apply theme immediately to prevent white flash
(function(){
  try {
    var bg = localStorage.getItem('air_theme_bg') || 'forest';
    var THEMES = {
      forest: {'--bg':'#0d1f0f','--s1':'#111f13','--s2':'#152718','--txt':'#c8e6c9'},
      midnight: {'--bg':'#0a0e1a','--s1':'#0f1635','--s2':'#121c3e','--txt':'#d0d8f0'},
      ocean: {'--bg':'#050d1a','--s1':'#081220','--s2':'#0b1828','--txt':'#b8d4f0'},
      sunset: {'--bg':'#1a0a0a','--s1':'#1f0e0e','--s2':'#241212','--txt':'#ffe8e8'},
      dark: {'--bg':'#0d1117','--s1':'#161b22','--s2':'#1c2128','--txt':'#e6edf3'}
    };
    var t = THEMES[bg] || THEMES.forest;
    document.documentElement.style.setProperty('--bg', t['--bg']);
    document.documentElement.style.setProperty('--s1', t['--s1']);
    document.documentElement.style.setProperty('--s2', t['--s2']);
    document.documentElement.style.setProperty('--txt', t['--txt']);
    document.body && (document.body.style.background = t['--bg']);
  } catch(e){}
})();
// Particle canvas for splash
(function(){
  const c=document.getElementById('splash-canvas');
  if(!c)return;
  const ctx=c.getContext('2d');
  let W,H,pts=[];
  function resize(){W=c.width=innerWidth;H=c.height=innerHeight;init()}
  function init(){
    pts=[];
    for(let i=0;i<55;i++){
      pts.push({
        x:Math.random()*W,y:Math.random()*H,
        r:Math.random()*1.6+.3,
        dx:(Math.random()-.5)*.3,dy:(Math.random()-.5)*.3,
        o:Math.random()*.5+.1
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    // Glow blobs
    const g1=ctx.createRadialGradient(W*.5,H*.38,0,W*.5,H*.38,W*.45);
    g1.addColorStop(0,'rgba(91,155,255,.08)');g1.addColorStop(1,'transparent');
    ctx.fillStyle=g1;ctx.fillRect(0,0,W,H);
    const g2=ctx.createRadialGradient(W*.8,H*.8,0,W*.8,H*.8,W*.35);
    g2.addColorStop(0,'rgba(184,158,255,.06)');g2.addColorStop(1,'transparent');
    ctx.fillStyle=g2;ctx.fillRect(0,0,W,H);
    // Stars
    pts.forEach(p=>{
      p.x+=p.dx;p.y+=p.dy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;
      if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(180,200,255,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
})();

window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{
    const s=document.getElementById('splash');
    s.classList.add('hide');
    setTimeout(()=>{
      s.remove();
      // Load saved theme first (before anything renders)
      loadSavedTheme();
      // Load saved language
      loadSavedLang();
      // Check if first-time user
      if(!isProfileComplete()) {
        showOnboarding();
      }
    },650);
  },2600);
});



// ═══════════════════════════════════════════════
//  AIR HUNTER — MERGED APP
// ═══════════════════════════════════════════════

// ─── STORAGE ─────────────────────────────────
const LS={g:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};

// ─── CHAPTER DATA ─────────────────────────────
// ─── PROFILE SYSTEM ───────────────────────────
const PROFILE = {
  get: () => LS.g('air_profile', { name: 'Student', avatar: '🎯', exam: 'jee', cls: '11' }),
  set: (p) => LS.s('air_profile', p)
};

// ─── ALL CHAPTERS DATA ─────────────────────────

// JEE Class 11
const CHAPTERS_JEE_11 = {
  p:[
    {id:'p1',name:'Kinematics',subtopics:['Distance & Displacement','Speed & Velocity','Acceleration','Equations of Motion','Projectile Motion','Relative Motion','Circular Motion']},
    {id:'p2',name:'Laws of Motion',subtopics:['Newton\'s 1st Law','Newton\'s 2nd Law','Newton\'s 3rd Law','Free Body Diagram','Friction','Tension & Pulley']},
    {id:'p3',name:'Work, Energy & Power',subtopics:['Work Done','Kinetic Energy','Potential Energy','Work-Energy Theorem','Power','Conservation of Energy']},
    {id:'p4',name:'Rotational Motion',subtopics:['Moment of Inertia','Torque','Angular Momentum','Rolling Motion','Theorems of MI']},
    {id:'p5',name:'Gravitation',subtopics:['Kepler\'s Laws','Universal Gravitation','Gravitational PE','Satellites','Escape Velocity']},
    {id:'p6',name:'Thermodynamics',subtopics:['Zeroth Law','1st Law','2nd Law','Carnot Engine','Heat Engines','Entropy']},
    {id:'p7',name:'Waves',subtopics:['Wave Motion','Sound Waves','Standing Waves','Doppler Effect','Superposition']},
    {id:'p8',name:'Properties of Matter',subtopics:['Elasticity','Stress & Strain','Fluid Statics','Viscosity','Surface Tension']},
  ],
  g:[
    {id:'g1',name:'Atomic Structure',subtopics:['Bohr Model','Quantum Numbers','Orbitals','Electronic Config','Aufbau Principle']},
    {id:'g2',name:'Chemical Bonding',subtopics:['Ionic Bonding','Covalent Bonding','VSEPR Theory','Hybridization','MO Theory']},
    {id:'g3',name:'States of Matter',subtopics:['Gas Laws','Ideal Gas','Real Gas','Van der Waals','Liquids & Solids']},
    {id:'g4',name:'Thermodynamics',subtopics:['Enthalpy','Entropy','Gibbs Energy','Hess\'s Law','Bond Enthalpies']},
    {id:'g5',name:'Equilibrium',subtopics:['Kc & Kp','Le Chatelier\'s Principle','Ionic Equilibrium','pH','Buffer Solutions']},
    {id:'g6',name:'s-Block Elements',subtopics:['Group 1','Group 2','Hydrogen','Anomalous Properties']},
    {id:'g7',name:'Organic Basics',subtopics:['IUPAC Nomenclature','Isomerism','Electronic Effects','Reaction Intermediates']},
    {id:'g8',name:'Hydrocarbons',subtopics:['Alkanes','Alkenes','Alkynes','Aromatic','Reactions']},
  ],
  r:[
    {id:'r1',name:'Sets & Relations',subtopics:['Set Operations','Venn Diagrams','Relations','Functions','Types of Functions']},
    {id:'r2',name:'Complex Numbers',subtopics:['Algebra of Complex','Modulus & Argument','Polar Form','De Moivre\'s Theorem']},
    {id:'r3',name:'Quadratic Equations',subtopics:['Roots & Discriminant','Sum & Product of Roots','Nature of Roots','Inequalities']},
    {id:'r4',name:'Sequences & Series',subtopics:['AP','GP','HP','Sum of Special Series']},
    {id:'r5',name:'Trigonometry',subtopics:['Trig Ratios','Identities','Inverse Trig','Equations','Triangle Properties']},
    {id:'r6',name:'Straight Lines',subtopics:['Slope','Forms of Line','Angle Between Lines','Distance','Locus']},
    {id:'r7',name:'Conic Sections',subtopics:['Circle','Parabola','Ellipse','Hyperbola']},
    {id:'r8',name:'Limits & Continuity',subtopics:['Limit Definition','Standard Limits','L\'Hôpital\'s Rule','Continuity']},
    {id:'r9',name:'Differentiation',subtopics:['Chain Rule','Product Rule','Implicit','Parametric','Higher Derivatives']},
    {id:'r10',name:'Statistics & Probability',subtopics:['Mean & Median','Variance','Classical Probability','Bayes Theorem']},
  ]
};

// JEE Class 12
const CHAPTERS_JEE_12 = {
  p:[
    {id:'p1',name:'Electrostatics',subtopics:['Coulomb\'s Law','Electric Field','Electric Field Lines','Electric Flux','Gauss\'s Law','Electric Potential','Equipotential Surfaces','Potential Energy']},
    {id:'p2',name:'Capacitors',subtopics:['Capacitance','Parallel Plate Capacitor','Dielectrics','Combination of Capacitors','Energy Stored','Van de Graaff Generator']},
    {id:'p3',name:'Current Electricity',subtopics:['Electric Current','Ohm\'s Law','Resistance','Resistivity','Kirchhoff\'s Laws','Wheatstone Bridge','Meter Bridge','Potentiometer']},
    {id:'p4',name:'Moving Charges and Magnetism',subtopics:['Magnetic Force','Biot-Savart Law','Ampere\'s Law','Solenoid & Toroid','Motion in Magnetic Field','Cyclotron','Galvanometer']},
    {id:'p5',name:'Magnetism and Matter',subtopics:['Bar Magnet','Magnetic Dipole','Earth\'s Magnetism','Magnetisation','Diamagnetic','Paramagnetic','Ferromagnetic']},
    {id:'p6',name:'Electromagnetic Induction',subtopics:['Magnetic Flux','Faraday\'s Laws','Lenz\'s Law','Motional EMF','Self Inductance','Mutual Inductance','AC Generator']},
    {id:'p7',name:'Alternating Current',subtopics:['AC Voltage','RMS Values','Phasors','R-L-C Circuit','Resonance','Power in AC','LC Oscillations','Transformer']},
    {id:'p8',name:'Electromagnetic Waves',subtopics:['Displacement Current','Maxwell\'s Equations','EM Spectrum','Properties of EM Waves','Uses of each band']},
    {id:'p9',name:'Ray Optics',subtopics:['Reflection','Refraction','Total Internal Reflection','Prism','Lenses','Lens Formula','Magnification','Optical Instruments']},
    {id:'p10',name:'Wave Optics',subtopics:['Wavefront','Huygens Principle','Interference','Young\'s Double Slit','Diffraction','Polarisation']},
    {id:'p11',name:'Dual Nature of Radiation and Matter',subtopics:['Photoelectric Effect','Einstein\'s Equation','de Broglie Wavelength','Davisson-Germer Experiment']},
    {id:'p12',name:'Atoms',subtopics:['Rutherford Model','Bohr Model','Energy Levels','Hydrogen Spectrum','Atomic Spectra']},
    {id:'p13',name:'Nuclei',subtopics:['Nuclear Size & Mass','Binding Energy','Nuclear Forces','Radioactivity','Alpha Beta Gamma Decay','Nuclear Fission & Fusion']},
    {id:'p14',name:'Semiconductor Electronics',subtopics:['Energy Bands','Intrinsic & Extrinsic','p-n Junction','Diode','Rectifier','Zener Diode','Transistor','Logic Gates']},
  ],
  g:[
    {id:'g1',name:'Solid State',subtopics:['Crystal Lattice','Unit Cell','Packing Efficiency','Voids','Defects','Electrical Properties','Magnetic Properties']},
    {id:'g2',name:'Solutions',subtopics:['Types of Solutions','Solubility','Vapour Pressure','Raoult\'s Law','Colligative Properties','Osmosis','Abnormal MM']},
    {id:'g3',name:'Electrochemistry',subtopics:['Galvanic Cell','EMF','Nernst Equation','Equilibrium Constant','Electrolytic Cell','Faraday\'s Laws','Batteries','Corrosion']},
    {id:'g4',name:'Chemical Kinetics',subtopics:['Rate of Reaction','Rate Law','Order & Molecularity','Integrated Rate Law','Half Life','Arrhenius Equation','Mechanisms']},
    {id:'g5',name:'Surface Chemistry',subtopics:['Adsorption','Catalysis','Colloids','Tyndall Effect','Emulsions','Micelles','Coagulation']},
    {id:'g6',name:'p-Block Elements',subtopics:['Group 15 - N P As Sb Bi','Group 16 - O S Se Te','Group 17 - Halogens','Group 18 - Noble Gases','Oxoacids','Interhalogen Compounds']},
    {id:'g7',name:'d and f Block Elements',subtopics:['Transition Metals Properties','Oxidation States','Magnetic Properties','Catalytic Properties','Lanthanoids','Actinoids']},
    {id:'g8',name:'Coordination Compounds',subtopics:['Werner\'s Theory','IUPAC Nomenclature','Isomerism','Crystal Field Theory','Colour','Stability','Organometallics']},
    {id:'g9',name:'Haloalkanes and Haloarenes',subtopics:['Classification','Preparation','Properties','SN1 & SN2','Elimination','Uses']},
    {id:'g10',name:'Alcohols Phenols and Ethers',subtopics:['Preparation','Physical Properties','Chemical Reactions','Acidity','Williamson Synthesis','Uses']},
    {id:'g11',name:'Aldehydes Ketones and Carboxylic Acids',subtopics:['Nomenclature','Preparation','Nucleophilic Addition','Aldol Condensation','Cannizzaro','Acidity of RCOOH','Named Reactions']},
    {id:'g12',name:'Amines',subtopics:['Classification','Preparation','Properties','Basicity','Diazonium Salts','Coupling Reactions']},
    {id:'g13',name:'Biomolecules',subtopics:['Carbohydrates','Proteins','Enzymes','Vitamins','Nucleic Acids','Hormones']},
    {id:'g14',name:'Polymers',subtopics:['Classification','Types of Polymerisation','Natural Polymers','Synthetic Polymers','Rubber','Biodegradable']},
    {id:'g15',name:'Chemistry in Everyday Life',subtopics:['Drugs & Medicines','Analgesics','Antibiotics','Antacids','Food Preservatives','Soaps & Detergents']},
  ],
  r:[
    {id:'r1',name:'Relations and Functions',subtopics:['Types of Relations','Reflexive Symmetric Transitive','Equivalence','Types of Functions','Composition','Invertible Functions']},
    {id:'r2',name:'Inverse Trigonometric Functions',subtopics:['Domain & Range','Graphs','Principal Value','Properties','Identities','Equations']},
    {id:'r3',name:'Matrices',subtopics:['Types of Matrices','Matrix Operations','Transpose','Symmetric & Skew','Elementary Row Operations']},
    {id:'r4',name:'Determinants',subtopics:['Properties of Determinants','Cofactors','Adjoint','Inverse','Cramer\'s Rule','Area of Triangle']},
    {id:'r5',name:'Continuity and Differentiability',subtopics:['Continuity','Differentiability','Chain Rule','Implicit Differentiation','Parametric','Rolle\'s Theorem','MVT','Logarithmic Differentiation']},
    {id:'r6',name:'Application of Derivatives',subtopics:['Rate of Change','Tangent & Normal','Increasing & Decreasing','Maxima & Minima','Approximations']},
    {id:'r7',name:'Integrals',subtopics:['Standard Forms','Substitution','By Parts','Partial Fractions','Definite Integrals','Properties','Limit as Sum']},
    {id:'r8',name:'Application of Integrals',subtopics:['Area Under Curve','Area Between Two Curves','Area Using Horizontal Strip']},
    {id:'r9',name:'Differential Equations',subtopics:['Order & Degree','General & Particular Solution','Variable Separable','Homogeneous DE','Linear DE']},
    {id:'r10',name:'Vector Algebra',subtopics:['Types of Vectors','Addition','Dot Product','Cross Product','Scalar Triple Product','Vector Triple Product']},
    {id:'r11',name:'Three Dimensional Geometry',subtopics:['Direction Cosines & Ratios','Equation of Line','Angle Between Lines','Equation of Plane','Angle Between Planes','Distance Formulas','Skew Lines']},
    {id:'r12',name:'Probability',subtopics:['Conditional Probability','Multiplication Theorem','Independent Events','Bayes\' Theorem','Random Variable','Binomial Distribution']},
  ]
};

// NEET Class 11
const CHAPTERS_NEET_11 = {
  p:[
    {id:'p1',name:'Kinematics',subtopics:['Distance & Displacement','Speed & Velocity','Acceleration','Equations of Motion','Projectile Motion']},
    {id:'p2',name:'Laws of Motion',subtopics:['Newton\'s Laws','Friction','Circular Motion','Free Body Diagram']},
    {id:'p3',name:'Work, Energy & Power',subtopics:['Work Done','KE & PE','Work-Energy Theorem','Power','Conservation']},
    {id:'p4',name:'Gravitation',subtopics:['Kepler\'s Laws','Universal Gravitation','Satellites','Escape Velocity']},
    {id:'p5',name:'Properties of Bulk Matter',subtopics:['Elasticity','Fluid Pressure','Viscosity','Surface Tension']},
    {id:'p6',name:'Thermodynamics',subtopics:['1st Law','2nd Law','Carnot Engine','Heat Transfer']},
    {id:'p7',name:'Oscillations & Waves',subtopics:['SHM','Spring','Pendulum','Sound Waves','Doppler Effect']},
  ],
  g:[
    {id:'g1',name:'Atomic Structure',subtopics:['Bohr Model','Quantum Numbers','Orbitals','Electronic Config']},
    {id:'g2',name:'Chemical Bonding',subtopics:['Ionic','Covalent','VSEPR','Hybridization']},
    {id:'g3',name:'States of Matter',subtopics:['Gas Laws','Ideal Gas','Kinetic Theory']},
    {id:'g4',name:'Thermodynamics (Chem)',subtopics:['Enthalpy','Entropy','Gibbs Energy','Hess\'s Law']},
    {id:'g5',name:'Equilibrium',subtopics:['Kc & Kp','Le Chatelier','pH','Buffer Solutions']},
    {id:'g6',name:'Organic Chemistry Basics',subtopics:['IUPAC','Isomerism','Electronic Effects','Reaction Types']},
    {id:'g7',name:'Hydrocarbons',subtopics:['Alkanes','Alkenes','Alkynes','Aromatic Compounds']},
  ],
  b:[
    {id:'b1',name:'Cell: Unit of Life',subtopics:['Cell Theory','Prokaryotic Cell','Eukaryotic Cell','Cell Organelles','Cell Wall & Membrane']},
    {id:'b2',name:'Biomolecules',subtopics:['Carbohydrates','Proteins','Lipids','Nucleic Acids','Enzymes']},
    {id:'b3',name:'Plant Kingdom',subtopics:['Algae','Bryophytes','Pteridophytes','Gymnosperms','Angiosperms']},
    {id:'b4',name:'Animal Kingdom',subtopics:['Porifera','Cnidaria','Platyhelminthes','Annelida','Arthropoda','Chordata']},
    {id:'b5',name:'Morphology of Plants',subtopics:['Root','Stem','Leaf','Flower','Fruit & Seed']},
    {id:'b6',name:'Anatomy of Plants',subtopics:['Tissues','Meristematic','Permanent','Secondary Growth']},
    {id:'b7',name:'Structural Organisation in Animals',subtopics:['Tissues','Organ Systems','Earthworm','Cockroach','Frog']},
    {id:'b8',name:'Photosynthesis',subtopics:['Light Reactions','Calvin Cycle','C4 Pathway','Photorespiration']},
    {id:'b9',name:'Respiration in Plants',subtopics:['Glycolysis','Krebs Cycle','Electron Transport Chain','Fermentation']},
    {id:'b10',name:'Plant Growth & Development',subtopics:['Growth Phases','Phytohormones','Auxins','Gibberellins','Photoperiodism']},
    {id:'b11',name:'Digestion & Absorption',subtopics:['GI Tract','Enzymes','Absorption','Disorders']},
    {id:'b12',name:'Body Fluids & Circulation',subtopics:['Blood','Lymph','Heart','Cardiac Cycle','ECG']},
  ]
};

// NEET Class 12
const CHAPTERS_NEET_12 = {
  p:[
    {id:'p1',name:'Electrostatics',subtopics:['Coulomb\'s Law','Electric Field','Gauss\'s Law','Potential','Capacitors']},
    {id:'p2',name:'Current Electricity',subtopics:['Ohm\'s Law','Kirchhoff\'s Laws','Wheatstone Bridge','Potentiometer']},
    {id:'p3',name:'Magnetic Effects & EMI',subtopics:['Biot-Savart','Ampere\'s Law','Faraday\'s Laws','Inductance','AC']},
    {id:'p4',name:'Optics',subtopics:['Reflection','Refraction','Lenses','Wave Optics','Interference']},
    {id:'p5',name:'Modern Physics',subtopics:['Photoelectric Effect','Bohr Model','Radioactivity','Nuclear Energy']},
    {id:'p6',name:'Semiconductors',subtopics:['p-n Junction','Diode','Transistor','Logic Gates']},
  ],
  g:[
    {id:'g1',name:'Electrochemistry',subtopics:['Galvanic Cells','Electrolysis','Faraday\'s Laws','Nernst Equation']},
    {id:'g2',name:'Chemical Kinetics',subtopics:['Rate Laws','Order','Arrhenius Equation','Half Life']},
    {id:'g3',name:'p-Block Elements',subtopics:['Group 15','Group 16','Group 17','Group 18']},
    {id:'g4',name:'Coordination Compounds',subtopics:['Werner Theory','Nomenclature','Isomerism','Crystal Field Theory']},
    {id:'g5',name:'Aldehydes & Ketones',subtopics:['Preparation','Nucleophilic Addition','Named Reactions']},
    {id:'g6',name:'Biomolecules (Chem)',subtopics:['Carbohydrates','Proteins','Nucleic Acids','Vitamins','Hormones']},
  ],
  b:[
    {id:'b1',name:'Reproduction in Plants',subtopics:['Asexual Reproduction','Flower Structure','Pollination','Fertilisation','Fruits']},
    {id:'b2',name:'Reproduction in Animals',subtopics:['Human Reproductive System','Gametogenesis','Fertilisation','Pregnancy']},
    {id:'b3',name:'Genetics',subtopics:['Mendel\'s Laws','Chromosomal Theory','Sex Determination','Linkage','Mutation']},
    {id:'b4',name:'Molecular Biology',subtopics:['DNA Structure','Replication','Transcription','Translation','Regulation']},
    {id:'b5',name:'Evolution',subtopics:['Origin of Life','Darwin\'s Theory','Natural Selection','Speciation','Human Evolution']},
    {id:'b6',name:'Human Health & Disease',subtopics:['Pathogens','Immunity','AIDS','Cancer','Drugs & Alcohol']},
    {id:'b7',name:'Biotechnology',subtopics:['rDNA Technology','PCR','Gel Electrophoresis','Cloning','Applications']},
    {id:'b8',name:'Ecosystem',subtopics:['Food Chain','Energy Flow','Nutrient Cycling','Succession','Productivity']},
    {id:'b9',name:'Biodiversity',subtopics:['Types of Diversity','Patterns','Threats','Conservation','Hotspots']},
    {id:'b10',name:'Excretion',subtopics:['Kidney Structure','Urine Formation','Osmoregulation','Disorders']},
    {id:'b11',name:'Locomotion & Movement',subtopics:['Muscle Types','Muscle Contraction','Skeleton','Joints','Disorders']},
    {id:'b12',name:'Neural Control',subtopics:['Neuron Structure','Nerve Impulse','Brain','Spinal Cord','Sense Organs']},
  ]
};

// ─── ACTIVE CHAPTERS (set by profile) ─────────
function getActiveChapters() {
  const prof = PROFILE.get();
  const key = prof.exam + '_' + prof.cls;
  const map = {
    'jee_11': CHAPTERS_JEE_11,
    'jee_12': CHAPTERS_JEE_12,
    'neet_11': CHAPTERS_NEET_11,
    'neet_12': CHAPTERS_NEET_12,
  };
  const base = map[key] || CHAPTERS_JEE_11;
  // Merge custom chapters
  const custom = getCustomChapters();
  const merged = {};
  Object.keys(base).forEach(s => { merged[s] = [...base[s]]; });
  Object.keys(custom).forEach(s => {
    if(!merged[s]) merged[s] = [];
    custom[s].forEach(cc => {
      if(!merged[s].find(x => x.id === cc.id)) merged[s].push(cc);
    });
  });
  return merged;
}

// ─── CUSTOM CHAPTERS STORAGE ──────────────────
function getCustomChapters() {
  return LS.g('jee2_custom_chapters', {});
}
function saveCustomChapters(data) {
  LS.s('jee2_custom_chapters', data);
}
function isCustomChapter(chapId) {
  const custom = getCustomChapters();
  return Object.values(custom).some(arr => arr.some(c => c.id === chapId));
}

// ─── ADD CHAPTER MODAL ────────────────────────
let _newSubList = []; // temp subtopics while building chapter

window.openAddChapterModal = () => {
  _newSubList = [];
  ge('add-chap-modal-title').textContent = '➕ New Chapter';
  ge('edit-chap-id').value = '';
  ge('new-chap-name').value = '';
  ge('new-sub-inp').value = '';
  ge('new-sub-list').innerHTML = '';
  ge('save-chap-btn').textContent = 'Save Chapter';
  // Update subject options based on exam
  const prof = PROFILE.get();
  const isNeet = prof.exam === 'neet';
  const sel = ge('new-chap-subj');
  if(sel) {
    sel.innerHTML = isNeet
      ? `<option value="p">⚛ Physics</option><option value="g">🧪 Chemistry</option><option value="b">🌿 Biology</option>`
      : `<option value="p">⚛ Physics</option><option value="g">🧪 Chemistry</option><option value="r">∑ Maths</option>`;
    sel.value = ST.pracSubj || 'p';
  }
  openModal('add-chapter-modal');
};

window.addSubToNewChap = () => {
  const inp = ge('new-sub-inp');
  const name = inp.value.trim();
  if(!name) return;
  if(_newSubList.includes(name)) { showToast('Ye subtopic already hai!', 1500); return; }
  _newSubList.push(name);
  inp.value = '';
  renderNewSubList();
  inp.focus();
};

window.removeNewSub = (idx) => {
  _newSubList.splice(idx, 1);
  renderNewSubList();
};

function renderNewSubList() {
  const el = ge('new-sub-list'); if(!el) return;
  el.innerHTML = _newSubList.map((s, i) =>
    `<div style="display:inline-flex;align-items:center;gap:4px;background:var(--s2);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:600;color:var(--txt)">
      <span>${s}</span>
      <button onclick="removeNewSub(${i})" style="background:none;border:none;cursor:pointer;color:var(--ar);font-size:14px;line-height:1;padding:0 0 0 2px">×</button>
    </div>`
  ).join('');
}

window.saveNewChapter = () => {
  const name = ge('new-chap-name').value.trim();
  const subj = ge('new-chap-subj').value;
  const editId = ge('edit-chap-id').value;

  if(!name) { showToast('Chapter name daalo!', 1500); return; }
  if(!_newSubList.length) { showToast('Kam se kam 1 subtopic add karo!', 1500); return; }

  const custom = getCustomChapters();
  if(!custom[subj]) custom[subj] = [];

  if(editId) {
    // Edit mode — update existing
    const idx = custom[subj].findIndex(c => c.id === editId);
    if(idx !== -1) {
      custom[subj][idx].name = name;
      custom[subj][idx].subtopics = [..._newSubList];
    }
    // Also update saved subtopics in ST.chapters if changed
    const saved = ST.chapters[editId];
    if(saved) {
      // Remove done marks for subtopics that were deleted
      const newSubs = new Set(_newSubList);
      Object.keys(saved.subtopics || {}).forEach(s => {
        if(!newSubs.has(s)) delete saved.subtopics[s];
      });
      sv('chapters');
    }
    showToast('✅ Chapter update ho gaya!', 2000);
  } else {
    // New chapter
    const newId = 'cust_' + uid();
    custom[subj].push({ id: newId, name, subtopics: [..._newSubList] });
    showToast(`✅ "${name}" add ho gaya!`, 2000);
  }

  saveCustomChapters(custom);
  closeModal('add-chapter-modal');
  // Switch to that subject tab
  const chipEl = ge('pchip-' + subj);
  if(chipEl) {
    document.querySelectorAll('#prac-chips .chip').forEach(c => c.classList.remove('on'));
    chipEl.classList.add('on');
    ST.pracSubj = subj;
  }
  renderChapterList();
};

// ─── EDIT / DELETE CUSTOM CHAPTER ─────────────
window.editCurrentChapter = () => {
  const id = ST.openChapterId;
  if(!id || !isCustomChapter(id)) return;
  const custom = getCustomChapters();
  let ch = null, subj = null;
  Object.keys(custom).forEach(s => {
    const found = custom[s].find(c => c.id === id);
    if(found) { ch = found; subj = s; }
  });
  if(!ch) return;

  _newSubList = [...ch.subtopics];
  ge('add-chap-modal-title').textContent = '✏ Edit Chapter';
  ge('edit-chap-id').value = id;
  ge('new-chap-name').value = ch.name;
  ge('new-chap-subj').value = subj;
  ge('save-chap-btn').textContent = 'Update Chapter';
  ge('new-sub-inp').value = '';
  renderNewSubList();
  openModal('add-chapter-modal');
};

window.deleteCurrentChapter = () => {
  const id = ST.openChapterId;
  if(!id || !isCustomChapter(id)) return;
  const ch = getAllChapById(id);
  customConfirm(`"${ch?.name}" chapter delete karna chahte ho?`, () => {
    const custom = getCustomChapters();
    Object.keys(custom).forEach(s => {
      custom[s] = custom[s].filter(c => c.id !== id);
    });
    saveCustomChapters(custom);
    // Clean up progress data
    if(ST.chapters[id]) { delete ST.chapters[id]; sv('chapters'); }
    closeChapter();
    showToast('🗑 Chapter delete ho gaya', 2000);
  }, { icon:'🗑', title:_t('chapter_del_title'), okLabel:_t('chapter_del_ok') });
};


const CHAPTERS = CHAPTERS_JEE_11; // will be overridden at runtime

// chapter names only (for test engine) — dynamic
let CH_NAMES = {};
let SUBJ_NAMES = {};
let SUBJ_COLORS = {p:'var(--ap)',g:'var(--ag)',r:'var(--ar)',b:'var(--ag)',all:'var(--am)'};

function refreshChapterData() {
  const ch = getActiveChapters();
  CH_NAMES = {};
  Object.keys(ch).forEach(s => { CH_NAMES[s] = ch[s].map(c=>c.name); });
  const prof = PROFILE.get();
  if (prof.exam === 'neet') {
    SUBJ_NAMES = {p:'Physics',g:'Chemistry',b:'Biology',all:'Full Mock'};
  } else {
    SUBJ_NAMES = {p:'Physics',g:'Chemistry',r:'Mathematics',all:'Full Mock'};
  }
}

// ─── PREP APP STATE ───────────────────────────
let ST = {
  tasks:    LS.g('jee2_tasks',[]),
  backlog:  LS.g('jee2_backlog',[]),
  notes:    LS.g('jee2_notes',[]),
  formulas: LS.g('jee2_formulas',[]),
  mocks:    LS.g('jee2_mocks',[]),
  revision: LS.g('jee2_revision',[]),
  streak:   LS.g('jee2_streak',{days:[],count:0}),
  scores:   LS.g('jee2_scores',{p:null,c:null,m:null}),
  chapters: LS.g('jee2_chapters',{}),
  pracSubj: 'p',
  formSubj: 'p',
  noteSubj: 'p',
  curPage:  'home',
  curSubPage:'revision',
  timerSecs:25*60,
  timerRunning:false,
  timerInt:null,
  openChapterId:null,
};
function sv(k){LS.s('jee2_'+k,ST[k])}

// ─── TEST ENGINE STATE ────────────────────────
let bank      = LS.g('jte_bank',[]);
let attempts  = LS.g('jte_attempts',[]);
let testSetup = {subj:null,chapters:[],timerMins:30};
let curSubPage2 = 'home';
let T = {qs:[],idx:0,answers:{},marked:{},timerSecs:0,timerInt:null,startTime:null,testName:'',subj:'',chapters:[],timerMins:0};

// ─── UTILS ────────────────────────────────────
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const today=()=>new Date().toISOString().split('T')[0];
const todayStr=()=>new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const nowStr=()=>{const n=new Date();return n.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})+' '+n.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true});}
const fmtD=(d)=>{if(!d)return'';const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
const ge=id=>document.getElementById(id);

// ─── STREAK SYSTEM ────────────────────────────
// Streak sirf tab count hoti hai jab us din 30+ min study ho
// 30 min = 1 Pomodoro + kuch extra ya manual kaam
// Tracked via: jee2_studymins_YYYY-MM-DD key

const STREAK_MIN_MINS = 30; // minimum minutes to earn streak

function getStudyMinsToday() {
  const key = 'jee2_studymins_' + today();
  return LS.g(key, 0);
}

function addStudyMins(mins) {
  const key = 'jee2_studymins_' + today();
  const cur = LS.g(key, 0);
  const newVal = cur + mins;
  LS.s(key, newVal);
  // Check if just crossed 30 min threshold
  if(cur < STREAK_MIN_MINS && newVal >= STREAK_MIN_MINS) {
    _earnStreakToday();
  }
  renderStreakProgress();
  return newVal;
}

function _earnStreakToday() {
  const t = today();
  if(ST.streak.days.includes(t)) return; // already earned
  ST.streak.days.push(t);
  // Recalculate consecutive count
  let cnt = 0, d = new Date();
  while(true) {
    const s = d.toISOString().split('T')[0];
    if(ST.streak.days.includes(s)) { cnt++; d.setDate(d.getDate()-1); }
    else break;
  }
  ST.streak.count = cnt;
  sv('streak');
  // Toast + vibrate
  doVibrate([100, 50, 100, 50, 200]);
  showToast('🔥 Streak earned! 30 min study complete!', 3000);
  renderStreak();
}

// Called from Pomodoro when focus session completes — uses ACTUAL timer duration
function onPomoComplete() {
  const actualMins = Math.round(_lastFocusSecs / 60); // actual mins user set
  addStudyMins(actualMins);
  const key = 'jee2_pomos_' + today();
  const count = LS.g(key, 0) + 1;
  LS.s(key, count);
  // Save to completion history
  addToCompHistory({
    type: 'timer',
    name: `Focus Session #${count}`,
    duration: actualMins,
    completedAt: nowStr()
  });
}

// Manual mark (for non-pomo study) - called from home page button
window.addManualStudy = (mins) => {
  const added = addStudyMins(mins || 30);
  showToast(`✅ ${mins || 30} min study added! Total: ${added} min`, 2500);
};

// markToday - now only marks if 30+ mins done (called from init just to render)
function markToday() {
  // Don't auto-earn streak on open — just render
  // Streak only earned via addStudyMins hitting 30 min threshold
}

function renderStreak() {
  const cal = ge('streak-cal'); if(!cal) return;
  cal.innerHTML = '';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayStr = today();

  // Month label
  const ml = ge('streak-month-label');
  if(ml) ml.textContent = now.toLocaleString('default',{month:'long',year:'numeric'});

  // Day-of-week headers
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'sday-hdr'; h.textContent = d;
    cal.appendChild(h);
  });

  // Empty cells before 1st
  const firstDow = new Date(year, month, 1).getDay();
  for(let i=0; i<firstDow; i++) {
    const e = document.createElement('div');
    e.className = 'sday empty'; cal.appendChild(e);
  }

  // Day cells
  for(let d=1; d<=daysInMonth; d++) {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isPast = ds < todayStr;
    const isToday = ds === todayStr;
    const done = ST.streak.days.includes(ds);
    const div = document.createElement('div');
    let cls = 'sday';
    if(isToday) cls += done ? ' today done' : ' today';
    else if(done) cls += ' done';
    else if(isPast) cls += ' miss';
    else cls += ' future';
    div.className = cls;
    div.textContent = d;
    div.title = ds;
    cal.appendChild(div);
  }

  // Update streak counts
  const sc = ge('streak-count'); if(sc) sc.textContent = ST.streak.count+'d';
  const ss = ge('s-streak'); if(ss) ss.textContent = ST.streak.count;

  // Show today's progress
  renderStreakProgress();

  // Date display
  const dd = ge('date-disp');
  if(dd) dd.textContent = now.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
}

function renderStreakProgress() {
  // Show how many mins studied today and progress to 30 min
  let bar = ge('streak-progress-bar');
  let label = ge('streak-progress-label');
  if(!bar) {
    // Create progress element inside card if not exists
    const cal = ge('streak-cal'); if(!cal) return;
    const wrap = document.createElement('div');
    wrap.id = 'streak-progress-wrap';
    wrap.className = 'streak-progress-wrap';
    wrap.innerHTML = `
      <div class="streak-progress-top">
        <span id="streak-progress-label" style="font-size:11px;color:var(--txt3);font-family:var(--fm)">0 / 30 min</span>
        <span id="streak-progress-status" style="font-size:11px;font-weight:700"></span>
      </div>
      <div class="streak-progress-track">
        <div class="streak-progress-bar" id="streak-progress-bar"></div>
      </div>
    `;
    cal.parentNode.insertBefore(wrap, cal);
    bar = ge('streak-progress-bar');
    label = ge('streak-progress-label');
  }
  const mins = getStudyMinsToday();
  const pct = Math.min(100, Math.round(mins / STREAK_MIN_MINS * 100));
  if(bar) bar.style.width = pct + '%';
  if(label) label.textContent = `${mins} / ${STREAK_MIN_MINS} min studied today`;
  const status = ge('streak-progress-status');
  if(status) {
    if(pct >= 100) { status.textContent = '🔥 Streak earned!'; status.style.color='var(--ag)'; }
    else { status.textContent = `${STREAK_MIN_MINS - mins} min aur`; status.style.color='var(--ay)'; }
  }
}

window.toggleStreakHistory = () => {
  const el = ge('streak-history');
  const arrow = ge('hist-arrow');
  if(!el) return;
  if(el.style.display === 'none') {
    el.style.display = 'block';
    if(arrow) arrow.textContent = '▲';
    renderStreakHistory();
  } else {
    el.style.display = 'none';
    if(arrow) arrow.textContent = '▼';
  }
};

function renderStreakHistory() {
  const el = ge('streak-history'); if(!el) return;
  el.innerHTML = '';

  // Group streak days by month
  const byMonth = {};
  ST.streak.days.forEach(ds => {
    const [y,m] = ds.split('-');
    const key = `${y}-${m}`;
    if(!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(parseInt(ds.split('-')[2]));
  });

  const months = Object.keys(byMonth).sort().reverse();
  const todayMonth = today().substring(0,7);

  if(!months.length) {
    el.innerHTML = '<div style="text-align:center;padding:16px;font-size:12px;color:var(--txt3);font-family:var(--fm)">' + _t('streak_empty') + '</div>';
    return;
  }

  months.forEach(mk => {
    if(mk === todayMonth) return; // current month already shown above
    const [y,m] = mk.split('-');
    const monthName = new Date(y, m-1, 1).toLocaleString('default',{month:'long',year:'numeric'});
    const days = byMonth[mk].sort((a,b)=>a-b);
    const daysInM = new Date(y, m, 0).getDate();
    const pct = Math.round(days.length / daysInM * 100);

    const div = document.createElement('div');
    div.className = 'hist-month';
    div.innerHTML = `
      <div class="hist-month-head">
        <span class="hist-month-name">${monthName}</span>
        <span class="hist-month-stat">${days.length}/${daysInM} days · ${pct}%</span>
      </div>
      <div class="hist-month-bar-track"><div class="hist-month-bar" style="width:${pct}%"></div></div>
      <div class="hist-day-chips">${days.map(d=>`<span class="hist-chip">${d}</span>`).join('')}</div>
    `;
    el.appendChild(div);
  });
}


// ─── PAGE NAVIGATION ──────────────────────────
// ─── SCREEN NAVIGATION SYSTEM ─────────────────
const _screenStack = [];

// Push a history entry so Android back button is intercepted
function _navPush(label) {
  history.pushState({ nav: label }, '');
}

function pushScreen(screenId, renderFn) {
  const cur = _screenStack[_screenStack.length - 1];
  if(cur) {
    const curEl = ge(cur);
    if(curEl) curEl.classList.remove('on');
  }
  _screenStack.push(screenId);
  const el = ge(screenId);
  if(!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('on');
  if(renderFn) renderFn();
  el.scrollTop = 0;
  _navPush('screen');
}

function popScreen() {
  if(_screenStack.length === 0) return;
  const cur = _screenStack.pop();
  const el = ge(cur);
  if(el) {
    el.classList.add('pop');
    setTimeout(() => { el.classList.remove('on','pop'); }, 220);
  }
  const prev = _screenStack[_screenStack.length - 1];
  if(prev) {
    const prevEl = ge(prev);
    if(prevEl) prevEl.classList.add('on');
  }
  doVibrate([20]);
}
window.popScreen = popScreen;

function clearScreenStack() {
  _screenStack.forEach(id => {
    const el = ge(id);
    if(el) el.classList.remove('on','pop');
  });
  _screenStack.length = 0;
}

// showSubPage → pushes a .scr full screen
function showSubPage(sp) {
  ST.curSubPage = sp;
  const renderMap = {
    backlog:   renderBacklog,
    formulas:  renderFormulas,
    notes:     renderNotes,
    revision:  renderRevision,
    mocks:     renderMocks,
    analytics: renderAnalytics,
    completed: () => renderCompHistory('all'),
    timer:     () => {},
    weak:      () => { _weakActiveTab='engine'; switchWeakTab('engine'); },
  };
  pushScreen('screen-' + sp, renderMap[sp] || null);
}

// showSubPage2 → pushes a .scr full screen
function showSubPage2(sp) {
  curSubPage2 = sp;
  if(sp === 'home') { popScreen(); return; }
  const renderMap = {
    bank:    renderBank,
    history: renderHistory,
    config:  () => {},
    quicktest: () => {
      qtParsedQ = [];
      const inp = ge('qt-json-inp'); if(inp) inp.value = '';
      const st  = ge('qt-status');   if(st)  st.style.display = 'none';
      const btn = ge('qt-start-btn');
      if(btn){ btn.style.opacity='.4'; btn.style.pointerEvents='none'; }
      const qc = ge('qt-q-count'); if(qc) qc.textContent = '';
      qtSelectTimer(30);
    },
  };
  pushScreen('screen-' + sp, renderMap[sp] || null);
}

// Page navigation — tabs
const _pageOrder = ['home','practice','testsetup','more','profile'];

function showPage(p){
  // Track pages for Explorer badge
  if(p==='home')     LS.s('air_page_home',true);
  if(p==='chapters') LS.s('air_page_chapters',true);
  if(p==='profile')  LS.s('air_page_profile',true);
  checkExplorerBadge();
  clearScreenStack();
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
  document.querySelectorAll('.bn').forEach(x=>x.classList.remove('on'));
  ge('page-'+p).classList.add('on');
  const bn=ge('bn-'+p);if(bn)bn.classList.add('on');
  ST.curPage=p;
  // Reset scroll to top smoothly on page switch
  window.scrollTo({top:0,behavior:'instant'});
  document.documentElement.scrollTop=0;
  document.body.scrollTop=0;
  const fab=ge('fab');
  const fabPages=['more'];
  if(fab)fab.className='fab'+(fabPages.includes(p)?'':' hide');
  const renders={
    home:renderHome,
    practice:renderChapterList,
    more:renderMore,
    testsetup:renderTestHome,
    profile:renderProfile
  };
  if(renders[p])renders[p]();
  // Push history so back button can go back to home
  if(p !== 'home') _navPush('page-' + p);
}

// ── Android/Browser back button handler ──
window.addEventListener('popstate', (e) => {
  // If a screen is open — close it
  if(_screenStack.length > 0) {
    popScreen();
    // Keep history in sync — don't let browser go back further
    history.pushState({ nav: 'screen' }, '');
    return;
  }
  // If chapter detail is open — close it
  const chapPage = ge('page-chapter');
  if(chapPage && chapPage.style.display !== 'none' && chapPage.classList.contains('on') || 
     (chapPage && chapPage.style.display === 'block')) {
    closeChapter();
    if(ST.curPage !== 'home') history.pushState({ nav: 'page-' + ST.curPage }, '');
    return;
  }
  // If on a page other than home — go to home
  if(ST.curPage && ST.curPage !== 'home') {
    showPage('home');
    return;
  }
  // Already on home — let browser handle (minimizes app)
});

// On first load, push an initial state so back button is always intercepted
window.addEventListener('load', () => {
  history.replaceState({ nav: 'home' }, '');
  // Track early_bird and night_owl badges based on time of use
  const _h = new Date().getHours();
  if(_h>=4 && _h<7)  LS.s('air_early_bird_done', true);
  if(_h>=23 || _h<2) LS.s('air_night_owl_done', true);
});


// ─── HOME ─────────────────────────────────────
function renderHome(){
  const prof = PROFILE.get();

  // Auto-accuracy display with progress indicator
  const subjKeys = [{id:'s-p', key:'p', subj:'p'}, {id:'s-c', key:'c', subj:'g'}, {id:'s-m', key:'m', subj:'r'}];
  subjKeys.forEach(({id, key, subj}) => {
    const el = ge(id); if(!el) return;
    const count = getSubjTestCount(key);
    const acc   = ST.scores[key];
    if(acc !== null) {
      el.textContent = acc + '%';
      el.title = `${count} tests ke basis par`;
    } else {
      const rem = MIN_TESTS_FOR_ACCURACY - count;
      el.textContent = count > 0 ? `${count}/5` : '—';
      el.title = count > 0 ? `${rem} aur tests do accuracy ke liye` : '5 tests do';
    }
  });

  // Update hint text under each score card
  ['p','c','m'].forEach(k => {
    const count = getSubjTestCount(k);
    const acc   = ST.scores[k];
    const hintEl = ge('sh-' + k);
    if(!hintEl) return;
    if(acc !== null) hintEl.textContent = `${getSubjTestCount(k)} tests ✓`;
    else if(count > 0) hintEl.textContent = `${MIN_TESTS_FOR_ACCURACY - count} more needed`;
    else hintEl.textContent = 'accuracy';
  });

  renderStreak();
  ge('date-disp').textContent=new Date().toDateString().toUpperCase();
  const tw=ge('home-tasks');
  if(!ST.tasks.length){tw.innerHTML='<div class="empty"><span class="empty-icon">📋</span><span class="empty-text">'+_t('no_tasks_text')+'</span></div>';ge('task-count-badge').textContent='0/0';return}
  const done=ST.tasks.filter(t=>t.done).length;
  ge('task-count-badge').textContent=done+'/'+ST.tasks.length;
  tw.innerHTML=ST.tasks.map(t=>`<div class="task-item${t.done?' done':''}" onclick="toggleTask('${t.id}')"><div class="task-check">${t.done?'✓':''}</div><span class="task-name">${t.name}</span><span class="task-subj">${t.subj.slice(0,4).toUpperCase()}</span><button class="task-del" onclick="delTask(event,'${t.id}')">×</button></div>`).join('');
}

// ─── COMPLETION HISTORY ──────────────────────
// Stores deleted tasks + completed subtopics with time/date
function getCompHistory() {
  const hist = LS.g('jee2_comp_history', []);
  // Migrate: assign histId to old entries that don't have one
  let changed = false;
  hist.forEach(h => {
    if(!h.histId) { h.histId = uid(); changed = true; }
  });
  if(changed) LS.s('jee2_comp_history', hist);
  return hist;
}
function addToCompHistory(entry) {
  const hist = getCompHistory();
  entry.histId = uid(); // unique ID for individual delete
  hist.unshift(entry);
  if(hist.length > 500) hist.splice(500);
  LS.s('jee2_comp_history', hist);
}

window.toggleTask = (id) => {
  const t = ST.tasks.find(x => x.id === id);
  if(!t) return;
  if(!t.done) {
    // Mark done — start 2s countdown then auto-delete
    t.done = true;
    sv('tasks');
    renderHome();
    // After 1.5s, move to history and remove
    setTimeout(() => {
      const idx = ST.tasks.findIndex(x => x.id === id);
      if(idx !== -1 && ST.tasks[idx].done) {
        const completed = ST.tasks.splice(idx, 1)[0];
        sv('tasks');
        addToCompHistory({
          type: 'task',
          name: completed.name,
          subj: completed.subj,
          addedAt: completed.addedAt || '',
          completedAt: nowStr(),
          id: completed.id
        });
        renderHome();
        // Update share card task count
        const stEl = ge('psc-tasks');
        if(stEl) stEl.textContent = getCompHistory().filter(h=>h.type==='task').length;
        showToast('✅ Task complete! History mein save ho gaya', 2000);
      }
    }, 1500);
  } else {
    // Undo — mark undone
    t.done = false;
    sv('tasks');
    renderHome();
  }
};

window.delTask = (e, id) => {
  e.stopPropagation();
  const t = ST.tasks.find(x => x.id === id);
  if(t) {
    addToCompHistory({
      type: 'task_deleted',
      name: t.name,
      subj: t.subj,
      completedAt: nowStr(),
      id: t.id
    });
  }
  ST.tasks = ST.tasks.filter(x => x.id !== id);
  sv('tasks');
  renderHome();
};

window.saveTask = () => {
  const n = ge('ti-name').value.trim(), s = ge('ti-subj').value;
  if(!n) return;
  ST.tasks.push({id:uid(), name:n, subj:s, done:false, addedAt:nowStr()});
  sv('tasks'); closeModal('task-modal'); ge('ti-name').value=''; renderHome();
};
// ─── AUTO ACCURACY CALCULATION ────────────────
// Minimum 5 tests required per subject to show accuracy
// After 5 tests, all tests of that subject are used (not just last 5)
const MIN_TESTS_FOR_ACCURACY = 5;

function calcSubjAccuracy(subj) {
  // Get all attempts for this subject
  const subjAttempts = attempts.filter(a => {
    if(subj === 'all') return true;
    // subj can be 'p','g','r' or subject name
    return a.subj === subj || a.subj === 'all';
  });

  // Filter only pure subject tests (not 'all' mixed tests for per-subject calc)
  const pureAttempts = attempts.filter(a => a.subj === subj);

  if(pureAttempts.length < MIN_TESTS_FOR_ACCURACY) return null; // not enough tests

  // Calculate accuracy across ALL tests of this subject
  const totalCorrect = pureAttempts.reduce((s,a) => s + a.correct, 0);
  const totalQs      = pureAttempts.reduce((s,a) => s + a.total, 0);
  if(!totalQs) return null;
  return Math.round(totalCorrect / totalQs * 100);
}

function getAutoAccuracy() {
  // Map subj codes to attempt subj field
  const subjMap = { p:'p', c:'g', m:'r' };
  const result  = { p: null, c: null, m: null };
  for(const [key, subj] of Object.entries(subjMap)) {
    result[key] = calcSubjAccuracy(subj);
  }
  return result;
}

function getSubjTestCount(subj) {
  const subjMap = { p:'p', c:'g', m:'r' };
  return attempts.filter(a => a.subj === subjMap[subj]).length;
}

// Called after every test submit — auto-updates ST.scores
function autoUpdateAccuracy() {
  const acc = getAutoAccuracy();
  let changed = false;
  if(acc.p !== null && acc.p !== ST.scores.p) { ST.scores.p = acc.p; changed = true; }
  if(acc.c !== null && acc.c !== ST.scores.c) { ST.scores.c = acc.c; changed = true; }
  if(acc.m !== null && acc.m !== ST.scores.m) { ST.scores.m = acc.m; changed = true; }
  if(changed) sv('scores');
}


// ─── CHAPTERS ────────────────────────────────
function getSubjColor(s){return{p:'p',g:'g',r:'r'}[s]}
function getChapProgress(chId){
  const cdata=ST.chapters[chId];if(!cdata||!cdata.subtopics)return 0;
  const ch=getAllChapById(chId);if(!ch)return 0;
  // For custom chapters, subtopics come from cdata.subtopicList (dynamically added)
  const subtopicList = ch.subtopics || [];
  const total=subtopicList.length;if(!total)return 0;
  const done=subtopicList.filter(s=>cdata.subtopics[s]).length;
  return Math.round(done/total*100);
}
function getAllChapById(id){
  // Check built-in first
  const ch=getActiveChapters();
  for(const s of Object.values(ch)){const c=s.find(x=>x.id===id);if(c)return c}
  // Check custom
  const custom=getCustomChapters();
  for(const s of Object.values(custom)){const c=s.find(x=>x.id===id);if(c)return c}
  return null;
}
// Helper: find subject key for any chapter id (built-in or custom)
function getChapSubj(id){
  let s=Object.keys(getActiveChapters()).find(k=>getActiveChapters()[k].some(c=>c.id===id));
  if(!s) s=Object.keys(getCustomChapters()).find(k=>(getCustomChapters()[k]||[]).some(c=>c.id===id));
  return s||null;
}
function renderChapterList(){
  const s=ST.pracSubj;const list=ge('chapter-list');if(!list)return;
  const ch=getActiveChapters();
  if(!ch[s]){
    ST.pracSubj='p';
    renderChapterList();return;
  }
  const cl=getSubjColor(s);
  // Merge built-in + custom chapters
  const allChaps = getMergedChapters(s);
  if(!allChaps.length){
    list.innerHTML='<div class="empty"><span class="empty-icon">📚</span><span class="empty-text">'+_t('no_chapters')+'</span></div>';
    return;
  }
  list.innerHTML=allChaps.map(c=>{
    const prog=getChapProgress(c.id);
    const cdata=ST.chapters[c.id];const target=cdata?.target;
    const meta=target?`Target: ${target} days`:'Tap to open & set target';
    const col=s==='p'?'var(--ap)':s==='b'?'var(--ag)':s==='g'?'var(--ag)':'var(--ar)';
    return`<div class="ch-item ${cl}" onclick="openChapter('${c.id}')">
      <div class="ch-dot" style="background:${col}"></div>
      <div class="ch-info">
        <div class="ch-name">${c.name}${c.isCustom?'<span class="custom-badge">custom</span>':''}</div>
        <div class="ch-meta">${meta} · ${c.subtopics.length} topics</div>
      </div>
      <div class="ch-prog-wrap">
        <div class="ch-prog-num" style="color:${col}">${prog}%</div>
        <div class="ch-prog-bar"><div class="ch-prog-fill" style="width:${prog}%;background:${col}"></div></div>
      </div>
      <button class="ch-del-btn" onclick="deleteChapterById(event,'${c.id}')" title="Delete">🗑</button>
      <div class="ch-arrow">›</div>
    </div>`;
  }).join('');
}

// ─── CUSTOM CHAPTERS SYSTEM ──────────────────
// Custom chapters stored separately in localStorage
// Only show user-added chapters — no built-in defaults
function getMergedChapters(subj) {
  const custom = (getCustomChapters()[subj] || []);
  return custom;
}

window.openAddChapterModal = () => {
  // Set select to current subject
  const sel = ge('ac-subj');
  if(sel) sel.value = ST.pracSubj || 'p';
  ge('ac-name').value = '';
  openModal('add-chapter-modal');
};

window.saveCustomChapter = () => {
  const subj = ge('ac-subj').value;
  const name = ge('ac-name').value.trim();
  if(!name) { showToast('Chapter name daalo!', 1500); return; }
  const custom = getCustomChapters();
  if(!custom[subj]) custom[subj] = [];
  // Check duplicate
  const allNames = getMergedChapters(subj).map(c => c.name.toLowerCase());
  if(allNames.includes(name.toLowerCase())) { showToast('Ye chapter already hai!', 1800); return; }
  const id = 'cust_' + uid();
  custom[subj].push({ id, name, subtopics: [], isCustom: true });
  saveCustomChapters(custom);
  closeModal('add-chapter-modal');
  ST.pracSubj = subj;
  // Update subject chip
  document.querySelectorAll('#prac-chips .chip').forEach(c => c.classList.remove('on'));
  const chip = ge('pchip-' + subj); if(chip) chip.classList.add('on');
  renderChapterList();
  showToast(`✅ "${name}" chapter add ho gaya!`, 2000);
};

window.openEditChapterModal = (e, id, subj) => {
  e.stopPropagation();
  const custom = getCustomChapters();
  const ch = (custom[subj] || []).find(c => c.id === id);
  if(!ch) return;
  ge('ec-id').value = id;
  ge('ec-subj').value = subj;
  ge('ec-name').value = ch.name;
  openModal('edit-chapter-modal');
};

window.updateCustomChapter = () => {
  const id   = ge('ec-id').value;
  const subj = ge('ec-subj').value;
  const name = ge('ec-name').value.trim();
  if(!name) { showToast('Naam daalo!', 1500); return; }
  const custom = getCustomChapters();
  const ch = (custom[subj] || []).find(c => c.id === id);
  if(ch) { ch.name = name; saveCustomChapters(custom); }
  closeModal('edit-chapter-modal');
  renderChapterList();
  showToast('✅ Chapter update ho gaya!', 1500);
};

window.deleteChapterById = (e, id) => {
  e.stopPropagation();
  const custom = getCustomChapters();
  let foundSubj = null;
  let foundChap = null;
  for(const s of ['p','g','r','b']){
    const ch = (custom[s]||[]).find(c=>c.id===id);
    if(ch){ foundSubj=s; foundChap=ch; break; }
  }
  if(!foundSubj){ showToast('Chapter nahi mila!', 1200); return; }
  customConfirm(`"${foundChap.name}" delete karna hai?\nSara progress bhi hata jayega.`, () => {
    custom[foundSubj] = (custom[foundSubj]||[]).filter(c=>c.id!==id);
    saveCustomChapters(custom);
    if(ST.chapters[id]){ delete ST.chapters[id]; sv('chapters'); }
    renderChapterList();
    showToast('🗑 Chapter delete ho gaya!', 1500);
  }, { icon:'🗑', title:_t('chapter_del_title'), okLabel:_t('chapter_del_ok') });
};

window.deleteCustomChapter = () => {
  const id   = ge('ec-id').value;
  const subj = ge('ec-subj').value;
  customConfirm('Is chapter ko delete karna hai? Iska sara progress bhi delete hoga.', () => {
    const custom = getCustomChapters();
    custom[subj] = (custom[subj] || []).filter(c => c.id !== id);
    saveCustomChapters(custom);
    // Also delete progress
    delete ST.chapters[id]; sv('chapters');
    closeModal('edit-chapter-modal');
    renderChapterList();
    showToast('🗑 Chapter deleted', 1500);
  }, { icon:'🗑', title:_t('chapter_del_title'), okLabel:_t('chapter_del_ok') });
};



function switchSubj(s,el2,ctx){
  const pg=ctx==='prac'?'#page-practice .chip':ctx==='form'?'#page-formulas .chip':'#page-notes .chip';
  document.querySelectorAll(pg).forEach(c=>c.classList.remove('on'));
  el2.classList.add('on');
  if(ctx==='prac'){ST.pracSubj=s;renderChapterList()}
  else if(ctx==='form'){ST.formSubj=s;renderFormulas()}
  else{ST.noteSubj=s;renderNotes()}
}
window.switchSubj=switchSubj;

function switchMoreSubj(s,ctx,el){
  if(ctx==='form'){
    document.querySelectorAll('[id^="more-fchip-"]').forEach(c=>c.classList.remove('on'));
    el.classList.add('on');
    ST.formSubj=s;renderFormulas();
  } else {
    document.querySelectorAll('[id^="more-nchip-"]').forEach(c=>c.classList.remove('on'));
    el.classList.add('on');
    ST.noteSubj=s;renderNotes();
  }
}
window.switchMoreSubj=switchMoreSubj;

function openChapter(id){
  ST.openChapterId=id;
  // Load fresh chapter data from storage
  const ch=getAllChapById(id);if(!ch)return;
  // For custom chapters, ensure subtopics are loaded from storage
  if(isCustomChapter(id)){
    const custom=getCustomChapters();
    for(const arr of Object.values(custom)){
      const c=arr.find(x=>x.id===id);
      if(c){ ch.subtopics=[...c.subtopics]; break; }
    }
  } else {
    // Built-in chapter: load custom subtopics overlay
    const customSubs=LS.g('jee2_custom_'+id, null);
    if(customSubs&&Array.isArray(customSubs)) ch.subtopics=customSubs;
  }
  let subj=getChapSubj(id);
  if(!subj) subj=Object.keys(getCustomChapters()).find(s=>(getCustomChapters()[s]||[]).some(c=>c.id===id));
  const subjNames={p:'Physics',g:'Chemistry',r:'Mathematics',b:'Biology'};
  ge('chap-name-title').textContent=ch.name;
  ge('chap-sub-title').textContent=subjNames[subj]||'';
  renderChapBody(id,ch,subj);
  const pg=ge('page-chapter');
  pg.classList.add('on');pg.scrollTop=0;
  // Track the_initiate badge
  if(!LS.g('air_initiate_done',false)) LS.s('air_initiate_done',true);
  // Track restless_hunter badge (5 unique chapters visited)
  const _visitedChaps = [...new Set([...(LS.g('air_visited_chaps',[])), id])];
  LS.s('air_visited_chaps', _visitedChaps);
  if(_visitedChaps.length>=5) LS.s('air_restless_hunter',true);
}
window.openChapter=openChapter;

function closeChapter(){ge('page-chapter').classList.remove('on');renderChapterList()}
window.closeChapter=closeChapter;

function renderChapBody(id,ch,subj){
  const cdata=ST.chapters[id]||{target:null,subtopics:{}};
  const cl=subj==='p'?'var(--ap)':subj==='g'?'var(--ag)':'var(--ar)';
  const total=ch.subtopics.length;
  const done=ch.subtopics.filter(s=>cdata.subtopics[s]).length;
  const pct=total?Math.round(done/total*100):0;
  const r=42,circ=2*Math.PI*r,offset=circ-(pct/100*circ);
  let html=`
  <div class="progress-ring-wrap">
    <svg class="ring-svg" width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="var(--b1)" stroke-width="8"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${cl}" stroke-width="8"
        stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round"
        transform="rotate(-90 50 50)" style="transition:stroke-dashoffset .6s ease"/>
    </svg>
    <div class="ring-info">
      <div class="ring-pct" style="color:${cl}">${pct}%</div>
      <div class="ring-label">COMPLETED</div>
      <div class="ring-fraction">${done} / ${total} topics</div>
    </div>
  </div>
  <div class="target-box">
    <div class="target-box-title">📅 Completion Target</div>`;
  if(cdata.target){
    html+=`<div class="target-display"><span class="target-display-text">🎯 ${cdata.target} days target set</span><span class="target-display-edit" onclick="editTarget('${id}')">Change</span></div>`;
  } else {
    html+=`<div class="target-row"><input class="target-inp" id="target-inp-${id}" type="number" min="1" max="365" placeholder="Days to complete (e.g. 7)"><button class="target-save" onclick="saveTarget('${id}')">Set Target</button></div>`;
  }
  html+=`</div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><span class="section-label" style="margin-bottom:0">SUBTOPICS</span><span style="font-size:11px;color:var(--txt3);font-family:var(--fm)">${done}/${total} done</span></div>`;
  const isCust = isCustomChapter(id);
  ch.subtopics.forEach(sub=>{
    const isDone=!!cdata.subtopics[sub];
    const safeS=sub.replace(/'/g,"\\'");
    html+=`<div class="subtopic-item${isDone?' done':''}" onclick="toggleSub('${id}','${safeS}')">
      <div class="sub-check">${isDone?'✓':''}</div>
      <div class="sub-info"><div class="sub-name">${sub}</div></div>
      ${isCust?`<button class="sub-del-btn" onclick="event.stopPropagation();deleteSubtopic('${id}','${safeS}')">×</button>`:''}
    </div>`;
  });
  html+=`<div style="margin-top:14px"><span class="section-label">ADD SUBTOPIC</span>
    <div class="add-subtopic-row">
      <input class="sub-inp" id="sub-inp-${id}" placeholder="e.g. Center of Mass" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();addCustomSub('${id}')}">
      <button class="sub-add-btn" onclick="addCustomSub('${id}')">Add</button>
    </div>
  </div>`;
  ge('chap-body').innerHTML=html;
}

window.toggleSub = (chapId, sub) => {
  if(!ST.chapters[chapId]) ST.chapters[chapId] = {target:null, subtopics:{}};
  const wasDone = ST.chapters[chapId].subtopics[sub];
  ST.chapters[chapId].subtopics[sub] = !wasDone;
  sv('chapters');

  // If just marked done → save to history
  if(!wasDone) {
    const ch = getAllChapById(chapId);
    const subjMap = getActiveChapters();
    const subjKey = Object.keys(subjMap).find(s => subjMap[s].some(c => c.id === chapId));
    const subjNames = {'p':'Physics','g':'Chemistry','r':'Maths','b':'Biology'};
    addToCompHistory({
      type: 'subtopic',
      name: sub,
      chapter: ch ? ch.name : chapId,
      subj: subjNames[subjKey] || subjKey,
      completedAt: nowStr()
    });
    showToast(`✅ "${sub}" done!`, 1500);
    // Achievement checks on subtopic done
    trackPowerHour();
    checkConsistentAim();
    checkScholarSpirit();
    checkEfficiencyExpert();
    checkDeepDiver(chapId);
    checkFastLearner(chapId);
    checkCustomKing();
    checkArchitect();
    checkResilientHunter();
    // Hard checks
    checkPerfectWeek();
    checkTripleThreat();
    checkChapterChain(chapId);
    checkSpeedDemon();
    checkCustomArchitect();
    checkUnshakableFocus();
    // Elite checks
    checkExecutioner();
    checkComebackKid();
    checkCustomSpecialist();
    checkBalancedHunter();
    checkSyllabusArchitect();
    checkHardcoreConsistency();
    checkTripleCentury();
    checkSubjOverlord();
    checkReliableHunter();
    checkPerfectionist(chapId);
    checkOptimizer();
    checkFocusAura();
    // Legendary checks
    checkFlashExecutor(chapId);
    checkArchSupreme();
    checkConsistentMonster();
  }

  const ch = getAllChapById(chapId);
  const subj = Object.keys(getActiveChapters()).find(s => getActiveChapters()[s].some(c => c.id === chapId));
  renderChapBody(chapId, ch, subj);
};
window.saveTarget=(chapId)=>{
  const inp=ge('target-inp-'+chapId);if(!inp)return;
  const days=parseInt(inp.value);if(!days||days<1){alert('Valid days daalo!');return}
  if(!ST.chapters[chapId])ST.chapters[chapId]={target:null,subtopics:{}};
  ST.chapters[chapId].target=days;sv('chapters');
  const ch=getAllChapById(chapId);
  const subj=getChapSubj(chapId);
  renderChapBody(chapId,ch,subj);
}
window.editTarget=(chapId)=>{
  if(!ST.chapters[chapId])return;
  ST.chapters[chapId].target=null;sv('chapters');
  const ch=getAllChapById(chapId);
  const subj=getChapSubj(chapId);
  renderChapBody(chapId,ch,subj);
}
window.deleteSubtopic = (chapId, sub) => {
  const ch = getAllChapById(chapId); if(!ch) return;
  ch.subtopics = ch.subtopics.filter(s => s !== sub);
  // Remove from done list too
  if(ST.chapters[chapId]?.subtopics) {
    delete ST.chapters[chapId].subtopics[sub];
    sv('chapters');
  }
  // Save to custom store
  if(isCustomChapter(chapId)) {
    const custom = getCustomChapters();
    Object.values(custom).forEach(arr => {
      const c = arr.find(x => x.id === chapId);
      if(c) c.subtopics = [...ch.subtopics];
    });
    saveCustomChapters(custom);
  } else {
    LS.s('jee2_custom_' + chapId, ch.subtopics);
  }
  const subj = getChapSubj(chapId);
  renderChapBody(chapId, ch, subj);
};

window.addCustomSub=(chapId)=>{
  const inp=ge('sub-inp-'+chapId);if(!inp)return;
  const name=inp.value.trim();if(!name)return;

  // Determine if custom chapter
  const isCustom = isCustomChapter(chapId);

  // Load current subtopics directly from storage (source of truth)
  let currentSubs;
  if(isCustom){
    const custom=getCustomChapters();
    let found=null;
    for(const arr of Object.values(custom)){ found=arr.find(x=>x.id===chapId); if(found)break; }
    if(!found){showToast('Chapter not found!',1500);return;}
    currentSubs=[...found.subtopics];
  } else {
    const ch=getAllChapById(chapId);if(!ch)return;
    currentSubs=[...(LS.g('jee2_custom_'+chapId, ch.subtopics))];
  }

  if(currentSubs.includes(name)){showToast('Ye subtopic already hai!',1500);return;}
  currentSubs.push(name);

  // Persist to storage
  if(isCustom){
    const custom=getCustomChapters();
    for(const arr of Object.values(custom)){
      const c=arr.find(x=>x.id===chapId);
      if(c){c.subtopics=[...currentSubs];break;}
    }
    saveCustomChapters(custom);
  } else {
    LS.s('jee2_custom_'+chapId, currentSubs);
  }

  // Re-open chapter fresh so everything is in sync
  inp.value='';
  LS.s('air_custom_sub_added', true);
  showToast(`✅ "${name}" added!`,1200);
  // Small delay so toast shows, then re-render
  setTimeout(()=>{ openChapter(chapId); },100);
};

// ─── BACKLOG ─────────────────────────────────
function renderBacklog(){
  ['high','med','low'].forEach(p=>{
    const w=ge('bl-'+p);if(!w)return;
    const items=ST.backlog.filter(b=>b.prio===p);
    if(!items.length){w.innerHTML='<div style="padding:8px 0;font-size:11px;color:var(--txt3);font-family:var(--fm)">Nothing here ✓</div>';return}
    w.innerHTML=items.map(b=>`<div class="bl-item ${p}"><span class="badge ${p}">${p.toUpperCase()}</span><div style="flex:1;min-width:0"><span class="bl-text">${b.topic}</span>${b.addedAt?`<div style="font-size:9px;color:var(--txt3);font-family:var(--fm);margin-top:2px">🕐 ${b.addedAt}</div>`:''}</div><span class="bl-due">${b.subj.slice(0,4)}${b.due?' · '+fmtD(b.due):''}</span><button class="edit-btn" onclick="editBacklog('${b.id}')" style="background:rgba(79,138,255,.12);border:1px solid rgba(79,138,255,.3);color:var(--ap);font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px;cursor:pointer;margin-right:4px">✏</button><button class="bl-del" onclick="delBacklog('${b.id}')">×</button></div>`).join('');
  });
  const t=ge('bl-total');if(t)t.textContent=ST.backlog.length+' PENDING';
}
window.delBacklog=(id)=>{ST.backlog=ST.backlog.filter(x=>x.id!==id);sv('backlog');renderBacklog();renderHome()}
window.saveBacklog=()=>{
  const topic=ge('bl-topic').value.trim();if(!topic){alert('Topic name daalo!');return}
  ST.backlog.push({id:uid(),topic,subj:ge('bl-subj').value,prio:ge('bl-prio').value,due:ge('bl-due').value,addedAt:nowStr()});
  sv('backlog');closeModal('bl-modal');ge('bl-topic').value='';ge('bl-due').value='';renderBacklog();renderHome();
}

// ─── FORMULAS ────────────────────────────────
function renderFormulas(){
  const w=ge('formula-list');if(!w)return;
  const items=ST.formulas.filter(f=>f.subj===ST.formSubj);
  if(!items.length){w.innerHTML='<div class="empty"><span class="empty-icon">∑</span><span class="empty-text">'+_t('empty_formula')+'</span></div>';return}
  w.innerHTML=items.map(f=>`<div class="formula-card"><div style="display:flex;gap:4px;position:absolute;top:10px;right:10px"><button style="background:rgba(79,138,255,.12);border:1px solid rgba(79,138,255,.3);color:var(--ap);font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px;cursor:pointer" onclick="editFormula('${f.id}')">✏</button><button style="background:none;color:var(--txt3);font-size:18px;opacity:.5;border:none;cursor:pointer;padding:0 2px" onclick="delFormula('${f.id}')">×</button></div><div class="formula-name" style="padding-right:70px">${f.name}</div><div class="formula-eq" style="white-space:pre-wrap">${f.eq.replace(/</g,'&lt;')}</div>${f.addedAt?`<div style="font-size:9px;color:var(--txt3);font-family:var(--fm);margin-top:6px">🕐 ${f.addedAt}</div>`:''}</div>`).join('');
}
window.delFormula=(id)=>{ST.formulas=ST.formulas.filter(x=>x.id!==id);sv('formulas');renderFormulas()}
window.saveFormula=()=>{
  const n=ge('fi-name').value.trim(),eq=ge('fi-eq').value.trim(),s=ge('fi-subj').value;
  if(!n||!eq){alert('Sab fields bhar!');return}
  ST.formulas.push({id:uid(),subj:s,name:n.toUpperCase(),eq,addedAt:nowStr()});
  sv('formulas');closeModal('form-modal');ge('fi-name').value='';ge('fi-eq').value='';renderFormulas();
}

// ─── NOTES ───────────────────────────────────
function renderNotes(){
  const w=ge('notes-list');if(!w)return;
  const items=ST.notes.filter(n=>n.subj===ST.noteSubj);
  if(!items.length){w.innerHTML='<div class="empty"><span class="empty-icon">📋</span><span class="empty-text">'+_t('empty_note')+'</span></div>';return}
  w.innerHTML=items.map(n=>`<div class="note-card ${n.subj}"><div style="display:flex;gap:4px;position:absolute;top:10px;right:10px"><button style="background:rgba(79,138,255,.12);border:1px solid rgba(79,138,255,.3);color:var(--ap);font-size:12px;font-weight:700;padding:3px 8px;border-radius:6px;cursor:pointer" onclick="editNote('${n.id}')">✏</button><button style="background:none;color:var(--txt3);font-size:18px;opacity:.5;border:none;cursor:pointer;padding:0 2px" onclick="delNote('${n.id}')">×</button></div><div class="note-tag">${{p:'PHYSICS',g:'CHEMISTRY',r:'MATHEMATICS'}[n.subj]}</div><div class="note-title">${n.title}</div><div class="note-body">${n.body}</div>${n.addedAt?`<div style="font-size:9px;color:var(--txt3);font-family:var(--fm);margin-top:6px">🕐 ${n.addedAt}</div>`:''}</div>`).join('');
}
window.delNote=(id)=>{ST.notes=ST.notes.filter(x=>x.id!==id);sv('notes');renderNotes()}
window.saveNote=()=>{
  const title=ge('ni-title').value.trim(),body=ge('ni-body').value.trim(),subj=ge('ni-subj').value;
  if(!title){alert('Title chahiye!');return}
  ST.notes.push({id:uid(),subj,title,body,addedAt:nowStr()});sv('notes');closeModal('note-modal');ge('ni-title').value='';ge('ni-body').value='';renderNotes();
}

// ─── EDIT BACKLOG ─────────────────────────────
window.editBacklog = (id) => {
  const b = ST.backlog.find(x => x.id === id);
  if(!b) return;
  ge('bl-edit-id').value = id;
  ge('bl-edit-topic').value = b.topic;
  ge('bl-edit-subj').value = b.subj;
  ge('bl-edit-prio').value = b.prio;
  ge('bl-edit-due').value = b.due || '';
  openModal('bl-edit-modal');
};
window.saveEditBacklog = () => {
  const id = ge('bl-edit-id').value;
  const b = ST.backlog.find(x => x.id === id);
  if(!b) return;
  const topic = ge('bl-edit-topic').value.trim();
  if(!topic) { showToast('Topic name daalo!', 1500); return; }
  b.topic = topic;
  b.subj = ge('bl-edit-subj').value;
  b.prio = ge('bl-edit-prio').value;
  b.due = ge('bl-edit-due').value;
  sv('backlog'); closeModal('bl-edit-modal'); renderBacklog(); renderHome();
  showToast('✅ Backlog updated!', 1200);
};

// ─── EDIT FORMULA ─────────────────────────────
window.editFormula = (id) => {
  const f = ST.formulas.find(x => x.id === id);
  if(!f) return;
  ge('form-edit-id').value = id;
  ge('form-edit-name').value = f.name;
  ge('form-edit-eq').value = f.eq;
  openModal('form-edit-modal');
};
window.saveEditFormula = () => {
  const id = ge('form-edit-id').value;
  const f = ST.formulas.find(x => x.id === id);
  if(!f) return;
  const name = ge('form-edit-name').value.trim();
  const eq = ge('form-edit-eq').value.trim();
  if(!name || !eq) { showToast('Sab fields bhar!', 1500); return; }
  f.name = name.toUpperCase();
  f.eq = eq;
  sv('formulas'); closeModal('form-edit-modal'); renderFormulas();
  showToast('✅ Formula updated!', 1200);
};

// ─── EDIT NOTE ────────────────────────────────
window.editNote = (id) => {
  const n = ST.notes.find(x => x.id === id);
  if(!n) return;
  ge('note-edit-id').value = id;
  ge('note-edit-title').value = n.title;
  ge('note-edit-body').value = n.body;
  openModal('note-edit-modal');
};
window.saveEditNote = () => {
  const id = ge('note-edit-id').value;
  const n = ST.notes.find(x => x.id === id);
  if(!n) return;
  const title = ge('note-edit-title').value.trim();
  const body = ge('note-edit-body').value.trim();
  if(!title) { showToast('Title chahiye!', 1500); return; }
  n.title = title;
  n.body = body;
  sv('notes'); closeModal('note-edit-modal'); renderNotes();
  showToast('✅ Note updated!', 1200);
};


// ─── MORE PAGE ───────────────────────────────
function renderMore(){ /* just shows the grid menu — subpages open as screens */ }

// ─── REVISION ────────────────────────────────
function renderRevision(){
  const w=ge('rev-list');if(!w)return;
  if(!ST.revision.length){w.innerHTML='<div class="empty"><span class="empty-icon">🔁</span><span class="empty-text">'+_t('empty_revision')+'</span></div>';return}
  const sCol={Physics:'var(--ap)',Chemistry:'var(--ag)',Mathematics:'var(--ar)'};
  w.innerHTML=ST.revision.map(r=>`<div class="rev-item"><div class="ch-dot" style="background:${sCol[r.subj]||'var(--ap)'}"></div><div class="rev-main"><div class="rev-name">${r.topic}</div><div class="rev-meta">${r.subj} · Every ${r.interval}d</div></div><button class="rev-btn${r.done?' done':''}" onclick="markRevised('${r.id}')">${r.done?'✓ Done':'Revise'}</button><button class="rev-del" onclick="delRevision('${r.id}')">×</button></div>`).join('');
}
window.markRevised=(id)=>{const r=ST.revision.find(x=>x.id===id);if(r){r.done=!r.done;sv('revision');renderRevision()}}
window.delRevision=(id)=>{ST.revision=ST.revision.filter(x=>x.id!==id);sv('revision');renderRevision()}
window.saveRevision=()=>{
  const topic=ge('ri-topic').value.trim();if(!topic){alert('Topic name daalo!');return}
  ST.revision.push({id:uid(),topic,subj:ge('ri-subj').value,interval:parseInt(ge('ri-interval').value)||1,done:false,addedAt:nowStr()});
  sv('revision');closeModal('rev-modal');ge('ri-topic').value='';renderRevision();
}

// ─── MOCKS ───────────────────────────────────
function renderMocks(){
  const list=ge('mock-list');const trend=ge('mock-trend');if(!list)return;
  if(!ST.mocks.length){list.innerHTML='<div class="empty"><span class="empty-icon">🎯</span><span class="empty-text">'+_t('empty_mock')+'</span></div>';if(trend)trend.innerHTML='';return}
  const sorted=[...ST.mocks].sort((a,b)=>b.date.localeCompare(a.date));
  list.innerHTML=sorted.map(m=>{
    const pct=Math.round(m.score/m.total*100);
    const col=pct>=70?'var(--ag)':pct>=55?'var(--ay)':'var(--ar)';
    const chapLine = m.chapter ? `<div style="font-size:10px;color:var(--txt3);font-family:var(--fm)">📖 ${m.chapter}</div>` : '';
    const timeLine = m.time ? ` · ${m.time}` : '';
    return`<div class="mock-row"><div class="mock-score" style="color:${col}">${m.score}</div><div class="mock-info"><div class="mock-name">${m.name}</div>${chapLine}<div class="mock-meta">${fmtD(m.date)}${timeLine} · /${m.total}${m.rank?' · AIR '+m.rank:''}</div></div><button class="mock-del" onclick="delMock('${m.id}')">×</button></div>`;
  }).join('');
  if(trend&&sorted.length>0){
    trend.innerHTML='<span class="section-label" style="margin-bottom:8px;display:block">'+_t('score_trend')+'</span>'+
    sorted.slice(0,5).reverse().map(m=>{const pct=Math.round(m.score/m.total*100);const col=pct>=70?'var(--ag)':pct>=55?'var(--ay)':'var(--ar)';return`<div class="pbar-row"><span class="pbar-label">${fmtD(m.date)}</span><div class="pbar-track"><div class="pbar-fill" style="width:${pct}%;background:${col}"></div></div><span class="pbar-val" style="color:${col}">${m.score}</span></div>`;}).join('');
  }
}
window.delMock=(id)=>{ST.mocks=ST.mocks.filter(x=>x.id!==id);sv('mocks');renderMocks();renderAnalytics();renderWeak();}
window.saveMock=()=>{
  const name=ge('mi-name').value.trim(),score=parseInt(ge('mi-score').value),total=parseInt(ge('mi-total').value)||300;
  if(!name||isNaN(score)){alert('Name aur score chahiye!');return}
  const subj=ge('mi-subj')?ge('mi-subj').value:'all';
  const timeInp=ge('mi-time-inp');
  const time=timeInp&&timeInp.value?timeInp.value:new Date().toTimeString().slice(0,5);
  const chapter=(ge('mi-chapter')&&ge('mi-chapter').value.trim())||'';
  ST.mocks.push({id:uid(),name,date:ge('mi-date').value||today(),time,subj,score,total,rank:ge('mi-rank').value.trim(),chapter});
  sv('mocks');closeModal('mock-modal');
  ge('mi-name').value='';ge('mi-score').value='';ge('mi-rank').value='';ge('mi-date').value='';
  if(ge('mi-chapter'))ge('mi-chapter').value='';
  if(ge('mi-time-inp'))ge('mi-time-inp').value='';
  if(ge('mi-subj'))ge('mi-subj').value='all';
  renderMocks();renderAnalytics();renderWeak();
}

// ─── ANALYTICS ───────────────────────────────
function renderAnalytics(){
  const as=ge('an-streak');if(as)as.textContent=ST.streak.count;
  if(ST.mocks.length){
    const avg=Math.round(ST.mocks.reduce((a,m)=>a+m.score/m.total*100,0)/ST.mocks.length);
    const best=ST.mocks.reduce((a,m)=>m.score>a.score?m:a,ST.mocks[0]);
    const aa=ge('an-avg');if(aa)aa.textContent=avg+'%';
    const ab=ge('an-best');if(ab)ab.textContent=best.score;
  }
  const bars=ge('an-bars');
  if(bars){
    const sc=[{l:'Physics',v:ST.scores.p,c:'var(--ap)'},{l:'Chemistry',v:ST.scores.c,c:'var(--ag)'},{l:'Maths',v:ST.scores.m,c:'var(--ar)'}];
    bars.innerHTML=sc.map(s=>`<div class="pbar-row"><span class="pbar-label">${s.l}</span><div class="pbar-track"><div class="pbar-fill" style="width:${s.v||0}%;background:${s.c}"></div></div><span class="pbar-val" style="color:${s.c}">${s.v!==null?(s.v+'%'):'—'}</span></div>`).join('');
  }
}

// ─── WEAK CHAPTERS SYSTEM — Mock tests < 60% ─────────────────────
let _weakFilter = 'all';


// ─── WEAK TEST TABS ────────────────────────────
let _weakActiveTab = 'engine';

window.switchWeakTab = (tab) => {
  _weakActiveTab = tab;
  const engineSection = ge('weak-engine-section');
  const mockSection = ge('weak-mock-section');
  const engineBtn = ge('wtab-engine');
  const mockBtn = ge('wtab-mock');
  if(!engineSection || !mockSection) return;
  if(tab === 'engine') {
    engineSection.style.display = '';
    mockSection.style.display = 'none';
    if(engineBtn) { engineBtn.style.borderColor='var(--ap)';engineBtn.style.background='rgba(79,138,255,.12)';engineBtn.style.color='var(--ap)'; }
    if(mockBtn) { mockBtn.style.borderColor='var(--b2)';mockBtn.style.background='transparent';mockBtn.style.color='var(--txt3)'; }
    renderWeakEngine();
  } else {
    engineSection.style.display = 'none';
    mockSection.style.display = '';
    if(mockBtn) { mockBtn.style.borderColor='var(--ap)';mockBtn.style.background='rgba(79,138,255,.12)';mockBtn.style.color='var(--ap)'; }
    if(engineBtn) { engineBtn.style.borderColor='var(--b2)';engineBtn.style.background='transparent';engineBtn.style.color='var(--txt3)'; }
    renderWeak(_weakFilter || 'all');
  }
};

function renderWeakEngine() {
  const el = ge('weak-engine-list'); if(!el) return;
  const weakAttempts = attempts.filter(a => {
    const pct = Math.round(a.correct / (a.total || 1) * 100);
    return pct < 60;
  }).sort((a, b) => {
    const pA = Math.round(a.correct / (a.total||1) * 100);
    const pB = Math.round(b.correct / (b.total||1) * 100);
    return pA - pB;
  });
  if(!weakAttempts.length) {
    el.innerHTML = '<div class="empty" style="padding:40px 0"><span class="empty-icon">🎉</span><span class="empty-text">' + (attempts.length ? 'Sab test engine attempts 60% se upar hain!' : 'Abhi tak koi test diya nahi.') + '</span></div>';
    return;
  }
  el.innerHTML = weakAttempts.map(a => {
    const pct = Math.round(a.correct / (a.total || 1) * 100);
    const urgency = pct < 30 ? 'var(--ar)' : pct < 45 ? 'var(--ay)' : 'var(--ap)';
    const badgeBg = pct < 30 ? 'rgba(240,51,88,.13)' : pct < 45 ? 'rgba(230,168,0,.13)' : 'rgba(46,123,255,.13)';
    const badge = pct < 30 ? '🔴 Critical' : pct < 45 ? '🟡 Weak' : '🔵 Borderline';
    const dashOffset = 113 - (pct/100)*113;
    return `<div class="weak-card" style="cursor:pointer;position:relative" onclick="viewAttempt('${a.id}')">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span class="weak-badge" style="background:${badgeBg};color:${urgency};margin:0">${badge}</span>
        <button onclick="event.stopPropagation();delEngineAttempt('${a.id}')" style="background:rgba(240,51,88,.1);border:none;color:var(--ar);font-size:16px;font-weight:700;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" title="Delete">🗑</button>
      </div>
      <div style="font-size:16px;font-weight:800;color:var(--txt);margin-bottom:4px">${a.testName || 'Test'}</div>
      <div style="font-size:12px;color:var(--txt3);margin-bottom:8px;font-family:var(--fm)">${a.date} · ${a.correct}✓ ${a.wrong}✗ · ${a.skip || 0} skip</div>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:12px;font-weight:600;color:var(--txt2)">Score: ${a.score} / ${a.total * 4}</div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0">
          <div class="weak-prog-ring">
            <svg viewBox="0 0 44 44" width="44" height="44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--b1)" stroke-width="4"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="${urgency}" stroke-width="4"
                stroke-dasharray="113" stroke-dashoffset="${dashOffset}"
                stroke-linecap="round" transform="rotate(-90 22 22)"/>
            </svg>
            <span class="weak-pct" style="color:${urgency}">${pct}%</span>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

window.delEngineAttempt = (id) => {
  attempts = attempts.filter(x => x.id !== id);
  LS.s('jte_attempts', attempts);
  renderWeakEngine();
  renderTestHome();
};

// Get all weak tests (score < 60%) from mock data
function getWeakMocks(subjFilter) {
  const subjNames = {p:'Physics', g:'Chemistry', r:'Maths', all:'Full Test'};
  const subjColors = {p:'var(--ap)', g:'var(--ag)', r:'var(--ar)', all:'var(--am)'};
  const subjIcons  = {p:'⚛', g:'🧪', r:'∑', all:'📋'};

  return ST.mocks
    .filter(m => {
      const pct = Math.round(m.score / m.total * 100);
      const mSubj = m.subj || 'all';
      if(pct >= 60) return false;
      if(subjFilter && subjFilter !== 'all' && mSubj !== subjFilter) return false;
      return true;
    })
    .map(m => {
      const pct  = Math.round(m.score / m.total * 100);
      const subj = m.subj || 'all';
      return {
        ...m,
        pct,
        subjName:  subjNames[subj]  || 'Full Test',
        color:     subjColors[subj] || 'var(--am)',
        icon:      subjIcons[subj]  || '📋',
        timeStr:   m.time || '',
        chapter:   m.chapter || '',
      };
    })
    .sort((a, b) => a.pct - b.pct); // lowest score first (weakest on top)
}

window.filterWeak = (f, el) => {
  _weakFilter = f;
  document.querySelectorAll('#screen-weak .chip').forEach(b => b.classList.remove('on'));
  if(el) el.classList.add('on');
  renderWeak(f);
};

function renderWeak(filter) {
  _weakFilter = filter || _weakFilter || 'all';
  const el = ge('weak-list'); if(!el) return;
  const weaks = getWeakMocks(_weakFilter);

  if(!weaks.length) {
    el.innerHTML = `<div class="empty" style="padding:40px 0">
      <span class="empty-icon">${ST.mocks.length ? '🎉' : '📋'}</span>
      <span class="empty-text">${ST.mocks.length
        ? _t('empty_weak_all_good')
        : _t('empty_weak_no_mock')}</span>
    </div>`;
    return;
  }

  el.innerHTML = weaks.map(m => {
    const urgency    = m.pct < 30 ? 'var(--ar)' : m.pct < 45 ? 'var(--ay)' : 'var(--ap)';
    const badgeBg    = m.pct < 30 ? 'rgba(240,51,88,.13)' : m.pct < 45 ? 'rgba(230,168,0,.13)' : 'rgba(46,123,255,.13)';
    const badge      = m.pct < 30 ? '🔴 Critical' : m.pct < 45 ? '🟡 Weak' : '🔵 Borderline';
    const dateStr    = fmtD(m.date);
    const timeStr    = m.timeStr ? m.timeStr : '';
    const rankStr    = m.rank ? `<span style="background:rgba(124,92,232,.12);color:var(--am);border-radius:6px;padding:2px 7px;font-size:10px;font-weight:700">AIR ${m.rank}</span>` : '';
    const chapterRow = m.chapter
      ? `<div style="display:flex;align-items:center;gap:5px;margin-top:6px;background:var(--s2);border-radius:8px;padding:5px 8px">
           <span style="font-size:13px">📖</span>
           <span style="font-size:12px;font-weight:700;color:var(--txt)">${m.chapter}</span>
         </div>`
      : `<div style="display:flex;align-items:center;gap:5px;margin-top:6px;background:var(--s2);border-radius:8px;padding:5px 8px">
           <span style="font-size:13px">📖</span>
           <span style="font-size:12px;color:var(--txt3);font-style:italic">Chapter not specified</span>
         </div>`;
    return `<div class="weak-card" style="cursor:default;position:relative">

      <!-- Badge + Delete row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span class="weak-badge" style="background:${badgeBg};color:${urgency};margin:0">${badge}</span>
        <button onclick="delMock('${m.id}')" style="background:rgba(240,51,88,.1);border:none;color:var(--ar);font-size:16px;font-weight:700;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0" title="Delete">🗑</button>
      </div>

      <!-- Test Name -->
      <div style="font-size:16px;font-weight:800;color:var(--txt);margin-bottom:4px;line-height:1.2">${m.name}</div>

      <!-- Subject pill -->
      <div style="display:inline-flex;align-items:center;gap:4px;background:${badgeBg};border-radius:8px;padding:3px 10px;margin-bottom:8px">
        <span style="font-size:13px">${m.icon}</span>
        <span style="font-size:12px;font-weight:700;color:${m.color}">${m.subjName}</span>
      </div>

      <!-- Chapter row -->
      ${chapterRow}

      <!-- Date · Time · Score row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
        <div style="display:flex;flex-direction:column;gap:3px">
          <div style="display:flex;align-items:center;gap:5px">
            <span style="font-size:11px">📅</span>
            <span style="font-size:12px;font-weight:600;color:var(--txt2)">${dateStr}</span>
            ${timeStr ? `<span style="font-size:11px">🕐</span><span style="font-size:12px;font-weight:600;color:var(--txt2)">${timeStr}</span>` : ''}
          </div>
          ${rankStr ? `<div style="margin-top:2px">${rankStr}</div>` : ''}
        </div>

        <!-- Score ring -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0">
          <div class="weak-prog-ring">
            <svg viewBox="0 0 44 44" width="44" height="44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--b1)" stroke-width="4"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="${urgency}" stroke-width="4"
                stroke-dasharray="113" stroke-dashoffset="${113 - (m.pct/100)*113}"
                stroke-linecap="round" transform="rotate(-90 22 22)"/>
            </svg>
            <span class="weak-pct" style="color:${urgency}">${m.pct}%</span>
          </div>
          <div style="font-size:11px;font-weight:700;color:var(--txt2);font-family:var(--fm)">${m.score}/${m.total}</div>
        </div>
      </div>

    </div>`;
  }).join('');
}

window.openWeakDetail = (chapId) => {
  const ch = getAllChapById(chapId);
  if(!ch) return;
  const cdata = ST.chapters[chapId];
  const subs = ch.subtopics || [];
  const active = getActiveChapters();
  const subjNames = {p:'Physics', g:'Chemistry', r:'Maths', b:'Biology'};
  const subjColors = {p:'var(--ap)', g:'var(--ag)', r:'var(--ar)', b:'var(--ag)'};
  const subjKey = Object.keys(active).find(s => active[s].some(c => c.id === chapId));
  const color = subjColors[subjKey] || 'var(--ap)';

  const done = subs.filter(s => cdata?.subtopics?.[s]);
  const pending = subs.filter(s => !cdata?.subtopics?.[s]);
  const prog = subs.length ? Math.round(done.length / subs.length * 100) : 0;

  // Get completion history for this chapter's subtopics
  const hist = getCompHistory().filter(h => h.type === 'subtopic' && h.chapter === ch.name);

  const titleEl = ge('wdet-title'); if(titleEl) titleEl.textContent = ch.name;
  const body = ge('wdet-body'); if(!body) return;

  body.innerHTML = `
    <!-- Progress bar -->
    <div class="card" style="margin-bottom:12px">
      <div class="card-body" style="padding:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--txt)">${ch.name}</span>
          <span style="font-size:13px;font-weight:800;color:${color}">${prog}%</span>
        </div>
        <div class="pbar-track" style="height:8px;border-radius:6px">
          <div class="pbar-fill" style="width:${prog}%;background:${color};height:8px;border-radius:6px;transition:width .4s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:6px">
          <span style="font-size:11px;color:var(--txt3);font-family:var(--fm)">${done.length} done · ${pending.length} pending</span>
          <span style="font-size:11px;color:${color};font-family:var(--fm);font-weight:700">${subjNames[subjKey]||''}</span>
        </div>
      </div>
    </div>

    <!-- Pending subtopics -->
    ${pending.length ? `
    <div class="card" style="margin-bottom:12px">
      <div class="card-head"><span class="card-title" style="color:var(--ar)">❌ PENDING TOPICS (${pending.length})</span></div>
      <div class="card-body" style="padding-top:6px">
        ${pending.map(s => `
          <div class="wdet-sub-row pending">
            <span class="wdet-sub-dot" style="background:var(--ar)"></span>
            <span class="wdet-sub-name">${s}</span>
            <span class="wdet-sub-status" style="color:var(--ar)">Not done</span>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Done subtopics -->
    ${done.length ? `
    <div class="card" style="margin-bottom:12px">
      <div class="card-head"><span class="card-title" style="color:var(--ag)">✅ COMPLETED TOPICS (${done.length})</span></div>
      <div class="card-body" style="padding-top:6px">
        ${done.map(s => {
          const h = hist.find(x => x.name === s);
          return `<div class="wdet-sub-row done">
            <span class="wdet-sub-dot" style="background:var(--ag)"></span>
            <span class="wdet-sub-name">${s}</span>
            <span class="wdet-sub-status" style="color:var(--txt3)">${h ? h.completedAt : '✓'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>` : ''}

    <!-- Completion history -->
    ${hist.length ? `
    <div class="card">
      <div class="card-head"><span class="card-title">🕐 COMPLETION HISTORY</span></div>
      <div class="card-body" style="padding-top:6px">
        ${hist.map(h => `
          <div class="wdet-hist-row">
            <span style="font-size:15px">✅</span>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600;color:var(--txt)">${h.name}</div>
              <div style="font-size:10px;color:var(--txt3);font-family:var(--fm)">${h.completedAt}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;

  pushScreen('screen-weak-detail', null);
};

// ─── POMODORO TIMER ──────────────────────────

let _timerMode = 'focus';   // 'focus' | 'break'
let _timerSession = 1;
let _timerTotalSecs = 25 * 60;
let _lastFocusSecs = 25 * 60;  // remember user's last focus duration

// vibrate helper
function vib(pattern) {
  try { if(navigator.vibrate) navigator.vibrate(pattern); } catch(e){}
}

// SVG ring update
function updateTimerRing() {
  const ring = ge('timer-ring');
  if(!ring) return;
  const pct = ST.timerSecs / _timerTotalSecs;
  const circ = 553;
  ring.style.strokeDashoffset = circ * (1 - pct);
  ring.style.stroke = _timerMode === 'break' ? 'var(--am)' : (ST.timerSecs < 300 ? 'var(--ar)' : 'var(--ag)');
}

function updateFace() {
  const f = ge('timer-face'); if(!f) return;
  const m = Math.floor(ST.timerSecs / 60);
  const s = ST.timerSecs % 60;
  f.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  f.className = 'timer-face' + (ST.timerSecs < 300 && _timerMode === 'focus' ? ' warn' : '');
  const sub = ge('timer-face-sub');
  if(sub) sub.textContent = _timerMode === 'break' ? _t('break_time') : _t('focus_time');
  const badge = ge('timer-mode-badge');
  if(badge) { badge.textContent = _timerMode === 'break' ? 'BREAK' : 'FOCUS'; badge.className = 'timer-mode-badge ' + _timerMode; }
  const lbl = ge('timer-session-lbl');
  if(lbl) lbl.textContent = 'SESSION ' + _timerSession;
  updateTimerRing();
}

function onTimerComplete() {
  clearInterval(ST.timerInt);
  ST.timerRunning = false;

  const btn = ge('tbtn-start');
  if(btn) { btn.textContent = '▶ Start'; btn.classList.remove('running'); }

  // 1. VIBRATE — works on all Android phones
  doVibrate([400, 150, 400, 150, 600, 150, 400]);

  // 2. SOUND — Custom or default beep
  playAlarmSound();

  if(_timerMode === 'focus') {
    // Count pomo + add ACTUAL timer mins to streak tracker
    onPomoComplete(); // handles both pomo count + streak mins
    _timerSession++;
    const doneMins = Math.round(_lastFocusSecs / 60);

    // 3. NOTIFICATION
    fireNotif('⏰ Focus Complete! 🎉', `${doneMins} min session khatam! Ab ${_timerSession % 4 === 0 ? '15' : '5'} min break lo 🔥`);

    // 4. IN-APP ALERT (always works)
    showTimerAlert(`🎉 ${doneMins} min focus khatam! Break lo`, 'focus');

    _timerMode = 'break';
    const breakMins = _timerSession % 4 === 0 ? 15 : 5;
    _timerTotalSecs = breakMins * 60;
    ST.timerSecs = _timerTotalSecs;
    document.querySelectorAll('.tpreset').forEach(b => b.classList.remove('on'));
    const bp = ge(_timerSession % 4 === 0 ? 'tpre-15' : 'tpre-5');
    if(bp) bp.classList.add('on');
  } else {
    doVibrate([200, 100, 200]);
    fireNotif('☕ Break khatam!', 'Wapas study mode mein aao 💪📚');
    showTimerAlert('💪 Break khatam! Study shuru karo', 'focus');
    _timerMode = 'focus';
    _timerTotalSecs = _lastFocusSecs;  // restore user's focus duration
    ST.timerSecs = _timerTotalSecs;
    document.querySelectorAll('.tpreset').forEach(b => b.classList.remove('on'));
    // highlight matching preset if any
    const focusMins = Math.round(_lastFocusSecs / 60);
    const matchBtn = ge('tpre-' + focusMins);
    if(matchBtn) matchBtn.classList.add('on');
  }
  updateFace();
}

// ── Vibration — direct, no SW needed ──
function doVibrate(pattern) {
  try {
    if('vibrate' in navigator) {
      navigator.vibrate(0); // stop any existing
      setTimeout(() => navigator.vibrate(pattern), 50);
    }
  } catch(e) {}
}
// alias
function vib(p) { doVibrate(p); }

// ── Web Audio beep — no file needed, always works ──
let _audioCtx = null;
function getAudioCtx() {
  if(!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  return _audioCtx;
}

function playBeep(type) {
  const ctx = getAudioCtx(); if(!ctx) return;
  const patterns = {
    done:  [{f:523,d:0.15},{f:659,d:0.15},{f:784,d:0.3}],   // C-E-G ascending — success
    start: [{f:784,d:0.15},{f:659,d:0.15},{f:523,d:0.2}],   // G-E-C descending — start
    tick:  [{f:440,d:0.05}],
    warn:  [{f:330,d:0.2},{f:330,d:0.2}],
  };
  const notes = patterns[type] || patterns.done;
  let t = ctx.currentTime + 0.05;
  notes.forEach(({f, d}) => {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = f;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
      gain.gain.linearRampToValueAtTime(0,    t + d);
      osc.start(t); osc.stop(t + d + 0.01);
      t += d + 0.05;
    } catch(e) {}
  });
}

// ── In-app full-screen alert ──
function showTimerAlert(msg, mode) {
  const old = ge('timer-alert-overlay');
  if(old) old.remove();
  const overlay = document.createElement('div');
  overlay.id = 'timer-alert-overlay';
  overlay.className = 'timer-alert-overlay';
  overlay.innerHTML = `
    <div class="timer-alert-box">
      <div class="timer-alert-icon">${mode === 'focus' ? '🎉' : '☕'}</div>
      <div class="timer-alert-msg">${msg}</div>
      <button class="btn btn-p btn-full" onclick="stopAlarmSound();document.getElementById('timer-alert-overlay').remove()">OK, Got it! 🙌</button>
    </div>
  `;
  document.body.appendChild(overlay);
  // Auto dismiss after 8s
  setTimeout(() => { const el = ge('timer-alert-overlay'); if(el) { stopAlarmSound(); el.remove(); } }, 8000);
}

// ── Fire real notification ──
function fireNotif(title, body) {
  if(!('Notification' in window)) return;
  if(Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      body,
      tag: 'airhunter-timer',
      renotify: true,
      requireInteraction: false,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 10000);
  } catch(e) {
    // Some browsers block new Notification() — try via SW
    if(navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'NOTIFY', title, body });
    }
  }
}

window.startTimer = () => {
  if(ST.timerRunning) return;
  // Unlock audio on user gesture (required by mobile browsers)
  const ctx = getAudioCtx();
  if(ctx && ctx.state === 'suspended') ctx.resume();
  // Request notification permission if not done yet
  if('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  ST.timerRunning = true;
  doVibrate([50]);
  const btn = ge('tbtn-start');
  if(btn) { btn.textContent = '⏱ Running'; btn.classList.add('running'); }
  ST.timerInt = setInterval(() => {
    if(ST.timerSecs <= 0) { onTimerComplete(); return; }
    ST.timerSecs--;
    updateFace();
  }, 1000);
};

window.pauseTimer = () => {
  clearInterval(ST.timerInt);
  ST.timerRunning = false;
  vib([30]);
  const btn = ge('tbtn-start');
  if(btn) { btn.textContent = '▶ Start'; btn.classList.remove('running'); }
};

window.resetTimer = () => {
  pauseTimer();
  ST.timerSecs = _timerTotalSecs;
  updateFace();
  vib([20]);
};

window.setTimerPreset = (mins, mode, el) => {
  if(ST.timerRunning) { showToast('⏳ Pehle current timer khatam karo ya reset karo!', 2000); vib([100,50,100]); return; }
  pauseTimer();
  _timerMode = mode;
  _timerTotalSecs = mins * 60;
  ST.timerSecs = _timerTotalSecs;
  if(mode === 'focus') _lastFocusSecs = _timerTotalSecs; // remember focus duration
  document.querySelectorAll('.tpreset').forEach(b => b.classList.remove('on'));
  if(el) el.classList.add('on');
  updateFace();
  vib([20]);
};

window.setCustomTimer = () => {
  if(ST.timerRunning) { showToast('⏳ Pehle current timer khatam karo ya reset karo!', 2000); vib([100,50,100]); return; }
  const v = parseInt(ge('timer-custom-inp').value);
  const mode = ge('timer-custom-mode').value;
  if(!v || v < 1 || v > 600) { vib([100,50,100]); return; }
  pauseTimer();
  _timerMode = mode;
  _timerTotalSecs = v * 60;
  ST.timerSecs = _timerTotalSecs;
  if(mode === 'focus') _lastFocusSecs = _timerTotalSecs;
  document.querySelectorAll('.tpreset').forEach(b => b.classList.remove('on'));
  ge('timer-custom-inp').value = '';
  updateFace();
  vib([20, 50, 20]);
  // Show toast
  const statusEl = ge('notif-status');
  if(statusEl) { statusEl.textContent = `✅ ${v} min ${mode} timer set!`; setTimeout(()=>statusEl.textContent='', 2000); }
};

// ══════════════════════════════════════════════
//   NOTIFICATION SYSTEM — Full rewrite
// ══════════════════════════════════════════════

let _notifSettings = { study: false, streak: false, break: false, interval: 120 };
let _notifIntervals = {};

// ── helpers ──
function _notifSupported() { return ('Notification' in window); }
function _notifGranted()   { return _notifSupported() && Notification.permission === 'granted'; }

function loadNotifSettings() {
  const saved = LS.g('air_notif_settings', null);
  if(saved) _notifSettings = Object.assign({}, _notifSettings, saved);
}
function saveNotifSettings() { LS.s('air_notif_settings', _notifSettings); }

// ── Show in-app toast (bottom bar) ──
function showToast(msg, duration = 2800) {
  const old = document.querySelector('.timer-toast');
  if(old) old.remove();
  const el = document.createElement('div');
  el.className = 'timer-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── sendNotif (study reminders) ──
function sendNotif(title, body, type) {
  doVibrate(type === 'study' ? [200, 100, 200] : [300, 100, 300]);
  fireNotif(title, body);
}

// ── Register SW (optional, for background) ──
function registerSW() {
  if(!('serviceWorker' in navigator)) return;
  const swCode = `
self.addEventListener('message', e => {
  if(!e.data || e.data.type !== 'NOTIFY') return;
  self.registration.showNotification(e.data.title || 'AIR Hunter', {
    body: e.data.body || '', tag: 'airhunter', renotify: true,
    vibrate: [300, 100, 300, 100, 500]
  });
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(l => l.length ? l[0].focus() : clients.openWindow('./')));
});
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
  `;
  try {
    const blob = new Blob([swCode], { type: 'application/javascript' });
    navigator.serviceWorker.register(URL.createObjectURL(blob), { scope: './' })
      .then(reg => { window._swReg = reg; })
      .catch(() => {});
  } catch(e) {}
}

// ── Request permission ──
window.requestNotifPermission = async () => {
  if(!_notifSupported()) {
    showToast('❌ Ye browser notifications support nahi karta');
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    const banner = ge('notif-banner');
    if(banner) banner.style.display = perm === 'granted' ? 'none' : 'flex';
    renderNotifStatus();
    if(perm === 'granted') {
      vib([50, 40, 50]);
      showToast('✅ Notifications allow ho gayi!');
      registerSW();
      // Auto-start study reminders if they were on
      if(_notifSettings.study) startStudyReminders();
      if(_notifSettings.streak) scheduleStreakAlert(true);
    } else {
      showToast('⚠ Notifications allow nahi hui. Settings mein jaao.');
    }
  } catch(e) {
    showToast('❌ Permission error: ' + e.message);
  }
};

// ── Toggle ──
window.toggleNotif = async (key) => {
  // Permission check
  if(!_notifSupported()) {
    showToast('❌ Browser notifications support nahi karta');
    return;
  }
  if(!_notifGranted()) {
    showToast('🔔 Pehle "Allow" dabao notifications ke liye');
    const banner = ge('notif-banner');
    if(banner) banner.style.display = 'flex';
    // Auto request
    try {
      const p = await Notification.requestPermission();
      if(p !== 'granted') { renderNotifStatus(); return; }
      registerSW();
    } catch(e) { renderNotifStatus(); return; }
  }

  _notifSettings[key] = !_notifSettings[key];
  saveNotifSettings();
  renderNotifToggles();
  vib([30]);

  if(key === 'study') {
    _notifSettings.study ? startStudyReminders() : stopStudyReminders();
    showToast(_notifSettings.study ? '✅ Study reminders ON' : '🔕 Study reminders OFF');
  }
  if(key === 'streak') {
    scheduleStreakAlert(_notifSettings.streak);
    showToast(_notifSettings.streak ? '✅ Streak alert ON (8 PM)' : '🔕 Streak alert OFF');
  }
  if(key === 'break') {
    showToast(_notifSettings.break ? '✅ Break alerts ON' : '🔕 Break alerts OFF');
  }
};

// ── Interval change ──
window.setNotifInterval = (mins, el) => {
  _notifSettings.interval = mins;
  saveNotifSettings();
  document.querySelectorAll('.itvl-btn').forEach(b => b.classList.remove('on'));
  if(el) el.classList.add('on');
  if(_notifSettings.study) { stopStudyReminders(); startStudyReminders(); }
  showToast('✅ Interval: har ' + mins + ' min');
  vib([30]);
};

// ── Study reminders ──
function startStudyReminders() {
  stopStudyReminders();
  if(!_notifSettings.study || !_notifGranted()) return;
  const mins = _notifSettings.interval || 120;
  const msgs = [
    '📚 Study time! Chapter open karo!',
    '🔥 Streak mat todna — ek Pomodoro karo!',
    '⚡ 25 min focus session shuru karo!',
    '🎯 JEE/NEET — consistency hi key hai!',
    '💡 Weak chapters pe dhyan do!',
    '🧠 Revision karo — notes check karo!',
    '🚀 Ek aur session — tu kar sakta hai!',
  ];
  let i = 0;
  _notifIntervals.study = setInterval(() => {
    if(_notifSettings.study && _notifGranted()) {
      sendNotif('AIR Hunter 📚', msgs[i++ % msgs.length], 'study');
    }
  }, mins * 60 * 1000);
}

function stopStudyReminders() {
  if(_notifIntervals.study) { clearInterval(_notifIntervals.study); _notifIntervals.study = null; }
}

// ── Streak alert (8 PM daily) ──
function scheduleStreakAlert(on) {
  if(_notifIntervals.streak) { clearTimeout(_notifIntervals.streak); _notifIntervals.streak = null; }
  if(!on || !_notifGranted()) return;
  const now   = new Date();
  const t8pm  = new Date(now);
  t8pm.setHours(20, 0, 0, 0);
  if(t8pm <= now) t8pm.setDate(t8pm.getDate() + 1);
  _notifIntervals.streak = setTimeout(() => {
    sendNotif('🔥 Streak Alert!',
      `${ST.streak.count} din ki streak — aaj study kiya? App kholo! 💪`, 'streak');
    scheduleStreakAlert(true);
  }, t8pm - now);
}

// ── Render toggle UI ──
function renderNotifToggles() {
  ['study','streak','break'].forEach(key => {
    const track = ge('notif-'+key+'-track');
    const knob  = ge('notif-'+key+'-knob');
    if(!track || !knob) return;
    const on = _notifSettings[key];
    track.classList.toggle('on', on);
    knob.style.transform = on ? 'translateX(22px)' : 'translateX(0)';
  });

  // Interval buttons
  const itvl = _notifSettings.interval || 120;
  document.querySelectorAll('.itvl-btn').forEach(b => b.classList.remove('on'));
  const iBtn = ge('itvl-' + itvl);
  if(iBtn) iBtn.classList.add('on');

  // Study interval row visibility
  const row = ge('notif-study-interval');
  if(row) row.style.display = _notifSettings.study ? 'flex' : 'none';

  renderNotifStatus();
}

function renderNotifStatus() {
  const el = ge('notif-status'); if(!el) return;
  if(!_notifSupported()) {
    el.textContent = '❌ Browser notifications support nahi karta';
    el.style.color = 'var(--ar)'; return;
  }
  const perm = Notification.permission;
  if(perm === 'denied') {
    el.innerHTML = '❌ ' + _t('notif_blocked').replace('❌ ','');
    el.style.color = 'var(--ar)'; return;
  }
  if(perm === 'default') {
    el.textContent = '⚠ Upar "Allow" button dabao notifications ke liye';
    el.style.color = 'var(--ay)'; return;
  }
  // granted
  const active = ['study','streak','break'].filter(k => _notifSettings[k]);
  if(active.length) {
    el.textContent = '✅ Active: ' + active.map(k =>
      k==='study' ? `Study (${_notifSettings.interval}min)` :
      k==='streak' ? 'Streak (8PM)' : 'Break buzz'
    ).join(' · ');
    el.style.color = 'var(--ag)';
  } else {
    el.textContent = '🔕 Koi notification on nahi — toggle karo';
    el.style.color = 'var(--txt3)';
  }
}

function checkAndShowNotifBanner() {
  const banner = ge('notif-banner'); if(!banner) return;
  if(!_notifSupported() || Notification.permission === 'granted') {
    banner.style.display = 'none';
  } else {
    banner.style.display = 'flex';
  }
}

// ── Init ──
function initNotifications() {
  loadNotifSettings();
  registerSW();
  renderNotifToggles();
  checkAndShowNotifBanner();
  if(_notifGranted()) {
    if(_notifSettings.study)  startStudyReminders();
    if(_notifSettings.streak) scheduleStreakAlert(true);
  }
}

// ─── FAB ─────────────────────────────────────
window.fabAct=()=>{
  const p=ST.curPage;
  if(p==='more'){
    const sp=ST.curSubPage;
    if(sp==='backlog')openModal('bl-modal');
    else if(sp==='formulas')openModal('form-modal');
    else if(sp==='notes')openModal('note-modal');
    else if(sp==='revision')openModal('rev-modal');
    else if(sp==='mocks')openModal('mock-modal');
  }
}

// ─── MODALS ───────────────────────────────────
function openModal(id){
  ge(id).classList.add('on');
  // Mock modal open pe date aur time auto-fill karo
  if(id === 'mock-modal') {
    const di = ge('mi-date');
    const ti = ge('mi-time-inp');
    if(di && !di.value) di.value = today();
    if(ti && !ti.value) ti.value = new Date().toTimeString().slice(0,5);
  }
}
function closeModal(id){ge(id).classList.remove('on')}
function overlayClose(e,id){if(e.target===ge(id))closeModal(id)}
window.openModal=openModal;window.closeModal=closeModal;window.overlayClose=overlayClose;

// ══════════════════════════════════════════════
//   TEST ENGINE FUNCTIONS
// ══════════════════════════════════════════════

// ─── TEST HOME ────────────────────────────────
function renderTestHome(){
  const testsEl = ge('ths-tests'); if(testsEl) testsEl.textContent = attempts.length;
  const qsEl = ge('ths-qs'); if(qsEl) qsEl.textContent = bank.length;
  if(attempts.length){
    const scores=attempts.map(a=>a.score);
    const best=Math.max(...scores);
    const avg=Math.round(attempts.reduce((s,a)=>s+(a.correct/(a.total||1)*100),0)/attempts.length);
    const bestEl=ge('ths-best'); if(bestEl) bestEl.textContent=best;
    const avgEl=ge('ths-avg'); if(avgEl) avgEl.textContent=avg+'%';
  }
}

// ─── SHOW TEST SETUP ──────────────────────────
// ─── TEST SETUP MODE ─────────────────────────
let setupJsonQ = [];
let setupJsonTimerMins = 30;
let activeTestMode = 'json'; // 'json' | 'bank'

function switchTestMode(m) {
  activeTestMode = m;
  ge('tmode-json-body').style.display = m === 'json' ? 'block' : 'none';
  ge('tmode-bank-body').style.display = m === 'bank' ? 'block' : 'none';
  ge('tmode-json').style.borderColor = m === 'json' ? 'var(--ap)' : 'var(--b2)';
  ge('tmode-json').style.color       = m === 'json' ? 'var(--ap)' : 'var(--txt)';
  ge('tmode-bank').style.borderColor = m === 'bank' ? 'var(--ap)' : 'var(--b2)';
  ge('tmode-bank').style.color       = m === 'bank' ? 'var(--ap)' : 'var(--txt)';
}
window.switchTestMode = switchTestMode;

window.clearSetupJson = () => {
  ge('setup-json-inp').value = '';
  setupJsonQ = [];
  ge('setup-json-status').style.display = 'none';
  ge('setup-json-count').textContent = '';
  const btn = ge('json-start-btn');
  btn.style.opacity = '.4'; btn.style.pointerEvents = 'none';
};

window.setupJsonPreview = () => {
  const raw = ge('setup-json-inp').value.trim();
  const statusEl = ge('setup-json-status');
  const btn = ge('json-start-btn');
  const countEl = ge('setup-json-count');
  setupJsonQ = [];
  btn.style.opacity = '.4'; btn.style.pointerEvents = 'none';
  countEl.textContent = '';
  if (!raw) { statusEl.style.display = 'none'; return; }
  const subj = ge('jt-subj')?.value || 'p';
  const chapter = ge('jt-chapter')?.value.trim() || 'General';
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error('JSON ek array hona chahiye [...]');
    const valid = [], errors = [];
    arr.forEach((q, i) => {
      const n = i + 1, text = q.q || q.text;
      if (!text) { errors.push(`Q${n}: "q" missing`); return; }
      let opts, correct;
      if (q.options && typeof q.options === 'object' && !Array.isArray(q.options)) {
        opts = [q.options['1'], q.options['2'], q.options['3'], q.options['4']];
        correct = parseInt(q.answer || q.ans) - 1;
      } else {
        opts = [q.a||q.optA, q.b||q.optB, q.c||q.optC, q.d||q.optD];
        correct = q.ans !== undefined ? parseInt(q.ans) : (q.correct !== undefined ? parseInt(q.correct) : -1);
      }
      if (!opts[0]||!opts[1]||!opts[2]||!opts[3]) { errors.push(`Q${n}: options missing`); return; }
      if (correct < 0 || correct > 3) { errors.push(`Q${n}: answer 1-4 hona chahiye`); return; }
      valid.push({ id: uid(), subj, chapter, text: text.trim(), options: opts, correct,
        explanation: (q.exp || q.explanation || '').trim() });
    });
    if (errors.length) {
      statusEl.innerHTML = '⚠ ' + errors.slice(0,3).join(' | ') + (errors.length > 3 ? ` +${errors.length-3} aur` : '');
      statusEl.style.cssText = 'display:block;background:rgba(255,79,109,.1);border:1px solid rgba(255,79,109,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:11px;font-family:var(--fm);color:var(--ar)';
    }
    if (valid.length) {
      setupJsonQ = valid;
      if (!errors.length) {
        statusEl.innerHTML = `✅ ${valid.length} questions ready — ${chapter}`;
        statusEl.style.cssText = 'display:block;background:rgba(0,196,140,.1);border:1px solid rgba(0,196,140,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;font-family:var(--fm);color:var(--ag)';
      }
      btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
      countEl.textContent = valid.length + ' questions • ' + setupJsonTimerMins + ' min';
    } else { statusEl.style.display = 'block'; }
  } catch(err) {
    statusEl.innerHTML = '❌ JSON error: ' + err.message;
    statusEl.style.cssText = 'display:block;background:rgba(255,79,109,.1);border:1px solid rgba(255,79,109,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:11px;font-family:var(--fm);color:var(--ar)';
  }
};

function selectJTimer(m) {
  setupJsonTimerMins = m;
  document.querySelectorAll('[id^="jtopt-"]').forEach(el => el.classList.remove('on'));
  const el = ge('jtopt-' + m); if (el) el.classList.add('on');
  if (setupJsonQ.length) ge('setup-json-count').textContent = setupJsonQ.length + ' questions • ' + m + ' min';
}
window.selectJTimer = selectJTimer;

window.setJCustomTimer = () => {
  const v = parseInt(ge('jcustom-timer-inp').value);
  if (!v || v < 1) return;
  setupJsonTimerMins = v;
  document.querySelectorAll('[id^="jtopt-"]').forEach(el => el.classList.remove('on'));
  if (setupJsonQ.length) ge('setup-json-count').textContent = setupJsonQ.length + ' questions • ' + v + ' min';
};

window.startJsonTest = () => {
  if (!setupJsonQ.length) { alert('Pehle valid JSON paste karo!'); return; }
  const qs = [...setupJsonQ].sort(() => Math.random() - .5);
  T.qs = qs; T.idx = 0; T.answers = {}; T.marked = {};
  T.timerSecs = setupJsonTimerMins * 60; T.startTime = Date.now();
  T.subj = qs[0]?.subj || 'p';
  T.chapters = [...new Set(qs.map(q => q.chapter))];
  T.timerMins = setupJsonTimerMins;
  T.testName = T.chapters.slice(0,2).join(', ') + (T.chapters.length > 2 ? '...' : '');
  ge('main-header').style.display = 'none';
  document.querySelector('.bnav').style.display = 'none';
  document.body.style.paddingBottom = '0';
  ge('page-testactive').classList.add('on');
  renderTestQ(); startTestTimer();
};

function showTestSetup(){
  testSetup={subj:null,chapters:[],timerMins:30};
  bankTestSetup={subj:null,chapters:[],timerMins:30};
  activeTestMode='json';
  switchTestMode('json');
  // reset JSON mode
  ge('setup-json-inp').value='';
  setupJsonQ=[];
  ge('setup-json-status').style.display='none';
  ge('setup-json-count').textContent='';
  const jsb=ge('json-start-btn');jsb.style.opacity='.4';jsb.style.pointerEvents='none';
  selectJTimer(30);
  // reset bank mode UI
  document.querySelectorAll('.subj-card').forEach(c=>c.className='subj-card');
  ge('scard-all').className='full-mock-card';
  const bca=ge('bank-chapter-select');if(bca)bca.innerHTML='<div style="font-size:12px;color:var(--txt3);font-family:var(--fm)">← Pehle subject select karo</div>';
  const bsp=ge('bstep2-pill');if(bsp)bsp.style.opacity='.4';
  const bsb=ge('bank-start-btn');if(bsb){bsb.style.opacity='.4';bsb.style.pointerEvents='none';}
  const bsc=ge('bank-start-count');if(bsc)bsc.textContent='';
  // show question counts per subject on cards
  const pC=ge('scard-p-count'),gC=ge('scard-g-count'),rC=ge('scard-r-count');
  if(pC)pC.textContent=bank.filter(q=>q.subj==='p').length+' Qs';
  if(gC)gC.textContent=bank.filter(q=>q.subj==='g').length+' Qs';
  if(rC)rC.textContent=bank.filter(q=>q.subj==='r').length+' Qs';
  const allC=ge('scard-all-count');if(allC)allC.textContent='Teeno subjects — '+bank.length+' total questions';
  selectTimer(30);
  showSubPage2('config');
}
window.showTestSetup=showTestSetup;

function selectSubj(s){
  testSetup.subj=s;testSetup.chapters=[];
  document.querySelectorAll('.subj-card').forEach(c=>c.className='subj-card');
  ge('scard-all').className='full-mock-card';
  if(s==='all')ge('scard-all').className='full-mock-card sel';
  else{const map={p:'sel-p',g:'sel-g',r:'sel-r'};ge('scard-'+s).className='subj-card '+map[s];}
  ge('step2-pill').style.opacity='1';
  if(s==='all'){ge('chapter-select-area').innerHTML='<div style="font-size:12px;color:var(--ag);font-family:var(--fm)">✓ Teeno subjects ke saare chapters included</div>';return}
  const cl=s==='p'?'p':s==='g'?'g':'r';
  const chips=CH_NAMES[s].map(ch=>`<div class="ch-chip" id="chip-${ch.replace(/\s/g,'_')}" onclick="toggleChapter('${ch.replace(/'/g,"\\'")}','${cl}',this)">${ch}</div>`).join('');
  ge('chapter-select-area').innerHTML=`<div style="font-size:11px;color:var(--txt3);font-family:var(--fm);margin-bottom:6px">Chapters select karo (skip karo = saare)</div><div class="chapter-chips">${chips}</div><button class="btn btn-o btn-xs" style="margin-top:10px" onclick="selectAllChapters('${s}')">Select All</button>`;
}
window.selectSubj=selectSubj;

function toggleChapter(ch,cl,el){
  if(testSetup.chapters.includes(ch)){testSetup.chapters=testSetup.chapters.filter(c=>c!==ch);el.classList.remove('on','p','g','r');}
  else{testSetup.chapters.push(ch);el.classList.add('on',cl);}
}
window.toggleChapter=toggleChapter;

function selectAllChapters(s){
  testSetup.chapters=[...CH_NAMES[s]];
  const cl=s==='p'?'p':s==='g'?'g':'r';
  document.querySelectorAll('.ch-chip').forEach(c=>{c.className='ch-chip on '+cl});
}
window.selectAllChapters=selectAllChapters;

function selectTimer(m){
  testSetup.timerMins=m;
  document.querySelectorAll('.timer-opt').forEach(t=>t.classList.remove('on'));
  const el=ge('topt-'+m);if(el)el.classList.add('on');
}
window.selectTimer=selectTimer;

function setBankTestTimer(){
  const v=parseInt(ge('custom-timer-inp').value);if(!v||v<1){showToast('Valid minutes daalo!',1500);return;}
  testSetup.timerMins=v;document.querySelectorAll('.timer-opt').forEach(t=>t.classList.remove('on'));
  showToast('⏱ '+v+' min timer set!',1200);
}
window.setBankTestTimer=setBankTestTimer;

// ─── START TEST ───────────────────────────────
function startTest(){
  if(!testSetup.subj){alert('Subject select karo!');return}
  let pool=[];
  if(testSetup.subj==='all'){pool=[...bank];}
  else{
    const chapFilter=testSetup.chapters.length>0?testSetup.chapters:CH_NAMES[testSetup.subj];
    pool=bank.filter(q=>q.subj===testSetup.subj && chapFilter.includes(q.chapter));
  }
  if(!pool.length){
    customConfirm('Is chapter mein koi question nahi hai! Question Bank mein add karoge?', () => {
      showSubPage2('bank'); setTimeout(()=>openAddQ(),300);
    }, { icon:'📝', title:_t('no_question_title'), okLabel:_t('no_question_ok'), danger:false });
    return;
  }
  pool=pool.sort(()=>Math.random()-.5);
  T.qs=pool;T.idx=0;T.answers={};T.marked={};
  T.timerSecs=testSetup.timerMins*60;T.startTime=Date.now();
  T.subj=testSetup.subj;T.chapters=[...testSetup.chapters];T.timerMins=testSetup.timerMins;
  const chapStr=testSetup.subj==='all'?'Full Mock':(testSetup.chapters.length?testSetup.chapters.slice(0,2).join(', ')+(testSetup.chapters.length>2?'...':''):'All Chapters');
  T.testName=SUBJ_NAMES[testSetup.subj]+' — '+chapStr;
  // show full screen test
  ge('main-header').style.display='none';
  document.querySelector('.bnav').style.display='none';
  document.body.style.paddingBottom='0';
  ge('page-testactive').classList.add('on');
  renderTestQ();startTestTimer();
}
window.startTest=startTest;

function exitTestScreen(){
  ge('main-header').style.display='';
  document.querySelector('.bnav').style.display='';
  document.body.style.paddingBottom='';
  ge('page-testactive').classList.remove('on');
}

// ─── TEST TIMER ───────────────────────────────
function startTestTimer(){
  clearInterval(T.timerInt);
  updateTimerDisplay();
  T.timerInt=setInterval(()=>{T.timerSecs--;updateTimerDisplay();if(T.timerSecs<=0){clearInterval(T.timerInt);submitTest();}},1000);
}
function updateTimerDisplay(){
  const el=ge('test-timer');if(!el)return;
  const m=Math.floor(T.timerSecs/60),s=T.timerSecs%60;
  el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  el.className='test-timer-display'+(T.timerSecs<=300?' danger':T.timerSecs<=600?' warn':'');
}

// ─── RENDER QUESTION ─────────────────────────
function renderTestQ(){
  const q=T.qs[T.idx];const area=ge('test-q-area');
  const answered=Object.keys(T.answers).length;
  const cl=SUBJ_COLORS[q.subj]||'var(--ap)';
  ge('test-prog-label').textContent='Q '+(T.idx+1)+' of '+T.qs.length;
  ge('test-prog-fill').style.width=(answered/T.qs.length*100)+'%';
  renderNavDots();
  const LABS=['A','B','C','D'];const sel=T.answers[T.idx];
  area.innerHTML=`
    <div class="test-q-num">QUESTION ${T.idx+1} OF ${T.qs.length}</div>
    <div class="test-q-badges">
      <span class="badge" style="background:rgba(79,138,255,.1);color:${cl}">${SUBJ_NAMES[q.subj]||q.subj}</span>
      <span class="badge y">${q.chapter}</span>
    </div>
    <div class="test-q-text">${q.text}</div>
    ${q.options.map((o,i)=>`<button class="test-opt${sel===i?' selected':''}" onclick="selectAnswer(${i})"><div class="opt-label">${LABS[i]}</div><div class="opt-text">${o}</div></button>`).join('')}
    <div style="margin-top:12px;display:flex;gap:8px">
      <button class="btn btn-y btn-xs" onclick="toggleMark(${T.idx})" style="${T.marked[T.idx]?'border-color:var(--ay);color:var(--ay)':''}">${T.marked[T.idx]?'🔖 Marked':'🔖 Mark for Review'}</button>
      <button class="btn btn-o btn-xs" onclick="clearAnswer(${T.idx})">✕ Clear</button>
    </div>`;
  area.scrollTop=0;
  ge('test-next-btn').textContent=T.idx===T.qs.length-1?'Finish ✓':'Next →';
}

function selectAnswer(i){T.answers[T.idx]=i;renderTestQ()}
function clearAnswer(idx){delete T.answers[idx];renderTestQ()}
function toggleMark(idx){T.marked[idx]=!T.marked[idx];renderTestQ()}
window.selectAnswer=selectAnswer;window.clearAnswer=clearAnswer;window.toggleMark=toggleMark;

function nextQ(){if(T.idx<T.qs.length-1){T.idx++;renderTestQ();}else confirmSubmit()}
window.nextQ=nextQ;

function renderNavDots(){
  const wrap=ge('test-nav-dots');if(!wrap)return;
  wrap.innerHTML=T.qs.map((_,i)=>{
    let cls='q-dot';
    if(i===T.idx)cls+=' current';
    else if(T.marked[i])cls+=' marked';
    else if(T.answers[i]!==undefined)cls+=' answered';
    return`<div class="${cls}" onclick="jumpToQ(${i})">${i+1}</div>`;
  }).join('');
  const cur=wrap.children[T.idx];if(cur)cur.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
}
function jumpToQ(i){T.idx=i;renderTestQ()}
window.jumpToQ=jumpToQ;

// ─── SUBMIT TEST ──────────────────────────────
function confirmSubmit(){
  const un=T.qs.length-Object.keys(T.answers).length;
  ge('confirm-msg').textContent=un>0?`${un} questions unattempted hain. Pakka submit karna hai?`:'Sab questions attempt kiye. Submit karo?';
  ge('confirm-overlay').classList.add('on');
}
function closeConfirm(){ge('confirm-overlay').classList.remove('on')}
window.closeConfirm=closeConfirm;

function submitTest(){
  closeConfirm();clearInterval(T.timerInt);
  const timeTaken=Math.round((Date.now()-T.startTime)/1000);
  let score=0,correct=0,wrong=0,skip=0;
  const review=T.qs.map((q,i)=>{
    const ans=T.answers[i];let result='skip';
    if(ans===undefined)skip++;
    else if(ans===q.correct){score+=4;correct++;result='correct';}
    else{score-=1;wrong++;result='wrong';}
    return{q,ans,result,idx:i};
  });
  const attempt={id:uid(),testName:T.testName,date:nowStr(),subj:T.subj,chapters:T.chapters,score,correct,wrong,skip,total:T.qs.length,timerMins:T.timerMins,timeTaken,review,maxScore:T.qs.length*4};
  attempts.push(attempt);LS.s('jte_attempts',attempts);
  autoUpdateAccuracy(); // auto-recalculate subject accuracy from all tests
  exitTestScreen();
  showTestResult(attempt);
}
window.submitTest=submitTest;

// ─── SHOW RESULT ─────────────────────────────
function showTestResult(a){
  ge('page-testresult').classList.add('on');
  ge('result-title-hdr').textContent='Test Result';
  ge('result-sub-hdr').textContent=a.testName;
  const pct=Math.round(a.correct/a.total*100);
  const grade=pct>=90?'🏆 Excellent!':pct>=75?'⭐ Very Good':pct>=60?'👍 Good':pct>=45?'📚 Keep Practicing':'💪 Needs More Work';
  const stars=pct>=90?'⭐⭐⭐':pct>=70?'⭐⭐':pct>=50?'⭐':'';
  const timeFmt=a.timeTaken>60?Math.floor(a.timeTaken/60)+'m '+a.timeTaken%60+'s':a.timeTaken+'s';
  let html=`
  <div class="result-hero">
    <div class="result-stars">${stars}</div>
    <div class="result-score-big"><span class="${a.score>=0?'pos':'neg'}">${a.score}</span></div>
    <div class="result-out-of">out of ${a.maxScore} marks</div>
    <div class="result-grade" style="margin-top:10px">${grade}</div>
    <div style="font-size:12px;color:var(--txt3);font-family:var(--fm);margin-top:4px">${a.date} · ${timeFmt}</div>
  </div>
  <div style="padding:16px">
  <div class="result-stat-grid">
    <div class="rst"><span class="rst-lbl">CORRECT</span><div class="rst-val" style="color:var(--ag)">${a.correct}</div></div>
    <div class="rst"><span class="rst-lbl">WRONG</span><div class="rst-val" style="color:var(--ar)">${a.wrong}</div></div>
    <div class="rst"><span class="rst-lbl">SKIPPED</span><div class="rst-val" style="color:var(--ay)">${a.skip}</div></div>
    <div class="rst"><span class="rst-lbl">ACCURACY</span><div class="rst-val">${pct}%</div></div>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <button class="btn btn-v btn-full" onclick="reattemptTest('${a.id}')">🔁 Reattempt</button>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><span class="section-label" style="margin:0">📊 ANSWER REVIEW</span></div>`;
  a.review.forEach((r,i)=>{
    const LABS=['A','B','C','D'];
    const userAns=r.ans!==undefined?LABS[r.ans]:'—';
    const corrAns=LABS[r.q.correct];
    html+=`<div class="ans-review-item ${r.result}">
      <div class="ari-top">
        <span class="badge ${r.result==='correct'?'g':r.result==='wrong'?'r':'y'}">${r.result==='correct'?'✓ +4':r.result==='wrong'?'✗ −1':'— 0'}</span>
        <span class="badge y">${r.q.chapter}</span>
        <span style="font-size:10px;font-family:var(--fm);color:var(--txt3)">Q${i+1}</span>
      </div>
      <div class="ari-q">${r.q.text}</div>
      <div class="ari-ans">
        <span style="color:var(--txt3)">Your: <span style="color:${r.result==='correct'?'var(--ag)':r.result==='wrong'?'var(--ar)':'var(--ay)'}">${userAns}</span></span>
        <span style="color:var(--txt3)">Correct: <span style="color:var(--ag)">${corrAns}) ${r.q.options[r.q.correct]}</span></span>
      </div>
      ${r.q.explanation?`<div style="margin-top:8px;font-size:11px;color:var(--txt2);background:var(--s3);padding:8px 10px;border-radius:8px;line-height:1.6">💡 ${r.q.explanation}</div>`:''}
    </div>`;
  });
  html+='</div>';
  ge('result-body').innerHTML=html;
  ge('result-body').scrollTop=0;
}

function closeTestResult(){
  ge('page-testresult').classList.remove('on');
  showPage('testsetup');
}
window.closeTestResult=closeTestResult;

function reattemptTest(id){
  const a=attempts.find(x=>x.id===id);if(!a)return;
  T.qs=a.review.map(r=>r.q).sort(()=>Math.random()-.5);
  T.idx=0;T.answers={};T.marked={};
  T.timerSecs=a.timerMins*60;T.startTime=Date.now();
  T.subj=a.subj;T.chapters=a.chapters;T.timerMins=a.timerMins;T.testName=a.testName+' (Reattempt)';
  ge('page-testresult').classList.remove('on');
  ge('main-header').style.display='none';
  document.querySelector('.bnav').style.display='none';
  document.body.style.paddingBottom='0';
  ge('page-testactive').classList.add('on');
  renderTestQ();startTestTimer();
}
window.reattemptTest=reattemptTest;

function viewAttempt(id){const a=attempts.find(x=>x.id===id);if(!a)return;showTestResult(a)}
window.viewAttempt=viewAttempt;

function deleteAttempt(id){
  customConfirm('Ye attempt delete karo?', () => {
    attempts=attempts.filter(x=>x.id!==id);LS.s('jte_attempts',attempts);renderHistory();renderTestHome();
  }, { icon:'🗑', title:_t('attempt_del_title'), okLabel:_t('chapter_del_ok') });
}
window.deleteAttempt=deleteAttempt;

// ─── HISTORY ─────────────────────────────────
function renderHistory(){
  const body=ge('history-list');if(!body)return;
  if(!attempts.length){body.innerHTML='<div class="empty"><span class="empty-icon">📊</span><span class="empty-text">Abhi tak koi test nahi diya.</span></div>';return}
  const sorted=[...attempts].reverse();
  body.innerHTML=sorted.map(a=>{
    const pct=Math.round(a.correct/a.total*100);
    const col=pct>=70?'var(--ag)':pct>=50?'var(--ay)':'var(--ar)';
    return`<div class="attempt-item" onclick="viewAttempt('${a.id}')">
      <div class="att-score" style="color:${col}">${a.score}</div>
      <div class="att-info"><div class="att-name">${a.testName}</div><div class="att-meta">${a.date} · ${a.correct}✓ ${a.wrong}✗ · ${pct}%</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <button class="btn btn-p btn-xs" onclick="event.stopPropagation();reattemptTest('${a.id}')">🔁</button>
        <button class="btn btn-r btn-xs" onclick="event.stopPropagation();deleteAttempt('${a.id}')">🗑</button>
      </div>
    </div>`;
  }).join('');
}

// ─── QUESTION BANK ────────────────────────────
// ─── QUESTION BANK ────────────────────────────
let bankFilter = 'all';
let bankChapterFilter = 'all'; // chapter name or 'all'

function renderBank(){
  const list = ge('bank-list');
  const statsEl = ge('bank-stats');
  const chRow = ge('bfilt-chapter-row');
  if(!list) return;

  // Filter by subject
  let bySubj = bankFilter === 'all' ? bank : bank.filter(q => q.subj === bankFilter);

  // Build chapter chips for selected subject
  if(chRow){
    if(bankFilter === 'all'){
      chRow.innerHTML = '';
      bankChapterFilter = 'all';
    } else {
      const chapters = [...new Set(bySubj.map(q => q.chapter))].sort();
      if(chapters.length > 1){
        chRow.innerHTML = `<div class="ch-chip on ${bankFilter}" id="bcfilt-all" onclick="setBankChapterFilter('all',this)">All Chapters</div>` +
          chapters.map(ch => `<div class="ch-chip" id="bcfilt-${ch.replace(/\s/g,'_')}" onclick="setBankChapterFilter('${ch.replace(/'/g,"\\'")}',this)">${ch}</div>`).join('');
      } else { chRow.innerHTML = ''; bankChapterFilter = 'all'; }
    }
  }

  // Filter by chapter
  let items = bankChapterFilter === 'all' ? bySubj : bySubj.filter(q => q.chapter === bankChapterFilter);

  if(statsEl) statsEl.textContent = `${items.length} questions ${bankFilter!=='all'?'· '+{p:'Physics',g:'Chemistry',r:'Maths'}[bankFilter]:'total'}${bankChapterFilter!=='all'?' · '+bankChapterFilter:''}`;

  if(!items.length){
    list.innerHTML = '<div class="empty"><span class="empty-icon">📚</span><span class="empty-text">Koi question nahi hai.<br>+ Add se question add karo.</span></div>';
    return;
  }

  const LABS = ['A','B','C','D'];
  const SNAMES = {p:'Physics',g:'Chemistry',r:'Maths'};

  // Group by chapter
  const grouped = {};
  items.forEach(q => { if(!grouped[q.chapter]) grouped[q.chapter] = []; grouped[q.chapter].push(q); });

  list.innerHTML = Object.entries(grouped).map(([ch, qs]) => `
    <div style="margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${qs[0].subj}">${SNAMES[qs[0].subj]}</span>
          <span style="font-size:13px;font-weight:700;color:var(--txt2)">${ch}</span>
        </div>
        <span style="font-size:10px;font-family:var(--fm);color:var(--txt3)">${qs.length} Qs</span>
      </div>
      ${qs.map(q => `
        <div class="qbank-item ${q.subj}" style="position:relative;padding-right:40px">
          <div class="qi-top"><span class="badge y" style="font-size:9px">${q.chapter}</span></div>
          <div class="qi-text">${q.text.length>130?q.text.slice(0,130)+'...':q.text}</div>
          <div class="qi-ans">✅ ${LABS[q.correct]}) ${q.options[q.correct]}</div>
          ${q.addedAt?`<div style="font-size:9px;color:var(--txt3);font-family:var(--fm);margin-top:4px">🕐 ${q.addedAt}</div>`:''}
          <button onclick="deleteQ('${q.id}')" style="position:absolute;top:10px;right:10px;background:rgba(255,79,109,.15);border:1px solid rgba(255,79,109,.3);color:var(--ar);width:28px;height:28px;border-radius:8px;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer">🗑</button>
        </div>`).join('')}
    </div>`).join('');
}

function setBankFilter(f, el){
  bankFilter = f;
  bankChapterFilter = 'all';
  document.querySelectorAll('[id^="bfilt-"]').forEach(c => c.className = 'ch-chip');
  el.className = 'ch-chip on ' + (f === 'all' ? 'p' : f);
  renderBank();
}
window.setBankFilter = setBankFilter;

function setBankChapterFilter(ch, el){
  bankChapterFilter = ch;
  document.querySelectorAll('[id^="bcfilt-"]').forEach(c => { c.className = 'ch-chip'; });
  el.className = 'ch-chip on ' + bankFilter;
  renderBank();
}
window.setBankChapterFilter = setBankChapterFilter;

function deleteQ(id){
  customConfirm('Question delete karo?', () => {
    bank = bank.filter(q => q.id !== id);
    LS.s('jte_bank', bank);
    renderBank();
    renderTestHome();
  }, { icon:'🗑', title:_t('question_del_title'), okLabel:_t('chapter_del_ok') });
}
window.deleteQ = deleteQ;

// ─── BANK SE TEST ────────────────────────────
let bankTestSetup = { subj: null, chapters: [], timerMins: 30 };

function selectBankSubj(s){
  bankTestSetup.subj = s;
  bankTestSetup.chapters = [];
  document.querySelectorAll('.subj-card').forEach(c => c.className = 'subj-card');
  ge('scard-all').className = 'full-mock-card';
  if(s === 'all') {
    ge('scard-all').className = 'full-mock-card sel';
  } else {
    const map = {p:'sel-p', g:'sel-g', r:'sel-r'};
    ge('scard-'+s).className = 'subj-card ' + map[s];
  }

  const pill = ge('bstep2-pill');
  const area = ge('bank-chapter-select');
  const btn  = ge('bank-start-btn');
  const countEl = ge('bank-start-count');

  if(s === 'all'){
    if(pill) pill.style.opacity = '1';
    const total = bank.length;
    if(area) area.innerHTML = `<div style="font-size:12px;color:var(--ag);font-family:var(--fm);padding:4px 0">✓ Teeno subjects ke saare ${total} questions included</div>`;
    const n = bank.length;
    if(n){ btn.style.opacity='1'; btn.style.pointerEvents='auto'; countEl.textContent = n+' questions available'; }
    else { btn.style.opacity='.4'; btn.style.pointerEvents='none'; countEl.textContent = 'Bank mein koi question nahi!'; }
    return;
  }

  // Get chapters in bank for this subject
  const subjQs = bank.filter(q => q.subj === s);
  const chapters = [...new Set(subjQs.map(q => q.chapter))].sort();
  if(pill) pill.style.opacity = '1';

  if(!chapters.length){
    if(area) area.innerHTML = `<div style="font-size:12px;color:var(--ar);font-family:var(--fm);">❌ Is subject ke koi questions bank mein nahi hain. Pehle add karo.</div>`;
    btn.style.opacity='.4'; btn.style.pointerEvents='none'; countEl.textContent='';
    return;
  }

  const cl = s;
  if(area) area.innerHTML = `
    <div style="font-size:11px;color:var(--txt3);font-family:var(--fm);margin-bottom:8px">Chapters choose karo (skip = saare ${subjQs.length} questions)</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:10px">
      ${chapters.map(ch => {
        const cnt = subjQs.filter(q=>q.chapter===ch).length;
        return `<div class="ch-chip" id="btest-chip-${ch.replace(/[\s\/]/g,'_')}" onclick="toggleBankChapter('${ch.replace(/'/g,"\\'")}','${cl}',this)">${ch} <span style="font-size:9px;opacity:.7">(${cnt})</span></div>`;
      }).join('')}
    </div>
    <button class="btn btn-o btn-xs" onclick="selectAllBankChapters('${s}')" style="font-size:11px">✓ Sab Select</button>`;

  // update count
  updateBankTestCount();
}
window.selectBankSubj = selectBankSubj;

function toggleBankChapter(ch, cl, el){
  if(bankTestSetup.chapters.includes(ch)){
    bankTestSetup.chapters = bankTestSetup.chapters.filter(c => c !== ch);
    el.className = 'ch-chip';
  } else {
    bankTestSetup.chapters.push(ch);
    el.className = 'ch-chip on ' + cl;
  }
  updateBankTestCount();
}
window.toggleBankChapter = toggleBankChapter;

function selectAllBankChapters(s){
  const subjQs = bank.filter(q => q.subj === s);
  const chapters = [...new Set(subjQs.map(q => q.chapter))];
  bankTestSetup.chapters = [...chapters];
  document.querySelectorAll('[id^="btest-chip-"]').forEach(el => { el.className = 'ch-chip on ' + s; });
  updateBankTestCount();
}
window.selectAllBankChapters = selectAllBankChapters;

function updateBankTestCount(){
  const btn = ge('bank-start-btn');
  const countEl = ge('bank-start-count');
  if(!bankTestSetup.subj || bankTestSetup.subj === 'all'){
    const n = bank.length;
    if(n){ btn.style.opacity='1'; btn.style.pointerEvents='auto'; countEl.textContent=n+' questions'; }
    else { btn.style.opacity='.4'; btn.style.pointerEvents='none'; countEl.textContent=''; }
    return;
  }
  const chaps = bankTestSetup.chapters.length
    ? bankTestSetup.chapters
    : [...new Set(bank.filter(q=>q.subj===bankTestSetup.subj).map(q=>q.chapter))];
  const n = bank.filter(q => q.subj===bankTestSetup.subj && chaps.includes(q.chapter)).length;
  if(n){ btn.style.opacity='1'; btn.style.pointerEvents='auto'; countEl.textContent=n+' questions available'; }
  else { btn.style.opacity='.4'; btn.style.pointerEvents='none'; countEl.textContent='Ye chapters mein koi question nahi'; }
}

window.startBankTest = () => {
  if(!bankTestSetup.subj){ alert('Pehle subject choose karo!'); return; }
  let pool;
  if(bankTestSetup.subj === 'all'){
    pool = [...bank];
  } else {
    const chaps = bankTestSetup.chapters.length
      ? bankTestSetup.chapters
      : [...new Set(bank.filter(q=>q.subj===bankTestSetup.subj).map(q=>q.chapter))];
    pool = bank.filter(q => q.subj===bankTestSetup.subj && chaps.includes(q.chapter));
  }
  if(!pool.length){ alert('Koi question nahi mila!'); return; }
  pool = pool.sort(()=>Math.random()-.5);
  T.qs=pool; T.idx=0; T.answers={}; T.marked={};
  T.timerSecs=testSetup.timerMins*60; T.startTime=Date.now();
  T.subj=bankTestSetup.subj; T.chapters=[...new Set(pool.map(q=>q.chapter))];
  T.timerMins=testSetup.timerMins;
  T.testName=({p:'Physics',g:'Chemistry',r:'Maths',all:'Full Mock'}[bankTestSetup.subj])
    +' — '+(bankTestSetup.chapters.length ? bankTestSetup.chapters.slice(0,2).join(', ')+(bankTestSetup.chapters.length>2?'...':'') : 'All Chapters');
  ge('main-header').style.display='none';
  document.querySelector('.bnav').style.display='none';
  document.body.style.paddingBottom='0';
  ge('page-testactive').classList.add('on');
  renderTestQ(); startTestTimer();
};


function openAddQ(){bulkQueue=[];updateBulkUI();switchAddTab('manual');openModal('addq-modal')}
window.openAddQ=openAddQ;

function switchAddTab(t){
  ge('tab-manual-body').style.display=t==='manual'?'block':'none';
  ge('tab-bulk-body').style.display=t==='bulk'?'block':'none';
  ge('tab-ai-body').style.display=t==='ai'?'block':'none';
  ['manual','bulk','ai'].forEach(id=>{
    const el=ge('tab-'+id);if(!el)return;
    el.style.borderColor=t===id?'var(--ap)':'var(--b2)';
    el.style.color=t===id?'var(--ap)':'var(--txt)';
  });
}
window.switchAddTab=switchAddTab;

// ─── BULK QUEUE ───────────────────────────────
let bulkQueue=[];

function updateBulkUI(){
  const n=bulkQueue.length;
  ge('bulk-counter').textContent=n;
  ge('bulk-save-count').textContent=n;
  const btn=ge('bulk-save-btn');
  if(n>0){btn.style.opacity='1';btn.style.pointerEvents='auto';}
  else{btn.style.opacity='.4';btn.style.pointerEvents='none';}
  const preview=ge('bulk-queue-preview');
  if(!n){preview.innerHTML='';return;}
  const LABS=['A','B','C','D'];
  preview.innerHTML=bulkQueue.map((q,i)=>`
    <div style="display:flex;align-items:center;gap:8px;background:var(--s2);border-radius:8px;padding:8px 10px;margin-bottom:6px;border-left:3px solid var(--ap)">
      <span style="font-size:11px;font-family:var(--fm);color:var(--ap);flex-shrink:0">Q${i+1}</span>
      <span style="font-size:12px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--txt2)">${q.text.slice(0,60)}${q.text.length>60?'...':''}</span>
      <span style="font-size:10px;font-family:var(--fm);color:var(--ag);flex-shrink:0">Ans:${LABS[q.correct]}</span>
      <button onclick="removeBulkQ(${i})" style="background:none;color:var(--txt3);font-size:16px;opacity:.6;flex-shrink:0">×</button>
    </div>`).join('');
}

window.addToBulkQueue=()=>{
  const chapter=ge('bq-chapter').value.trim();
  const text=ge('bq-text').value.trim();
  const oa=ge('bq-oa').value.trim(),ob=ge('bq-ob').value.trim();
  const oc=ge('bq-oc').value.trim(),od=ge('bq-od').value.trim();
  if(!chapter){alert('Chapter name daalo!');ge('bq-chapter').focus();return;}
  if(!text||!oa||!ob||!oc||!od){alert('Question aur saare options bhar!');return;}
  bulkQueue.push({
    id:uid(),
    subj:ge('bq-subj').value,
    chapter,text,
    options:[oa,ob,oc,od],
    correct:parseInt(ge('bq-ans').value),
    explanation:ge('bq-exp').value.trim()
  });
  // clear only question fields, keep subject+chapter
  ['bq-text','bq-oa','bq-ob','bq-oc','bq-od','bq-exp'].forEach(id=>{const e=ge(id);if(e)e.value='';});
  ge('bq-ans').value='0';
  updateBulkUI();
  ge('bq-text').focus();
}

window.removeBulkQ=(i)=>{bulkQueue.splice(i,1);updateBulkUI();}

window.saveBulkQ=()=>{
  if(!bulkQueue.length){alert('Queue khaali hai!');return;}
  const at=nowStr();
  bulkQueue.forEach(q=>q.addedAt=at);
  bank.push(...bulkQueue);
  LS.s('jte_bank',bank);
  const count=bulkQueue.length;
  bulkQueue=[];
  updateBulkUI();
  closeModal('addq-modal');
  renderBank();renderTestHome();
  alert(`✅ ${count} questions bank mein save ho gaye!`);
}

function saveManualQ(){
  const text=ge('q-text-inp').value.trim();const oa=ge('q-oa').value.trim();const ob=ge('q-ob').value.trim();
  const oc=ge('q-oc').value.trim();const od=ge('q-od').value.trim();const chapter=ge('q-chapter').value.trim();
  if(!text||!oa||!ob||!oc||!od||!chapter){alert('Sab fields bhar!');return}
  bank.push({id:uid(),subj:ge('q-subj').value,chapter,text,options:[oa,ob,oc,od],correct:parseInt(ge('q-ans').value),explanation:ge('q-exp').value.trim(),addedAt:nowStr()});
  LS.s('jte_bank',bank);closeModal('addq-modal');
  ['q-text-inp','q-oa','q-ob','q-oc','q-od','q-exp','q-chapter'].forEach(id=>{const e=ge(id);if(e)e.value=''});
  renderBank();renderTestHome();alert('✅ Question saved!');
}
window.saveManualQ=saveManualQ;

// ─── AI GENERATE ──────────────────────────────
// ─── JSON IMPORT ─────────────────────────────
let jsonParsedQ = [];

function toggleJsonPaste(){
  const area = ge('json-paste-area');
  area.style.display = area.style.display==='none' ? 'block' : 'none';
}
window.toggleJsonPaste = toggleJsonPaste;

function clearJsonPaste(){
  ge('json-paste-inp').value='';
  jsonParsedQ=[];
  ge('json-error').style.display='none';
  ge('json-preview').style.display='none';
  const btn=ge('json-import-btn');
  btn.style.opacity='.4';btn.style.pointerEvents='none';
  ge('json-import-count').textContent='0';
}
window.clearJsonPaste=clearJsonPaste;

function copyJsonTemplate(){
  const t=`[
  {
    "q": "A ball is thrown vertically upward with velocity 20 m/s. Time to reach max height?",
    "options": { "1": "1 s", "2": "2 s", "3": "3 s", "4": "4 s" },
    "answer": 2,
    "exp": "v=u-gt => 0=20-10t => t=2s (optional)"
  }
]`;
  navigator.clipboard.writeText(t).then(()=>alert('✅ Template copy ho gaya!')).catch(()=>alert('Manually copy karo:\n'+t));
}
window.copyJsonTemplate = copyJsonTemplate;

function parseAndPreviewJson(raw){
  const errBox = ge('json-error');
  const preview = ge('json-preview');
  const previewList = ge('json-preview-list');
  const countEl = ge('json-preview-count');
  const importBtn = ge('json-import-btn');
  const importCount = ge('json-import-count');
  errBox.style.display='none'; preview.style.display='none';
  jsonParsedQ=[];
  importBtn.style.opacity='.4'; importBtn.style.pointerEvents='none';

  const subj = (ge('ji-subj')?.value || 'p');
  const chapter = (ge('ji-chapter')?.value.trim() || '');

  try{
    const arr = JSON.parse(raw);
    if(!Array.isArray(arr)) throw new Error('JSON ek array hona chahiye: [...]');
    const errors=[], valid=[];
    arr.forEach((q,i)=>{
      const n=i+1;
      const text = q.q || q.text;
      if(!text) {errors.push(`Q${n}: "q" field missing`);return;}
      // New format: options object {1,2,3,4} + answer 1-4
      let opts, correct;
      if(q.options && typeof q.options === 'object' && !Array.isArray(q.options)){
        opts = [q.options['1'],q.options['2'],q.options['3'],q.options['4']];
        correct = parseInt(q.answer||q.ans) - 1; // 1-4 → 0-3
      } else {
        // old format fallback: a,b,c,d + ans 0-3
        opts = [q.a||q.optA, q.b||q.optB, q.c||q.optC, q.d||q.optD];
        correct = q.ans!==undefined ? parseInt(q.ans) : (q.correct!==undefined ? parseInt(q.correct) : -1);
      }
      if(!opts[0]||!opts[1]||!opts[2]||!opts[3]) {errors.push(`Q${n}: options missing`);return;}
      if(correct<0||correct>3) {errors.push(`Q${n}: answer must be 1-4`);return;}
      valid.push({id:uid(), subj, chapter: chapter||'General',
        text:text.trim(), options:opts, correct,
        explanation:(q.exp||q.explanation||'').trim(),
        addedAt: nowStr()});
    });

    if(errors.length){
      errBox.innerHTML='<b>⚠ Kuch errors hain:</b><br>'+errors.slice(0,5).join('<br>')+(errors.length>5?`<br>...aur ${errors.length-5} aur`:'');
      errBox.style.display='block';
    }
    if(!valid.length){jsonParsedQ=[];return;}
    jsonParsedQ=valid;

    const LABS=['1','2','3','4'];
    previewList.innerHTML=valid.slice(0,5).map(q=>`
      <div style="background:var(--s2);border-radius:8px;padding:9px 11px;margin-bottom:6px;border-left:3px solid var(--ap)">
        <div style="font-size:12px;color:var(--txt2)">${q.text.slice(0,90)}${q.text.length>90?'...':''}</div>
        <div style="font-size:10px;font-family:var(--fm);color:var(--ag);margin-top:3px">✅ ${LABS[q.correct]}) ${q.options[q.correct].slice(0,30)}</div>
      </div>`).join('')+(valid.length>5?`<div style="font-size:11px;color:var(--txt3);font-family:var(--fm);padding:6px 0">...aur ${valid.length-5} aur questions</div>`:'');
    countEl.textContent=valid.length+' valid questions';
    importCount.textContent=valid.length;
    preview.style.display='block';
    importBtn.style.opacity='1'; importBtn.style.pointerEvents='auto';
  }catch(err){
    errBox.textContent='❌ JSON parse error: '+err.message;
    errBox.style.display='block';
  }
}

window.loadJsonFile=(e)=>{
  const file=e.target.files[0]; if(!file)return;
  const reader=new FileReader();
  reader.onload=(ev)=>{ parseAndPreviewJson(ev.target.result); };
  reader.readAsText(file);
  e.target.value='';
}

// live parse on paste
document.addEventListener('DOMContentLoaded',()=>{
  document.addEventListener('input',(e)=>{
    if(e.target.id==='json-paste-inp') parseAndPreviewJson(e.target.value.trim());
  });
});

window.importJsonQ=()=>{
  if(!jsonParsedQ.length){alert('Pehle valid JSON daalo!');return;}
  const at=nowStr();
  jsonParsedQ.forEach(q=>q.addedAt=at);
  bank.push(...jsonParsedQ);
  LS.s('jte_bank',bank);
  const count=jsonParsedQ.length;
  jsonParsedQ=[];
  closeModal('addq-modal');
  renderBank(); renderTestHome();
  alert(`✅ ${count} questions successfully bank mein import ho gaye!`);
}




// ─── CUSTOM ALARM SOUND ──────────────────────
let _customSoundBuffer = null;   // decoded AudioBuffer
let _customSoundB64 = null;      // base64 stored in LS
let _soundPreset = 'beep';       // 'beep' or 'custom'

// Load from storage on init
function initCustomSound() {
  _soundPreset = LS.g('air_sound_preset', 'beep');
  const b64 = LS.g('air_custom_sound_b64', null);
  if(b64 && _soundPreset === 'custom') {
    _customSoundB64 = b64;
    decodeB64Sound(b64);
    const name = LS.g('air_custom_sound_name', 'Custom Sound');
    const nameEl = ge('custom-sound-name');
    if(nameEl) nameEl.textContent = name;
    ge('test-sound-btn') && (ge('test-sound-btn').style.display = '');
    ge('clear-sound-btn') && (ge('clear-sound-btn').style.display = '');
    // update preset buttons
    document.querySelectorAll('.sound-preset-btn').forEach(b => b.classList.remove('on'));
    const cb = ge('spbtn-custom'); if(cb) cb.classList.add('on');
  }
}

function decodeB64Sound(b64) {
  try {
    const ctx = getAudioCtx(); if(!ctx) return;
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++) buf[i]=bin.charCodeAt(i);
    ctx.decodeAudioData(buf.buffer, decoded => { _customSoundBuffer = decoded; });
  } catch(e) { console.warn('Sound decode fail', e); }
}

window.pickCustomSound = () => {
  ge('sound-file-inp') && ge('sound-file-inp').click();
};

window.loadCustomSound = (e) => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const b64 = btoa(new Uint8Array(ev.target.result).reduce((d,b) => d+String.fromCharCode(b),''));
      _customSoundB64 = b64;
      _soundPreset = 'custom';
      LS.s('air_custom_sound_b64', b64);
      LS.s('air_custom_sound_name', file.name);
      LS.s('air_sound_preset', 'custom');
      decodeB64Sound(b64);
      const nameEl = ge('custom-sound-name');
      if(nameEl) nameEl.textContent = '🎵 ' + file.name;
      ge('test-sound-btn') && (ge('test-sound-btn').style.display = '');
      ge('clear-sound-btn') && (ge('clear-sound-btn').style.display = '');
      const statusEl = ge('sound-status');
      if(statusEl) { statusEl.style.display=''; statusEl.textContent='✅ Sound loaded: ' + file.name; setTimeout(()=>statusEl.style.display='none',3000); }
      document.querySelectorAll('.sound-preset-btn').forEach(b => b.classList.remove('on'));
      const cb = ge('spbtn-custom'); if(cb) cb.classList.add('on');
    } catch(err) { showToast('❌ File load nahi hua', 1500); }
  };
  reader.readAsArrayBuffer(file);
  e.target.value = ''; // reset so same file can be picked again
};

window.testCustomSound = () => {
  playAlarmSound();
};

window.clearCustomSound = () => {
  _customSoundBuffer = null;
  _customSoundB64 = null;
  _soundPreset = 'beep';
  LS.s('air_sound_preset', 'beep');
  localStorage.removeItem('air_custom_sound_b64');
  localStorage.removeItem('air_custom_sound_name');
  const nameEl = ge('custom-sound-name'); if(nameEl) nameEl.textContent = 'Sound Choose Karo';
  ge('test-sound-btn') && (ge('test-sound-btn').style.display = 'none');
  ge('clear-sound-btn') && (ge('clear-sound-btn').style.display = 'none');
  document.querySelectorAll('.sound-preset-btn').forEach(b => b.classList.remove('on'));
  const bb = ge('spbtn-beep'); if(bb) bb.classList.add('on');
  showToast('🔔 Default beep restore ho gaya', 1500);
};

window.selectSoundPreset = (preset, el) => {
  document.querySelectorAll('.sound-preset-btn').forEach(b => b.classList.remove('on'));
  if(el) el.classList.add('on');
  if(preset === 'beep') {
    _soundPreset = 'beep';
    LS.s('air_sound_preset', 'beep');
    showToast('🔔 Default beep selected', 1200);
  } else {
    pickCustomSound();
  }
};

// Track currently playing alarm source so we can stop it
let _alarmSourceNode = null;

// Stop alarm sound (called when user dismisses alert)
function stopAlarmSound() {
  if(_alarmSourceNode) {
    try { _alarmSourceNode.stop(); } catch(e) {}
    _alarmSourceNode = null;
  }
}
window.stopAlarmSound = stopAlarmSound;

// Main function called when timer ends
function playAlarmSound() {
  stopAlarmSound(); // stop any previous
  if(_soundPreset === 'custom' && _customSoundBuffer) {
    try {
      const ctx = getAudioCtx(); if(!ctx) { playBeep('done'); return; }
      if(ctx.state === 'suspended') ctx.resume();
      const src = ctx.createBufferSource();
      src.buffer = _customSoundBuffer;
      src.connect(ctx.destination);
      src.start(0);
      _alarmSourceNode = src;
      // Auto-stop after sound duration
      src.onended = () => { _alarmSourceNode = null; };
    } catch(e) { playBeep('done'); }
  } else {
    playBeep('done');
  }
}

// ─── BACKUP & RESTORE ────────────────────────
window.exportBackup=()=>{
  try{
    const data={
      version:2,
      exportedAt:new Date().toISOString(),
      prepData:{
        tasks:       LS.g('jee2_tasks',[]),
        backlog:     LS.g('jee2_backlog',[]),
        notes:       LS.g('jee2_notes',[]),
        formulas:    LS.g('jee2_formulas',[]),
        mocks:       LS.g('jee2_mocks',[]),
        revision:    LS.g('jee2_revision',[]),
        streak:      LS.g('jee2_streak',{days:[],count:0}),
        scores:      LS.g('jee2_scores',{p:null,c:null,m:null}),
        chapters:    LS.g('jee2_chapters',{}),
        profile:     LS.g('air_profile',{}),
        compHistory: LS.g('jee2_comp_history',[]),
      },
      testData:{
        bank:     LS.g('jte_bank',[]),
        attempts: LS.g('jte_attempts',[]),
      }
    };
    const customs={};
    try{
      Object.values(getActiveChapters()).forEach(arr=>arr.forEach(ch=>{
        const c=LS.g('jee2_custom_'+ch.id,null);
        if(c)customs[ch.id]=c;
      }));
    }catch(e){}
    data.customSubtopics=customs;
    const cc=LS.g('jee2_custom_chapters',null);
    if(cc)data.customChapters=cc;

    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download='AIRHunter_Backup_'+new Date().toISOString().split('T')[0]+'.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{document.body.removeChild(a);URL.revokeObjectURL(url);},200);
    showToast('✅ Backup export ho gaya!',2000);
  }catch(err){
    showToast('❌ Export failed: '+err.message,3000);
    console.error('exportBackup error:',err);
  }
}

window.importBackup=(e)=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=(ev)=>{
    try{
      const data=JSON.parse(ev.target.result);
      if(!data.version||!data.prepData){alert('❌ Invalid backup file!');return}
      customConfirm('Ye restore kar dega aur current data replace ho jayega. Pakka?', () => {
        const p=data.prepData;
        if(p.tasks)    LS.s('jee2_tasks',p.tasks);
        if(p.backlog)  LS.s('jee2_backlog',p.backlog);
        if(p.notes)    LS.s('jee2_notes',p.notes);
        if(p.formulas) LS.s('jee2_formulas',p.formulas);
        if(p.mocks)    LS.s('jee2_mocks',p.mocks);
        if(p.revision) LS.s('jee2_revision',p.revision);
        if(p.streak)   LS.s('jee2_streak',p.streak);
        if(p.scores)   LS.s('jee2_scores',p.scores);
        if(p.chapters) LS.s('jee2_chapters',p.chapters);
        const t=data.testData;
        if(t){
          if(t.bank)     LS.s('jte_bank',t.bank);
          if(t.attempts) LS.s('jte_attempts',t.attempts);
        }
        if(data.customSubtopics){
          Object.entries(data.customSubtopics).forEach(([id,subs])=>LS.s('jee2_custom_'+id,subs));
        }
        alert('✅ Data restore ho gaya! App reload ho raha hai...');
        location.reload();
      }, { icon:'📤', title:_t('restore_title'), okLabel:_t('restore_ok') });
    }catch(err){alert('❌ File read error: '+err.message);}
  };
  reader.readAsText(file);
  e.target.value='';
}

window.exportPDF=()=>{
  const scores=LS.g('jee2_scores',{p:null,c:null,m:null});
  const tasks=LS.g('jee2_tasks',[]);
  const backlog=LS.g('jee2_backlog',[]);
  const notes=LS.g('jee2_notes',[]);
  const formulas=LS.g('jee2_formulas',[]);
  const mocks=LS.g('jee2_mocks',[]);
  const streak=LS.g('jee2_streak',{days:[],count:0});
  const chapData=LS.g('jee2_chapters',{});
  const testAttempts=LS.g('jte_attempts',[]);

  // Compute chapter progress
  const chapProgress=[];
  Object.values(getActiveChapters()).forEach(arr=>arr.forEach(ch=>{
    const cd=chapData[ch.id];
    if(!cd||!cd.subtopics)return;
    const total=ch.subtopics.length;
    const done=ch.subtopics.filter(s=>cd.subtopics[s]).length;
    if(done>0)chapProgress.push({name:ch.name,done,total,pct:Math.round(done/total*100)});
  }));

  const now=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>AIR Hunter — Backup Report</title>
  <style>
    body{font-family:'Segoe UI',sans-serif;background:#fff;color:#111;padding:32px;max-width:800px;margin:0 auto;font-size:14px}
    h1{font-size:26px;font-weight:900;color:#4f8aff;margin-bottom:2px}
    .sub{font-size:12px;color:#888;margin-bottom:28px}
    h2{font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#4f8aff;border-bottom:2px solid #e8ecff;padding-bottom:6px;margin:24px 0 12px}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:8px}
    .stat{background:#f5f7ff;border-radius:10px;padding:12px 14px;border-left:3px solid #4f8aff}
    .stat-lbl{font-size:10px;letter-spacing:1px;color:#888;text-transform:uppercase}
    .stat-val{font-size:22px;font-weight:800;color:#4f8aff;margin-top:2px}
    table{width:100%;border-collapse:collapse;margin-bottom:8px}
    th{background:#f5f7ff;font-size:11px;letter-spacing:1px;color:#888;text-transform:uppercase;padding:8px 10px;text-align:left}
    td{padding:8px 10px;border-bottom:1px solid #f0f0f0;font-size:13px}
    tr:last-child td{border-bottom:none}
    .badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700}
    .badge-high{background:#ffe0e6;color:#e03555}
    .badge-med{background:#fff5cc;color:#b38a00}
    .badge-low{background:#d4f7ee;color:#008060}
    .badge-p{background:#e8ecff;color:#4f8aff}
    .badge-g{background:#d4f7ee;color:#008060}
    .badge-r{background:#ffe0e6;color:#e03555}
    .note-box{background:#f9f9ff;border-left:3px solid #4f8aff;padding:10px 12px;margin-bottom:8px;border-radius:0 8px 8px 0}
    .note-title{font-weight:700;font-size:13px;margin-bottom:3px}
    .note-body{font-size:12px;color:#555;line-height:1.6}
    .prog-bar{background:#eee;border-radius:4px;height:6px;width:100%;margin-top:4px}
    .prog-fill{background:#4f8aff;height:6px;border-radius:4px}
    @media print{body{padding:16px}}
  </style></head><body>
  <h1>🎯 AIR Hunter</h1>
  <div class="sub">Backup Report · Generated on ${now}</div>

  <h2>📊 Subject Accuracy</h2>
  <div class="grid">
    <div class="stat"><div class="stat-lbl">Physics</div><div class="stat-val" style="color:#4f8aff">${scores.p!==null?scores.p+'%':'—'}</div></div>
    <div class="stat"><div class="stat-lbl">Chemistry</div><div class="stat-val" style="color:#00c48c">${scores.c!==null?scores.c+'%':'—'}</div></div>
    <div class="stat"><div class="stat-lbl">Maths</div><div class="stat-val" style="color:#ff4f6d">${scores.m!==null?scores.m+'%':'—'}</div></div>
    <div class="stat"><div class="stat-lbl">Streak</div><div class="stat-val" style="color:#ffb800">${streak.count}🔥</div></div>
  </div>

  ${chapProgress.length?`<h2>📐 Chapter Progress</h2>
  <table><thead><tr><th>Chapter</th><th>Progress</th><th>Done</th></tr></thead><tbody>
  ${chapProgress.map(c=>`<tr><td>${c.name}</td><td><div class="prog-bar"><div class="prog-fill" style="width:${c.pct}%"></div></div><span style="font-size:11px;color:#888">${c.pct}%</span></td><td>${c.done}/${c.total}</td></tr>`).join('')}
  </tbody></table>`:''}

  ${tasks.length?`<h2>✅ Today's Tasks (${tasks.filter(t=>t.done).length}/${tasks.length} done)</h2>
  <table><thead><tr><th>Task</th><th>Subject</th><th>Status</th></tr></thead><tbody>
  ${tasks.map(t=>`<tr><td>${t.name}</td><td>${t.subj}</td><td>${t.done?'✅ Done':'⏳ Pending'}</td></tr>`).join('')}
  </tbody></table>`:''}

  ${backlog.length?`<h2>🗂 Backlog (${backlog.length} items)</h2>
  <table><thead><tr><th>Topic</th><th>Subject</th><th>Priority</th></tr></thead><tbody>
  ${backlog.map(b=>`<tr><td>${b.topic}</td><td>${b.subj}</td><td><span class="badge badge-${b.prio}">${b.prio.toUpperCase()}</span></td></tr>`).join('')}
  </tbody></table>`:''}

  ${formulas.length?`<h2>∑ Formulas (${formulas.length})</h2>
  <table><thead><tr><th>Subject</th><th>Name</th><th>Formula</th></tr></thead><tbody>
  ${formulas.map(f=>`<tr><td><span class="badge badge-${f.subj}">${{p:'Physics',g:'Chemistry',r:'Maths'}[f.subj]}</span></td><td>${f.name}</td><td><b>${f.eq}</b></td></tr>`).join('')}
  </tbody></table>`:''}

  ${notes.length?`<h2>📋 Notes (${notes.length})</h2>
  ${notes.map(n=>`<div class="note-box"><div class="note-title">${n.title} <span class="badge badge-${n.subj}" style="margin-left:6px">${{p:'Physics',g:'Chemistry',r:'Maths'}[n.subj]}</span></div><div class="note-body">${n.body||'—'}</div></div>`).join('')}`:''}

  ${mocks.length?`<h2>🎯 Mock Test Scores (${mocks.length})</h2>
  <table><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>%</th></tr></thead><tbody>
  ${[...mocks].sort((a,b)=>b.date.localeCompare(a.date)).map(m=>`<tr><td>${m.name}</td><td>${m.date}</td><td>${m.score}/${m.total}</td><td>${Math.round(m.score/m.total*100)}%</td></tr>`).join('')}
  </tbody></table>`:''}

  ${testAttempts.length?`<h2>📊 Test Engine History (${testAttempts.length} attempts)</h2>
  <table><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Correct</th><th>Wrong</th><th>%</th></tr></thead><tbody>
  ${[...testAttempts].reverse().map(a=>`<tr><td>${a.testName}</td><td>${a.date}</td><td>${a.score}</td><td style="color:#00a876">${a.correct}✓</td><td style="color:#e03555">${a.wrong}✗</td><td>${Math.round(a.correct/a.total*100)}%</td></tr>`).join('')}
  </tbody></table>`:''}

  <div style="margin-top:32px;font-size:11px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:12px">
    AIR Hunter — Backup generated on ${now} · Keep grinding! 💪
  </div>
  </body></html>`;

  const blob=new Blob([html],{type:'text/html'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='JEE_Mission2027_Report_'+new Date().toISOString().split('T')[0]+'.html';
  a.click();URL.revokeObjectURL(url);
}


// ─── QUICK TEST ──────────────────────────────
let qtParsedQ = [];
let qtTimerMins = 30;

window.copyQtTemplate = () => {
  const t = `[
  {
    "q": "A body starts from rest with acceleration 2 m/s². Distance in 5s?",
    "options": { "1": "10 m", "2": "20 m", "3": "25 m", "4": "50 m" },
    "answer": 3
  }
]`;
  navigator.clipboard.writeText(t)
    .then(() => alert('✅ Template copy ho gaya!'))
    .catch(() => alert('Manually copy karo:\n' + t));
};

window.clearQtJson = () => {
  ge('qt-json-inp').value = '';
  qtParsedQ = [];
  ge('qt-status').style.display = 'none';
  const btn = ge('qt-start-btn');
  btn.style.opacity = '.4'; btn.style.pointerEvents = 'none';
  ge('qt-q-count').textContent = '';
};

window.qtJsonPreview = () => {
  const raw = ge('qt-json-inp').value.trim();
  const statusEl = ge('qt-status');
  const btn = ge('qt-start-btn');
  const countEl = ge('qt-q-count');
  qtParsedQ = [];
  btn.style.opacity = '.4'; btn.style.pointerEvents = 'none';
  countEl.textContent = '';
  if (!raw) { statusEl.style.display = 'none'; return; }
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error('JSON ek array hona chahiye: [...]');
    const valid = []; const errors = [];
    arr.forEach((q, i) => {
      const n = i + 1;
      const text = q.q || q.text;
      if (!text)    { errors.push(`Q${n}: "q" field missing`); return; }
      if (!q.chapter) { errors.push(`Q${n}: "chapter" missing`); return; }
      if (!['p','g','r'].includes(q.subj)) { errors.push(`Q${n}: subj must be "p","g","r"`); return; }
      const a = q.a||q.optA, b = q.b||q.optB, c = q.c||q.optC, d = q.d||q.optD;
      if (!a||!b||!c||!d) { errors.push(`Q${n}: options a,b,c,d missing`); return; }
      const ans = q.ans !== undefined ? parseInt(q.ans) : (q.correct !== undefined ? parseInt(q.correct) : -1);
      if (ans < 0 || ans > 3) { errors.push(`Q${n}: "ans" 0-3 hona chahiye`); return; }
      valid.push({ id: uid(), subj: q.subj, chapter: q.chapter.trim(),
        text: text.trim(), options: [a,b,c,d], correct: ans,
        explanation: (q.exp || q.explanation || '').trim() });
    });
    if (errors.length) {
      statusEl.innerHTML = '<b>⚠ Kuch errors:</b> ' + errors.slice(0,3).join(' | ') + (errors.length > 3 ? ` +${errors.length-3} aur` : '');
      statusEl.style.cssText = 'display:block;background:rgba(255,79,109,.1);border:1px solid rgba(255,79,109,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:11px;font-family:var(--fm);color:var(--ar)';
    }
    if (valid.length) {
      qtParsedQ = valid;
      if (!errors.length) {
        statusEl.innerHTML = `✅ ${valid.length} questions ready — ab test shuru karo!`;
        statusEl.style.cssText = 'display:block;background:rgba(0,196,140,.1);border:1px solid rgba(0,196,140,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:12px;font-family:var(--fm);color:var(--ag)';
      }
      btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
      countEl.textContent = valid.length + ' questions • ' + qtTimerMins + ' min timer';
    } else {
      statusEl.style.display = 'block';
    }
  } catch(err) {
    statusEl.innerHTML = '❌ JSON error: ' + err.message;
    statusEl.style.cssText = 'display:block;background:rgba(255,79,109,.1);border:1px solid rgba(255,79,109,.3);border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:11px;font-family:var(--fm);color:var(--ar)';
  }
};

function qtSelectTimer(m) {
  qtTimerMins = m;
  document.querySelectorAll('[id^="qtopt-"]').forEach(el => el.classList.remove('on'));
  const el = ge('qtopt-' + m); if (el) el.classList.add('on');
  if (qtParsedQ.length) ge('qt-q-count').textContent = qtParsedQ.length + ' questions • ' + m + ' min timer';
}
window.qtSelectTimer = qtSelectTimer;

window.qtSetCustomTimer = () => {
  const v = parseInt(ge('qt-custom-timer').value);
  if (!v || v < 1) return;
  qtTimerMins = v;
  document.querySelectorAll('[id^="qtopt-"]').forEach(el => el.classList.remove('on'));
  if (qtParsedQ.length) ge('qt-q-count').textContent = qtParsedQ.length + ' questions • ' + v + ' min timer';
};

window.startQuickTest = () => {
  if (!qtParsedQ.length) { alert('Pehle valid JSON paste karo!'); return; }
  // shuffle questions
  const qs = [...qtParsedQ].sort(() => Math.random() - .5);
  // reuse existing test engine — just set T directly, don't touch bank
  T.qs = qs; T.idx = 0; T.answers = {}; T.marked = {};
  T.timerSecs = qtTimerMins * 60; T.startTime = Date.now();
  T.subj = qs[0]?.subj || 'p';
  T.chapters = [...new Set(qs.map(q => q.chapter))];
  T.timerMins = qtTimerMins;
  T.testName = '⚡ Quick Test — ' + T.chapters.slice(0,2).join(', ') + (T.chapters.length > 2 ? '...' : '');
  // hide nav, show full screen test
  ge('main-header').style.display = 'none';
  document.querySelector('.bnav').style.display = 'none';
  document.body.style.paddingBottom = '0';
  ge('page-testactive').classList.add('on');
  renderTestQ(); startTestTimer();
};

window.clearAllData=()=>{
  customConfirm(_t('clear_data_msg'), () => {
    ['jee2_tasks','jee2_backlog','jee2_notes','jee2_formulas','jee2_mocks','jee2_revision',
     'jee2_streak','jee2_scores','jee2_chapters','jee2_comp_history','air_profile',
     'air_profile_complete','air_achievements',
     'jte_attempts','jte_bank'].forEach(k=>localStorage.removeItem(k));
    Object.keys(localStorage).forEach(k=>{
      if(k.startsWith('jee2_studymins_')||k.startsWith('jee2_pomos_')||k.startsWith('jee2_custom_'))
        localStorage.removeItem(k);
    });
    location.reload();
  }, { icon:'🗑', title:_t('clear_data_title'), okLabel:_t('clear_data_ok') });
}

// ─── LOAD CUSTOM SUBTOPICS ───────────────────
function loadCustomSubtopics(){
  const ch = getActiveChapters();
  Object.values(ch).forEach(arr=>arr.forEach(ch=>{const custom=LS.g('jee2_custom_'+ch.id,null);if(custom&&Array.isArray(custom))ch.subtopics=custom;}));
}

// ─── PROFILE PAGE ────────────────────────────
// ─── ACHIEVEMENTS DEFINITIONS ────────────────
// difficulty: 'easy' | 'medium' | 'hard'
const ACHIEVEMENTS = [
  // ── EASY (20 badges) ──
  { id:'rookie_hunter',   icon:'🆕', name:'Rookie Hunter',   desc:'Name aur Goal profile mein save kiya',        difficulty:'easy', check:()=>{ const p=PROFILE.get(); return !!(p.name&&p.name!=='Student'&&p.dailyGoal); } },
  { id:'first_blood',     icon:'🩸', name:'First Blood',     desc:'Pehla subtopic checkbox tick kiya',            difficulty:'easy', check:()=>Object.values(ST.chapters).some(ch=>ch.subtopics&&Object.values(ch.subtopics).some(v=>v)) },
  { id:'the_initiate',    icon:'📜', name:'The Initiate',    desc:'Pehli baar kisi chapter ko khola',              difficulty:'easy', check:()=>!!LS.g('air_initiate_done',false) },
  { id:'early_bird',      icon:'🌅', name:'Early Bird',      desc:'Subah 4–7 AM ke beech app use kiya (track hoga)',            difficulty:'easy', check:()=>!!LS.g('air_early_bird_done',false) },
  { id:'night_owl',       icon:'🦉', name:'Night Owl',       desc:'Raat 11 PM – 2 AM ke beech app use kiya (track hoga)',       difficulty:'easy', check:()=>!!LS.g('air_night_owl_done',false) },
  { id:'streak3',         icon:'🔥', name:'Streak Starter',  desc:'Lagatar 3 din app use kiya',                  difficulty:'easy', check:()=>ST.streak.count>=3 },
  { id:'theme_explorer',  icon:'🎨', name:'Theme Explorer',  desc:'Dark/Light mode change kiya',                 difficulty:'easy', check:()=>!!LS.g('air_theme_changed',false) },
  { id:'target_locked',   icon:'🎯', name:'Target Locked',   desc:'Pehla Custom Subtopic add kiya',              difficulty:'easy', check:()=>!!LS.g('air_custom_sub_added',false) },
  { id:'first_victory',   icon:'🏆', name:'First Victory',   desc:'Kisi ek chapter ke saare subtopics complete', difficulty:'easy', check:()=>{ const ac=getActiveChapters(); return Object.values(ac).some(list=>list.some(ch=>{ const cd=ST.chapters[ch.id]; if(!cd||!ch.subtopics||!ch.subtopics.length)return false; return ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]); })); } },
  { id:'comms_online',    icon:'🔔', name:'Comms Online',    desc:'Notifications enable ki',                     difficulty:'easy', check:()=>{ const s=LS.g('air_notif_settings',null); return !!(s&&(s.study||s.streak)); } },
  { id:'weekend_warrior', icon:'⚔️', name:'Weekend Warrior', desc:'Saturday aur Sunday dono din padhai ki',      difficulty:'easy', check:()=>{ const days=ST.streak.days||[]; return days.some(d=>new Date(d).getDay()===6)&&days.some(d=>new Date(d).getDay()===0); } },
  { id:'scout',           icon:'🔍', name:'Scout',           desc:'Help/FAQ section khola',                      difficulty:'easy', check:()=>!!LS.g('air_help_opened',false) },
  { id:'quick_kill',      icon:'⚡', name:'Quick Kill',      desc:'Ek din mein 5 subtopics finish kiye',          difficulty:'easy', check:()=>{ const today=new Date().toISOString().slice(0,10); return (LS.g('jee2_comp_history',[])).filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today)).length>=5; } },
  { id:'steady_aim',      icon:'🏹', name:'Steady Aim',      desc:'Lagatar 5 din 1+ topic complete kiya',        difficulty:'easy', check:()=>{ const days=[...new Set((LS.g('jee2_comp_history',[])).filter(h=>h.type==='subtopic'&&h.completedAt).map(h=>h.completedAt.slice(0,10)))].sort(); if(days.length<5)return false; let s=1; for(let i=days.length-1;i>0;i--){ if((new Date(days[i])-new Date(days[i-1]))/86400000===1)s++;else break; } return s>=5; } },
  { id:'minor_threat',    icon:'⚠️', name:'Minor Threat',    desc:'Total 10 subtopics complete kiye',            difficulty:'easy', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=10 },
  { id:'warming_up',      icon:'♨️', name:'Warming Up',      desc:'Total 25 subtopics complete kiye',            difficulty:'easy', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=25 },
  { id:'half_century',    icon:'💯', name:'Half-Century',    desc:'Total 50 subtopics complete kiye',            difficulty:'easy', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=50 },
  { id:'planner',         icon:'📅', name:'Planner',         desc:'3 alag subjects ke topics touch kiye',        difficulty:'easy', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).filter(s=>ac[s].some(ch=>{ const cd=ST.chapters[ch.id]; return cd&&cd.subtopics&&Object.values(cd.subtopics).some(v=>v); })).length>=3; } },
  { id:'deep_focus',      icon:'🧘', name:'Deep Focus',      desc:'Bina close kiye 1 ghante tak app open raha',  difficulty:'easy', check:()=>!!LS.g('air_deep_focus',false) },
  { id:'first_milestone', icon:'🚩', name:'First Milestone', desc:'App install kiye 7 din pure hue',             difficulty:'easy', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; return (Date.now()-new Date(inst).getTime())>=7*24*3600*1000; } },

  // ── MEDIUM (40 badges) ──
  // --- original 6 kept ---
  { id:'streak7',        icon:'💎', name:'Diamond Week',     desc:'7 din streak',                             difficulty:'medium', check:()=>ST.streak.count>=7 },
  { id:'tests5',         icon:'⚔️', name:'Battle Ready',     desc:'5 tests complete',                         difficulty:'medium', check:()=>attempts.length>=5 },
  { id:'tasks10',        icon:'✅', name:'Task Master',      desc:'10 tasks complete',                        difficulty:'medium', check:()=>ST.tasks.filter(t=>t.done).length>=10 },
  { id:'formula10',      icon:'∑',  name:'Formula King',     desc:'10 formulas add ki',                       difficulty:'medium', check:()=>ST.formulas.length>=10 },
  { id:'mock5',          icon:'🏆', name:'Mock Champion',    desc:'5 mock tests diye',                        difficulty:'medium', check:()=>ST.mocks.length>=5 },
  { id:'accuracy80',     icon:'🎯', name:"Bull's Eye",       desc:'Kisi subject mein 80%+',                   difficulty:'medium', check:()=>Object.values(ST.scores).some(v=>v>=80) },
  // --- 40 new ---
  { id:'week_warrior',      icon:'📅', name:'Week Warrior',        desc:'7 alag dino mein subtopics complete kiye',                     difficulty:'medium', check:()=>{ const days=[...new Set((LS.g('jee2_comp_history',[])).filter(h=>h.type==='subtopic'&&h.completedAt).map(h=>h.completedAt.slice(0,10)))]; return days.length>=7; } },
  { id:'subj_specialist',   icon:'📚', name:'Subject Specialist',  desc:'Kisi ek subject ke 50% chapters poore kiye',                   difficulty:'medium', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).some(s=>{ const list=ac[s]; const done=list.filter(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); }); return done.length>=Math.ceil(list.length*0.5); }); } },
  { id:'midnight_marauder', icon:'🌑', name:'Midnight Marauder',   desc:'3 din lagataar raat 12-3 baje padhai ki',                      difficulty:'medium', check:()=>{ const h=LS.g('air_midnight_days',[]); return h.length>=3; } },
  { id:'early_predator',    icon:'🦅', name:'Early Predator',      desc:'5 din lagataar subah 5 AM se pehle session shuru kiya',        difficulty:'medium', check:()=>{ const h=LS.g('air_early_days',[]); return h.length>=5; } },
  { id:'double_digit',      icon:'🔢', name:'Double Digit',        desc:'Ek din mein 10 subtopics complete kiye',                       difficulty:'medium', check:()=>{ const today=new Date().toISOString().slice(0,10); return (LS.g('jee2_comp_history',[])).filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today)).length>=10; } },
  { id:'the_grinder',       icon:'⚙️', name:'The Grinder',         desc:'Total 100 subtopics mark kiye',                                difficulty:'medium', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=100 },
  { id:'no_days_off',       icon:'🚫', name:'No Days Off',         desc:'Lagatar 14 din progress update kiya',                          difficulty:'medium', check:()=>ST.streak.count>=14 },
  { id:'diverse_hunter',    icon:'🌈', name:'Diverse Hunter',      desc:'Ek din mein 3 alag subjects ke topics padhe',                  difficulty:'medium', check:()=>{ const today=new Date().toISOString().slice(0,10); const hist=LS.g('jee2_comp_history',[]); const subjs=new Set(hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today)).map(h=>h.subj)); return subjs.size>=3; } },
  { id:'custom_king',       icon:'👑', name:'Custom King',         desc:'10+ custom subtopics add aur complete kiye',                   difficulty:'medium', check:()=>!!LS.g('air_custom_king',false) },
  { id:'notif_ninja',       icon:'🥷', name:'Notification Ninja',  desc:'Notification ke 15 min ke andar app khola',                    difficulty:'medium', check:()=>!!LS.g('air_notif_ninja',false) },
  { id:'halfway_hero',      icon:'🏅', name:'Half-Way Hero',       desc:'Total default syllabus ka 50% khatam kiya',                    difficulty:'medium', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.5; } },
  { id:'weekend_zealot',    icon:'🔥', name:'Weekend Zealot',      desc:'Lagatar 4 weekends (Sat-Sun) padhai ki',                       difficulty:'medium', check:()=>!!LS.g('air_weekend_zealot',false) },
  { id:'chap_conqueror',    icon:'🚩', name:'Chapter Conqueror',   desc:'Total 5 full chapters complete kiye',                          difficulty:'medium', check:()=>{ const ac=getActiveChapters(); let done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ const cd=ST.chapters[ch.id]; if(cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]))done++; })); return done>=5; } },
  { id:'focus_master',      icon:'🧠', name:'Focus Master',        desc:'App open rakh kar 3 ghante continuous tracking',               difficulty:'medium', check:()=>!!LS.g('air_focus_master',false) },
  { id:'consistent_aim',    icon:'🎯', name:'Consistent Aim',      desc:'10 din mein roz 2+ subtopics complete kiye',                   difficulty:'medium', check:()=>!!LS.g('air_consistent_aim',false) },
  { id:'the_explorer',      icon:'🗺️', name:'The Explorer',        desc:'App ke saare pages visit kiye',                                difficulty:'medium', check:()=>!!LS.g('air_explorer_done',false) },
  { id:'restless_hunter',   icon:'🏃', name:'Restless Hunter',     desc:'Total 5 alag chapters visit kiye',                             difficulty:'medium', check:()=>!!LS.g('air_restless_hunter',false) },
  { id:'scholars_spirit',   icon:'📖', name:"Scholar's Spirit",    desc:'Ek subject ko lagatar 3 din focus kiya',                       difficulty:'medium', check:()=>!!LS.g('air_scholars_spirit',false) },
  { id:'power_hour',        icon:'⚡', name:'Power Hour',          desc:'Ek ghante mein 5 subtopics complete kiye',                     difficulty:'medium', check:()=>!!LS.g('air_power_hour',false) },
  { id:'monthly_milestone', icon:'🗓️', name:'Monthly Milestone',   desc:'App use karte hue 30 din poore hue',                           difficulty:'medium', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; return (Date.now()-new Date(inst).getTime())>=30*24*3600*1000; } },
  { id:'social_scout',      icon:'🤝', name:'Social Scout',        desc:'Profile mein email aur phone dono save kiye',                  difficulty:'medium', check:()=>{ const p=PROFILE.get(); return !!(p.email&&p.phone); } },
  { id:'the_architect',     icon:'🏗️', name:'The Architect',       desc:'Har subject mein 1+ custom subtopic add kiya',                 difficulty:'medium', check:()=>!!LS.g('air_architect',false) },
  { id:'resilient_hunter',  icon:'💪', name:'Resilient Hunter',    desc:'Gap ke baad wapas 3-day streak banayi',                        difficulty:'medium', check:()=>!!LS.g('air_resilient_hunter',false) },
  { id:'fast_learner',      icon:'🏎️', name:'Fast Learner',        desc:'Ek chapter 24 ghante mein khatam kiya',                        difficulty:'medium', check:()=>!!LS.g('air_fast_learner',false) },
  { id:'subj_sultan',       icon:'🏰', name:'Subject Sultan',      desc:'Do subjects ka 50% syllabus poora kiya',                       difficulty:'medium', check:()=>{ const ac=getActiveChapters(); let count=0; Object.keys(ac).forEach(s=>{ const list=ac[s]; const done=list.filter(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); }); if(done.length>=Math.ceil(list.length*0.5))count++; }); return count>=2; } },
  { id:'night_watchman',    icon:'🔦', name:'Night Watchman',      desc:'Lagatar 5 raaton 11 PM ke baad padhai ki',                     difficulty:'medium', check:()=>{ const h=LS.g('air_night_days',[]); return h.length>=5; } },
  { id:'sun_chaser',        icon:'☀️', name:'Sun Chaser',          desc:'Lagatar 5 subah 6 AM se pehle padhai ki',                      difficulty:'medium', check:()=>{ const h=LS.g('air_dawn_days',[]); return h.length>=5; } },
  { id:'efficiency_expert', icon:'📊', name:'Efficiency Expert',   desc:'Ek week mein 30+ subtopics complete kiye',                     difficulty:'medium', check:()=>!!LS.g('air_efficiency_expert',false) },
  { id:'unstoppable',       icon:'🌪️', name:'Unstoppable Force',   desc:'21 din ki continuous login streak',                            difficulty:'medium', check:()=>ST.streak.count>=21 },
  { id:'centurion',         icon:'💯', name:'Centurion Hunter',    desc:'Total 150 subtopics mark kiye',                                difficulty:'medium', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=150 },
  { id:'deep_diver',        icon:'🤿', name:'Deep Diver',          desc:'Ek session mein 1 full chapter complete kiya',                 difficulty:'medium', check:()=>!!LS.g('air_deep_diver',false) },
  { id:'the_strategist',    icon:'📝', name:'The Strategist',      desc:'Custom topics use karke schedule banaya',                      difficulty:'medium', check:()=>!!LS.g('air_custom_sub_added',false)&&Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=10 },
  { id:'holiday_hunter',    icon:'🏖️', name:'Holiday Hunter',      desc:'Public holiday ya festival ke din padhai ki',                  difficulty:'medium', check:()=>!!LS.g('air_holiday_hunter',false) },
  { id:'badge_collector',   icon:'🎖️', name:'Badge Collector',     desc:'Pehle 10 badges earn kiye',                                    difficulty:'medium', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.length>=10; } },
  { id:'knowledge_seeker',  icon:'🎓', name:'Knowledge Seeker',    desc:'Help section ke saare FAQs padhe',                             difficulty:'medium', check:()=>!!LS.g('air_faq_read',false) },
  { id:'steady_hand',       icon:'✍️', name:'Steady Hand',         desc:'15 din ki daily progress streak',                              difficulty:'medium', check:()=>ST.streak.count>=15 },
  { id:'the_finisher',      icon:'🏁', name:'The Finisher',        desc:'Ek poore subject ke saare default topics khatam kiye',         difficulty:'medium', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).some(s=>ac[s].every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); })); } },
  { id:'multi_tasker',      icon:'🔀', name:'Multi-Tasker',        desc:'Subtopics aur custom topics dono manage kiye',                 difficulty:'medium', check:()=>!!LS.g('air_custom_sub_added',false)&&Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=5 },
  { id:'loyal_hunter',      icon:'🐕', name:'Loyal Hunter',        desc:'Lagatar 45 din app par active raha',                           difficulty:'medium', check:()=>ST.streak.count>=45 },
  { id:'silver_rank',       icon:'🥈', name:'Silver Rank',         desc:'Total progress 60% cross ho gayi',                             difficulty:'medium', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.6; } },

  // ── HARD 🔴 (32 badges) ──
  { id:'tests20',          icon:'🏹', name:'Sharpshooter',      desc:'20 tests complete',                                          difficulty:'hard', check:()=>attempts.length>=20 },
  { id:'accuracy90',       icon:'🚀', name:'Genius Mode',       desc:'Kisi subject mein 90%+',                                     difficulty:'hard', check:()=>Object.values(ST.scores).some(v=>v>=90) },
  { id:'monthly_master',   icon:'📅', name:'Monthly Master',    desc:'30 din lagatar app active raha',                             difficulty:'hard', check:()=>ST.streak.count>=30 },
  { id:'subj_destroyer',   icon:'💥', name:'Subject Destroyer', desc:'Kisi ek subject ke saare default chapters 100% khatam',      difficulty:'hard', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).some(s=>ac[s].length>0&&ac[s].every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); })); } },
  { id:'club_500',         icon:'🏗️', name:'The 500 Club',      desc:'Total 500 subtopics complete kiye',                          difficulty:'hard', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=500 },
  { id:'midnight_legend',  icon:'🌌', name:'Midnight Legend',   desc:'Lagatar 7 raaton 12 AM - 3 AM padhai ki',                    difficulty:'hard', check:()=>{ const md=LS.g('air_midnight_days',[]); if(md.length<7)return false; const sorted=[...md].sort(); let s=1; for(let i=sorted.length-1;i>0;i--){ if((new Date(sorted[i])-new Date(sorted[i-1]))/86400000===1)s++;else break; } return s>=7; } },
  { id:'early_bird_king',  icon:'👑', name:'Early Bird King',   desc:'Lagatar 10 din subah 5 AM se pehle session shuru kiya',      difficulty:'hard', check:()=>{ const ed=LS.g('air_early_days',[]); if(ed.length<10)return false; const sorted=[...ed].sort(); let s=1; for(let i=sorted.length-1;i>0;i--){ if((new Date(sorted[i])-new Date(sorted[i-1]))/86400000===1)s++;else break; } return s>=10; } },
  { id:'perfect_week',     icon:'✅', name:'Perfect Week',      desc:'Mon-Sun har din 5+ topics finish kiye',                      difficulty:'hard', check:()=>!!LS.g('air_perfect_week',false) },
  { id:'no_mercy',         icon:'👺', name:'No Mercy',          desc:'Ek din mein 25+ subtopics complete kiye',                    difficulty:'hard', check:()=>{ const today=new Date().toISOString().slice(0,10); return (LS.g('jee2_comp_history',[])).filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today)).length>=25; } },
  { id:'syllabus_sniper',  icon:'🎯', name:'Syllabus Sniper',   desc:'Total progress 75% se upar gayi',                            difficulty:'hard', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.75; } },
  { id:'custom_architect', icon:'🛠️', name:'Custom Architect',  desc:'50+ custom subtopics add aur complete kiye',                 difficulty:'hard', check:()=>!!LS.g('air_custom_architect',false) },
  { id:'the_marathoner',   icon:'🏃', name:'The Marathoner',    desc:'Ek session mein 5 ghante app active raha',                   difficulty:'hard', check:()=>!!LS.g('air_marathoner',false) },
  { id:'consistent_beast', icon:'👹', name:'Consistent Beast',  desc:'Har din progress update ki (lagatar 45 din), bina ek bhi din chode',difficulty:'hard', check:()=>ST.streak.count>=45&&Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=200 },
  { id:'triple_threat',    icon:'🔱', name:'Triple Threat',     desc:'Ek din mein 3 subjects ke 3-3 chapters touch kiye',          difficulty:'hard', check:()=>!!LS.g('air_triple_threat',false) },
  { id:'weekend_god',      icon:'⚡', name:'Weekend God',       desc:'Lagatar 8 weekends Sat-Sun padhai ki',                       difficulty:'hard', check:()=>{ const ww=LS.g('air_ww_days',[]); const sats=ww.filter(d=>new Date(d).getDay()===6); const suns=ww.filter(d=>new Date(d).getDay()===0); return sats.length>=8&&suns.length>=8; } },
  { id:'chapter_chain',    icon:'🔗', name:'Chapter Chain',     desc:'Ek subject ke lagatar 5 chapters finish kiye',               difficulty:'hard', check:()=>!!LS.g('air_chapter_chain',false) },
  { id:'notif_ghost',      icon:'👻', name:'Notification Ghost',desc:'Ek hafte tak har notification ke 5 min mein app khola',      difficulty:'hard', check:()=>!!LS.g('air_notif_ghost',false) },
  { id:'knowledge_titan',  icon:'🏛️', name:'Knowledge Titan',   desc:'10 subjects ka syllabus start kiya (10%+ each)',             difficulty:'hard', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).filter(s=>{ return ac[s].some(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.some(st=>cd.subtopics&&cd.subtopics[st]); }); }).length>=3; } },
  { id:'unshakable_focus', icon:'💎', name:'Unshakable Focus',  desc:'1 poora hafta sirf ek subject par focus kiya',               difficulty:'hard', check:()=>!!LS.g('air_unshakable_focus',false) },
  { id:'speed_demon',      icon:'🏎️', name:'Speed Demon',       desc:'3 din ke andar 100 subtopics finish kiye',                   difficulty:'hard', check:()=>!!LS.g('air_speed_demon',false) },
  { id:'finisher_3',       icon:'🏁', name:'The Finisher',      desc:'3 subjects ka full syllabus 100% khatam kiya',               difficulty:'hard', check:()=>{ const ac=getActiveChapters(); let done=0; Object.keys(ac).forEach(s=>{ if(ac[s].length>0&&ac[s].every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); }))done++; }); return done>=3; } },
  { id:'veteran_status',   icon:'🎖️', name:'Veteran Status',    desc:'App install kiye 90 din (3 mahine) poore hue',               difficulty:'hard', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; return (Date.now()-new Date(inst).getTime())>=90*24*3600*1000; } },
  { id:'gold_rank',        icon:'🥇', name:'Gold Rank',         desc:'Total progress 90% cross ho gayi',                           difficulty:'hard', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.9; } },
  { id:'social_silence',   icon:'🔇', name:'Social Silence',    desc:'10 din lagatar app par focused raha',                        difficulty:'hard', check:()=>ST.streak.count>=10 },
  { id:'theme_master',     icon:'🎭', name:'Theme Master',      desc:'Theme change karke 1+ ghanta padhai ki',                     difficulty:'hard', check:()=>!!LS.g('air_theme_changed',false)&&LS.g('air_deep_focus',false) },
  { id:'planner_pro',      icon:'📝', name:'The Planner Pro',   desc:'100+ custom tasks schedule aur complete kiye',               difficulty:'hard', check:()=>ST.tasks.filter(t=>t.done).length>=100 },
  { id:'exam_ready',       icon:'✍️', name:'Exam Ready',        desc:'Saare high-weightage chapters complete kiye',                 difficulty:'hard', check:()=>!!LS.g('air_exam_ready',false) },
  { id:'grinder_elite',    icon:'⚙️', name:'The Grinder Elite', desc:'Total 1000 subtopics mark kiye',                             difficulty:'hard', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=1000 },
  { id:'sunday_sniper',    icon:'🎯', name:'Sunday Sniper',     desc:'Sunday ko 10+ ghante study time track kiya',                 difficulty:'hard', check:()=>!!LS.g('air_sunday_sniper',false) },
  { id:'night_crawler',    icon:'🕷️', name:'Night Crawler',     desc:'7 din sirf raat 11 PM-4 AM padhai ki',                       difficulty:'hard', check:()=>{ const nd=LS.g('air_night_days',[]); if(nd.length<7)return false; const sorted=[...nd].sort(); let s=1; for(let i=sorted.length-1;i>0;i--){ if((new Date(sorted[i])-new Date(sorted[i-1]))/86400000===1)s++;else break; } return s>=7; } },
  { id:'morning_monk',     icon:'🧘', name:'Morning Monk',      desc:'7 din sirf subah 4-9 AM padhai ki',                          difficulty:'hard', check:()=>{ const dd=LS.g('air_dawn_days',[]); if(dd.length<7)return false; const sorted=[...dd].sort(); let s=1; for(let i=sorted.length-1;i>0;i--){ if((new Date(sorted[i])-new Date(sorted[i-1]))/86400000===1)s++;else break; } return s>=7; } },
  { id:'hardcore_hunter',  icon:'🔥', name:'Hardcore Hunter',   desc:'50 badges earn karne ke baad unlock hua',                    difficulty:'hard', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.length>=50; } },

  // ── ELITE 🟣 (32 badges) ──
  { id:'streak30',          icon:'👑', name:'Legend',               desc:'30 din streak',                                           difficulty:'elite', check:()=>ST.streak.count>=30 },
  { id:'allsubj',           icon:'⚗️', name:'All Rounder',          desc:'Teeno subjects mein score',                               difficulty:'elite', check:()=>ST.scores.p!==null&&ST.scores.c!==null&&ST.scores.m!==null },
  { id:'the_executioner',   icon:'🪓', name:'The Executioner',      desc:'Ek hafte mein 50+ subtopics complete kiye',               difficulty:'elite', check:()=>!!LS.g('air_executioner',false) },
  { id:'atomic_habit',      icon:'⚛️', name:'Atomic Habit',         desc:'60 din lagatar 1+ topic mark kiya',                       difficulty:'elite', check:()=>ST.streak.count>=60 },
  { id:'subj_commander',    icon:'🎖️', name:'Subject Commander',    desc:'5 subjects ka 100% syllabus finish kiya',                 difficulty:'elite', check:()=>{ const ac=getActiveChapters(); let done=0; Object.keys(ac).forEach(s=>{ if(ac[s].length>0&&ac[s].every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); }))done++; }); return done>=5; } },
  { id:'deep_work_elite',   icon:'🧘', name:'Deep Work Elite',      desc:'Ek din mein 8+ ghante active study time',                 difficulty:'elite', check:()=>!!LS.g('air_deep_work_elite',false) },
  { id:'comeback_kid',      icon:'🔄', name:'The Comeback Kid',     desc:'10 din gap ke baad 7 din ki streak banayi',               difficulty:'elite', check:()=>!!LS.g('air_comeback_kid',false) },
  { id:'custom_specialist', icon:'🛠️', name:'Custom Specialist',    desc:'150+ custom subtopics complete kiye',                     difficulty:'elite', check:()=>!!LS.g('air_custom_specialist',false) },
  { id:'notif_master',      icon:'📲', name:'Notification Master',  desc:'15 din lagatar study reminder par react kiya',            difficulty:'elite', check:()=>!!LS.g('air_notif_master',false) },
  { id:'night_owl_pro',     icon:'🦉', name:'Night Owl Pro',        desc:'15 raaton tak midnight sessions kiye',                    difficulty:'elite', check:()=>{ const md=LS.g('air_midnight_days',[]); if(md.length<15)return false; const s=[...md].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=15; } },
  { id:'morning_glory',     icon:'🌅', name:'Morning Glory',        desc:'15 din lagatar subah 5 AM se pehle padhai ki',            difficulty:'elite', check:()=>{ const ed=LS.g('air_early_days',[]); if(ed.length<15)return false; const s=[...ed].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=15; } },
  { id:'centurion_strat',   icon:'💯', name:'Centurion Strategist', desc:'App use karte hue 100 din poore hue',                     difficulty:'elite', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; return (Date.now()-new Date(inst).getTime())>=100*24*3600*1000; } },
  { id:'balanced_hunter',   icon:'⚖️', name:'Balanced Hunter',      desc:'Ek week mein saare subjects ke 2-2 topics padhe',         difficulty:'elite', check:()=>!!LS.g('air_balanced_hunter',false) },
  { id:'finisher_plus',     icon:'🏁', name:'The Finisher Plus',    desc:'Total default syllabus ka 95% complete kiya',             difficulty:'elite', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.95; } },
  { id:'unstoppable_streak',icon:'🔥', name:'Unstoppable Streak',   desc:'75 din ki continuous login streak',                       difficulty:'elite', check:()=>ST.streak.count>=75 },
  { id:'syllabus_architect',icon:'🏗️', name:'Syllabus Architect',   desc:'Har subject mein 10+ custom topics add aur finish kiye',  difficulty:'elite', check:()=>!!LS.g('air_syllabus_architect',false) },
  { id:'hardcore_consist',  icon:'💪', name:'Hardcore Consistency', desc:'3 mahine tak har Sunday 5+ topics padhe',                 difficulty:'elite', check:()=>!!LS.g('air_hardcore_consist',false) },
  { id:'triple_century',    icon:'🏏', name:'Triple Century',       desc:'Ek din mein 3 subjects ke chapters finish kiye',          difficulty:'elite', check:()=>!!LS.g('air_triple_century',false) },
  { id:'ghost_hunter',      icon:'👻', name:'The Ghost Hunter',     desc:'4 ghante continuous bina switch kiye focus kiya',         difficulty:'elite', check:()=>!!LS.g('air_ghost_hunter',false) },
  { id:'milestone_crusher', icon:'🚜', name:'Milestone Crusher',    desc:'100 badges earn kiye',                                    difficulty:'elite', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.length>=100; } },
  { id:'legendary_scout',   icon:'🧭', name:'Legendary Scout',      desc:'App ke saare features use kiye',                          difficulty:'elite', check:()=>!!LS.g('air_explorer_done',false)&&!!LS.g('air_theme_changed',false)&&!!LS.g('air_custom_sub_added',false)&&!!LS.g('air_notif_settings',null) },
  { id:'the_optimizer',     icon:'📈', name:'The Optimizer',        desc:'Completion rate pichle hafte se 20% badha',               difficulty:'elite', check:()=>!!LS.g('air_optimizer',false) },
  { id:'power_user',        icon:'🔋', name:'Power User',           desc:'Ek din mein 12 ghante app active raha',                   difficulty:'elite', check:()=>!!LS.g('air_power_user',false) },
  { id:'subj_overlord',     icon:'👑', name:'Subject Overlord',     desc:'Sabse zyada subtopics wale subject 100% complete kiya',   difficulty:'elite', check:()=>!!LS.g('air_subj_overlord',false) },
  { id:'reliable_hunter',   icon:'✅', name:'The Reliable Hunter',  desc:'Poore mahine ek bhi din goal miss nahi kiya',             difficulty:'elite', check:()=>!!LS.g('air_reliable_hunter',false) },
  { id:'marathon_master',   icon:'🏃', name:'Marathon Master',      desc:'Ek session mein 10 subtopics finish kiye',                difficulty:'elite', check:()=>!!LS.g('air_power_hour',false) },
  { id:'focus_aura',        icon:'✨', name:'Focus Aura',           desc:'30 din daily 4+ ghante padhai ka record',                 difficulty:'elite', check:()=>!!LS.g('air_focus_aura',false) },
  { id:'the_perfectionist', icon:'⭐', name:'The Perfectionist',    desc:'Ek chapter ke saare subtopics ek hi din mein tick kiye',  difficulty:'elite', check:()=>!!LS.g('air_perfectionist',false) },
  { id:'theme_addict',      icon:'🎨', name:'Theme Addict',         desc:'Theme baar baar switch kiya',                             difficulty:'elite', check:()=>LS.g('air_theme_switch_count',0)>=5 },
  { id:'fast_tracker',      icon:'⏩', name:'Fast Tracker',         desc:'Target se 2x tez chapter finish kiya',                    difficulty:'elite', check:()=>!!LS.g('air_fast_tracker',false) },
  { id:'unyielding_will',   icon:'🏔️', name:'Unyielding Will',      desc:'20 Hard-category topics complete kiye',                   difficulty:'elite', check:(e)=>{ const hardIds=['tests20','accuracy90','monthly_master','subj_destroyer','club_500','midnight_legend','early_bird_king','perfect_week','no_mercy','syllabus_sniper','custom_architect','the_marathoner','consistent_beast','triple_threat','weekend_god','chapter_chain','notif_ghost','knowledge_titan','unshakable_focus','speed_demon']; const arr=e||LS.g('air_achievements',[]); return hardIds.filter(id=>arr.includes(id)).length>=20; } },
  { id:'master_strategist', icon:'🧠', name:'Master Strategist',    desc:'90+ hard+elite badges achieve kiye',                      difficulty:'elite', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); const hardElite=arr.filter(id=>{ const a=ACHIEVEMENTS.find(x=>x.id===id); return a&&(a.difficulty==='hard'||a.difficulty==='elite'); }); return hardElite.length>=90; } },

  // ── LEGENDARY 🟡 (32 badges) ──
  { id:'streak100',          icon:'🌟', name:'100 Days!',               desc:'100 din streak',                                                    difficulty:'legendary', check:()=>ST.streak.count>=100 },
  { id:'backlog0',           icon:'🧹', name:'Clean Slate',             desc:'Backlog zero kiya',                                                  difficulty:'legendary', check:()=>ST.backlog.length===0&&attempts.length>0 },
  { id:'the_air_legend',     icon:'👑', name:'The AIR Legend',          desc:'Saare default + 100+ custom topics 100% complete kiye',             difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); const allDefault=Object.values(ac).every(list=>list.every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]); })); let customDone=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ const orig=ch.subtopics||[]; const custom=LS.g('jee2_custom_'+ch.id,[]); const extras=custom.filter(s=>!orig.includes(s)); const cd=ST.chapters[ch.id]; if(cd)customDone+=extras.filter(s=>cd.subtopics&&cd.subtopics[s]).length; })); return allDefault&&customDone>=100; } },
  { id:'year_of_hunter',     icon:'🗓️', name:'Year of the Hunter',      desc:'365 din lagatar app par active raha',                               difficulty:'legendary', check:()=>ST.streak.count>=365 },
  { id:'unstoppable_legacy', icon:'♾️', name:'Unstoppable Legacy',      desc:'200 din ki continuous login streak',                                difficulty:'legendary', check:()=>ST.streak.count>=200 },
  { id:'club_5000',          icon:'🏛️', name:'The 5000 Club',           desc:'Total 5000 subtopics mark kiye',                                    difficulty:'legendary', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=5000 },
  { id:'god_of_focus',       icon:'🧘', name:'God of Focus',            desc:'Ek hafte tak daily 10+ ghante study track kiya',                    difficulty:'legendary', check:()=>!!LS.g('air_god_of_focus',false) },
  { id:'arch_supreme',       icon:'📐', name:'Syllabus Architect Supreme', desc:'Har subject mein 100+ custom topics complete kiye',              difficulty:'legendary', check:()=>!!LS.g('air_arch_supreme',false) },
  { id:'ghost_of_air',       icon:'👻', name:'The Ghost of AIR',        desc:'Ek poore mahine 4 AM se padhai shuru ki (bina miss kiye)',          difficulty:'legendary', check:()=>{ const ed=LS.g('air_early_days',[]); if(ed.length<30)return false; const s=[...ed].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=30; } },
  { id:'nocturnal_master',   icon:'🌑', name:'Nocturnal Master',        desc:'Ek poore mahine 12 AM-4 AM padhai ki (bina miss kiye)',             difficulty:'legendary', check:()=>{ const md=LS.g('air_midnight_days',[]); if(md.length<30)return false; const s=[...md].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=30; } },
  { id:'finisher_god',       icon:'🏁', name:'The Finisher God',        desc:'Saare subjects ka 3 baar revision cycle complete kiya',             difficulty:'legendary', check:()=>LS.g('air_revision_cycles',0)>=3 },
  { id:'badge_overlord',     icon:'🎖️', name:'Badge Overlord',          desc:'175+ badges earn kiye',                                             difficulty:'legendary', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.length>=175; } },
  { id:'iron_mind',          icon:'🧠', name:'Iron Mind',               desc:'50 din lagatar har din 5+ hard subtopics complete kiye',            difficulty:'legendary', check:()=>!!LS.g('air_iron_mind',false) },
  { id:'specialist_king',    icon:'🏰', name:'The Specialist King',     desc:'Saare subjects mein Subject Destroyer badge earn kiya',             difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).every(s=>ac[s].length>0&&ac[s].every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); })); } },
  { id:'weekend_conqueror',  icon:'⚔️', name:'Weekend Conqueror',       desc:'6 mahine tak Sat-Sun 12+ ghante padhai ki',                         difficulty:'legendary', check:()=>!!LS.g('air_weekend_conqueror',false) },
  { id:'flash_executioner',  icon:'⚡', name:'Flash Executioner',       desc:'24 ghante mein 2 poore bade chapters finish kiye',                  difficulty:'legendary', check:()=>!!LS.g('air_flash_executor',false) },
  { id:'immortal_hunter',    icon:'🛡️', name:'The Immortal Hunter',     desc:'App install ke 1 saal baad bhi 100% consistency',                   difficulty:'legendary', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; const age=(Date.now()-new Date(inst).getTime()); return age>=365*24*3600*1000&&ST.streak.count>=365; } },
  { id:'data_scientist',     icon:'📊', name:'Data Scientist',          desc:'Total progress 100% optimize ki',                                   difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done===total; } },
  { id:'notif_emperor',      icon:'👑', name:'Notification Emperor',    desc:'6 mahine tak study reminders miss nahi kiye',                       difficulty:'legendary', check:()=>!!LS.g('air_notif_emperor',false) },
  { id:'silent_sniper',      icon:'🔇', name:'The Silent Sniper',       desc:'12 ghante bina switch kiye continuous focus kiya',                  difficulty:'legendary', check:()=>!!LS.g('air_silent_sniper',false) },
  { id:'universal_scholar',  icon:'🌌', name:'Universal Scholar',       desc:'Saare subjects ka expert level achieve kiya',                       difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); return Object.keys(ac).length>=3&&Object.keys(ac).every(s=>{ const list=ac[s]; const done=list.filter(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]); }); return done.length/list.length>=0.8; }); } },
  { id:'streak_messiah',     icon:'🙌', name:'Streak Messiah',          desc:'300 din ki unbelievable continuous streak',                         difficulty:'legendary', check:()=>ST.streak.count>=300 },
  { id:'one_above_all',      icon:'☝️', name:'The One Above All',       desc:'App ke har feature, theme aur setting ka master',                   difficulty:'legendary', check:()=>!!LS.g('air_explorer_done',false)&&!!LS.g('air_theme_changed',false)&&!!LS.g('air_custom_sub_added',false)&&!!LS.g('air_notif_settings',null)&&!!LS.g('air_deep_focus',false) },
  { id:'exam_destroyer',     icon:'💥', name:'Exam Destroyer',          desc:'Final exam se 1 mahine pehle pura syllabus 2 baar complete kiya',   difficulty:'legendary', check:()=>LS.g('air_revision_cycles',0)>=2 },
  { id:'consistent_monster', icon:'👹', name:'Consistent Monster',      desc:'1 saal lagatar roz 3+ subtopics mark kiye',                         difficulty:'legendary', check:()=>!!LS.g('air_consistent_monster',false) },
  { id:'architect_success',  icon:'🏗️', name:'The Architect of Success',desc:'1000+ custom tasks/topics complete kiye',                           difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let total=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ const orig=ch.subtopics||[]; const custom=LS.g('jee2_custom_'+ch.id,[]); total+=custom.filter(s=>!orig.includes(s)&&ST.chapters[ch.id]?.subtopics?.[s]).length; })); return total>=1000; } },
  { id:'zen_hunter',         icon:'🌸', name:'Zen Hunter',              desc:'100% syllabus smooth progress se complete kiya',                    difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done===total; } },
  { id:'master_discipline',  icon:'📏', name:'Master of Discipline',    desc:'30 din ek hi time par padhai shuru ki',                             difficulty:'legendary', check:()=>!!LS.g('air_master_discipline',false) },
  { id:'air_hunter_spirit',  icon:'🏹', name:'The AIR Hunter Spirit',   desc:'App ke core motive 100% achieve kiya',                              difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=1.0&&ST.streak.count>=100; } },
  { id:'hunters_legacy',     icon:'📜', name:"Hunter's Legacy",         desc:'App ko goal tak pahunchne ka zariya banaya',                         difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let total=0,done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ if(!ch.subtopics)return; total+=ch.subtopics.length; const cd=ST.chapters[ch.id]; done+=ch.subtopics.filter(s=>cd&&cd.subtopics&&cd.subtopics[s]).length; })); return total>0&&done/total>=0.9&&ST.streak.count>=90; } },

  // ── NEW LEGENDARY (19 badges) ──
  { id:'legend_250',         icon:'🌠', name:'The 250 Streak',          desc:'250 din ki lajawab continuous streak',                              difficulty:'legendary', check:()=>ST.streak.count>=250 },
  { id:'formula_emperor',    icon:'∑',  name:'Formula Emperor',         desc:'100+ formulas app mein save kiye',                                  difficulty:'legendary', check:()=>ST.formulas.length>=100 },
  { id:'task_titan',         icon:'📋', name:'Task Titan',              desc:'500 tasks complete kiye',                                           difficulty:'legendary', check:()=>ST.tasks.filter(t=>t.done).length>=500 },
  { id:'mega_grinder',       icon:'⚙️', name:'Mega Grinder',            desc:'Total 2000 subtopics mark kiye',                                    difficulty:'legendary', check:()=>Object.values(ST.chapters).reduce((t,ch)=>t+(ch.subtopics?Object.values(ch.subtopics).filter(v=>v).length:0),0)>=2000 },
  { id:'mock_overlord',      icon:'🎯', name:'Mock Test Overlord',      desc:'50 mock tests complete kiye',                                       difficulty:'legendary', check:()=>ST.mocks.length>=50 },
  { id:'test_juggernaut',    icon:'🏹', name:'Test Juggernaut',         desc:'100 tests complete kiye',                                           difficulty:'legendary', check:()=>attempts.length>=100 },
  { id:'annual_warrior',     icon:'📅', name:'Annual Warrior',          desc:'App install ke 2 saal baad bhi active',                             difficulty:'legendary', check:()=>{ const inst=LS.g('air_install_date',null); if(!inst)return false; return (Date.now()-new Date(inst).getTime())>=730*24*3600*1000; } },
  { id:'perfect_accuracy',   icon:'💯', name:'Perfect Accuracy',        desc:'Kisi subject mein 100% accuracy achieve ki',                        difficulty:'legendary', check:()=>Object.values(ST.scores).some(v=>v>=100) },
  { id:'ultimate_streak',    icon:'🔱', name:'Ultimate Streak',         desc:'400 din ki godlike streak',                                         difficulty:'legendary', check:()=>ST.streak.count>=400 },
  { id:'chapter_god',        icon:'📖', name:'Chapter God',             desc:'Total 50 full chapters 100% complete kiye',                         difficulty:'legendary', check:()=>{ const ac=getActiveChapters(); let done=0; Object.values(ac).forEach(list=>list.forEach(ch=>{ const cd=ST.chapters[ch.id]; if(cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]))done++; })); return done>=50; } },
  { id:'revision_king',      icon:'🔁', name:'The Revision King',       desc:'Poora syllabus 5 baar complete kiya',                               difficulty:'legendary', check:()=>LS.g('air_revision_cycles',0)>=5 },
  { id:'backlog_destroyer',  icon:'🧹', name:'Backlog Destroyer',       desc:'100+ backlogs clear kiye',                                          difficulty:'legendary', check:()=>!!LS.g('air_backlog_destroyer',false) },
  { id:'score_legend',       icon:'📊', name:'Score Legend',            desc:'Teeno subjects mein 95%+ accuracy',                                 difficulty:'legendary', check:()=>ST.scores.p>=95&&ST.scores.c>=95&&ST.scores.m>=95 },
  { id:'formula_god',        icon:'🧮', name:'Formula God',             desc:'50 formulas ek hi din mein revise kiye',                            difficulty:'legendary', check:()=>!!LS.g('air_formula_god',false) },
  { id:'night_emperor',      icon:'🌙', name:'Night Emperor',           desc:'50 din lagataar raat 12-4 AM padhai ki',                            difficulty:'legendary', check:()=>{ const md=LS.g('air_midnight_days',[]); if(md.length<50)return false; const s=[...md].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=50; } },
  { id:'dawn_emperor',       icon:'🌄', name:'Dawn Emperor',            desc:'50 din lagataar subah 5 AM se pehle padhai ki',                     difficulty:'legendary', check:()=>{ const ed=LS.g('air_early_days',[]); if(ed.length<50)return false; const s=[...ed].sort(); let c=1; for(let i=s.length-1;i>0;i--){ if((new Date(s[i])-new Date(s[i-1]))/86400000===1)c++;else break; } return c>=50; } },
  { id:'custom_legend',      icon:'🛠️', name:'Custom Legend',           desc:'500+ custom subtopics add aur complete kiye',                       difficulty:'legendary', check:()=>!!LS.g('air_custom_legend',false) },
  { id:'the_supreme',        icon:'👁️', name:'The Supreme',             desc:'Legendary category ke 40+ badges earn kiye',                       difficulty:'legendary', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.filter(id=>{ const a=ACHIEVEMENTS.find(x=>x.id===id); return a&&a.difficulty==='legendary'; }).length>=40; } },
  { id:'absolute_champion',  icon:'🏆', name:'The Absolute Champion',   desc:'Saare 179 badges unlock karne ke baad final badge',                 difficulty:'legendary', check:(e)=>{ const arr=e||LS.g('air_achievements',[]); return arr.length>=179; } },
];

function renderAchievements() {
  // Deduplicate stored achievements (fix double-count bug)
  let earned = [...new Set(LS.g('air_achievements', []))];
  let changed = false;
  // Multi-pass: run 2 passes so count-based badges (badge_collector etc.) work correctly
  const counts = LS.g('air_ach_counts', {});
  for(let pass=0; pass<2; pass++){
    ACHIEVEMENTS.forEach(a => {
      try {
        if (!earned.includes(a.id) && a.check(earned)) {
          earned.push(a.id);
          counts[a.id] = (counts[a.id] || 0) + 1;
          changed = true;
        }
      } catch(e) {}
    });
    earned = [...new Set(earned)];
  }
  if (changed) { LS.s('air_achievements', earned); LS.s('air_ach_counts', counts); }

  const total = ACHIEVEMENTS.length;
  const earnedCount = earned.length;

  // Update top summary
  const sc = ge('ach-sum-count'); if(sc) sc.textContent = earnedCount + ' / ' + total;
  const sp = ge('ach-sum-pct');   if(sp) sp.textContent = Math.round(earnedCount/total*100) + '%';

  // Update shortcut card badge in profile
  const qa = ge('qa-ach-count'); if(qa) qa.textContent = earnedCount + ' / ' + total;

  const badgeHTML = (a, isEarned) => {
    const counts = LS.g('air_ach_counts', {});
    const cnt = counts[a.id] || 0;
    return '<div class="ach-badge ' + (isEarned ? 'earned' : 'locked') + '" onclick="openBadgeModal(\'' + a.id + '\')">' +
    (isEarned && cnt > 1 ? '<div class="ach-earn-count">×' + cnt + '</div>' : '') +
    '<div class="ach-icon">' + a.icon + '</div>' +
    '<div class="ach-name">' + a.name + '</div>' +
    '<div class="ach-desc">' + a.desc + '</div>' +
    (isEarned ? '<div class="ach-earned-tag">✓ EARNED' + (cnt > 1 ? ' ×'+cnt : '') + '</div>' : '<div class="ach-earned-tag" style="color:var(--txt3)">🔒 LOCKED</div>') +
    '</div>';
  };

  // Render each difficulty tier
  ['easy', 'medium', 'hard', 'elite', 'legendary'].forEach(function(diff) {
    const list = ACHIEVEMENTS.filter(function(a){ return a.difficulty === diff; });
    const earnedIn = list.filter(function(a){ return earned.includes(a.id); });
    const lockedIn = list.filter(function(a){ return !earned.includes(a.id); });

    const pill = ge('adp-' + diff);
    if(pill) pill.textContent = earnedIn.length + '/' + list.length;

    const sub = ge('ach-sub-' + diff);
    if(sub) sub.textContent = earnedIn.length + ' / ' + list.length + ' earned';

    const grid = ge('ach-grid-' + diff);
    if(grid) grid.innerHTML = earnedIn.map(function(a){ return badgeHTML(a,true); }).join('') +
                               lockedIn.map(function(a){ return badgeHTML(a,false); }).join('');
  });
}

// ─── Achievement Helpers ─────────────────────
function checkExplorerBadge(){
  if(LS.g('air_page_home',false)&&LS.g('air_page_chapters',false)&&LS.g('air_page_profile',false)&&LS.g('air_page_help',false))
    LS.s('air_explorer_done',true);
}
window._powerHourTimes=window._powerHourTimes||[];
function trackPowerHour(){
  const now=Date.now();
  window._powerHourTimes.push(now);
  window._powerHourTimes=window._powerHourTimes.filter(t=>now-t<=3600000);
  if(window._powerHourTimes.length>=5) LS.s('air_power_hour',true);
}
function checkConsistentAim(){
  const hist=LS.g('jee2_comp_history',[]);
  const byDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    byDay[d]=(byDay[d]||0)+1;
  });
  const days=Object.keys(byDay).filter(d=>byDay[d]>=2).sort();
  if(days.length<10)return;
  let streak=1;
  for(let i=days.length-1;i>0;i--){
    if((new Date(days[i])-new Date(days[i-1]))/86400000===1)streak++;
    else break;
  }
  if(streak>=10) LS.s('air_consistent_aim',true);
}
function checkDeepDiver(chapId){
  const ch=getAllChapById(chapId);
  if(!ch||!ch.subtopics||!ch.subtopics.length)return;
  const cd=ST.chapters[chapId];
  if(!cd)return;
  // Check if all subtopics done and first was done within last 24h
  const allDone=ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]);
  if(allDone){
    const hist=LS.g('jee2_comp_history',[]);
    const chapHist=hist.filter(h=>h.chapter===ch.name&&h.type==='subtopic'&&h.completedAt);
    if(chapHist.length>=ch.subtopics.length){
      const earliest=chapHist.map(h=>new Date(h.completedAt).getTime()).sort((a,b)=>a-b)[0];
      if(Date.now()-earliest<=86400000) LS.s('air_deep_diver',true);
    }
  }
}
function checkFastLearner(chapId){
  const ch=getAllChapById(chapId);
  if(!ch||!ch.subtopics||!ch.subtopics.length)return;
  const cd=ST.chapters[chapId];
  if(!cd)return;
  const allDone=ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]);
  if(!allDone)return;
  const hist=LS.g('jee2_comp_history',[]);
  const chapHist=hist.filter(h=>h.chapter===ch.name&&h.type==='subtopic'&&h.completedAt);
  if(chapHist.length<ch.subtopics.length)return;
  const times=chapHist.map(h=>new Date(h.completedAt).getTime()).sort((a,b)=>a-b);
  if(times[times.length-1]-times[0]<=86400000) LS.s('air_fast_learner',true);
}
function checkScholarSpirit(){
  const hist=LS.g('jee2_comp_history',[]);
  const subjByDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.subj).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    if(!subjByDay[d]) subjByDay[d]=new Set();
    subjByDay[d].add(h.subj);
  });
  const days=Object.keys(subjByDay).sort();
  if(days.length<3)return;
  for(let i=0;i<=days.length-3;i++){
    const s0=subjByDay[days[i]], s1=subjByDay[days[i+1]], s2=subjByDay[days[i+2]];
    if((new Date(days[i+1])-new Date(days[i]))/86400000===1&&(new Date(days[i+2])-new Date(days[i+1]))/86400000===1){
      // same single subject all 3 days
      const intersection=[...s0].filter(s=>s1.has(s)&&s2.has(s));
      const allSingle=(s0.size===1&&s1.size===1&&s2.size===1);
      if(allSingle&&intersection.length>0){ LS.s('air_scholars_spirit',true); return; }
    }
  }
}
function checkEfficiencyExpert(){
  const hist=LS.g('jee2_comp_history',[]);
  // group by week
  const byWeek={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=new Date(h.completedAt);
    const week=Math.floor(d.getTime()/(7*86400000));
    byWeek[week]=(byWeek[week]||0)+1;
  });
  if(Object.values(byWeek).some(v=>v>=30)) LS.s('air_efficiency_expert',true);
}
function checkCustomKing(){
  // Count custom subtopics that are done
  const chapters=ST.chapters;
  // We track custom subs via jee2_custom_* keys
  const ac=getActiveChapters();
  let customDone=0;
  Object.values(ac).forEach(list=>list.forEach(ch=>{
    const orig=ch.subtopics||[];
    const custom=LS.g('jee2_custom_'+ch.id,[]);
    const extras=custom.filter(s=>!orig.includes(s));
    const cd=chapters[ch.id];
    if(cd) customDone+=extras.filter(s=>cd.subtopics&&cd.subtopics[s]).length;
  }));
  if(customDone>=10) LS.s('air_custom_king',true);
}
function checkArchitect(){
  const ac=getActiveChapters();
  const subjects=Object.keys(ac);
  const allHaveCustom=subjects.length>0&&subjects.every(s=>{
    return ac[s].some(ch=>{ const custom=LS.g('jee2_custom_'+ch.id,[]); return custom.length>0; });
  });
  if(allHaveCustom) LS.s('air_architect',true);
}
function checkResilientHunter(){
  const days=ST.streak.days||[];
  if(days.length<4)return;
  const sorted=[...days].sort();
  // look for gap of 2-3 days then 3 new consecutive days
  for(let i=0;i<sorted.length-3;i++){
    const gapDays=(new Date(sorted[i+1])-new Date(sorted[i]))/86400000;
    if(gapDays>=2&&gapDays<=3){
      // check next 3 are consecutive
      const d1=(new Date(sorted[i+2])-new Date(sorted[i+1]))/86400000;
      const d2=sorted[i+3]?(new Date(sorted[i+3])-new Date(sorted[i+2]))/86400000:0;
      if(d1===1&&d2===1){ LS.s('air_resilient_hunter',true); return; }
    }
  }
}
// ─── Elite Achievement Helpers ───────────────
function checkExecutioner(){
  const hist=LS.g('jee2_comp_history',[]);
  const byWeek={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=new Date(h.completedAt);
    const week=Math.floor(d.getTime()/(7*86400000));
    byWeek[week]=(byWeek[week]||0)+1;
  });
  if(Object.values(byWeek).some(v=>v>50)) LS.s('air_executioner',true);
}
function checkComebackKid(){
  const days=[...(ST.streak.days||[])].sort();
  for(let i=0;i<days.length-1;i++){
    const gap=(new Date(days[i+1])-new Date(days[i]))/86400000;
    if(gap>=10){
      // check if there are 7 consecutive days after this gap
      const afterGap=days.slice(i+1);
      if(afterGap.length>=7){
        let streak=1;
        for(let j=1;j<afterGap.length;j++){
          if((new Date(afterGap[j])-new Date(afterGap[j-1]))/86400000===1)streak++;
          else break;
        }
        if(streak>=7){ LS.s('air_comeback_kid',true); return; }
      }
    }
  }
}
function checkCustomSpecialist(){
  const ac=getActiveChapters();
  let customDone=0;
  Object.values(ac).forEach(list=>list.forEach(ch=>{
    const orig=ch.subtopics||[];
    const custom=LS.g('jee2_custom_'+ch.id,[]);
    const extras=custom.filter(s=>!orig.includes(s));
    const cd=ST.chapters[ch.id];
    if(cd)customDone+=extras.filter(s=>cd.subtopics&&cd.subtopics[s]).length;
  }));
  if(customDone>=150) LS.s('air_custom_specialist',true);
}
function checkBalancedHunter(){
  const today=new Date().toISOString().slice(0,10);
  const monday=new Date();
  monday.setDate(monday.getDate()-monday.getDay()+1);
  const weekStart=monday.toISOString().slice(0,10);
  const hist=LS.g('jee2_comp_history',[]);
  const weekHist=hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt>=weekStart);
  const ac=getActiveChapters();
  const allSubjs=Object.keys(ac);
  const subjMap={'Physics':'p','Chemistry':'g','Maths':'r','Biology':'b'};
  const qualifies=allSubjs.every(s=>{
    const subjName=({'p':'Physics','g':'Chemistry','r':'Maths','b':'Biology'})[s]||s;
    return weekHist.filter(h=>h.subj===subjName||h.subj===s).length>=2;
  });
  if(qualifies) LS.s('air_balanced_hunter',true);
}
function checkSyllabusArchitect(){
  const ac=getActiveChapters();
  const allSubjs=Object.keys(ac);
  const allHave10=allSubjs.length>0&&allSubjs.every(s=>{
    let customDone=0;
    ac[s].forEach(ch=>{
      const orig=ch.subtopics||[];
      const custom=LS.g('jee2_custom_'+ch.id,[]);
      const extras=custom.filter(x=>!orig.includes(x));
      const cd=ST.chapters[ch.id];
      if(cd)customDone+=extras.filter(x=>cd.subtopics&&cd.subtopics[x]).length;
    });
    return customDone>=10;
  });
  if(allHave10) LS.s('air_syllabus_architect',true);
}
function checkHardcoreConsistency(){
  const days=ST.streak.days||[];
  const sundays=days.filter(d=>new Date(d).getDay()===0);
  const hist=LS.g('jee2_comp_history',[]);
  const sundaysWith5=sundays.filter(sun=>{
    return hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(sun)).length>=5;
  });
  // need sundays spanning 3 months (90 days)
  if(sundaysWith5.length>=12) LS.s('air_hardcore_consist',true);
}
function checkTripleCentury(){
  const today=new Date().toISOString().slice(0,10);
  const ac=getActiveChapters();
  let fullSubjs=0;
  Object.keys(ac).forEach(s=>{
    // Check if any chapter in this subj was fully completed today
    const justFinished=ac[s].some(ch=>{
      const cd=ST.chapters[ch.id];
      return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(st=>cd.subtopics&&cd.subtopics[st]);
    });
    if(justFinished)fullSubjs++;
  });
  if(fullSubjs>=3) LS.s('air_triple_century',true);
}
function checkSubjOverlord(){
  const ac=getActiveChapters();
  let maxSubj='', maxCount=0;
  Object.keys(ac).forEach(s=>{
    const count=ac[s].reduce((t,ch)=>t+(ch.subtopics?ch.subtopics.length:0),0);
    if(count>maxCount){maxCount=count;maxSubj=s;}
  });
  if(!maxSubj)return;
  const allDone=ac[maxSubj].every(ch=>{
    const cd=ST.chapters[ch.id];
    return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]);
  });
  if(allDone) LS.s('air_subj_overlord',true);
}
function checkReliableHunter(){
  const prof=PROFILE.get();
  if(!prof.dailyGoal)return;
  const goal=parseInt(prof.dailyGoal)||1;
  const hist=LS.g('jee2_comp_history',[]);
  const byDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    byDay[d]=(byDay[d]||0)+1;
  });
  const days=Object.keys(byDay).sort();
  if(days.length<30)return;
  const last30=days.slice(-30);
  if(last30.length>=30&&last30.every(d=>byDay[d]>=goal)) LS.s('air_reliable_hunter',true);
}
function checkPerfectionist(chapId){
  const ch=getAllChapById(chapId);
  if(!ch||!ch.subtopics||!ch.subtopics.length)return;
  const cd=ST.chapters[chapId];
  if(!cd)return;
  const allDone=ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]);
  if(!allDone)return;
  const today=new Date().toISOString().slice(0,10);
  const hist=LS.g('jee2_comp_history',[]);
  const todayChap=hist.filter(h=>h.chapter===ch.name&&h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today));
  if(todayChap.length>=ch.subtopics.length) LS.s('air_perfectionist',true);
}
function checkOptimizer(){
  const hist=LS.g('jee2_comp_history',[]);
  const now=Date.now();
  const thisWeek=hist.filter(h=>h.type==='subtopic'&&h.completedAt&&now-new Date(h.completedAt).getTime()<=7*86400000).length;
  const lastWeek=hist.filter(h=>h.type==='subtopic'&&h.completedAt&&now-new Date(h.completedAt).getTime()>7*86400000&&now-new Date(h.completedAt).getTime()<=14*86400000).length;
  if(lastWeek>0&&thisWeek>=lastWeek*1.2) LS.s('air_optimizer',true);
}
// Power User: 12 hours
function initPowerUserTimer(){
  if(!LS.g('air_power_user',false)){
    setTimeout(()=>{ LS.s('air_power_user',true); },12*3600000);
  }
}
// Deep Work Elite: 8 hours
function initDeepWorkTimer(){
  if(!LS.g('air_deep_work_elite',false)){
    setTimeout(()=>{ LS.s('air_deep_work_elite',true); },8*3600000);
  }
}
// Ghost Hunter: 4 hours (same session, no leave — approximated by timer)
function initGhostHunterTimer(){
  if(!LS.g('air_ghost_hunter',false)){
    setTimeout(()=>{ LS.s('air_ghost_hunter',true); },4*3600000);
  }
}
// Focus Aura: track daily 4-hour sessions
function checkFocusAura(){
  const record=LS.g('air_focus_aura_days',[]);
  const today=new Date().toISOString().slice(0,10);
  if(!record.includes(today)&&LS.g('air_deep_focus',false)){
    record.push(today);
    LS.s('air_focus_aura_days',record);
  }
  if(record.length>=30) LS.s('air_focus_aura',true);
}
// Theme switch counter
function trackThemeSwitch(){
  const count=LS.g('air_theme_switch_count',0)+1;
  LS.s('air_theme_switch_count',count);
}
// ─── Legendary Achievement Helpers ──────────
function checkFlashExecutor(chapId){
  const ch=getAllChapById(chapId);
  if(!ch||!ch.subtopics||!ch.subtopics.length)return;
  const cd=ST.chapters[chapId];
  if(!cd||!ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]))return;
  // This chapter just finished — check if another chapter also finished within 24h
  const hist=LS.g('jee2_comp_history',[]);
  const now=Date.now();
  const recentChaps=new Set(hist.filter(h=>h.type==='subtopic'&&h.completedAt&&now-new Date(h.completedAt).getTime()<=86400000).map(h=>h.chapter));
  const ac=getActiveChapters();
  let fullChapsToday=0;
  Object.values(ac).forEach(list=>list.forEach(c=>{
    if(recentChaps.has(c.name)){
      const cdd=ST.chapters[c.id];
      if(cdd&&c.subtopics&&c.subtopics.length>0&&c.subtopics.every(s=>cdd.subtopics&&cdd.subtopics[s]))fullChapsToday++;
    }
  }));
  if(fullChapsToday>=2) LS.s('air_flash_executor',true);
}
function checkArchSupreme(){
  const ac=getActiveChapters();
  const allSubjs=Object.keys(ac);
  if(!allSubjs.length)return;
  const allHave100=allSubjs.every(s=>{
    let customDone=0;
    ac[s].forEach(ch=>{
      const orig=ch.subtopics||[];
      const custom=LS.g('jee2_custom_'+ch.id,[]);
      const extras=custom.filter(x=>!orig.includes(x));
      const cd=ST.chapters[ch.id];
      if(cd)customDone+=extras.filter(x=>cd.subtopics&&cd.subtopics[x]).length;
    });
    return customDone>=100;
  });
  if(allHave100) LS.s('air_arch_supreme',true);
}
function checkConsistentMonster(){
  const hist=LS.g('jee2_comp_history',[]);
  const byDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    byDay[d]=(byDay[d]||0)+1;
  });
  const days=Object.keys(byDay).filter(d=>byDay[d]>=3).sort();
  if(days.length<365)return;
  // Check any 365-day window where all days have 3+
  let streak=1;
  for(let i=days.length-1;i>0;i--){
    if((new Date(days[i])-new Date(days[i-1]))/86400000===1)streak++;
    else break;
  }
  if(streak>=365) LS.s('air_consistent_monster',true);
}
// ─── Hard Achievement Helpers ────────────────
function checkPerfectWeek(){
  const hist=LS.g('jee2_comp_history',[]);
  const byDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    byDay[d]=(byDay[d]||0)+1;
  });
  // Find any Mon-Sun window where all 7 days have 5+ subtopics
  const days=Object.keys(byDay).sort();
  for(let i=0;i<=days.length-7;i++){
    const week=days.slice(i,i+7);
    if(week.length<7)continue;
    const isConsec=week.every((d,j)=>j===0||(new Date(d)-new Date(week[j-1]))/86400000===1);
    if(isConsec&&week.every(d=>byDay[d]>=5)){
      const startDow=new Date(week[0]).getDay();
      if(startDow===1){ LS.s('air_perfect_week',true); return; }
    }
  }
}
function checkTripleThreat(){
  const today=new Date().toISOString().slice(0,10);
  const hist=LS.g('jee2_comp_history',[]);
  const todayHist=hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.completedAt.startsWith(today));
  const ac=getActiveChapters();
  let qualifySubjs=0;
  Object.keys(ac).forEach(s=>{
    const chapsTouched=new Set(todayHist.filter(h=>h.subj===Object.keys({'p':'Physics','g':'Chemistry','r':'Maths','b':'Biology'}).find(k=>({'p':'Physics','g':'Chemistry','r':'Maths','b':'Biology'})[k]===h.subj)||h.subj===s).map(h=>h.chapter));
    if(chapsTouched.size>=3)qualifySubjs++;
  });
  if(qualifySubjs>=3) LS.s('air_triple_threat',true);
}
function checkChapterChain(chapId){
  const ac=getActiveChapters();
  const subj=Object.keys(ac).find(s=>ac[s].some(c=>c.id===chapId));
  if(!subj)return;
  const list=ac[subj];
  // find 5 consecutive chapters all fully done
  for(let i=0;i<=list.length-5;i++){
    const five=list.slice(i,i+5);
    if(five.every(ch=>{ const cd=ST.chapters[ch.id]; return cd&&ch.subtopics&&ch.subtopics.length>0&&ch.subtopics.every(s=>cd.subtopics&&cd.subtopics[s]); })){
      LS.s('air_chapter_chain',true); return;
    }
  }
}
function checkSpeedDemon(){
  const hist=LS.g('jee2_comp_history',[]);
  const subtopicHist=hist.filter(h=>h.type==='subtopic'&&h.completedAt).sort((a,b)=>new Date(a.completedAt)-new Date(b.completedAt));
  // any 3-day window with 100+ subtopics
  for(let i=0;i<subtopicHist.length;i++){
    const start=new Date(subtopicHist[i].completedAt).getTime();
    const count=subtopicHist.filter(h=>{ const t=new Date(h.completedAt).getTime(); return t>=start&&t<=start+3*86400000; }).length;
    if(count>=100){ LS.s('air_speed_demon',true); return; }
  }
}
function checkCustomArchitect(){
  const ac=getActiveChapters();
  let customDone=0;
  Object.values(ac).forEach(list=>list.forEach(ch=>{
    const orig=ch.subtopics||[];
    const custom=LS.g('jee2_custom_'+ch.id,[]);
    const extras=custom.filter(s=>!orig.includes(s));
    const cd=ST.chapters[ch.id];
    if(cd)customDone+=extras.filter(s=>cd.subtopics&&cd.subtopics[s]).length;
  }));
  if(customDone>=50) LS.s('air_custom_architect',true);
}
function checkUnshakableFocus(){
  const hist=LS.g('jee2_comp_history',[]);
  const byDay={};
  hist.filter(h=>h.type==='subtopic'&&h.completedAt&&h.subj).forEach(h=>{
    const d=h.completedAt.slice(0,10);
    if(!byDay[d])byDay[d]=new Set();
    byDay[d].add(h.subj);
  });
  const days=Object.keys(byDay).sort();
  for(let i=0;i<=days.length-7;i++){
    const week=days.slice(i,i+7);
    if(week.length<7)continue;
    const isConsec=week.every((d,j)=>j===0||(new Date(d)-new Date(week[j-1]))/86400000===1);
    if(isConsec){
      // all 7 days only 1 subject
      const allSingle=week.every(d=>byDay[d].size===1);
      const sameSubj=allSingle&&new Set(week.map(d=>[...byDay[d]][0])).size===1;
      if(sameSubj){ LS.s('air_unshakable_focus',true); return; }
    }
  }
}
// Marathoner: 5 hours
function initMarathonerTimer(){
  if(!LS.g('air_marathoner',false)){
    setTimeout(()=>{ LS.s('air_marathoner',true); },5*3600000);
  }
}
// ─────────────────────────────────────────────
window.toggleAchSection = function(diff) {
  const body = ge('ach-body-' + diff);
  const chev = ge('ach-chev-' + diff);
  if (!body) return;
  const isCollapsed = body.classList.toggle('collapsed');
  if (chev) chev.classList.toggle('closed', isCollapsed);
};

// ─── ABOUT DEVELOPER TOGGLE ──────────────────
window.toggleAboutDev = () => {
  const body = ge('about-dev-body');
  const chev = ge('about-dev-chev');
  const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px' && body.style.maxHeight !== '0';
  if(isOpen){
    body.style.maxHeight = '0';
    body.style.opacity = '0';
    chev.style.transform = 'rotate(0deg)';
  } else {
    body.style.maxHeight = '800px';
    body.style.opacity = '1';
    chev.style.transform = 'rotate(180deg)';
  }
};

window.openAchievements = () => {
  renderAchievements();
  pushScreen('scr-achievements');
};

// ─── BADGE DETAIL MODAL ─────────────────────────
let _currentBadgeId = null;

window.openBadgeModal = (id) => {
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if(!a) return;
  _currentBadgeId = id;

  const earned = LS.g('air_achievements', []);
  const counts = LS.g('air_ach_counts', {});
  const isEarned = earned.includes(id);
  const cnt = counts[id] || 0;

  // Difficulty colors
  const diffColors = {
    easy:      { bg:'rgba(8,184,130,.15)',  color:'#10b880', label:'🟢 EASY' },
    medium:    { bg:'rgba(255,176,0,.15)',  color:'#ffb000', label:'🟡 MEDIUM' },
    hard:      { bg:'rgba(240,51,88,.15)',  color:'var(--ar)', label:'🔴 HARD' },
    elite:     { bg:'rgba(139,92,246,.15)', color:'#8b5cf6', label:'🟣 ELITE' },
    legendary: { bg:'rgba(234,179,8,.15)',  color:'#eab308', label:'🏆 LEGENDARY' },
  };
  const dc = diffColors[a.difficulty] || diffColors.easy;

  ge('bm-icon').textContent = a.icon;
  ge('bm-name').textContent = a.name;
  ge('bm-desc').textContent = a.desc;
  ge('bm-count').textContent = cnt > 0 ? cnt : (isEarned ? '1' : '0');
  ge('bm-status').textContent = isEarned ? '✅' : '🔒';
  ge('bm-diff-val').textContent = a.difficulty.toUpperCase();

  const pill = ge('bm-diff-pill');
  pill.textContent = dc.label;
  pill.style.background = dc.bg;
  pill.style.color = dc.color;

  const earnBtn = ge('bm-earn-btn');
  const removeBtn = ge('bm-remove-btn');

  if(isEarned) {
    earnBtn.disabled = false;
    earnBtn.textContent = '🏅 Firse Earn Karo';
    removeBtn.disabled = false;
  } else {
    earnBtn.disabled = false;
    earnBtn.textContent = '🏅 Abhi Earn Karo';
    removeBtn.disabled = true;
  }

  ge('badge-detail-overlay').classList.add('open');
};

window.closeBadgeModal = (e) => {
  if(e && e.target !== ge('badge-detail-overlay')) return;
  ge('badge-detail-overlay').classList.remove('open');
  _currentBadgeId = null;
};

window.manuallyEarnBadge = () => {
  if(!_currentBadgeId) return;
  // Add to earned list
  let earned = [...new Set(LS.g('air_achievements', []))];
  if(!earned.includes(_currentBadgeId)) earned.push(_currentBadgeId);
  LS.s('air_achievements', earned);

  // Increment count
  const counts = LS.g('air_ach_counts', {});
  counts[_currentBadgeId] = (counts[_currentBadgeId] || 0) + 1;
  LS.s('air_ach_counts', counts);

  // Update modal display
  ge('bm-count').textContent = counts[_currentBadgeId];
  ge('bm-status').textContent = '✅';
  ge('bm-earn-btn').textContent = '🏅 Firse Earn Karo';
  ge('bm-remove-btn').disabled = false;

  showToast('🏅 Badge earn ho gaya! ×' + counts[_currentBadgeId], 2000);
  setTimeout(() => { renderAchievements(); }, 300);
};

window.removeBadge = () => {
  if(!_currentBadgeId) return;
  // Remove from earned list
  let earned = LS.g('air_achievements', []).filter(x => x !== _currentBadgeId);
  LS.s('air_achievements', earned);

  // Reset count
  const counts = LS.g('air_ach_counts', {});
  delete counts[_currentBadgeId];
  LS.s('air_ach_counts', counts);

  // Update modal
  ge('bm-count').textContent = '0';
  ge('bm-status').textContent = '🔒';
  ge('bm-earn-btn').textContent = '🏅 Abhi Earn Karo';
  ge('bm-remove-btn').disabled = true;

  showToast('🗑 Badge remove ho gaya!', 2000);
  ge('badge-detail-overlay').classList.remove('open');
  setTimeout(() => { renderAchievements(); }, 300);
};




window.openHelp = () => {
  LS.s('air_help_opened', true); // Achievement: Scout
  LS.s('air_page_help', true);  // Achievement: The Explorer
  checkExplorerBadge();
  // Reset to overview tab each time
  document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.help-nav-btn').forEach(b=>b.classList.remove('on'));
  const ov = ge('help-overview'); if(ov) ov.classList.add('on');
  const firstBtn = document.querySelector('.help-nav-btn'); if(firstBtn) firstBtn.classList.add('on');
  pushScreen('scr-help');
};

window.copyPdfPrompt = () => {
  const box = ge('pdf-prompt-box');
  const btn = ge('pdf-copy-btn');
  if(!box || !btn) return;
  const text = box.innerText || box.textContent;
  navigator.clipboard.writeText(text.trim()).then(() => {
    btn.textContent = '✓ COPIED!';
    btn.style.background = 'var(--ag)';
    setTimeout(() => {
      btn.textContent = 'COPY';
      btn.style.background = 'var(--ap)';
    }, 2200);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text.trim();
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ COPIED!';
    btn.style.background = 'var(--ag)';
    setTimeout(() => { btn.textContent = 'COPY'; btn.style.background = 'var(--ap)'; }, 2200);
  });
};


// ─── PROFILE RENDER ───────────────────────────
function renderProfile() {
  const prof = PROFILE.get();

  // ── Hero Avatar ──
  const av = ge('profile-avatar');
  if(av) {
    const savedPhoto = LS.g('air_profile_photo', '');
    if(savedPhoto) {
      av.innerHTML = `<img src="${savedPhoto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center top" alt="Profile">`;
    } else {
      av.textContent = prof.avatar || '🎯';
    }
  }
  const nm = ge('profile-name-disp'); if(nm) nm.textContent = prof.name || 'Student';
  const em = ge('profile-email-disp'); if(em) em.textContent = prof.email ? '📧 '+prof.email : '📧 —';
  const ph = ge('profile-phone-disp'); if(ph) ph.textContent = prof.phone ? '📱 '+prof.phone : '📱 —';
  const tg = ge('profile-tag-disp');
  if(tg) tg.textContent = (prof.exam==='neet'?'NEET':'JEE') + ' · Class ' + (prof.cls||'11');
  const bt = ge('ph-batch-tag'); if(bt) bt.textContent = prof.batch || '—';

  // ── Avatar badge (top streak badge) ──
  const badge = ge('ph-avatar-badge');
  if(badge){
    const s = ST.streak.count;
    badge.textContent = s>=100?'👑':s>=60?'🥇':s>=30?'🏅':s>=14?'💫':s>=7?'⚡':s>=3?'🔥':'🌱';
  }

  // ── Exam / Class cards ──
  const jeeEl=ge('psw-jee'),neetEl=ge('psw-neet');
  if(jeeEl){jeeEl.classList.remove('on');if(prof.exam==='jee')jeeEl.classList.add('on');}
  if(neetEl){neetEl.classList.remove('on');if(prof.exam==='neet')neetEl.classList.add('on');}
  const c11El=ge('psw-11'),c12El=ge('psw-12');
  if(c11El){c11El.classList.remove('on');if(prof.cls==='11')c11El.classList.add('on');}
  if(c12El){c12El.classList.remove('on');if(prof.cls==='12')c12El.classList.add('on');}

  // ── Countdown ──
  const cdSub=ge('prof-cd-sub'), cdPct=ge('prof-cd-pct'), cdRing=ge('prof-cd-ring-fill');
  // Clear any previous countdown interval
  if(window._cdInterval) { clearInterval(window._cdInterval); window._cdInterval = null; }

  if(prof.examDate){
    const examDateStr = prof.examDate;
    const savedAt = prof.savedAt ? new Date(prof.savedAt) : new Date();

    function updateCdBoxes() {
      const now = new Date();
      const exam = new Date(examDateStr + 'T00:00:00');
      const diff = exam - now;

      if(diff <= 0) {
        // Exam day or past
        const d=ge('cd-days'),h=ge('cd-hours'),m=ge('cd-mins'),s=ge('cd-secs');
        if(d) d.textContent='🎉'; if(h) h.textContent='00'; if(m) m.textContent='00'; if(s) s.textContent='00';
        if(cdSub) cdSub.textContent = _lang==='en' ? 'Exam day! Best of luck! 🎉' : 'Exam day! Best of luck! 🎉';
        if(cdPct) cdPct.textContent='100%';
        if(cdRing) cdRing.style.width='100%';
        if(window._cdInterval) { clearInterval(window._cdInterval); window._cdInterval=null; }
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const days  = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const mins  = Math.floor((totalSecs % 3600) / 60);
      const secs  = totalSecs % 60;

      const pad = n => String(n).padStart(2,'0');
      const d=ge('cd-days'),h=ge('cd-hours'),mn=ge('cd-mins'),s=ge('cd-secs');
      if(d)  d.textContent  = days;
      if(h)  h.textContent  = pad(hours);
      if(mn) mn.textContent = pad(mins);
      if(s)  s.textContent  = pad(secs);

      if(cdSub) cdSub.textContent = exam.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});

      // Progress bar
      const examDay = new Date(examDateStr + 'T00:00:00');
      const totalDays = Math.max(1, Math.round((examDay - savedAt) / 86400000));
      const daysLeft = Math.max(0, diff / 86400000);
      const pct = Math.max(0, Math.min(100, Math.round((1 - daysLeft/totalDays)*100)));
      if(cdPct)  cdPct.textContent  = pct+'%';
      if(cdRing) cdRing.style.width = pct+'%';
    }

    updateCdBoxes();
    window._cdInterval = setInterval(updateCdBoxes, 1000);

  } else {
    const d=ge('cd-days'),h=ge('cd-hours'),m=ge('cd-mins'),s=ge('cd-secs');
    if(d) d.textContent='—'; if(h) h.textContent='—'; if(m) m.textContent='—'; if(s) s.textContent='—';
    if(cdSub)  cdSub.textContent=_t('set_exam_date');
    if(cdPct)  cdPct.textContent='';
    if(cdRing) cdRing.style.width='0%';
  }

  // ── Daily Goal ──
  const goalHrs = parseInt(prof.dailyGoal||6);
  const pomosToday = LS.g('jee2_pomos_'+today(), 0);
  const doneHrs = Math.min(goalHrs, Math.round(pomosToday*25/60*10)/10);
  const goalPct = Math.min(100,Math.round(doneHrs/goalHrs*100));
  const gd=ge('prof-goal-done'); if(gd) gd.textContent=doneHrs;
  const gt=ge('prof-goal-target'); if(gt) gt.textContent=goalHrs;
  const gf=ge('prof-goal-fill'); if(gf) gf.style.width=goalPct+'%';
  const gpct=ge('ph-goal-pct'); if(gpct) gpct.textContent=goalPct+'%';
  const gh=ge('prof-goal-hint');
  if(gh) {
    if(goalPct>=100) gh.textContent = _lang==='en' ? "🎉 Goal complete! You're on fire!" : '🎉 Goal complete! Khatarnak!';
    else if(goalPct>=75) gh.textContent = _lang==='en' ? '💪 Almost there! Keep going!' : '💪 Almost there!';
    else if(goalPct>=50) gh.textContent = _lang==='en' ? '⚡ Halfway there! Keep pushing!' : '⚡ Halfway! Keep going!';
    else if(goalPct>0)   gh.textContent = _lang==='en' ? '🚀 Good start! Keep studying!' : '🚀 Good start! Aur karo!';
    else                 gh.textContent = _lang==='en' ? '⏱ Start the Pomodoro timer to track your goal!' : '⏱ Pomodoro start karo, goal track hoga!';
  }

  // ── Progress Rings ──
  const circ=201;
  [['p','ring-p','rval-p',ST.scores.p],['g','ring-g','rval-g',ST.scores.c],['r','ring-r','rval-r',ST.scores.m]].forEach(([subj,ringId,valId,val])=>{
    const ring=ge(ringId); const valEl=ge(valId);
    if(ring) ring.style.strokeDashoffset = val!==null ? circ-(val/100*circ) : circ;
    if(valEl) valEl.textContent = val!==null ? val+'%' : '—';
  });
  const rl=ge('rlbl-r'); if(rl) rl.textContent=prof.exam==='neet'?'Biology':'Maths';

  // ── Share Card ──
  const sav=ge('psc-avatar');
  if(sav) {
    const savedPhoto = LS.g('air_profile_photo', '');
    if(savedPhoto) {
      sav.innerHTML = `<img src="${savedPhoto}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;object-position:center top" alt="Profile">`;
      sav.style.fontSize = '0';
    } else {
      sav.textContent = prof.avatar||'🎯';
      sav.style.fontSize = '';
    }
  }
  const sn=ge('psc-name'); if(sn) sn.textContent=prof.name||'Student';
  const st2=ge('psc-tag'); if(st2) st2.textContent=(prof.exam==='neet'?'NEET':'JEE')+' · Class '+(prof.cls||'11');
  const ss=ge('psc-streak'); if(ss) ss.textContent=ST.streak.count;
  const stests=ge('psc-tests'); if(stests) stests.textContent=attempts.length;
  const stasks=ge('psc-tasks'); if(stasks) stasks.textContent=getCompHistory().filter(h=>h.type==='task').length;
  // count chapters started
  let chapCount=0;
  Object.values(getActiveChapters()).forEach(arr=>arr.forEach(c=>{if(getChapProgress(c.id)>0)chapCount++;}));
  const sch=ge('psc-chapters'); if(sch) sch.textContent=chapCount;

  // ── Theme toggle sync ──
  const isDark = LS.g('air_theme','midnight')==='dark';
  const tog=ge('theme-toggle'); if(tog) tog.classList.toggle('dark-on',isDark);
  const knob=ge('theme-knob'); if(knob) knob.textContent=isDark?'🌙':'☀️';
  const lbl=ge('theme-lbl'); if(lbl) lbl.textContent=isDark?'Dark Mode':'Light Mode';

  // ── Header logo ──
  const ls=document.querySelector('.logo-sub');
  if(ls) ls.textContent=(prof.exam==='neet'?'NEET':'JEE')+' · CLASS '+(prof.cls||'11');

  renderAchievements();
}

let _selectedAvatar = null;
window.selectAvatar = (el, emoji) => {
  _selectedAvatar = emoji;
  document.querySelectorAll('.avatar-opt').forEach(a => a.classList.remove('on'));
  el.classList.add('on');
};

window.handleProfilePhotoUpload = (event) => {
  const file = event.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')) { showToast('❌ Sirf image file select karo!', 2000); return; }
  if(file.size > 5 * 1024 * 1024) { showToast('❌ Image 5MB se chhoti honi chahiye!', 2000); return; }

  const reader = new FileReader();
  reader.onload = (e) => {
    // Compress image using canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX = 300;
      let w = img.width, h = img.height;
      if(w > h) { if(w > MAX){ h = Math.round(h * MAX/w); w = MAX; } }
      else       { if(h > MAX){ w = Math.round(w * MAX/h); h = MAX; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.75);
      LS.s('air_profile_photo', compressed);
      renderProfile();
      showToast('✅ Profile photo update ho gayi!', 1800);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-selected
  event.target.value = '';
};

window.removeProfilePhoto = () => {
  LS.s('air_profile_photo', '');
  renderProfile();
  showToast('🗑 Photo remove ho gayi!', 1500);
};

window.saveProfile = () => {
  const prof = PROFILE.get();
  const name = ge('prof-name-inp').value.trim();
  if(name) prof.name = name;
  const email = ge('prof-email-inp').value.trim();
  if(email) prof.email = email;
  const phone = ge('prof-phone-inp').value.trim();
  if(phone) prof.phone = phone;
  const batch = ge('prof-batch-inp').value.trim();
  if(batch) prof.batch = batch;
  const examDate = ge('prof-examdate-inp').value;
  if(examDate){ prof.examDate = examDate; prof.savedAt = new Date().toISOString(); }
  const goal = ge('prof-goal-inp').value;
  if(goal) prof.dailyGoal = goal;
  if(_selectedAvatar) prof.avatar = _selectedAvatar;
  PROFILE.set(prof);
  // Achievement: Rookie Hunter
  if(prof.name && prof.name !== 'Student' && prof.dailyGoal) LS.s('air_rookie_hunter_done', true);
  closeModal('profile-modal');
  renderProfile();
  _selectedAvatar = null;
};

window.shareProgress = () => {
  const prof = PROFILE.get();
  const text = `🎯 AIR Hunter Progress Report
👤 ${prof.name||'Student'} | ${prof.exam==='neet'?'NEET':'JEE'} ${prof.examYear||'2026'} · Class ${prof.cls||'11'}

📊 Accuracy:
  ⚛ Physics: ${ST.scores.p!==null?ST.scores.p+'%':'—'}
  🧪 Chemistry: ${ST.scores.c!==null?ST.scores.c+'%':'—'}
  ${prof.exam==='neet'?'🧬 Biology':'∑ Maths'}: ${ST.scores.m!==null?ST.scores.m+'%':'—'}

🔥 Streak: ${ST.streak.count} days
📝 Tests: ${attempts.length} | ✅ Tasks: ${ST.tasks.filter(t=>t.done).length}

Keep grinding! 💪
— AIR Hunter by Clock AI`;
  navigator.clipboard.writeText(text)
    .then(()=>alert('✅ Share text copy ho gaya!'))
    .catch(()=>alert(text));
};

window.toggleTheme = () => {
  LS.s('air_theme_changed', true); // Achievement: Theme Explorer
  trackThemeSwitch(); // Achievement: Theme Addict
  const isDark = LS.g('air_theme','midnight')==='dark';
  const newDark = !isDark;
  LS.s('air_theme', newDark?'dark':'light');
  document.body.classList.toggle('dark-mode', newDark);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.content=newDark?'#0d0f14':'#f0f2f8';
  // update toggle UI
  const tog=ge('theme-toggle'); if(tog) tog.classList.toggle('dark-on',newDark);
  const knob=ge('theme-knob'); if(knob) knob.textContent=newDark?'🌙':'☀️';
  const lbl=ge('theme-lbl'); if(lbl) lbl.textContent=newDark?'Dark Mode':'Light Mode';
};

window.switchExam = (exam) => {
  const prof = PROFILE.get();
  prof.exam = exam;
  PROFILE.set(prof);
  ST.pracSubj = 'p';
  refreshChapterData();
  renderProfile();
  renderChapterList();
  updateChipLabels();
};

window.switchClass = (cls) => {
  const prof = PROFILE.get();
  prof.cls = cls;
  PROFILE.set(prof);
  refreshChapterData();
  renderProfile();
  renderChapterList();
};

function updateChipLabels() {
  const prof = PROFILE.get();
  const isNEET = prof.exam === 'neet';
  const chip3 = ge('pchip-r') || ge('pchip-b');
  if(chip3) {
    chip3.className = 'chip '+(isNEET?'b':'r')+(ST.pracSubj===(isNEET?'b':'r')?' on':'');
    chip3.textContent = isNEET ? '🧬 Biology' : '∑ Maths';
    chip3.setAttribute('onclick',`switchSubj('${isNEET?'b':'r'}',this,'prac')`);
    chip3.id = isNEET ? 'pchip-b' : 'pchip-r';
  }
}

// ─── COMPLETED HISTORY PAGE ──────────────────
let _compFilter = 'all';

window.filterCompHistory = (type, el) => {
  _compFilter = type;
  document.querySelectorAll('#sub-completed .chip').forEach(b => b.classList.remove('on'));
  if(el) el.classList.add('on');
  renderCompHistory(type);
};

window.clearCompHistory = () => {
  customConfirm('Poori history delete karni hai?', () => {
    LS.s('jee2_comp_history', []);
    renderCompHistory(_compFilter);
  }, { icon:'🗑', title:'History Clear?', okLabel:'🗑 Clear karo' });
};

window.deleteHistItem = (histId) => {
  let hist = getCompHistory();
  const before = hist.length;
  hist = hist.filter(h => h.histId !== histId);
  // If nothing was deleted (old entry without histId), try by rendered index
  if(hist.length === before) {
    console.warn('deleteHistItem: histId not found:', histId);
    return;
  }
  LS.s('jee2_comp_history', hist);
  // Re-render smoothly — remove just that item from DOM first
  const itemEl = document.getElementById('chi-' + histId);
  if(itemEl) {
    itemEl.style.transition = 'opacity .2s, transform .2s';
    itemEl.style.opacity = '0';
    itemEl.style.transform = 'translateX(30px)';
    setTimeout(() => renderCompHistory(_compFilter), 220);
  } else {
    renderCompHistory(_compFilter);
  }
  doVibrate([40]);
};

function renderCompHistory(filter) {
  const el = ge('comp-history-list'); if(!el) return;
  let hist = getCompHistory();

  if(filter === 'task')     hist = hist.filter(h => h.type === 'task' || h.type === 'task_deleted');
  if(filter === 'subtopic') hist = hist.filter(h => h.type === 'subtopic');
  if(filter === 'timer')    hist = hist.filter(h => h.type === 'timer');

  if(!hist.length) {
    el.innerHTML = `<div class="empty" style="padding:32px 0">
      <span class="empty-icon">📭</span>
      <span class="empty-text">${_t('empty_history')}</span>
    </div>`;
    return;
  }

  // Group by date
  const groups = {};
  hist.forEach(h => {
    const d = h.completedAt ? h.completedAt.split(' ')[0] : 'Unknown';
    if(!groups[d]) groups[d] = [];
    groups[d].push(h);
  });

  const todayStr = today();
  const yesterStr = (() => { const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0]; })();

  // Type config
  const cfg = {
    task:         { icon:'✅', label:'Task',          cls:'g' },
    task_deleted: { icon:'🗑', label:'Task (deleted)', cls:'r' },
    subtopic:     { icon:'📘', label:'Subtopic',       cls:'p' },
    timer:        { icon:'⏱', label:'Timer',          cls:'y' },
  };

  let html = '';
  Object.keys(groups).sort().reverse().forEach(date => {
    const label = date === todayStr ? 'Today' : date === yesterStr ? 'Yesterday' : date;
    html += `<div class="ch-date-label">${label}</div>`;
    groups[date].forEach(h => {
      const c   = cfg[h.type] || { icon:'•', label:h.type, cls:'p' };
      const time = h.completedAt ? (h.completedAt.split(' ')[1] || '') : '';
      const hid  = h.histId || '';

      let subLine = '';
      if(h.type === 'subtopic')
        subLine = `<span class="ch-chapter">${h.chapter||''} · ${h.subj||''}</span>`;
      else if(h.type === 'timer')
        subLine = `<span class="ch-chapter">⏱ ${h.duration || 25} min focus session</span>`;
      else
        subLine = `<span class="ch-chapter">${h.subj||''}</span>`;

      html += `<div class="ch-item" id="chi-${hid}">
        <div class="ch-icon ${c.cls}">${c.icon}</div>
        <div class="ch-info">
          <div class="ch-name">${h.name}</div>
          ${subLine}
        </div>
        <div class="ch-meta">
          <span class="ch-type ${c.cls}">${c.label}</span>
          <span class="ch-time">${time}</span>
        </div>
        <button class="ch-del-btn" onclick="event.stopPropagation();deleteHistItem('${hid}')" title="Delete">🗑</button>
      </div>`;
    });
  });
  el.innerHTML = html;
}

// ─── HELP SECTION ────────────────────────────
window.showHelpTab = (tab, el) => {
  if(tab==='faq') LS.s('air_faq_read',true); // Achievement: Knowledge Seeker
  document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.help-nav-btn').forEach(b => b.classList.remove('on'));
  const t = ge('help-' + tab); if(t) t.classList.add('on');
  if(el) el.classList.add('on');
};

window.toggleFaq = (el) => {
  const isOpen = el.classList.contains('open');
  // Close all others
  document.querySelectorAll('.help-faq-item.open').forEach(f => f.classList.remove('open'));
  if(!isOpen) el.classList.add('open');
};

// ─── INIT ────────────────────────────────────
window.addEventListener('DOMContentLoaded',()=>{
  // Apply saved theme background
  const savedThemeBg = LS.g('air_theme_bg', 'forest');
  _themeBg = savedThemeBg;
  applyTheme();

  refreshChapterData();
  loadCustomSubtopics();
  initCustomSound();
  markToday();
  showPage('home');
  updateFace();
  renderProfile();
  initNotifications();
  // Set install date (first time only)
  if(!LS.g('air_install_date',null)) LS.s('air_install_date', new Date().toISOString());
  // Deep Focus: mark if user keeps app open >= 1 hour
  if(!LS.g('air_deep_focus',false)){
    setTimeout(()=>{ LS.s('air_deep_focus',true); },3600000);
  }
  // Focus Master: 3 hours
  if(!LS.g('air_focus_master',false)){
    setTimeout(()=>{ LS.s('air_focus_master',true); },10800000);
  }
  // Marathoner: 5 hours
  initMarathonerTimer();
  // Elite timers
  initPowerUserTimer();
  initDeepWorkTimer();
  initGhostHunterTimer();
  // Legendary timers
  if(!LS.g('air_silent_sniper',false)){
    setTimeout(()=>{ LS.s('air_silent_sniper',true); },12*3600000);
  }
  // God of Focus: track 10h daily for 7 days
  (function trackGodOfFocus(){
    const today=new Date().toISOString().slice(0,10);
    setTimeout(()=>{
      const rec=LS.g('air_gof_days',[]);
      if(!rec.includes(today)){ rec.push(today); LS.s('air_gof_days',rec); }
      if(rec.length>=7) LS.s('air_god_of_focus',true);
    },10*3600000);
  })();
  // Arch Supreme: track per-subject custom completion
  // (checked dynamically in renderAchievements via existing custom logic)
  // Time-of-day tracking for achievements
  (function trackTimeAchievements(){
    const h = new Date().getHours();
    const today = new Date().toISOString().slice(0,10);
    // Night (11 PM – 2 AM) → Midnight Marauder, Night Watchman
    if(h>=23||h<2){
      const md=LS.g('air_midnight_days',[]);
      if(!md.includes(today)){ md.push(today); if(md.length>5)md.shift(); LS.s('air_midnight_days',md); }
      const nd=LS.g('air_night_days',[]);
      if(!nd.includes(today)){ nd.push(today); if(nd.length>10)nd.shift(); LS.s('air_night_days',nd); }
    }
    // Early morning (before 5 AM) → Early Predator
    if(h<5&&h>=0){
      const ed=LS.g('air_early_days',[]);
      if(!ed.includes(today)){ ed.push(today); if(ed.length>10)ed.shift(); LS.s('air_early_days',ed); }
    }
    // Before 6 AM → Sun Chaser
    if(h<6){
      const dd=LS.g('air_dawn_days',[]);
      if(!dd.includes(today)){ dd.push(today); if(dd.length>10)dd.shift(); LS.s('air_dawn_days',dd); }
    }
    // Weekend Zealot: track sat+sun pairs
    const dow=new Date().getDay();
    if(dow===6||dow===0){
      const ww=LS.g('air_ww_days',[]);
      if(!ww.includes(today)){ ww.push(today); LS.s('air_ww_days',ww); }
      // Check 4 complete weekends
      const sats=ww.filter(d=>new Date(d).getDay()===6);
      const suns=ww.filter(d=>new Date(d).getDay()===0);
      if(sats.length>=4&&suns.length>=4) LS.s('air_weekend_zealot',true);
    }
    // Page explorer — mark home visit
    LS.s('air_page_home',true);
    checkExplorerBadge();
  })();

  // Pre-fill modal fields
  const prof = PROFILE.get();
  if(ge('prof-name-inp'))     ge('prof-name-inp').value     = prof.name||'';
  if(ge('prof-email-inp'))    ge('prof-email-inp').value    = prof.email||'';
  if(ge('prof-phone-inp'))    ge('prof-phone-inp').value    = prof.phone||'';
  if(ge('prof-batch-inp'))    ge('prof-batch-inp').value    = prof.batch||'';
  if(ge('prof-examdate-inp')) ge('prof-examdate-inp').value = prof.examDate||'';
  if(ge('prof-goal-inp'))     ge('prof-goal-inp').value     = prof.dailyGoal||'6';
});



// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
const THEMES = {
  light: {
    '--bg':'#f0f2f8','--s1':'#ffffff','--s2':'#f5f7fc','--s3':'#eaecf4',
    '--b1':'#dde1f0','--b2':'#c8cde0','--b3':'#b0b7d0',
    '--txt':'#0f1630','--txt2':'#3d4a72','--txt3':'#8590b0',
    '--ap':'#2e7bff','--ap2':'#1a65e0','--ag':'#08b882','--ag2':'#07a272',
    '--ar':'#f03358','--ar2':'#d82248','--ay':'#e6a800','--am':'#7c5ce8',
    '--glow-p':'rgba(91,155,255,.18)','--glow-g':'rgba(16,212,154,.14)','--glow-r':'rgba(255,92,122,.14)'
  },
  dark: {
    '--bg':'#0d1117','--s1':'#161b22','--s2':'#1c2128','--s3':'#21262d',
    '--b1':'#30363d','--b2':'#3d444d','--b3':'#4d5562',
    '--txt':'#e6edf3','--txt2':'#b1bac4','--txt3':'#7d8590',
    '--ap':'#4d9fff','--ap2':'#3788e8','--ag':'#2dcc96','--ag2':'#22b582',
    '--ar':'#ff5c7a','--ar2':'#e8445f','--ay':'#f7c948','--am':'#9f7aea',
    '--glow-p':'rgba(77,159,255,.2)','--glow-g':'rgba(45,204,150,.16)','--glow-r':'rgba(255,92,122,.16)'
  },
  midnight: {
    '--bg':'#0a0e1a','--s1':'#0f1635','--s2':'#121c3e','--s3':'#172245',
    '--b1':'#1e2d5a','--b2':'#253570','--b3':'#2e3d80',
    '--txt':'#d0d8f0','--txt2':'#8899cc','--txt3':'#5566aa',
    '--ap':'#5b9bff','--ap2':'#4484e8','--ag':'#34d89c','--ag2':'#28c288',
    '--ar':'#ff6685','--ar2':'#ee5070','--ay':'#ffcc44','--am':'#a78bfa',
    '--glow-p':'rgba(91,155,255,.25)','--glow-g':'rgba(52,216,156,.18)','--glow-r':'rgba(255,102,133,.18)'
  },
  forest: {
    '--bg':'#0d1f0f','--s1':'#111f13','--s2':'#152718','--s3':'#1a2e1d',
    '--b1':'#1f3823','--b2':'#264530','--b3':'#2e5238',
    '--txt':'#c8e6c9','--txt2':'#88bb8e','--txt3':'#558060',
    '--ap':'#66bb6a','--ap2':'#4caf50','--ag':'#26d98a','--ag2':'#1ebe78',
    '--ar':'#ef5350','--ar2':'#e53935','--ay':'#ffd54f','--am':'#ab47bc',
    '--glow-p':'rgba(102,187,106,.22)','--glow-g':'rgba(38,217,138,.16)','--glow-r':'rgba(239,83,80,.15)'
  },
  sunset: {
    '--bg':'#1a0a0a','--s1':'#1f0e0e','--s2':'#241212','--s3':'#2a1515',
    '--b1':'#3d1a1a','--b2':'#4d2020','--b3':'#5c2828',
    '--txt':'#ffe8e8','--txt2':'#cc9999','--txt3':'#996666',
    '--ap':'#ff7043','--ap2':'#f4511e','--ag':'#ffca28','--ag2':'#ffb300',
    '--ar':'#ff4444','--ar2':'#ee2222','--ay':'#ffd740','--am':'#e040fb',
    '--glow-p':'rgba(255,112,67,.22)','--glow-g':'rgba(255,202,40,.16)','--glow-r':'rgba(255,68,68,.18)'
  },
  ocean: {
    '--bg':'#050d1a','--s1':'#081220','--s2':'#0b1828','--s3':'#0e1e30',
    '--b1':'#122440','--b2':'#162c50','--b3':'#1c3560',
    '--txt':'#b8d4f0','--txt2':'#7099cc','--txt3':'#446699',
    '--ap':'#40a9ff','--ap2':'#2090e8','--ag':'#20e3a0','--ag2':'#18cc8e',
    '--ar':'#ff5b8a','--ar2':'#ee4475','--ay':'#ffc444','--am':'#8b78fa',
    '--glow-p':'rgba(64,169,255,.24)','--glow-g':'rgba(32,227,160,.18)','--glow-r':'rgba(255,91,138,.18)'
  }
};

const FONTS = {};

let _themeBg = LS.g('air_theme_bg', 'forest');

function applyThemeBg(bg) {
  const t = THEMES[bg] || THEMES.midnight;
  const root = document.documentElement.style;
  Object.entries(t).forEach(([k, v]) => root.setProperty(k, v));
  document.body.style.background = t['--bg'];
  document.body.style.color = t['--txt'];
  const header = document.getElementById('main-header');
  if(header) {
    header.style.background = t['--bg'];
    header.style.borderBottomColor = t['--b1'];
  }
}

function applyTheme() {
  applyThemeBg(_themeBg);
  updateThemeUI();
}

function updateThemeUI() {
  // Background cards
  Object.keys(THEMES).forEach(bg => {
    const card = ge('tbg-' + bg);
    const check = card && card.querySelector('.theme-check');
    if(card) card.style.borderColor = bg === _themeBg ? 'var(--ap)' : 'var(--b2)';
    if(check) check.style.opacity   = bg === _themeBg ? '1' : '0';
  });
}

window.setThemeBg = (bg) => {
  _themeBg = bg;
  LS.s('air_theme_bg', bg);
  applyThemeBg(bg);
  updateThemeUI();
  showToast('🎨 Theme changed!', 1500);
};

// ─── LANGUAGE SYSTEM ─────────────────────────────────────────────────────────
let _lang = 'hi';

const I18N = {
  hi: {
    // Onboarding
    ob_s1_title: 'Swagat hai AIR Hunter mein!',
    ob_s1_sub: 'Pehle apna naam batao, taaki hum tumhein personally jaanein',
    ob_s2_title: 'Apna Avatar Chuno',
    ob_s2_sub: 'Ye tumhara profile icon hoga',
    ob_s3_title: 'Konsa Exam?',
    ob_s3_sub: 'Apna target exam aur class choose karo',
    ob_s4_title: 'Last Step!',
    ob_s4_sub: 'Ye baad mein bhi change kar sakte ho Profile mein',
    ob_name_lbl: 'TUMHARA NAAM *',
    ob_phone_lbl: 'PHONE (Optional)',
    ob_email_lbl: 'EMAIL (Optional)',
    ob_batch_lbl: 'BATCH / COACHING (Optional)',
    ob_examdate_lbl: 'EXAM DATE (Optional)',
    ob_goal_lbl: 'DAILY STUDY GOAL',
    ob_next: 'Aage Bado →',
    ob_back: '← Wapas',
    ob_finish: '🚀 App Shuru Karo!',
    // Profile
    goal_hint: 'Study karo aur Pomodoro timer start karo! ⏱',
    hrs_today: 'hrs today',
    exam_countdown: '⏳ EXAM COUNTDOWN',
    set_exam_date: 'Edit profile → exam date set karo',
    daily_goal_lbl: '📚 DAILY STUDY GOAL',
    subj_acc: '📊 SUBJECT ACCURACY',
    quick_access: '🔗 QUICK ACCESS',
    about_dev: '👨‍💻 ABOUT DEVELOPER',
    share_title: '📤 Share Your Progress',
    share_btn: '📋 Share Text Copy Karo',
    danger_btn: '🗑 Saara Data Delete Karo',
    danger_hint: 'Ye action undo nahi ho sakta',
    monthly_hist: '📅 Monthly History',
    save_profile: '💾 Save Profile',
    add_task: 'Add Task',
    save_formula: 'Save Formula',
    save_note: 'Save Note',
    // Toast
    welcome: '🎉 AIR Hunter mein swagat hai, ',
    // Confirm dialog
    confirm_ok: '✅ Haan, karo',
    confirm_cancel: 'Ruko',
    confirm_title: 'Confirm karo',
    // Timer
    focus_time: 'Focus time',
    break_time: '☕ Break time',
    // Streak
    streak_empty: 'Abhi tak koi streak nahi. 30 min study karo! 💪',
    // Chapter
    no_chapters: 'Koi chapter nahi. ＋ Chapter button se add karo!',
    // Goal hint variants
    goal_hint_progress: 'Bas thoda aur! Study jaari rakho 💪',
    goal_hint_done: 'Aaj ka goal poora! 🎉 Ek hunter ban gaye!',
    // Nav
    nav_home: 'HOME', nav_test: 'TEST', nav_more: 'MORE', nav_profile: 'PROFILE',
    // Home page cards
    this_month: 'IS MAHINE',
    todays_tasks: 'AAJ KE TASKS',
    high_backlog: '🔴 HIGH PRIORITY BACKLOG',
    view_all: 'Sab dekho →',
    focus_timer_lbl: '⏱ FOCUS TIMER',
    notif_lbl: '🔔 REMINDER NOTIFICATIONS',
    subj_acc_lbl: 'SUBJECT ACCURACY',
    backup_lbl: '💾 BACKUP & RESTORE',
    recent_attempts: 'RECENT ATTEMPTS',
    // App Settings section (new)
    settings_section: '⚙️ APP SETTINGS',
    backup_desc2: 'Apna sara data export karo — delete karne se pehle zaroor karo!',
    permissions_lbl: '🔔 APP PERMISSIONS',
    allow_notif_btn: '🔔 Notifications Allow Karo',
    danger_hint2: 'Ye action undo nahi ho sakta — pehle backup lo!',
    custom_sound_lbl: '🔊 CUSTOM ALARM SOUND',
    custom_sound_desc: 'Timer khatam hone par apni custom sound play hogi',
    // App Settings section (new)
    settings_section: '⚙️ APP SETTINGS',
    backup_desc2: 'Export all your data — do this before deleting!',
    permissions_lbl: '🔔 APP PERMISSIONS',
    allow_notif_btn: '🔔 Allow Notifications',
    danger_hint2: 'This action cannot be undone — backup first!',
    custom_sound_lbl: '🔊 CUSTOM ALARM SOUND',
    custom_sound_desc: 'Your chosen sound will play when the timer ends',
    danger_zone: '⚠ DANGER ZONE',
    // Sub-screen titles
    scr_backlog: '🗂 Backlog',
    scr_formula: '∑ Formula Sheet',
    scr_notes: '📋 Notes',
    scr_revision: '🔁 Spaced Revision',
    scr_mock: '🎯 Mock Tests',
    scr_timer: '⏱ Focus Timer',
    scr_analytics: '📊 Analytics',
    scr_completed: '✅ Completed History',
    scr_weak: '⚠️ Weak Chapters',
    scr_testsetup: '⚙ Test Setup',
    scr_qbank: '📚 Question Bank',
    scr_testhistory: '📊 Test History',
    scr_achievements: '🏆 Achievements',
    scr_help: '❓ Help & Guide',
    // Backlog priorities
    pri_high: '🔴 HIGH PRIORITY',
    pri_med: '🟡 MEDIUM PRIORITY',
    pri_low: '🟢 LOW PRIORITY',
    // Profile sections
    exam_type: '🎯 EXAM TYPE',
    class_lbl: '📘 CLASS',
    ach_title: 'Achievements',
    ach_sub: 'Badges earn karo',
    help_title: 'Help & Guide',
    help_sub: 'App guide · Tips · FAQ',
    stat_streak: 'Streak 🔥',
    // Modal titles
    modal_edit_profile: '✏ Edit Profile',
    modal_add_task: 'Aaj ka Task Add karo',
    modal_add_formula: 'Formula Add karo',
    modal_add_note: 'Important Note Add karo',
    modal_new_chapter: '＋ Naya Chapter',
    modal_edit_chapter: '✏ Chapter Edit karo',
    // Timer presets
    preset_focus: 'Focus', preset_deep: 'Deep', preset_flow: 'Flow',
    preset_break: 'Break', preset_rest: 'Rest',
    streak_alert: 'Streak Alert',
    add_task_btn: '＋ Add Task',
    acc_auto_info: '🤖 Accuracy auto-calculate hoti hai — 5 tests ke baad show hogi',
    no_tasks_text: 'Koi task nahi. Add karo!',
    // Empty states
    empty_formula: 'Koi formula nahi. Add karo!',
    empty_note: 'Koi note nahi. Add karo!',
    empty_revision: 'Koi revision topic nahi.',
    empty_mock: 'Koi mock result nahi.',
    empty_history: 'Koi history nahi mili.',
    empty_weak_no_mock: 'Abhi koi mock test add nahi kiya. "Mock Tests" mein jaake results add karo.',
    empty_weak_all_good: 'Sab tests mein 60%+ score! Koi weak test nahi. 🔥',
    // Weak screen subtitle
    weak_subtitle: '📌 Jo mock tests mein score 60% se neeche raha — subject, chapter, date aur time ke saath yahan dikh rahe hain',
    // Timer
    notif_banner: '🔔 Notifications allow karo reminders ke liye',
    notif_blocked: '❌ Blocked! Chrome → Settings → Site settings → Notifications → Allow karo',
    timer_custom_lbl: '⚙ Custom:',
    timer_custom_ph: 'Minutes (1–600)',
    score_trend: 'SCORE TREND',
    // Notifications
    study_reminder_title: 'Study Reminder',
    study_reminder_desc: 'Har 2 ghante mein yaad dilayega',
    streak_alert_desc: 'Raat 8 baje streak yaad dilayega',
    break_reminder_title: 'Break Reminder',
    break_reminder_desc: 'Pomodoro complete hone par buzz',
    // Analytics
    an_avg: 'AVG',
    an_best: 'BEST',
    an_streak_lbl: 'STREAK',
    backup_desc: 'Apna sara data JSON file mein export karo.',
    pdf_desc: 'Readable PDF summary bhi download kar sakte ho.',
    export_btn: '📥 Export JSON',
    restore_btn: '📤 Restore',
    pdf_btn: '📄 Download PDF Summary',
    // Completed history
    clear_all: 'Clear All',
    filter_tasks: 'Tasks',
    filter_subtopics: 'Subtopics',
    filter_timer: '⏱ Timer',
    // Streak calendar
    legend_studied: 'Studied 30+ min',
    legend_missed: 'Missed',
    legend_today: 'Today',
    manual_study_lbl: '📖 Manual study add:',
    // Clear data dialog
    clear_data_msg: 'Sab data delete ho jayega — tests, chapters, tasks sab. Ye undo nahi ho sakta!',
    clear_data_title: 'Saara Data Delete?',
    clear_data_ok: '🗑 Haan, delete karo',
    // Other confirm dialogs
    chapter_del_title: 'Chapter Delete?',
    chapter_del_ok: '🗑 Delete karo',
    attempt_del_title: 'Attempt Delete?',
    question_del_title: 'Question Delete?',
    restore_title: 'Data Restore?',
    restore_ok: '📤 Haan, restore karo',
    no_question_title: 'Koi Question Nahi',
    no_question_ok: '📝 Bank mein jao',
  },
  en: {
    // Onboarding
    ob_s1_title: 'Welcome to AIR Hunter!',
    ob_s1_sub: 'Tell us your name so we can personalise your experience',
    ob_s2_title: 'Choose Your Avatar',
    ob_s2_sub: 'This will be your profile icon',
    ob_s3_title: 'Which Exam?',
    ob_s3_sub: 'Select your target exam and class',
    ob_s4_title: 'Almost Done!',
    ob_s4_sub: 'You can change these anytime from your Profile',
    ob_name_lbl: 'YOUR NAME *',
    ob_phone_lbl: 'PHONE (Optional)',
    ob_email_lbl: 'EMAIL (Optional)',
    ob_batch_lbl: 'BATCH / COACHING (Optional)',
    ob_examdate_lbl: 'EXAM DATE (Optional)',
    ob_goal_lbl: 'DAILY STUDY GOAL',
    ob_next: 'Continue →',
    ob_back: '← Back',
    ob_finish: '🚀 Launch AIR Hunter!',
    // Profile
    goal_hint: 'Start studying and use the Pomodoro timer! ⏱',
    hrs_today: 'hrs today',
    exam_countdown: '⏳ EXAM COUNTDOWN',
    set_exam_date: 'Edit profile → set exam date',
    daily_goal_lbl: '📚 DAILY STUDY GOAL',
    subj_acc: '📊 SUBJECT ACCURACY',
    quick_access: '🔗 QUICK ACCESS',
    about_dev: '👨‍💻 ABOUT DEVELOPER',
    share_title: '📤 Share Your Progress',
    share_btn: '📋 Copy Share Text',
    danger_btn: '🗑 Delete All Data',
    danger_hint: 'This action cannot be undone',
    monthly_hist: '📅 Monthly History',
    save_profile: '💾 Save Profile',
    add_task: 'Add Task',
    save_formula: 'Save Formula',
    save_note: 'Save Note',
    // Toast
    welcome: '🎉 Welcome to AIR Hunter, ',
    // Confirm dialog
    confirm_ok: '✅ Yes, proceed',
    confirm_cancel: 'Cancel',
    confirm_title: 'Please Confirm',
    // Timer
    focus_time: 'Focus time',
    break_time: '☕ Break time',
    // Streak
    streak_empty: 'No streak yet. Study for 30 minutes to start! 💪',
    // Chapter
    no_chapters: 'No chapters yet. Add one using the ＋ Chapter button!',
    // Goal hint variants
    goal_hint_progress: 'Almost there! Keep studying 💪',
    goal_hint_done: "Today's goal complete! 🎉 You're a true hunter!",
    // Nav
    nav_home: 'HOME', nav_test: 'TEST', nav_more: 'MORE', nav_profile: 'PROFILE',
    // Home page cards
    this_month: 'THIS MONTH',
    todays_tasks: "TODAY'S TASKS",
    high_backlog: '🔴 HIGH PRIORITY BACKLOG',
    view_all: 'View All →',
    focus_timer_lbl: '⏱ FOCUS TIMER',
    notif_lbl: '🔔 REMINDER NOTIFICATIONS',
    subj_acc_lbl: 'SUBJECT ACCURACY',
    backup_lbl: '💾 BACKUP & RESTORE',
    recent_attempts: 'RECENT ATTEMPTS',
    danger_zone: '⚠ DANGER ZONE',
    // Sub-screen titles
    scr_backlog: '🗂 Backlog',
    scr_formula: '∑ Formula Sheet',
    scr_notes: '📋 Notes',
    scr_revision: '🔁 Spaced Revision',
    scr_mock: '🎯 Mock Tests',
    scr_timer: '⏱ Focus Timer',
    scr_analytics: '📊 Analytics',
    scr_completed: '✅ Completed History',
    scr_weak: '⚠️ Weak Chapters',
    scr_testsetup: '⚙ Test Setup',
    scr_qbank: '📚 Question Bank',
    scr_testhistory: '📊 Test History',
    scr_achievements: '🏆 Achievements',
    scr_help: '❓ Help & Guide',
    // Backlog priorities
    pri_high: '🔴 HIGH PRIORITY',
    pri_med: '🟡 MEDIUM PRIORITY',
    pri_low: '🟢 LOW PRIORITY',
    // Profile sections
    exam_type: '🎯 EXAM TYPE',
    class_lbl: '📘 CLASS',
    ach_title: 'Achievements',
    ach_sub: 'Earn badges',
    help_title: 'Help & Guide',
    help_sub: 'App guide · Tips · FAQ',
    stat_streak: 'Streak 🔥',
    // Modal titles
    modal_edit_profile: '✏ Edit Profile',
    modal_add_task: "Add Today's Task",
    modal_add_formula: 'Add Formula',
    modal_add_note: 'Add Important Note',
    modal_new_chapter: '＋ New Chapter',
    modal_edit_chapter: '✏ Edit Chapter',
    // Timer presets
    preset_focus: 'Focus', preset_deep: 'Deep', preset_flow: 'Flow',
    preset_break: 'Break', preset_rest: 'Rest',
    streak_alert: 'Streak Alert',
    add_task_btn: '＋ Add Task',
    acc_auto_info: '🤖 Accuracy is auto-calculated — will show after 5 tests',
    no_tasks_text: 'No tasks yet. Add one!',
    // Empty states
    empty_formula: 'No formulas yet. Add one!',
    empty_note: 'No notes yet. Add one!',
    empty_revision: 'No revision topics yet.',
    empty_mock: 'No mock results yet.',
    empty_history: 'No history found.',
    empty_weak_no_mock: 'No mock tests added yet. Go to "Mock Tests" to add results.',
    empty_weak_all_good: 'All tests above 60%! No weak tests. 🔥',
    // Weak screen subtitle
    weak_subtitle: '📌 Tests where score was below 60% — shown here with subject, chapter, date & time',
    // Timer
    notif_banner: '🔔 Allow notifications for reminders',
    notif_blocked: '❌ Blocked! Chrome → Settings → Site settings → Notifications → Allow',
    timer_custom_lbl: '⚙ Custom:',
    timer_custom_ph: 'Minutes (1–600)',
    score_trend: 'SCORE TREND',
    // Notifications
    study_reminder_title: 'Study Reminder',
    study_reminder_desc: 'Reminds you every 2 hours',
    streak_alert_desc: 'Streak reminder at 8 PM',
    break_reminder_title: 'Break Reminder',
    break_reminder_desc: 'Buzz when Pomodoro completes',
    // Analytics
    an_avg: 'AVG',
    an_best: 'BEST',
    an_streak_lbl: 'STREAK',
    backup_desc: 'Export all your data as a JSON file.',
    pdf_desc: 'Download a readable PDF summary.',
    export_btn: '📥 Export JSON',
    restore_btn: '📤 Restore',
    pdf_btn: '📄 Download PDF Summary',
    // Completed history
    clear_all: 'Clear All',
    filter_tasks: 'Tasks',
    filter_subtopics: 'Subtopics',
    filter_timer: '⏱ Timer',
    // Streak calendar
    legend_studied: 'Studied 30+ min',
    legend_missed: 'Missed',
    legend_today: 'Today',
    manual_study_lbl: '📖 Manual study add:',
    // Clear data dialog
    clear_data_msg: 'All data will be deleted — tests, chapters, tasks, everything. This cannot be undone!',
    clear_data_title: 'Delete All Data?',
    clear_data_ok: '🗑 Yes, delete',
    // Other confirm dialogs
    chapter_del_title: 'Delete Chapter?',
    chapter_del_ok: '🗑 Delete',
    attempt_del_title: 'Delete Attempt?',
    question_del_title: 'Delete Question?',
    restore_title: 'Restore Data?',
    restore_ok: '📤 Yes, restore',
    no_question_title: 'No Questions',
    no_question_ok: '📝 Go to Bank',
  }
};

function _t(key) {
  const L = I18N[_lang] || I18N.hi;
  return L[key] !== undefined ? L[key] : ((I18N.hi)[key] || key);
}

window.obSelectLang = (lang, el) => {
  _lang = lang;
  // Update card styles
  ['hi','en'].forEach(l => {
    const card = ge('ob-lang-' + l);
    const check = card ? card.querySelector('.ob-lang-check') : null;
    if(card) {
      card.style.borderColor = l === lang ? 'var(--ap)' : 'var(--b3)';
      card.style.background = l === lang ? 'rgba(91,155,255,.08)' : 'transparent';
    }
    if(check) check.style.opacity = l === lang ? '1' : '0';
  });
};


// ─── RENDER HELP (bilingual) ─────────────────────────────────────────────────
function renderHelp() {
  const hi = _lang !== 'en';

  // Nav buttons
  const navLabels = hi
    ? ['📱 App Guide', '📄 JSON', '💡 Tips', '🙋 FAQ']
    : ['📱 App Guide', '📄 JSON', '💡 Tips', '🙋 FAQ'];
  ['overview','json','tips','faq'].forEach((id,i) => {
    const btn = ge('help-nav-' + id);
    if(btn) btn.textContent = navLabels[i];
  });

  // Overview Tab
  const ov = ge('help-overview');
  if(ov) ov.innerHTML = hi ? `
    <div class="help-card">
      <div class="help-card-title">📱 App Overview</div>
      <div class="help-card-body">AIR Hunter ek complete JEE/NEET preparation tracker hai. Chapters track karo, tests do, aur apni progress dekho — sab ek jagah.</div>
    </div>
    <div class="help-card">
      <div class="help-card-title">🏠 HOME Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot p"></span><b>Accuracy Cards</b> — Physics, Chemistry, Maths/Bio accuracy (5+ tests ke baad auto calculate hogi)</div>
        <div class="help-item"><span class="help-dot p"></span><b>Monthly Calendar</b> — Har din ke tasks aur subtopics</div>
        <div class="help-item"><span class="help-dot p"></span><b>Streak</b> — Roz study karo, streak maintain karo 🔥</div>
        <div class="help-item"><span class="help-dot p"></span><b>Daily Study</b> — Pomodoro timer se automatically track hoga</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">📐 CHAPTERS Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot g"></span><b>Chapter Progress</b> — Har chapter ke subtopics tick karo</div>
        <div class="help-item"><span class="help-dot g"></span><b>Weak Chapters</b> — Low progress wale chapters filter karo</div>
        <div class="help-item"><span class="help-dot g"></span><b>Custom Chapters</b> — Apne chapters add kar sakte ho</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">🎯 TEST Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span><b>Quick Test</b> — Subject aur chapter choose karo, test lo</div>
        <div class="help-item"><span class="help-dot r"></span><b>Question Bank</b> — Apne questions manually add karo</div>
        <div class="help-item"><span class="help-dot r"></span><b>JSON Test</b> — ChatGPT/Claude se generate karke paste karo</div>
        <div class="help-item"><span class="help-dot r"></span><b>History</b> — Purane tests ka review karo</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">☰ MORE Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot y"></span><b>Tasks · Notes · Formulas</b> — Daily study management</div>
        <div class="help-item"><span class="help-dot y"></span><b>Mock Tests</b> — Full mock results track karo</div>
        <div class="help-item"><span class="help-dot y"></span><b>Pomodoro Timer</b> — Focus timer se study track hoga automatically</div>
        <div class="help-item"><span class="help-dot y"></span><b>Analytics · Backup</b> — Progress graphs aur data backup</div>
      </div>
    </div>` : `
    <div class="help-card">
      <div class="help-card-title">📱 App Overview</div>
      <div class="help-card-body">AIR Hunter is a complete JEE/NEET preparation tracker. Track chapters, take tests, and monitor your progress — all in one place.</div>
    </div>
    <div class="help-card">
      <div class="help-card-title">🏠 HOME Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot p"></span><b>Accuracy Cards</b> — Physics, Chemistry, Maths/Bio accuracy (auto-calculated after 5+ tests)</div>
        <div class="help-item"><span class="help-dot p"></span><b>Monthly Calendar</b> — Tasks and subtopics for each day</div>
        <div class="help-item"><span class="help-dot p"></span><b>Streak</b> — Study daily to maintain your streak 🔥</div>
        <div class="help-item"><span class="help-dot p"></span><b>Daily Study</b> — Automatically tracked via the Pomodoro timer</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">📐 CHAPTERS Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot g"></span><b>Chapter Progress</b> — Tick off subtopics for each chapter</div>
        <div class="help-item"><span class="help-dot g"></span><b>Weak Chapters</b> — Filter chapters with low progress</div>
        <div class="help-item"><span class="help-dot g"></span><b>Custom Chapters</b> — Add your own chapters</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">🎯 TEST Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span><b>Quick Test</b> — Choose subject and chapter, start the test</div>
        <div class="help-item"><span class="help-dot r"></span><b>Question Bank</b> — Manually add your own questions</div>
        <div class="help-item"><span class="help-dot r"></span><b>JSON Test</b> — Generate via ChatGPT/Claude and paste directly</div>
        <div class="help-item"><span class="help-dot r"></span><b>History</b> — Review your past test attempts</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">☰ MORE Page</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot y"></span><b>Tasks · Notes · Formulas</b> — Daily study management tools</div>
        <div class="help-item"><span class="help-dot y"></span><b>Mock Tests</b> — Track full mock test results</div>
        <div class="help-item"><span class="help-dot y"></span><b>Pomodoro Timer</b> — Study time tracked automatically</div>
        <div class="help-item"><span class="help-dot y"></span><b>Analytics · Backup</b> — Progress graphs and data backup</div>
      </div>
    </div>`;

  // JSON Tab
  const jt = ge('help-json');
  if(jt) jt.innerHTML = hi ? `
    <div class="help-card">
      <div class="help-card-title">📄 JSON Kya Hota Hai?</div>
      <div class="help-card-body">AIR Hunter mein questions JSON format mein paste karke test de sakte ho — koi file upload nahi, seedha text paste karo.</div>
    </div>
    <div class="help-card">
      <div class="help-card-title">✅ Question JSON Format</div>
      <div class="help-card-body">
        <div class="help-code-label">Test → JSON Test tab mein ye format:</div>
        <div class="help-code">[{"q":"Newton ka 2nd law?",
"a":["F=ma","F=mv","F=m/a","F=m+a"],
"ans":0,"subj":"p",
"chapter":"Laws of Motion"}]</div>
        <div class="help-fields">
          <div class="help-field"><span class="hf-key">"q"</span><span class="hf-desc">Question text</span></div>
          <div class="help-field"><span class="hf-key">"a"</span><span class="hf-desc">4 options ki array</span></div>
          <div class="help-field"><span class="hf-key">"ans"</span><span class="hf-desc">Sahi answer index: 0/1/2/3</span></div>
          <div class="help-field"><span class="hf-key">"subj"</span><span class="hf-desc">"p" Phy · "g" Chem · "r" Maths/Bio</span></div>
        </div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">⚡ ChatGPT/Claude Prompt</div>
      <div class="help-card-body">
        <div class="help-code">Kinematics ke 10 JEE MCQ do.
Format: [{"q":"...","a":["...","...","...","..."],
"ans":0,"subj":"p","chapter":"Kinematics"}]</div>
      </div>
    </div>
    <div class="help-card" style="border-color:rgba(46,123,255,.3);background:rgba(46,123,255,.04)">
      <div class="help-card-title" style="color:var(--ap)">📸 PDF / Image → JSON (Fastest Way!)</div>
      <div class="help-card-body">
        <div style="font-size:12px;color:var(--txt2);line-height:1.6;margin-bottom:12px">Agar tumhare paas <b>question paper PDF</b> hai, ya phone se <b>photo click ki</b> hai — seedha kisi bhi AI mein daalo aur neeche wala prompt copy karke paste karo. AI automatically JSON bana dega! 🔥</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>PDF ya image kholo</b> — ChatGPT, Gemini, Claude — koi bhi AI chalega</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>File attach karo</b> — Paperclip icon se PDF ya image upload karo</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>Prompt copy karo</b> aur AI mein paste karo</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ag);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>AI ka response copy karo</b> → AIR Hunter → Test → JSON Test mein paste karo ✅</div></div>
        </div>
        <div style="font-size:10px;font-weight:800;color:var(--txt3);letter-spacing:1px;font-family:var(--fm);margin-bottom:6px">📋 YE PROMPT COPY KARO:</div>
        <div style="position:relative"><div class="help-code" id="pdf-prompt-box" style="font-size:10.5px;line-height:1.65;padding-right:44px;user-select:all">Is PDF/image mein jo bhi MCQ questions hain, unhe is exact JSON format mein convert karo — koi extra text mat likho, sirf JSON do:

[
  {
    "q": "Question text yahan",
    "a": ["Option A", "Option B", "Option C", "Option D"],
    "ans": 0,
    "subj": "p",
    "chapter": "Chapter Name"
  }
]

Rules:
- "ans" mein sahi option ka index likho (0=A, 1=B, 2=C, 3=D)
- "subj": Physics="p", Chemistry="g", Maths/Bio="r"
- Sirf pure JSON do, koi explanation nahi</div><button onclick="copyPdfPrompt()" id="pdf-copy-btn" style="position:absolute;top:8px;right:8px;background:var(--ap);border:none;color:#fff;border-radius:8px;padding:5px 9px;font-size:11px;font-weight:800;cursor:pointer;font-family:var(--fm)">COPY</button></div>
        <div style="font-size:10px;font-weight:800;color:var(--txt3);letter-spacing:1px;font-family:var(--fm);margin:12px 0 7px">🤖 KIS AI MEIN DAALO:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
          <a href="https://chat.openai.com" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">🤖</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">ChatGPT</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://gemini.google.com" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">✨</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Gemini</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://claude.ai" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">🧠</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Claude</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://manus.im" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">⚡</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Manus</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">Image ✓</div></div></a>
        </div>
        <div style="margin-top:12px;background:rgba(8,184,130,.08);border:1px solid rgba(8,184,130,.2);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--txt2);line-height:1.5">💡 <b>Pro Tip:</b> Agar response mein <code style="background:var(--s3);padding:1px 4px;border-radius:4px;font-size:10px">\`\`\`json</code> wali formatting aaye — sirf <b>[ ]</b> ke andar wala part copy karo.</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">❌ Common Mistakes</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span>Array hamesha <b>[ ]</b> se shuru honi chahiye</div>
        <div class="help-item"><span class="help-dot r"></span>"ans" 0-3 mein hona chahiye (1-4 nahi)</div>
        <div class="help-item"><span class="help-dot g"></span>Tip: jsonlint.com pe validate kar lo</div>
      </div>
    </div>` : `
    <div class="help-card">
      <div class="help-card-title">📄 What is JSON?</div>
      <div class="help-card-body">In AIR Hunter, you can paste questions in JSON format to take tests — no file upload needed, just paste the text directly.</div>
    </div>
    <div class="help-card">
      <div class="help-card-title">✅ Question JSON Format</div>
      <div class="help-card-body">
        <div class="help-code-label">Paste this format in Test → JSON Test tab:</div>
        <div class="help-code">[{"q":"Newton's 2nd law?",
"a":["F=ma","F=mv","F=m/a","F=m+a"],
"ans":0,"subj":"p",
"chapter":"Laws of Motion"}]</div>
        <div class="help-fields">
          <div class="help-field"><span class="hf-key">"q"</span><span class="hf-desc">Question text</span></div>
          <div class="help-field"><span class="hf-key">"a"</span><span class="hf-desc">Array of 4 options</span></div>
          <div class="help-field"><span class="hf-key">"ans"</span><span class="hf-desc">Correct answer index: 0/1/2/3</span></div>
          <div class="help-field"><span class="hf-key">"subj"</span><span class="hf-desc">"p" Phy · "g" Chem · "r" Maths/Bio</span></div>
        </div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">⚡ ChatGPT/Claude Prompt</div>
      <div class="help-card-body">
        <div class="help-code">Give me 10 JEE MCQs on Kinematics.
Format: [{"q":"...","a":["...","...","...","..."],
"ans":0,"subj":"p","chapter":"Kinematics"}]</div>
      </div>
    </div>
    <div class="help-card" style="border-color:rgba(46,123,255,.3);background:rgba(46,123,255,.04)">
      <div class="help-card-title" style="color:var(--ap)">📸 PDF / Image → JSON (Fastest Way!)</div>
      <div class="help-card-body">
        <div style="font-size:12px;color:var(--txt2);line-height:1.6;margin-bottom:12px">Have a <b>question paper PDF</b> or a <b>photo</b> of questions? Drop it into any AI, paste the prompt below, and get instant JSON you can paste straight into AIR Hunter! 🔥</div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">1</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>Open any AI</b> — ChatGPT, Gemini, Claude — all work great</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">2</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>Attach your file</b> — Upload PDF or photo using the paperclip icon</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ap);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">3</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>Copy the prompt below</b> and paste it into the AI — hit Send</div></div>
          <div style="display:flex;align-items:flex-start;gap:10px"><div style="min-width:24px;height:24px;border-radius:50%;background:var(--ag);color:#fff;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">4</div><div style="font-size:12px;color:var(--txt2);line-height:1.5"><b>Copy the AI response</b> → AIR Hunter → Test → JSON Test → Paste ✅</div></div>
        </div>
        <div style="font-size:10px;font-weight:800;color:var(--txt3);letter-spacing:1px;font-family:var(--fm);margin-bottom:6px">📋 COPY THIS PROMPT:</div>
        <div style="position:relative"><div class="help-code" id="pdf-prompt-box" style="font-size:10.5px;line-height:1.65;padding-right:44px;user-select:all">Convert all MCQ questions in this PDF/image to the exact JSON format below — output only the JSON, no extra text:

[
  {
    "q": "Question text here",
    "a": ["Option A", "Option B", "Option C", "Option D"],
    "ans": 0,
    "subj": "p",
    "chapter": "Chapter Name"
  }
]

Rules:
- "ans" is the correct option index (0=A, 1=B, 2=C, 3=D)
- "subj": Physics="p", Chemistry="g", Maths/Bio="r"
- Output only pure JSON, no explanations</div><button onclick="copyPdfPrompt()" id="pdf-copy-btn" style="position:absolute;top:8px;right:8px;background:var(--ap);border:none;color:#fff;border-radius:8px;padding:5px 9px;font-size:11px;font-weight:800;cursor:pointer;font-family:var(--fm)">COPY</button></div>
        <div style="font-size:10px;font-weight:800;color:var(--txt3);letter-spacing:1px;font-family:var(--fm);margin:12px 0 7px">🤖 WHICH AI TO USE:</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
          <a href="https://chat.openai.com" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">🤖</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">ChatGPT</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://gemini.google.com" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">✨</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Gemini</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://claude.ai" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">🧠</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Claude</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">PDF + Image ✓</div></div></a>
          <a href="https://manus.im" target="_blank" style="display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:10px;padding:9px 10px;text-decoration:none"><span style="font-size:18px">⚡</span><div><div style="font-size:11px;font-weight:800;color:var(--txt1)">Manus</div><div style="font-size:9px;color:var(--txt3);font-family:var(--fm)">Image ✓</div></div></a>
        </div>
        <div style="margin-top:12px;background:rgba(8,184,130,.08);border:1px solid rgba(8,184,130,.2);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--txt2);line-height:1.5">💡 <b>Pro Tip:</b> If the response contains <code style="background:var(--s3);padding:1px 4px;border-radius:4px;font-size:10px">\`\`\`json</code> formatting — just copy the part inside <b>[ ]</b>.</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">❌ Common Mistakes</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span>The array must always start with <b>[ ]</b></div>
        <div class="help-item"><span class="help-dot r"></span>"ans" must be between 0–3 (not 1–4)</div>
        <div class="help-item"><span class="help-dot g"></span>Tip: Validate your JSON at jsonlint.com</div>
      </div>
    </div>`;

  // Tips Tab
  const tp = ge('help-tips');
  if(tp) tp.innerHTML = hi ? `
    <div class="help-card">
      <div class="help-card-title">🔥 Streak Kaise Maintain Karo</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot y"></span>Roz Pomodoro timer chalao — 30 min complete hone pe streak count hoga</div>
        <div class="help-item"><span class="help-dot y"></span>Streak badges: 3🔥 · 7💎 · 30👑 · 100🌟</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">⏱ Pomodoro Best Use</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot p"></span>Custom timer set karo jitni der padhna ho — wahi time daily study mein count hoga</div>
        <div class="help-item"><span class="help-dot p"></span>Timer khatam karo, break lo, phir aur time add karo — cumulative track hota hai</div>
        <div class="help-item"><span class="help-dot p"></span>Daily goal Profile mein set karo — Pomodoro se auto track hota hai</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">📊 Accuracy Kaise Badhao</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot g"></span>5 tests complete karo — phir subject-wise accuracy automatically calculate hogi</div>
        <div class="help-item"><span class="help-dot g"></span>Pehle chapters complete karo, phir test do</div>
        <div class="help-item"><span class="help-dot g"></span>Weak chapters backlog mein add karo aur revisit karo</div>
        <div class="help-item"><span class="help-dot g"></span>Test ke baad review mode mein galat answers samjho</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">💾 Data Safe Karna</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span>More → Analytics → Backup → Export karo</div>
        <div class="help-item"><span class="help-dot r"></span>JSON file WhatsApp pe apne aap ko bhej do</div>
        <div class="help-item"><span class="help-dot r"></span>Phone format karne se <b>pehle</b> backup lo!</div>
      </div>
    </div>` : `
    <div class="help-card">
      <div class="help-card-title">🔥 How to Maintain Your Streak</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot y"></span>Run the Pomodoro timer daily — streak counts once you complete 30 minutes</div>
        <div class="help-item"><span class="help-dot y"></span>Streak badges: 3🔥 · 7💎 · 30👑 · 100🌟</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">⏱ Best Use of the Pomodoro Timer</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot p"></span>Set a custom timer for however long you want to study — that exact time is added to daily study</div>
        <div class="help-item"><span class="help-dot p"></span>Finish a session, take a break, add more time — it all adds up cumulatively</div>
        <div class="help-item"><span class="help-dot p"></span>Set your daily goal in Profile — the Pomodoro timer tracks it automatically</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">📊 How to Improve Accuracy</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot g"></span>Complete 5 tests — subject-wise accuracy is calculated automatically after that</div>
        <div class="help-item"><span class="help-dot g"></span>Complete chapters first, then attempt the test</div>
        <div class="help-item"><span class="help-dot g"></span>Add weak chapters to backlog and revisit them</div>
        <div class="help-item"><span class="help-dot g"></span>Use review mode after each test to understand wrong answers</div>
      </div>
    </div>
    <div class="help-card">
      <div class="help-card-title">💾 Keep Your Data Safe</div>
      <div class="help-card-body">
        <div class="help-item"><span class="help-dot r"></span>Go to More → Analytics → Backup → Export</div>
        <div class="help-item"><span class="help-dot r"></span>Send the JSON file to yourself on WhatsApp</div>
        <div class="help-item"><span class="help-dot r"></span>Always back up <b>before</b> resetting your phone!</div>
      </div>
    </div>`;

  // FAQ Tab
  const fq = ge('help-faq');
  if(fq) fq.innerHTML = hi ? `
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Data kahan save hota hai? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Sab data aapke phone ke browser localStorage mein save hota hai. Koi server nahi, koi internet nahi chahiye. Lekin browser data clear karne se delete ho sakta hai — isliye regular backup lo.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">JEE se NEET switch kiya to data jaayega? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Tasks, notes, formulas, test history sab safe rahega. Sirf chapter progress alag ho jayegi kyunki chapters different hain.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Test mein negative marking hai? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Haan! JEE pattern: Sahi = +4, Galat = -1, Skip = 0. Score results mein dono dikhte hain.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Notifications kaam nahi kar rahi? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Chrome settings → Site settings → Notifications → Allow karo. Phir app ko "Add to Home Screen" karo.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">App offline kaam karta hai? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Haan! 100% offline. Sirf Google Fonts ke liye internet chahiye — baaki sab local hai.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Naya phone mein data kaise transfer karo? <span class="faq-arrow">▼</span></div><div class="help-faq-a">More → Analytics → Backup → Export. WhatsApp pe bhejo. Naye phone mein HTML file kholo, same jagah se Import karo.</div></div>` : `
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Where is my data saved? <span class="faq-arrow">▼</span></div><div class="help-faq-a">All data is saved in your browser's localStorage on your device. No server, no internet required. However, clearing browser data will delete it — back up regularly.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Will I lose data if I switch from JEE to NEET? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Tasks, notes, formulas, and test history are all preserved. Only chapter progress will differ since the chapter lists are different for each exam.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Is there negative marking in tests? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Yes! JEE pattern: Correct = +4, Wrong = −1, Skip = 0. Both raw and adjusted scores are shown in results.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Notifications aren't working? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Go to Chrome Settings → Site Settings → Notifications → Allow. Then add the app to your Home Screen for best results.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">Does the app work offline? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Yes! 100% offline. Only Google Fonts require an internet connection — everything else runs locally.</div></div>
    <div class="help-faq-item" onclick="toggleFaq(this)"><div class="help-faq-q">How do I transfer data to a new phone? <span class="faq-arrow">▼</span></div><div class="help-faq-a">Go to More → Analytics → Backup → Export. Send the file to yourself. On your new phone, open the HTML file and Import from the same location.</div></div>`;
}

// ─── RENDER ABOUT DEVELOPER (bilingual) ──────────────────────────────────────
function renderAboutDev() {
  const card = ge('about-dev-card');
  if(!card) return;
  const hi = _lang !== 'en';

  const title     = hi ? 'Anurag Kaushik' : 'Anurag Kaushik';
  const subtitle  = hi
    ? 'Founder & CEO, Clock AI | Building "AIR Hunter" – The Ultimate Study Strategy Engine 🏹'
    : 'Founder & CEO, Clock AI | Building "AIR Hunter" – The Ultimate Study Strategy Engine 🏹';

  const bio = hi
    ? `"Main hamesha se maanta hoon ki competitive exams sirf mehnat se nahi, sahi <b style="color:#fbbf24">'Hunting Strategy'</b> se jeete jaate hain. Clock AI ka Founder aur CEO hone ke naate, mera mission education ko gamify karna aur har aspirant ko ek <b style="color:#7eb3ff">disciplined predator</b> mein badalna hai.`
    : `"I have always believed that competitive exams are not won by hard work alone, but by the right <b style="color:#fbbf24">'Hunting Strategy'</b>. As the Founder and CEO of Clock AI, my mission is to gamify education and transform every aspirant into a <b style="color:#7eb3ff">disciplined predator</b>.`;

  const para2 = hi
    ? `Humne AIR Hunter ko isliye design kiya hai taaki students apne syllabus ko track hi nahi, balki use <span style="color:#34d399;font-weight:700">'hunt'</span> karein. <span style="color:rgba(255,255,255,.85)">150+ logic-based achievement badges</span> aur real-time analytics ke saath, hum padhai ko ek <span style="color:#c084fc;font-weight:700">mission</span> banate hain jahan target sirf pass hona nahi, balki <span style="color:#fbbf24;font-weight:700">All India Rank haasil karna hai. 🎯</span>`
    : `We designed AIR Hunter so that students don't just track their syllabus — they <span style="color:#34d399;font-weight:700">hunt</span> it. With <span style="color:rgba(255,255,255,.85)">150+ logic-based achievement badges</span> and real-time analytics, we turn studying into a <span style="color:#c084fc;font-weight:700">mission</span> where the goal is not just to pass, but to achieve an <span style="color:#fbbf24;font-weight:700">All India Rank (AIR). 🎯</span>`;

  const para3 = hi
    ? `Jab hum technology aur human potential ko sahi tarah se sync karte hain, toh success koi accident nahi, balki ek <span style="color:#f97316;font-weight:700">inevitable result</span> ban jati hai. Let's hunt the rank! 🥂"`
    : `When technology and human potential are perfectly synchronized, success stops being an accident — it becomes an <span style="color:#f97316;font-weight:700">inevitable result</span>. Let's hunt the rank! 🥂"`;

  card.style.cssText = 'background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);border-radius:18px;overflow:hidden;margin-bottom:12px;position:relative';
  card.innerHTML = `
    <!-- Glow accents -->
    <div style="position:absolute;top:-24px;right:-24px;width:100px;height:100px;background:radial-gradient(circle,rgba(46,123,255,.28),transparent 70%);pointer-events:none"></div>
    <div style="position:absolute;bottom:-18px;left:-18px;width:80px;height:80px;background:radial-gradient(circle,rgba(255,176,0,.16),transparent 70%);pointer-events:none"></div>

    <!-- Header row — always visible, tap to expand -->
    <div onclick="toggleAboutDev()" style="display:flex;align-items:center;gap:12px;padding:16px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none">
      <img src="data:image/jpeg;base64,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" style="width:50px;height:50px;border-radius:50%;object-fit:cover;object-position:center top;flex-shrink:0;box-shadow:0 3px 14px rgba(46,123,255,.4);border:2px solid rgba(46,123,255,.5)" alt="Anurag Kaushik">
      <div style="flex:1;min-width:0">
        <div style="font-size:15px;font-weight:900;color:#fff;letter-spacing:-.2px">${title}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.55);font-family:var(--fm);margin-top:3px;line-height:1.4">${subtitle}</div>
      </div>
      <div id="about-dev-chev" style="font-size:18px;color:rgba(255,255,255,.45);transition:transform .3s;flex-shrink:0">▾</div>
    </div>

    <!-- Expandable body -->
    <div id="about-dev-body" style="max-height:0;overflow:hidden;transition:max-height .45s cubic-bezier(.4,0,.2,1),opacity .3s;opacity:0">
      <div style="padding:0 16px 16px">

        <!-- Badges -->
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">
          <span style="background:rgba(46,123,255,.25);border:1px solid rgba(46,123,255,.4);color:#7eb3ff;font-size:8px;font-weight:800;font-family:var(--fm);padding:3px 9px;border-radius:20px;letter-spacing:.5px">🚀 FOUNDER</span>
          <span style="background:rgba(168,85,247,.2);border:1px solid rgba(168,85,247,.35);color:#c084fc;font-size:8px;font-weight:800;font-family:var(--fm);padding:3px 9px;border-radius:20px;letter-spacing:.5px">⚙️ CEO</span>
          <span style="background:rgba(255,176,0,.2);border:1px solid rgba(255,176,0,.35);color:#fbbf24;font-size:8px;font-weight:800;font-family:var(--fm);padding:3px 9px;border-radius:20px;letter-spacing:.5px">🎓 ED-TECH</span>
          <span style="background:rgba(16,184,130,.2);border:1px solid rgba(16,184,130,.3);color:#34d399;font-size:8px;font-weight:800;font-family:var(--fm);padding:3px 9px;border-radius:20px;letter-spacing:.5px">🕐 CLOCK AI</span>
        </div>

        <!-- Quote card -->
        <div style="background:rgba(0,0,0,.35);border:1px solid rgba(255,176,0,.22);border-radius:14px;padding:14px;position:relative">
          <div style="position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#ff8c00,#ffd700,#ff8c00);border-radius:14px 14px 0 0"></div>
          <div style="font-size:10px;font-weight:900;color:#ffd700;letter-spacing:.6px;margin-bottom:10px">💬 WORDS FROM THE CEO</div>
          <div style="font-size:28px;color:rgba(255,176,0,.18);font-family:Georgia,serif;line-height:.5;margin-bottom:8px">"</div>
          <p style="font-size:11.5px;color:rgba(255,255,255,.72);font-family:var(--fm);line-height:1.8;margin:0 0 10px">${bio}</p>
          <p style="font-size:11.5px;color:rgba(255,255,255,.72);font-family:var(--fm);line-height:1.8;margin:0 0 10px">${para2}</p>
          <p style="font-size:11.5px;color:rgba(255,255,255,.72);font-family:var(--fm);line-height:1.8;margin:0">${para3}</p>
          <div style="display:flex;align-items:center;justify-content:flex-end;padding-top:10px;margin-top:10px;border-top:1px solid rgba(255,255,255,.08)">
            <div style="font-size:8.5px;color:rgba(255,255,255,.4);font-family:var(--fm);text-align:right">— Anurag Kaushik<br><span style="color:rgba(255,176,0,.6)">Founder & CEO, Clock AI</span></div>
          </div>
        </div>

        <!-- Bottom mini cards -->
        <div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:rgba(46,123,255,.12);border:1px solid rgba(46,123,255,.2);border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:20px;margin-bottom:4px">🏹</div>
            <div style="font-size:9px;font-weight:800;color:#7eb3ff;letter-spacing:.3px">AIR HUNTER</div>
            <div style="font-size:8px;color:rgba(255,255,255,.4);font-family:var(--fm);margin-top:2px">Flagship Product</div>
          </div>
          <div style="background:rgba(255,176,0,.1);border:1px solid rgba(255,176,0,.2);border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:20px;margin-bottom:4px">🎯</div>
            <div style="font-size:9px;font-weight:800;color:#fbbf24;letter-spacing:.3px">MISSION</div>
            <div style="font-size:8px;color:rgba(255,255,255,.4);font-family:var(--fm);margin-top:2px">Hunt The Rank</div>
          </div>
        </div>

      </div>
    </div>`;
}

function applyLang() {
  const L = I18N[_lang] || I18N.hi;
  // Helper: set text of element by id
  const st = (id, key) => { const el = ge(id); if(el) el.textContent = L[key] || el.textContent; };
  const sp = (id, val) => { const el = ge(id); if(el) el.textContent = val; };
  // Onboarding texts
  st('ob-s1-title', 'ob_s1_title');
  st('ob-s1-sub',   'ob_s1_sub');
  st('ob-s2-title', 'ob_s2_title');
  st('ob-s2-sub',   'ob_s2_sub');
  st('ob-s3-title', 'ob_s3_title');
  st('ob-s3-sub',   'ob_s3_sub');
  st('ob-s4-title', 'ob_s4_title');
  st('ob-s4-sub',   'ob_s4_sub');
  // Onboarding labels
  st('ob-name-lbl',     'ob_name_lbl');
  st('ob-phone-lbl',    'ob_phone_lbl');
  st('ob-email-lbl',    'ob_email_lbl');
  st('ob-batch-lbl',    'ob_batch_lbl');
  st('ob-examdate-lbl', 'ob_examdate_lbl');
  st('ob-goal-lbl',     'ob_goal_lbl');
  // Onboarding buttons
  ['ob-btn-1','ob-btn-2','ob-btn-3'].forEach(id => st(id, 'ob_next'));
  ['ob-back-2','ob-back-3','ob-back-4'].forEach(id => st(id, 'ob_back'));
  st('ob-finish-btn', 'ob_finish');
  // data-i18n elements (in main app)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(L[key] !== undefined) el.textContent = L[key];
  });
  // Profile goal hint (also set via renderStreakProgress)
  const gh = ge('prof-goal-hint');
  if(gh && gh.getAttribute('data-i18n') === 'goal_hint') gh.textContent = L.goal_hint;
  // Profile language toggle button highlights
  ['hi','en'].forEach(l => {
    const btn = ge('lang-btn-' + l);
    if(btn) {
      btn.style.borderColor = l === _lang ? 'var(--ap)' : 'var(--b3)';
      btn.style.background  = l === _lang ? 'rgba(91,155,255,.08)' : 'transparent';
    }
  });
  // Render dynamic sections
  renderHelp();
  renderAboutDev();
  // Re-render tasks so empty state text updates
  if(typeof renderTasks === 'function') renderTasks();
  // Re-render all other dynamic sections
  if(typeof renderFormulas === 'function') renderFormulas();
  if(typeof renderNotes === 'function') renderNotes();
  if(typeof renderRevision === 'function') renderRevision();
  if(typeof renderMocks === 'function') renderMocks();
  if(typeof renderWeak === 'function') renderWeak();
  if(typeof renderCompHistory === 'function') renderCompHistory();
  // Re-render profile so countdown text updates with language
  if(typeof renderProfile === 'function') renderProfile();
}

// ─── ONBOARDING SYSTEM ───────────────────────────────────────────────────────
let _obExam = 'jee', _obCls = '11', _obAvatar = '🎯';

function isProfileComplete() {
  return !!LS.g('air_profile_complete', false);
}

function loadSavedLang() {
  const saved = LS.g('air_lang', null);
  if(saved) { _lang = saved; }
  applyLang();
}

function loadSavedTheme() {
  _themeBg = LS.g('air_theme_bg', 'forest');
  applyTheme();
}

window.changeLang = (lang) => {
  _lang = lang;
  LS.s('air_lang', lang);
  applyLang();
  // Re-render dynamic sections so JS-generated text updates too
  try { renderChapterList(); } catch(e) {}
  try { renderStreak(); } catch(e) {}
  try { renderProfile(); } catch(e) {}
  try { renderStreakProgress(); } catch(e) {}
  try { renderTasks(); } catch(e) {}
  try { updateFace(); } catch(e) {}
  showToast(lang === 'en' ? '🌐 Language changed to English!' : '🌐 भाषा हिंदी में बदली!', 2000);
};


// ─── ONBOARDING WELCOME SCREEN (New / Old User) ──────────────────────────────
let _obRestoredData = null; // holds parsed backup before confirming

window.obWelcomeNew = () => {
  // New user → go straight to language selection
  obGoToStep(0);
};

window.obWelcomeOld = () => {
  _obRestoredData = null;
  // reset file panel
  const statusEl = ge('ob-restore-status');
  const loginBtn = ge('ob-restore-login-btn');
  const fileArea = ge('ob-restore-file-area');
  if(statusEl){ statusEl.textContent=''; statusEl.style.color='var(--ag)'; }
  if(loginBtn) loginBtn.style.display='none';
  if(fileArea){ fileArea.style.borderColor='var(--b2)'; const lbl=ge('ob-restore-file-label'); if(lbl) lbl.textContent='JSON File Choose Karo / Select JSON File'; }
  // reset paste panel
  const pi=ge('ob-paste-inp'); const ps=ge('ob-paste-status'); const pb=ge('ob-paste-restore-btn');
  if(pi) pi.value='';
  if(ps){ ps.textContent=''; }
  if(pb) pb.style.display='none';
  obRestoreTab('file');
  obGoToStep('restore');
};

window.obRestoreTab = (tab) => {
  const fp=ge('ob-panel-file'), pp=ge('ob-panel-paste');
  const fb=ge('ob-tab-file'),   pb=ge('ob-tab-paste');
  const isFile = tab==='file';
  if(fp) fp.style.display = isFile?'flex':'none';
  if(pp) pp.style.display = isFile?'none':'flex';
  if(fb){ fb.style.background=isFile?'var(--ap)':'transparent'; fb.style.color=isFile?'#fff':'var(--txt3)'; fb.style.boxShadow=isFile?'0 2px 8px rgba(46,123,255,.3)':'none'; }
  if(pb){ pb.style.background=isFile?'transparent':'var(--ap)'; pb.style.color=isFile?'var(--txt3)':'#fff'; pb.style.boxShadow=isFile?'none':'0 2px 8px rgba(46,123,255,.3)'; }
};

window.obLivePasteCheck = () => {
  const inp=ge('ob-paste-inp'), status=ge('ob-paste-status'), btn=ge('ob-paste-restore-btn');
  if(!inp) return;
  const raw=inp.value.trim();
  if(!raw){ if(status) status.textContent=''; if(btn) btn.style.display='none'; _obRestoredData=null; return; }
  try{
    const data=JSON.parse(raw);
    if(!data.version||!data.prepData){
      if(status){ status.style.color='var(--ar)'; status.textContent='❌ Invalid backup JSON — sahi data paste karo / paste valid backup JSON'; }
      if(btn) btn.style.display='none'; _obRestoredData=null; return;
    }
    _obRestoredData=data;
    const d=data.exportedAt?new Date(data.exportedAt).toLocaleDateString('en-IN'):'?';
    const n=data.prepData?.profile?.name||'';
    if(status){ status.style.color='var(--ag)'; status.textContent='✅ Backup mila'+(n?' — '+n:'')+'! ('+d+') · Valid backup found!'; }
    if(btn) btn.style.display='';
  }catch(e){
    if(status){ status.style.color='var(--ar)'; status.textContent='❌ JSON parse error — check pasted text'; }
    if(btn) btn.style.display='none'; _obRestoredData=null;
  }
};

window.obRestoreFromPaste = () => {
  if(!_obRestoredData){ showToast('Pehle valid JSON paste karo!',1500); return; }
  const btn=ge('ob-paste-restore-btn');
  if(btn){ btn.textContent='⏳ Restore ho raha hai...'; btn.disabled=true; }
  obRestoreAndContinue();
};

window.obHandleRestoreFile = (e) => {
  const file = e.target.files[0]; if(!file) return;
  const statusEl = ge('ob-restore-status');
  const loginBtn = ge('ob-restore-login-btn');
  const fileArea = ge('ob-restore-file-area');
  const lbl = ge('ob-restore-file-label');

  if(statusEl) statusEl.textContent = '⏳ File padh raha hai...';

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if(!data.version || !data.prepData) {
        if(statusEl) statusEl.style.color = 'var(--ar)';
        if(statusEl) statusEl.textContent = '❌ Invalid backup file! Sahi JSON file select karo.';
        if(fileArea) fileArea.style.borderColor = 'var(--ar)';
        return;
      }
      // Valid backup
      _obRestoredData = data;
      const name = data.prepData?.profile?.name || 'User';
      const exportDate = data.exportedAt ? new Date(data.exportedAt).toLocaleDateString('en-IN') : 'Unknown';
      if(statusEl) {
        statusEl.style.color = 'var(--ag)';
        statusEl.textContent = `✅ Backup milaa! (${exportDate})`;
      }
      if(fileArea) {
        fileArea.style.borderColor = 'var(--ag)';
        if(lbl) lbl.textContent = '📄 ' + file.name;
      }
      if(loginBtn) loginBtn.style.display = '';
    } catch(err) {
      if(statusEl) { statusEl.style.color = 'var(--ar)'; statusEl.textContent = '❌ File parse nahi hua. Valid JSON file chahiye.'; }
      if(fileArea) fileArea.style.borderColor = 'var(--ar)';
    }
  };
  reader.readAsText(file);
  e.target.value = '';
};

window.obRestoreAndContinue = () => {
  if(!_obRestoredData) { showToast('Pehle file choose karo!', 1500); return; }
  const data = _obRestoredData;
  const loginBtn = ge('ob-restore-login-btn');
  if(loginBtn) { loginBtn.textContent = '⏳ Restore ho raha hai...'; loginBtn.disabled = true; }

  try {
    const p = data.prepData;
    if(p.tasks)    LS.s('jee2_tasks', p.tasks);
    if(p.backlog)  LS.s('jee2_backlog', p.backlog);
    if(p.notes)    LS.s('jee2_notes', p.notes);
    if(p.formulas) LS.s('jee2_formulas', p.formulas);
    if(p.mocks)    LS.s('jee2_mocks', p.mocks);
    if(p.revision) LS.s('jee2_revision', p.revision);
    if(p.streak)   LS.s('jee2_streak', p.streak);
    if(p.scores)   LS.s('jee2_scores', p.scores);
    if(p.chapters) LS.s('jee2_chapters', p.chapters);
    if(p.profile)  LS.s('air_profile', p.profile);
    if(p.compHistory) LS.s('jee2_comp_history', p.compHistory);
    if(data.testData) {
      if(data.testData.bank)     LS.s('jte_bank', data.testData.bank);
      if(data.testData.attempts) LS.s('jte_attempts', data.testData.attempts);
    }
    if(data.customSubtopics) {
      Object.entries(data.customSubtopics).forEach(([id, subs]) => {
        LS.s('jee2_custom_' + id, subs);
      });
    }
    if(data.customChapters) LS.s('jee2_custom_chapters', data.customChapters);
    // After restore, go to language selection (user will confirm profile on finish)
    _obRestoredData = null;
    showToast('✅ Data restore ho gaya!', 2000);
    // Short delay then go to language step
    setTimeout(() => { obGoToStep(0); }, 500);
  } catch(err) {
    if(loginBtn) { loginBtn.textContent = '✅ Login & Continue →'; loginBtn.disabled = false; }
    showToast('❌ Restore failed! Try again.', 2000);
  }
};

function showOnboarding() {
  const ob = ge('onboarding');
  if(ob) ob.classList.add('show');
  // Always start from welcome screen
  obGoToStep(-1);
}

function hideOnboarding() {
  const ob = ge('onboarding');
  if(ob) { ob.classList.remove('show'); ob.style.display = 'none'; }
}


function obGoToStep(step) {
  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));
  const target = ge('ob-step-' + step);
  if(target) target.classList.add('active');

  // Progress bar: hide on welcome/restore, show on steps 0-4
  const obWrap = ge('onboarding');
  const dotBar = obWrap ? obWrap.querySelector('.ob-progress') : null;
  if(dotBar) dotBar.style.display = (step === -1 || step === 'restore') ? 'none' : '';

  // Fill dots: step 0 = 1 dot, step 1 = 2 dots, ...step 4 = all 5 dots
  for(let i = 0; i <= 4; i++) {
    const dot = ge('ob-dot-' + i);
    if(dot) dot.classList.toggle('done', typeof step === 'number' && step >= 0 && i <= step);
  }
  // Scroll to top
  const ob = ge('onboarding');
  if(ob) ob.scrollTop = 0;
}

window.obSelectAvatar = (el, emoji) => {
  _obAvatar = emoji;
  document.querySelectorAll('.ob-av-opt').forEach(a => a.classList.remove('on'));
  el.classList.add('on');
  const preview = ge('ob-selected-avatar-preview');
  if(preview) preview.textContent = emoji;
};

window.obSelectExam = (exam) => {
  _obExam = exam;
  ge('ob-jee').classList.toggle('on', exam === 'jee');
  ge('ob-neet').classList.toggle('on', exam === 'neet');
};

window.obSelectCls = (cls) => {
  _obCls = cls;
  ge('ob-cls11').classList.toggle('on', cls === '11');
  ge('ob-cls12').classList.toggle('on', cls === '12');
};

window.obNext = (fromStep) => {
  if(fromStep === 0) {
    // Language step — save lang and apply translations
    LS.s('air_lang', _lang);
    applyLang();
    obGoToStep(1);
  } else if(fromStep === 1) {
    const name = (ge('ob-name').value || '').trim();
    if(!name) {
      ge('ob-name').style.borderColor = 'var(--ar)';
      ge('ob-name').focus();
      return;
    }
    ge('ob-name').style.borderColor = '';
    obGoToStep(2);
  } else if(fromStep === 2) {
    obGoToStep(3);
  } else if(fromStep === 3) {
    obGoToStep(4);
  }
};

window.obBack = (fromStep) => {
  if(fromStep === 1) obGoToStep(0);       // name → lang
  else if(fromStep === 0) obGoToStep(-1); // lang → welcome
  else obGoToStep(fromStep - 1);
};

window.obFinish = () => {
  const name     = (ge('ob-name').value || '').trim() || 'Student';
  const phone    = (ge('ob-phone').value || '').trim();
  const email    = (ge('ob-email').value || '').trim();
  const batch    = (ge('ob-batch').value || '').trim();
  const examDate = ge('ob-examdate').value || '';
  const goal     = ge('ob-goal').value || '6';

  const prof = {
    name, phone, email, batch, avatar: _obAvatar,
    exam: _obExam, cls: _obCls,
    dailyGoal: goal,
  };
  if(examDate) { prof.examDate = examDate; prof.savedAt = new Date().toISOString(); }

  PROFILE.set(prof);
  LS.s('air_profile_complete', true);

  hideOnboarding();
  refreshChapterData();
  renderProfile();
  updateChipLabels();
  showToast(_t('welcome') + name + '!', 3000);
};

// ─── clearAllData — also clear profile_complete flag ─────────────────────────
let _cconfCallback = null;

window.customConfirm = (msg, onOk, opts = {}) => {
  _cconfCallback = onOk;
  const ov = ge('custom-confirm-overlay');
  const icon = ge('cconf-icon');
  const title = ge('cconf-title');
  const msgEl = ge('cconf-msg');
  const okBtn = ge('cconf-ok');

  icon.textContent = opts.icon || '⚠️';
  title.textContent = opts.title || _t('confirm_title');
  msgEl.textContent = msg;
  okBtn.style.background = opts.danger === false ? 'var(--ag)' : 'var(--ar)';
  okBtn.textContent = opts.okLabel || _t('confirm_ok');

  ov.classList.add('on');
};

window.closeCustomConfirm = (confirmed) => {
  const ov = ge('custom-confirm-overlay');
  ov.classList.remove('on');
  if(confirmed && typeof _cconfCallback === 'function') {
    const cb = _cconfCallback;
    _cconfCallback = null;
    cb();
  } else {
    _cconfCallback = null;
  }
};