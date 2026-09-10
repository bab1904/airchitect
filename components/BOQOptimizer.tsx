import React, { useState } from 'react';
import { generateBOQOptimization } from '../services/geminiService';
import { BOQItem, OptimizationSuggestion, Project } from '../types';
import { 
  TrendingDown, 
  ArrowRight, 
  Zap, 
  RefreshCw, 
  Layers, 
  Check, 
  Sparkles, 
  Clock, 
  Gauge, 
  Droplet, 
  SlidersHorizontal,
  Flame,
  Building,
  Eye,
  X,
  Scale,
  Award,
  CheckCircle2
} from 'lucide-react';

interface BOQOptimizerProps {
  project: Project | null;
}

const DEFAULT_BOQ: BOQItem[] = [
  { item: 'Wall Masonry', description: 'Red Clay Bricks (Class 1) & Sand-Cement Mortar', quantity: 15000, unit: 'nos', rate: 10, amount: 150000 },
  { item: 'Internal Partitions', description: 'Internal Brick Partition Walls (4.5" Single Brick)', quantity: 3500, unit: 'sqft', rate: 45, amount: 157500 },
  { item: 'Structural Concrete', description: 'M25 Grade Site-Mixed Concrete (14-Day De-shuttering)', quantity: 50, unit: 'cum', rate: 6500, amount: 325000 },
  { item: 'Internal Plastering', description: 'Traditional 2-Coat Sand Plaster + POP Punning', quantity: 4000, unit: 'sqft', rate: 25, amount: 100000 },
  { item: 'Flooring Finish', description: 'Italian Marble for Living/Dining (Polishing & Wet Laying)', quantity: 800, unit: 'sqft', rate: 450, amount: 360000 },
  { item: 'Windows & Glazing', description: 'Custom Teak Wood Frames & Site-Fabricated Shutters', quantity: 12, unit: 'nos', rate: 15000, amount: 180000 }
];

const INITIAL_SUGGESTIONS: OptimizationSuggestion[] = [
  {
    id: 'OPT-MAS-01',
    category: 'Masonry',
    optimizationType: 'BALANCED',
    originalItem: 'Red Clay Bricks (Class 1) & Sand-Cement Mortar',
    proposedAlternative: 'Autoclaved Aerated Concrete (AAC) Blocks + Thin-Bed Jointing Adhesive',
    savingsPercentage: 24,
    potentialSavingsAmount: 36000,
    timeSavedDays: 18,
    speedMultiplier: '3.5x Faster Masonry',
    laborEfficiency: '140 sqft/day vs 45 sqft/day per mason',
    curingReductionDays: 14,
    reasoning: 'AAC blocks are 8x larger than traditional bricks, requiring 75% fewer joints. Using polymer-modified thin-bed adhesive eliminates 14 days of water curing, allows immediate subsequent plastering, and reduces structural dead load by 50%.',
    implementationStrategy: 'Replace traditional 9" and 4.5" red brick masonry with 600x200x150mm Grade-1 AAC blocks laid with 3mm polymer mortar.',
    timeOptimizationDetails: {
      speedBoost: '3.5x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 14,
      laborProductivity: '1 Mason lays 140 sqft/day (vs 45 sqft with bricks)',
      scheduleImpact: 'Cuts overall wall construction cycle by 18 days'
    },
    comparisonData: {
      originalName: 'Class-1 Red Clay Kiln Bricks',
      alternativeName: 'Grade-1 Autoclaved Aerated Concrete (AAC) Blocks',
      originalImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹10 / brick (₹80 for equivalent 1-block coverage)',
        alternativeUnitCost: '₹62 / block (600x200x150mm)',
        totalSavings: '₹36,000 Direct BOQ Savings',
        percentageDiff: '24% Net Cost Reduction'
      },
      timeComparison: {
        originalSpeed: '40 - 45 sqft / day per mason',
        alternativeSpeed: '140 - 160 sqft / day per mason',
        daysSaved: '18 Days Faster Project Delivery',
        speedFactor: '3.5x Acceleration'
      },
      curingComparison: {
        originalCuring: '14 to 21 Days Continuous Water Spraying',
        alternativeCuring: '0 Days (Pre-cured Polymer Chemical Bond)',
        curingDaysSaved: '14 Days Wet Curing Downtime Eliminated'
      },
      laborComparison: {
        originalLabor: '1 Mason + 2 Helpers (Heavy mortar mixing)',
        alternativeLabor: '1 Mason + 1 Helper (Ready dry-mix tub paste)',
        laborSavings: '35% Reduction in Labor Man-Hours'
      },
      structuralComparison: {
        originalWeight: '1,900 - 2,100 kg / m³ (Heavy Dead Load)',
        alternativeWeight: '600 - 650 kg / m³ (68% Weight Reduction)',
        weightReduction: 'Saves 8-12% Steel in Foundation Columns'
      },
      keyAdvantages: [
        '8x larger volumetric size means 75% fewer mortar joint lines and zero thermal bridging.',
        'High R-value thermal insulation reduces indoor cooling load by up to 25% for building lifetime.',
        '4-hour certified fire resistance rating compared to 2 hours for standard red bricks.',
        'Zero water curing allows plastering/finishing crews to start work immediately without 2-week delays.'
      ],
      specsComparison: [
        { feature: 'Dimensional Precision', originalVal: '± 8mm (Rough, uneven)', alternativeVal: '± 1.5mm (Laser wire-cut sharp)', winner: 'alternative' },
        { feature: 'Mortar Thickness', originalVal: '12mm - 15mm Sand-Cement', alternativeVal: '3mm Thin-bed polymer adhesive', winner: 'alternative' },
        { feature: 'Compressive Strength', originalVal: '3.5 - 5.0 N/mm²', alternativeVal: '4.0 - 5.5 N/mm² (Uniform Grade 1)', winner: 'alternative' },
        { feature: 'Plaster Consumption', originalVal: '20mm thick (Higher sand cost)', alternativeVal: '10mm - 12mm thin coat', winner: 'alternative' },
        { feature: 'Environmental Green Rating', originalVal: 'Topsoil depletion & high carbon kiln', alternativeVal: 'Eco-friendly fly-ash recycled base (LEED +5)', winner: 'alternative' }
      ]
    }
  },
  {
    id: 'OPT-MAS-02',
    category: 'Masonry',
    optimizationType: 'TIME',
    originalItem: 'Internal Brick Partition Walls (4.5" Single Brick)',
    proposedAlternative: 'Precast Lightweight ALC / Concrete Interlocking Wall Panels',
    savingsPercentage: 12,
    potentialSavingsAmount: 18000,
    timeSavedDays: 24,
    speedMultiplier: '5.0x Faster Installation',
    laborEfficiency: '300 sqft/day per 2-worker crew',
    curingReductionDays: 21,
    reasoning: 'Tongue-and-groove precast lightweight panels erect dry in minutes. Arrives pre-finished with a smooth surface, completely eliminating both internal sand-cement plastering and 21 days of water curing.',
    implementationStrategy: 'Install 75mm fiber-reinforced autoclaved lightweight panels for internal non-loadbearing room partitions.',
    timeOptimizationDetails: {
      speedBoost: '5.0x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 21,
      laborProductivity: '2 Workers install 300 sqft/day with dry jointing',
      scheduleImpact: 'Eliminates internal plastering phase entirely (saves 24 days)'
    },
    comparisonData: {
      originalName: '4.5" Single Brick Partition + 2-Side Plaster',
      alternativeName: '75mm Precast ALC Tongue & Groove Interlocking Wall Panels',
      originalImage: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹45 / sqft + ₹50 / sqft Plastering',
        alternativeUnitCost: '₹82 / sqft Complete Dry Install (No Plaster needed)',
        totalSavings: '₹18,000 Net Savings',
        percentageDiff: '12% Lower Installed Cost'
      },
      timeComparison: {
        originalSpeed: '50 sqft / day (Masonry + 2-Side Plaster)',
        alternativeSpeed: '300 - 350 sqft / day (Dry Joint Panel Fitting)',
        daysSaved: '24 Days Schedule Reduction',
        speedFactor: '5.0x Speed Advantage'
      },
      curingComparison: {
        originalCuring: '21 Days Curing (Masonry + Plaster combined)',
        alternativeCuring: '0 Days (Dry System ready for putty)',
        curingDaysSaved: '21 Days Water Downtime Eliminated'
      },
      laborComparison: {
        originalLabor: 'Mason + Plasterer + Laborers',
        alternativeLabor: '2 Semiskilled panel fitters',
        laborSavings: '60% Labor Crew Reduction'
      },
      structuralComparison: {
        originalWeight: '180 kg / m² installed partition',
        alternativeWeight: '55 kg / m² (70% lighter load)',
        weightReduction: 'Dramatic reduction in floor slab deflection'
      },
      keyAdvantages: [
        'Completely replaces internal sand-cement plastering phase with mirror-smooth factory face.',
        'Precision tongue-and-groove jointing prevents hairline expansion cracks.',
        'Immediate electrical conduit and piping chases cut cleanly in seconds.',
        'Demountable and reconfigurable for future space changes without masonry demolition.'
      ],
      specsComparison: [
        { feature: 'Construction Method', originalVal: 'Wet brick masonry + wet plaster', alternativeVal: '100% Dry interlocking precast panels', winner: 'alternative' },
        { feature: 'Surface Finish', originalVal: 'Rough undulating plaster', alternativeVal: 'Mirror-flat direct paint/wallpaper ready', winner: 'alternative' },
        { feature: 'Space Usability (Carpet Area)', originalVal: '135mm total finished wall thickness', alternativeVal: '75mm slim wall (+3% Carpet Area Gain)', winner: 'alternative' },
        { feature: 'Sound Transmission (STC)', originalVal: '38 dB', alternativeVal: '42 dB (Acoustic core dampening)', winner: 'alternative' }
      ]
    }
  },
  {
    id: 'OPT-CON-01',
    category: 'Concrete',
    optimizationType: 'TIME',
    originalItem: 'M25 Grade Site-Mixed Concrete (14-Day De-shuttering)',
    proposedAlternative: 'Rapid-Hardening RMC with Accelerating Superplasticizers (M35 Grade)',
    savingsPercentage: 10,
    potentialSavingsAmount: 32500,
    timeSavedDays: 12,
    speedMultiplier: '2.5x Faster Slab Cycle',
    laborEfficiency: 'Pour 50 cum in 4 hours vs 2 days manual mixing',
    curingReductionDays: 7,
    reasoning: 'High-early-strength concrete achieves 70% design strength in 72 hours using third-generation polycarboxylate ethers, reducing slab shuttering cycle time from 14 days down to 4–5 days.',
    implementationStrategy: 'Schedule ready-mix batching with boom placer pumps for 4-day early formwork stripping.',
    timeOptimizationDetails: {
      speedBoost: '2.5x Formwork Turnover',
      curingTimeDays: 4,
      traditionalCuringDays: 14,
      laborProductivity: 'Complete roof pour in 4 hours via boom pump',
      scheduleImpact: 'Shaves 12 days per elevated slab level'
    },
    comparisonData: {
      originalName: 'Manual Site-Mixed M25 Concrete & Lift Buckets',
      alternativeName: 'Ready-Mix Accelerated M35 High-Early Strength Concrete',
      originalImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹6,500 / cum (Plus aggregate wastage & mixer hire)',
        alternativeUnitCost: '₹5,850 / cum (Contract batching rate)',
        totalSavings: '₹32,500 Direct Material Savings',
        percentageDiff: '10% Savings + Shuttering Rental Savings'
      },
      timeComparison: {
        originalSpeed: '2 Full Days Manual Pouring per Slab',
        alternativeSpeed: '4 Hours via High-Reach Boom Placer Pump',
        daysSaved: '12 Days Shuttering Cycle Saved per Floor',
        speedFactor: '2.5x Faster Turnover'
      },
      curingComparison: {
        originalCuring: '14 Days Shuttering Retention',
        alternativeCuring: '4 Days Rapid De-shuttering (70% strength @ 72h)',
        curingDaysSaved: '10 Days Early Formwork Stripping'
      },
      laborComparison: {
        originalLabor: '18 - 25 Manual Concrete Pouring Crew',
        alternativeLabor: '4 - 6 Vibrator & Boom hose operators',
        laborSavings: '75% Reduction in Pouring Crew'
      },
      structuralComparison: {
        originalWeight: '2400 kg / m³ (Variable manual density)',
        alternativeWeight: '2450 kg / m³ (Guaranteed compaction & strength)',
        weightReduction: 'Zero honeycomb voids or cold joints'
      },
      keyAdvantages: [
        'Achieves 70% compressive design strength within 72 hours via polycarboxylate ethers.',
        'Formwork props stripped in 4–5 days instead of waiting 14–21 days, cutting rental fees.',
        'Automated computerized batching guarantees exact water-cement ratio and slump consistency.',
        'Eliminates site noise, sand storage congestion, and cement bag spillage losses.'
      ],
      specsComparison: [
        { feature: 'De-shuttering Schedule', originalVal: '14 - 21 Days', alternativeVal: '4 - 5 Days', winner: 'alternative' },
        { feature: 'Compressive Strength @ 3 Days', originalVal: '9 - 11 N/mm²', alternativeVal: '24.5 N/mm² (Early High Strength)', winner: 'alternative' },
        { feature: 'Water-Cement Ratio Control', originalVal: 'Manual estimate (Prone to excess water)', alternativeVal: 'Automated batching ± 1% accuracy', winner: 'alternative' },
        { feature: 'Pour Rate Capacity', originalVal: '3 - 5 cum / hour manual mixer', alternativeVal: '35 - 45 cum / hour boom pump', winner: 'alternative' }
      ]
    }
  },
  {
    id: 'OPT-PLAS-01',
    category: 'Finishing / Plaster',
    optimizationType: 'BALANCED',
    originalItem: 'Traditional 2-Coat Sand Plaster + POP Punning',
    proposedAlternative: 'Direct One-Coat Gypsum Machine Spray Plaster',
    savingsPercentage: 32,
    potentialSavingsAmount: 32000,
    timeSavedDays: 14,
    speedMultiplier: '4.0x Faster Application',
    laborEfficiency: '1 Plasterer finishes 450 sqft/day vs 100 sqft/day',
    curingReductionDays: 10,
    reasoning: 'One-coat gypsum plaster is applied directly over AAC/RCC blocks without sand preparation. Delivers direct paint-ready finish in a single pass with zero water curing and no shrinkage cracks.',
    implementationStrategy: 'Deploy mobile spray plastering machines for continuous internal wall application.',
    timeOptimizationDetails: {
      speedBoost: '4.0x Speed Factor',
      curingTimeDays: 0,
      traditionalCuringDays: 10,
      laborProductivity: '450 sqft/day per applicator',
      scheduleImpact: 'Saves 14 days and allows painting work to start 2 weeks early'
    },
    comparisonData: {
      originalName: '2-Coat Sand-Cement Plaster + POP Punning',
      alternativeName: 'Single-Pass Machine Spray Gypsum Plaster',
      originalImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹25 / sqft (Sand, cement, water, POP punning)',
        alternativeUnitCost: '₹17 / sqft (Direct 1-coat spray material)',
        totalSavings: '₹32,000 Net Material Savings',
        percentageDiff: '32% Direct Cost Reduction'
      },
      timeComparison: {
        originalSpeed: '80 - 100 sqft / day per plasterer',
        alternativeSpeed: '400 - 450 sqft / day per spray applicator',
        daysSaved: '14 Days Saved on Finishing',
        speedFactor: '4.0x Speed Increase'
      },
      curingComparison: {
        originalCuring: '7 to 10 Days Continuous Water Spraying',
        alternativeCuring: '0 Days (Sets chemically, zero water spray)',
        curingDaysSaved: '10 Days Water Downtime Saved'
      },
      laborComparison: {
        originalLabor: 'Plasterer + Mortar Mixer + Curing labor',
        alternativeLabor: '1 Machine Operator + 1 Leveling Finisher',
        laborSavings: '55% Reduction in Plastering Labor'
      },
      structuralComparison: {
        originalWeight: '22 kg / m² plaster dead weight',
        alternativeWeight: '11 kg / m² (50% lighter)',
        weightReduction: 'Reduces internal partition dead-load'
      },
      keyAdvantages: [
        'Direct paint-ready mirror surface in a single application; completely eliminates POP punning.',
        'Zero shrinkage cracks and zero thermal efflorescence compared to river sand plaster.',
        'Naturally fire-resistant with non-combustible gypsum crystal structure.',
        'Superior thermal insulation keeps interiors noticeably cooler in summer.'
      ],
      specsComparison: [
        { feature: 'Application Coats', originalVal: '2 Coats (Rough + Fine) + POP', alternativeVal: '1 Single Coat (Paint ready)', winner: 'alternative' },
        { feature: 'Water Curing Required', originalVal: 'Yes (10 days minimum)', alternativeVal: 'Zero water curing needed', winner: 'alternative' },
        { feature: 'Shrinkage Crack Risk', originalVal: 'High (Clay & silt impurities in sand)', alternativeVal: 'Zero (Non-shrink formulation)', winner: 'alternative' },
        { feature: 'Finish Whiteness', originalVal: 'Dull Grey (Requires 2 putty coats)', alternativeVal: 'Brilliant White (Direct primer ready)', winner: 'alternative' }
      ]
    }
  },
  {
    id: 'OPT-FLR-01',
    category: 'Flooring',
    optimizationType: 'COST',
    originalItem: 'Italian Marble for Living/Dining (Polishing & Wet Laying)',
    proposedAlternative: 'Glazed Vitrified Double-Charged GVT Tiles (800x1600mm)',
    savingsPercentage: 58,
    potentialSavingsAmount: 208800,
    timeSavedDays: 8,
    speedMultiplier: '2.0x Faster Tiling',
    laborEfficiency: 'Tile laying in 2 days vs 10 days diamond polishing',
    curingReductionDays: 0,
    reasoning: 'Large-format vitrified slabs duplicate Italian marble aesthetics with pre-polished factory gloss, eliminating lengthy on-site multi-grit diamond polishing and slurry mess.',
    implementationStrategy: 'Procure 800x1600mm Statuario book-match gloss vitrified tiles laid with rapid-set tile adhesive.',
    timeOptimizationDetails: {
      speedBoost: '2.0x Speed Factor',
      curingTimeDays: 1,
      traditionalCuringDays: 8,
      laborProductivity: 'Complete 800 sqft floor in 2 days',
      scheduleImpact: 'Walkable floor in 24 hours (saves 8 days)'
    },
    comparisonData: {
      originalName: 'Imported Italian Marble (Dyna/Statuario) + Slurry Polishing',
      alternativeName: '800x1600mm Double-Charged Glazed Vitrified Slabs (GVT)',
      originalImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹450 / sqft (₹350 slab + ₹100 laying & polishing)',
        alternativeUnitCost: '₹189 / sqft (₹145 slab + ₹44 rapid-set adhesive)',
        totalSavings: '₹2,08,800 Huge Budget Savings',
        percentageDiff: '58% Direct Cost Savings'
      },
      timeComparison: {
        originalSpeed: '10 - 14 Days (Bedding, curing, 7-stage polish)',
        alternativeSpeed: '2 Days (Precision tile leveler installation)',
        daysSaved: '8 - 10 Days Project Duration Saved',
        speedFactor: '2.5x Faster Turnover'
      },
      curingComparison: {
        originalCuring: '7 Days Bedding Curing + 3 Days Slurry Drying',
        alternativeCuring: '24 Hours (Walkable next morning)',
        curingDaysSaved: '7 Days Downtime Saved'
      },
      laborComparison: {
        originalLabor: 'Master Marble Layer + Polishing Gang',
        alternativeLabor: 'Standard Tile Mason with suction cups',
        laborSavings: '60% Labor Cost Savings'
      },
      structuralComparison: {
        originalWeight: '55 kg / m² (Thick cement bed + marble)',
        alternativeWeight: '22 kg / m² (Thin polymer bed)',
        weightReduction: '60% lighter floor finish load'
      },
      keyAdvantages: [
        '0.05% water absorption rate makes GVT tiles completely impervious to oil, wine, and acid stains.',
        'MOHS scale hardness rating of 7 (vs 3.5 for marble) resists furniture scratches and high foot traffic.',
        'Eliminates messy on-site diamond polishing slurry that damages painted baseboards.',
        'High gloss nano-coating retains factory shine for decades without re-polishing.'
      ],
      specsComparison: [
        { feature: 'Stain Resistance', originalVal: 'Porous (Stains easily with turmeric/lemon)', alternativeVal: '100% Stain proof & non-porous (<0.05%)', winner: 'alternative' },
        { feature: 'Scratch Resistance', originalVal: 'MOHS 3.5 (Soft stone, scratches easily)', alternativeVal: 'MOHS 7.0 (Hardened vitrified ceramic)', winner: 'alternative' },
        { feature: 'Installation Time', originalVal: '10 - 14 Days on site', alternativeVal: '2 Days complete', winner: 'alternative' },
        { feature: 'Maintenance & Polish', originalVal: 'Requires re-polishing every 3-4 years', alternativeVal: 'Zero maintenance, lifetime shine', winner: 'alternative' }
      ]
    }
  },
  {
    id: 'OPT-WIN-01',
    category: 'Joinery / Windows',
    optimizationType: 'BALANCED',
    originalItem: 'Custom Teak Wood Frames & Site-Fabricated Shutters',
    proposedAlternative: 'Factory-Prefabricated Multi-Chamber UPVC Sliding Systems',
    savingsPercentage: 45,
    potentialSavingsAmount: 81000,
    timeSavedDays: 10,
    speedMultiplier: '3.0x Faster Installation',
    laborEfficiency: 'Drop-in anchor fastening in 30 mins per window',
    curingReductionDays: 0,
    reasoning: 'Factory-glazed UPVC window units arrive finished with hardware and weather-stripping. Installs into masonry rough openings in 30 minutes with expansion foam vs weeks of carpentry and painting.',
    implementationStrategy: 'Standardize architectural rough openings to modular dimensions for 1-day site drop-in installation.',
    timeOptimizationDetails: {
      speedBoost: '3.0x Installation Speed',
      curingTimeDays: 0,
      traditionalCuringDays: 0,
      laborProductivity: 'Install 12 windows in 1 single workday',
      scheduleImpact: 'Eliminates wood polishing and seasoning delays (saves 10 days)'
    },
    comparisonData: {
      originalName: 'Hand-Carved Teak Wood Frames & Site-Fitted Glass',
      alternativeName: 'Factory-Glazed 3-Track UPVC Sliding Windows with Bug Screen',
      originalImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      alternativeImage: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&q=80&w=800',
      costComparison: {
        originalUnitCost: '₹15,000 / window (Timber, seasoning, carpentry, polish)',
        alternativeUnitCost: '₹8,250 / window (Complete multi-chamber factory unit)',
        totalSavings: '₹81,000 Total Joinery Savings',
        percentageDiff: '45% Cost Reduction'
      },
      timeComparison: {
        originalSpeed: '3 - 4 Days carpentry & varnishing per window',
        alternativeSpeed: '30 Minutes drop-in fastener installation',
        daysSaved: '10 Days Saved across project',
        speedFactor: '3.0x Faster Turnaround'
      },
      curingComparison: {
        originalCuring: 'Multiple varnish coat drying (48 hrs)',
        alternativeCuring: '0 Drying time (Pre-finished factory vinyl)',
        curingDaysSaved: 'Zero site drying downtime'
      },
      laborComparison: {
        originalLabor: 'Master carpenter + polisher over 2 weeks',
        alternativeLabor: '2 Installation technicians for 1 day',
        laborSavings: '70% Labor Hours Saved'
      },
      structuralComparison: {
        originalWeight: '45 kg / frame (Prone to warping in monsoon)',
        alternativeWeight: '22 kg / frame (Galvanized steel core reinforcement)',
        weightReduction: 'Zero seasonal expansion or jamming'
      },
      keyAdvantages: [
        '100% termite proof, rot proof, and weather-resistant with multi-chamber acoustic insulation.',
        'EPDM gasket sealing delivers up to 35 dB sound reduction from exterior street traffic.',
        'Double-glazed argon gas glass options reduce AC heat transfer significantly.',
        'Integrated stainless steel mosquito wire-mesh screen with smooth multi-roller glides.'
      ],
      specsComparison: [
        { feature: 'Termite & Water Resistance', originalVal: 'Prone to termite attack & monsoon rotting', alternativeVal: '100% Termite, rot & corrosion immune', winner: 'alternative' },
        { feature: 'Sound Insulation', originalVal: '18 - 22 dB (Draft gaps around wood)', alternativeVal: '32 - 36 dB (Multi-point airtight seals)', winner: 'alternative' },
        { feature: 'Maintenance', originalVal: 'Requires periodic polishing & painting', alternativeVal: 'Zero maintenance (Simple wipe clean)', winner: 'alternative' },
        { feature: 'Thermal U-Value', originalVal: '3.2 W/m²K', alternativeVal: '1.8 W/m²K (Energy star rated)', winner: 'alternative' }
      ]
    }
  }
];

const MASONRY_COMPARISON_MATRIX = [
  {
    type: 'Traditional Red Clay Bricks',
    speed: '40 - 50 sqft / day',
    curing: '14 - 21 Days (Water)',
    mortar: '1:6 Sand-Cement (12mm)',
    deadLoad: '1900 kg / m³ (Heavy)',
    timeRating: 'Slow (Baseline)',
    costRating: 'Moderate'
  },
  {
    type: 'AAC Blocks + Polymer Adhesive',
    speed: '130 - 160 sqft / day (3.5x)',
    curing: '0 Days (Self-Curing)',
    mortar: '3mm Thin-Bed Polymer',
    deadLoad: '600 kg / m³ (68% Lighter)',
    timeRating: '⚡ Fast (18 Days Saved)',
    costRating: '💰 24% Cheaper'
  },
  {
    type: 'Precast ALC Wall Panels',
    speed: '300 - 350 sqft / day (5x)',
    curing: '0 Days (Dry Joint)',
    mortar: 'Tongue & Groove Dry Seal',
    deadLoad: '700 kg / m³ (Lightweight)',
    timeRating: '🚀 Ultra-Fast (24 Days Saved)',
    costRating: '💰 12% Cheaper'
  },
  {
    type: 'Gypsum / Fiber Cement Drywall',
    speed: '400 sqft / day (6x)',
    curing: '0 Days (Dry System)',
    mortar: 'Stud Framing & Joint Tape',
    deadLoad: '350 kg / m³ (Ultra-Light)',
    timeRating: '⚡⚡ Instant Partition',
    costRating: 'Neutral'
  }
];

const BOQOptimizer: React.FC<BOQOptimizerProps> = ({ project }) => {
  const [boqItems, setBoqItems] = useState<BOQItem[]>(DEFAULT_BOQ);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(INITIAL_SUGGESTIONS);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'TIME' | 'COST' | 'MASONRY'>('ALL');
  const [showMatrix, setShowMatrix] = useState(false);

  // Comparison Pop-up Modal State
  const [selectedForComparison, setSelectedForComparison] = useState<OptimizationSuggestion | null>(null);

  const calculateTotal = (items: BOQItem[]) => items.reduce((acc, item) => acc + (item.amount || 0), 0);
  const currentTotal = calculateTotal(boqItems);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const location = project ? project.location : "Vijayawada, India";
      const result = await generateBOQOptimization(boqItems, location);
      setSuggestions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAlternative = (sug: OptimizationSuggestion) => {
    if (appliedIds.includes(sug.id)) return;

    setBoqItems(prev => prev.map(item => {
      if (item.description.toLowerCase().includes(sug.originalItem.toLowerCase().slice(0, 8)) ||
          item.item.toLowerCase().includes(sug.originalItem.toLowerCase().slice(0, 8))) {
        const discountedAmount = Math.round(item.amount * (1 - sug.savingsPercentage / 100));
        return {
          ...item,
          description: `${sug.proposedAlternative} (Speed & Cost Optimized)`,
          amount: discountedAmount,
          rate: Math.round(discountedAmount / item.quantity)
        };
      }
      return item;
    }));

    setAppliedIds(prev => [...prev, sug.id]);
  };

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(sug => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TIME') return sug.optimizationType === 'TIME' || (sug.timeSavedDays && sug.timeSavedDays >= 12);
    if (activeFilter === 'COST') return sug.optimizationType === 'COST' || sug.savingsPercentage >= 25;
    if (activeFilter === 'MASONRY') return sug.category === 'Masonry' || sug.originalItem.toLowerCase().includes('brick') || sug.originalItem.toLowerCase().includes('wall');
    return true;
  });

  const totalPotentialSavings = suggestions.reduce((acc, s) => acc + (s.potentialSavingsAmount || 0), 0);
  const totalDaysSaved = suggestions.reduce((acc, s) => acc + (s.timeSavedDays || 0), 0);
  const totalCuringDaysEliminated = suggestions.reduce((acc, s) => acc + (s.curingReductionDays || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 4
    }).format(val || 0);
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} /> Dual Value &amp; Speed Engineering
            </span>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded">
              Cost + Fast-Track Timeline Optimizer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Zap className="text-amber-500" /> AI BOQ Smart Cost &amp; Time Optimizer
          </h1>
          <p className="text-sm text-slate-500">
            Compare material alternatives with high-resolution visual specs, side-by-side cost &amp; speed benchmarks, and instant BOQ substitution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowMatrix(!showMatrix)}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Building size={14} className="text-indigo-600" />
            {showMatrix ? "Hide Masonry Matrix" : "Masonry Speed Matrix"}
          </button>

          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-xl transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? "Analyzing BOQ & Timeline..." : "Run AI Dual Optimization"}
          </button>
        </div>
      </div>

      {/* 4-Column High-Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Baseline BOQ */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Baseline BOQ Cost</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{formatCurrency(currentTotal)}</div>
          <p className="text-xs text-slate-500 mt-1">{boqItems.length} active material line items</p>
        </div>

        {/* Card 2: Cost Savings Identified */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-2xl shadow-lg shadow-emerald-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">Identified Cost Savings</span>
            <TrendingDown size={18} className="text-emerald-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            {formatCurrency(totalPotentialSavings)}
          </div>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            Up to 32% overall expenditure reduction
          </p>
        </div>

        {/* Card 3: Project Time Acceleration */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 text-white p-5 rounded-2xl shadow-lg shadow-indigo-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-100 uppercase tracking-wider">Timeline Acceleration</span>
            <Clock size={18} className="text-indigo-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            -{totalDaysSaved} Days Saved
          </div>
          <p className="text-xs text-indigo-100 mt-1 font-medium flex items-center gap-1">
            <Gauge size={13} /> Up to 3.8x faster critical path
          </p>
        </div>

        {/* Card 4: Water Curing Days Eliminated */}
        <div className="bg-gradient-to-br from-sky-600 to-cyan-800 text-white p-5 rounded-2xl shadow-lg shadow-sky-600/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-sky-100 uppercase tracking-wider">Curing Downtime Saved</span>
            <Droplet size={18} className="text-sky-200" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-1">
            -{totalCuringDaysEliminated} Curing Days
          </div>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            Zero-curing polymer &amp; dry tech
          </p>
        </div>
      </div>

      {/* Interactive Fast-Track Masonry Speed Comparison Matrix (Collapsible) */}
      {showMatrix && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-slate-800 animate-fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-600/30 text-indigo-400 rounded-lg">
                <Building size={18} />
              </span>
              <div>
                <h3 className="font-bold text-base text-white">Masonry &amp; Partition Speed Comparison Matrix</h3>
                <p className="text-xs text-slate-400">Benchmarking traditional red brickwork against modern high-speed walling technologies</p>
              </div>
            </div>
            <span className="text-xs bg-indigo-950 text-indigo-300 px-3 py-1 rounded-full border border-indigo-800 font-mono font-bold">
              Target: Fast-Track Delivery
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Wall Material &amp; Method</th>
                  <th className="p-3">Erection Speed</th>
                  <th className="p-3">Water Curing Time</th>
                  <th className="p-3">Jointing &amp; Plastering</th>
                  <th className="p-3">Dead Load Weight</th>
                  <th className="p-3">Schedule Impact</th>
                  <th className="p-3">Cost Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MASONRY_COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-red-400' : idx === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      {row.type}
                    </td>
                    <td className="p-3 font-mono text-indigo-300 font-bold">{row.speed}</td>
                    <td className="p-3">{row.curing}</td>
                    <td className="p-3 text-slate-400">{row.mortar}</td>
                    <td className="p-3 text-slate-400">{row.deadLoad}</td>
                    <td className="p-3 font-semibold text-amber-300">{row.timeRating}</td>
                    <td className="p-3 font-bold text-emerald-400">{row.costRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strategy Mode Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Optimization Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Recommendations ({suggestions.length})
          </button>

          <button
            onClick={() => setActiveFilter('MASONRY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'MASONRY'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Building size={14} /> Fast-Track Masonry ({suggestions.filter(s => s.category === 'Masonry').length})
          </button>

          <button
            onClick={() => setActiveFilter('TIME')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'TIME'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Clock size={14} /> Time Optimizers (Speed First)
          </button>

          <button
            onClick={() => setActiveFilter('COST')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeFilter === 'COST'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <TrendingDown size={14} /> Cost Savers (Value Eng)
          </button>
        </div>
      </div>

      {/* Main Grid: Suggestions & Current BOQ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Suggestions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Value &amp; Speed Engineering Suggestions
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredSuggestions.length} of {suggestions.length} items
            </span>
          </div>

          <div className="space-y-4">
            {filteredSuggestions.map(sug => {
              const isApplied = appliedIds.includes(sug.id);

              return (
                <div 
                  key={sug.id}
                  className={`p-5 rounded-2xl border transition-all duration-200 ${
                    isApplied 
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                  }`}
                >
                  {/* Top Row: Category & Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {sug.id}
                        </span>
                        {sug.category && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {sug.category}
                          </span>
                        )}
                        {sug.optimizationType === 'TIME' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 flex items-center gap-1">
                            <Clock size={10} /> Fast-Track Speed
                          </span>
                        )}
                        {sug.optimizationType === 'BALANCED' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Flame size={10} /> Speed + Cost Optimized
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="line-through text-slate-400 font-semibold text-xs">{sug.originalItem}</span>
                        <ArrowRight size={14} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 text-sm text-indigo-700">{sug.proposedAlternative}</span>
                      </div>
                    </div>

                    {/* Dual Metrics Pill */}
                    <div className="text-right shrink-0 space-y-1">
                      {sug.timeSavedDays && sug.timeSavedDays > 0 && (
                        <div className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 justify-end">
                          <Clock size={12} /> -{sug.timeSavedDays} Days ({sug.speedMultiplier || 'Accelerated'})
                        </div>
                      )}
                      <div className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 justify-end">
                        <TrendingDown size={12} /> -{sug.savingsPercentage}% (Save {formatCurrency(sug.potentialSavingsAmount)})
                      </div>
                    </div>
                  </div>

                  {/* Speed & Productivity Spec Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 my-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Gauge size={14} className="text-indigo-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Labor Efficiency</span>
                        <span className="font-bold text-slate-800 text-xs">{sug.laborEfficiency || 'Increased output per crew'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplet size={14} className="text-sky-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Water Curing Downtime</span>
                        <span className="font-bold text-slate-800 text-xs">
                          {sug.curingReductionDays && sug.curingReductionDays > 0 
                            ? `-${sug.curingReductionDays} Days Eliminated (Zero Wet Curing)` 
                            : 'Standard Rapid Curing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Rationale */}
                  <p className="text-xs text-slate-600 leading-relaxed">{sug.reasoning}</p>

                  {/* Strategy Footer & Dual Action Buttons (Compare & Apply) */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedForComparison(sug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors self-start sm:self-auto"
                    >
                      <Eye size={14} />
                      <span>Compare Materials &amp; View Specs</span>
                    </button>

                    <button
                      onClick={() => handleApplyAlternative(sug)}
                      disabled={isApplied}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 ${
                        isApplied 
                          ? 'bg-emerald-600 text-white cursor-default shadow-xs' 
                          : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-sm hover:shadow'
                      }`}
                    >
                      {isApplied ? <Check size={14} /> : <Zap size={14} />}
                      {isApplied ? "Applied to BOQ & Timeline" : "Apply to BOQ & Schedule"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Live BOQ & Timeline Schedule Impact Table (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cumulative Schedule Acceleration Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-xl border border-indigo-800/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} /> Project Fast-Track Impact
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                {appliedIds.length} Optimizations Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Schedule Duration Reduced:</span>
                <span className="font-mono font-bold text-amber-300">
                  -{appliedIds.length > 0 ? appliedIds.length * 14 : 0} Days
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Masonry &amp; Partition Acceleration:</span>
                <span className="font-mono font-bold text-emerald-300">3.5x - 5.0x Speed</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Direct BOQ Cost Saved:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatCurrency(DEFAULT_BOQ.reduce((a,b)=>a+b.amount,0) - currentTotal)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((appliedIds.length / suggestions.length) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Live BOQ Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Layers size={16} className="text-indigo-600" /> Live BOQ Summary
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Total: {formatCurrency(currentTotal)}
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {boqItems.map((item, idx) => (
                <div key={idx} className="p-3.5 hover:bg-slate-50 text-xs flex items-center justify-between transition-colors">
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-800 block truncate">{item.item}</span>
                    <span className="text-[11px] text-slate-500 truncate block">{item.description}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.quantity} {item.unit} @ ₹{item.rate}/{item.unit}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 text-right shrink-0">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SIDE-BY-SIDE MATERIAL COMPARISON POP-UP MODAL             */}
      {/* ========================================================= */}
      {selectedForComparison && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/30 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Scale size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                      Side-by-Side Material Comparison &amp; Engineering Specs
                    </span>
                    {selectedForComparison.category && (
                      <span className="bg-indigo-950 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-800 font-bold">
                        {selectedForComparison.category}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    {selectedForComparison.originalItem} <span className="text-slate-400">vs</span> {selectedForComparison.proposedAlternative}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedForComparison(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                title="Close Modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900">
              {/* Visual Side-by-Side Cards (Images + Core Value Prop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Traditional/Original Material Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                  <div className="relative h-48 bg-slate-200 overflow-hidden">
                    <img 
                      src={selectedForComparison.comparisonData?.originalImage || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800'} 
                      alt="Traditional Material"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Traditional Baseline Spec
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {selectedForComparison.comparisonData?.originalName || selectedForComparison.originalItem}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">Standard conventional building material and methodology</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Estimated Material Cost:</span>
                        <span className="font-mono font-bold text-slate-800">
                          {selectedForComparison.comparisonData?.costComparison.originalUnitCost || 'Baseline High Rate'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Construction Speed:</span>
                        <span className="font-mono font-bold text-red-600">
                          {selectedForComparison.comparisonData?.timeComparison.originalSpeed || 'Slow Manual Labor'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500 font-medium">Water Curing Required:</span>
                        <span className="font-bold text-slate-700">
                          {selectedForComparison.comparisonData?.curingComparison.originalCuring || '14 - 21 Days Continuous'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500 font-medium">Structural Weight:</span>
                        <span className="font-bold text-slate-700">
                          {selectedForComparison.comparisonData?.structuralComparison.originalWeight || 'Heavy Dead Load'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Fast-Track Optimized Material Card */}
                <div className="bg-indigo-50/40 rounded-2xl border-2 border-indigo-500 overflow-hidden flex flex-col shadow-lg shadow-indigo-500/10 relative">
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img 
                      src={selectedForComparison.comparisonData?.alternativeImage || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'} 
                      alt="Optimized Material"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles size={12} /> AI Recommended Optimization
                    </div>
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      -{selectedForComparison.savingsPercentage}% Cost | -{selectedForComparison.timeSavedDays || 14} Days
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    <div>
                      <h3 className="font-bold text-base text-indigo-950 flex items-center gap-1.5">
                        {selectedForComparison.comparisonData?.alternativeName || selectedForComparison.proposedAlternative}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">High-speed, cost-effective advanced technology</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-indigo-100 text-xs">
                      <div className="flex justify-between py-1 border-b border-indigo-50">
                        <span className="text-slate-500 font-medium">Optimized Material Cost:</span>
                        <span className="font-mono font-bold text-emerald-600">
                          {selectedForComparison.comparisonData?.costComparison.alternativeUnitCost || 'Direct Discounted Rate'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-indigo-50">
                        <span className="text-slate-500 font-medium">Construction Speed:</span>
                        <span className="font-mono font-bold text-indigo-700">
                          {selectedForComparison.comparisonData?.timeComparison.alternativeSpeed || '3.5x Fast-Track'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-indigo-50">
                        <span className="text-slate-500 font-medium">Water Curing Required:</span>
                        <span className="font-bold text-emerald-600">
                          {selectedForComparison.comparisonData?.curingComparison.alternativeCuring || '0 Days (Self-Curing / Dry)'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500 font-medium">Structural Weight:</span>
                        <span className="font-bold text-indigo-700">
                          {selectedForComparison.comparisonData?.structuralComparison.alternativeWeight || '68% Weight Reduction'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Side-by-Side Matrix Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <Scale size={16} className="text-indigo-600" /> Engineering Specifications Comparison Matrix
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {selectedForComparison.comparisonData?.costComparison.totalSavings || 'Significant Value Advantage'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Engineering Parameter</th>
                        <th className="p-3.5">Traditional Specification</th>
                        <th className="p-3.5">Optimized Alternative</th>
                        <th className="p-3.5 text-center">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedForComparison.comparisonData?.specsComparison.map((spec, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-800">{spec.feature}</td>
                          <td className="p-3.5 text-slate-500">{spec.originalVal}</td>
                          <td className="p-3.5 font-semibold text-indigo-900">{spec.alternativeVal}</td>
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              <CheckCircle2 size={12} /> Superior
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Advantages & Benefits Bullet Section */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                  <Award size={18} className="text-emerald-600" /> Why Upgrade to this Material? (Strategic Advantages)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  {selectedForComparison.comparisonData?.keyAdvantages.map((adv, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-800">Project Impact:</span> Shaves{' '}
                <span className="text-indigo-600 font-bold">
                  {selectedForComparison.timeSavedDays || 14} Days
                </span>{' '}
                off schedule &amp; saves{' '}
                <span className="text-emerald-600 font-bold">
                  {formatCurrency(selectedForComparison.potentialSavingsAmount)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedForComparison(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Close Comparison
                </button>

                <button
                  onClick={() => {
                    handleApplyAlternative(selectedForComparison);
                    setSelectedForComparison(null);
                  }}
                  disabled={appliedIds.includes(selectedForComparison.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                    appliedIds.includes(selectedForComparison.id)
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
                  }`}
                >
                  {appliedIds.includes(selectedForComparison.id) ? (
                    <>
                      <Check size={16} /> Applied in BOQ
                    </>
                  ) : (
                    <>
                      <Zap size={16} /> Apply this Optimization to BOQ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOQOptimizer;