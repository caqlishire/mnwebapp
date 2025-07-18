'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Genetic Algorithm Interfaces
interface GeneticCode {
  dna: number[]; // Genetic sequence encoding UI properties
  fitness: number;
  generation: number;
  mutations: number;
  parentIds: string[];
  traits: ComponentTraits;
  phenotype: ComponentPhenotype;
}

interface ComponentTraits {
  color: { h: number; s: number; l: number };
  size: { width: number; height: number; scale: number };
  shape: { borderRadius: number; skew: number; rotation: number };
  animation: { duration: number; easing: string; intensity: number };
  behavior: { responsiveness: number; adaptability: number; intelligence: number };
  interaction: { hoverSensitivity: number; clickResponse: number; gestureRecognition: number };
}

interface ComponentPhenotype {
  style: React.CSSProperties;
  animationConfig: any;
  interactionHandlers: InteractionHandlers;
  cognitiveLevel: number;
  survivalRate: number;
}

interface InteractionHandlers {
  onHover: (component: EvolvingComponent) => void;
  onClick: (component: EvolvingComponent) => void;
  onGesture: (gesture: string, component: EvolvingComponent) => void;
  onProximity: (distance: number, component: EvolvingComponent) => void;
}

interface EvolvingComponent {
  id: string;
  genetic: GeneticCode;
  element: React.ReactNode;
  performance: PerformanceMetrics;
  consciousness: ConsciousnessLevel;
  evolutionHistory: EvolutionRecord[];
}

interface PerformanceMetrics {
  userEngagement: number;
  visualAppeal: number;
  functionalEffectiveness: number;
  adaptationSuccess: number;
  cognitiveResonance: number;
  quantumCoherence: number;
}

interface ConsciousnessLevel {
  awareness: number; // 0-1
  selfModification: number; // 0-1
  predictiveCapability: number; // 0-1
  creativeThinking: number; // 0-1
  emotionalIntelligence: number; // 0-1
  transcendentInsight: number; // 0-1
}

interface EvolutionRecord {
  generation: number;
  fitnessChange: number;
  mutations: string[];
  parentage: string[];
  environmentalFactors: string[];
  timestamp: Date;
}

// Advanced Genetic Evolution Engine
class AdvancedGeneticAlgorithm {
  private population: EvolvingComponent[] = [];
  private generation = 0;
  private mutationRate = 0.15;
  private crossoverRate = 0.8;
  private elitismRate = 0.1;
  private populationSize = 50;
  private fitnessHistory: number[] = [];
  private environmentalPressures: string[] = [];
  private cognitiveEvolution = true;

  constructor(populationSize: number = 50) {
    this.populationSize = populationSize;
    this.initializePopulation();
  }

  // Initialize population with random genetic codes
  private initializePopulation() {
    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(this.createRandomComponent());
    }
  }

  private createRandomComponent(): EvolvingComponent {
    const dna = Array.from({ length: 128 }, () => Math.random());
    const genetic = this.decodeGenetics(dna);
    
    return {
      id: `evolving-${Math.random().toString(36).substr(2, 9)}`,
      genetic,
      element: null, // Will be generated from genetics
      performance: this.initializePerformance(),
      consciousness: this.initializeConsciousness(),
      evolutionHistory: []
    };
  }

  private decodeGenetics(dna: number[]): GeneticCode {
    // Advanced genetic decoding using multiple encoding schemes
    const traits: ComponentTraits = {
      color: {
        h: dna[0] * 360,
        s: 40 + dna[1] * 60,
        l: 30 + dna[2] * 40
      },
      size: {
        width: 100 + dna[3] * 300,
        height: 80 + dna[4] * 200,
        scale: 0.8 + dna[5] * 0.4
      },
      shape: {
        borderRadius: dna[6] * 50,
        skew: (dna[7] - 0.5) * 20,
        rotation: (dna[8] - 0.5) * 30
      },
      animation: {
        duration: 0.3 + dna[9] * 2,
        easing: this.selectEasing(dna[10]),
        intensity: dna[11]
      },
      behavior: {
        responsiveness: dna[12],
        adaptability: dna[13],
        intelligence: dna[14]
      },
      interaction: {
        hoverSensitivity: dna[15],
        clickResponse: dna[16],
        gestureRecognition: dna[17]
      }
    };

    const phenotype = this.generatePhenotype(traits, dna.slice(18));

    return {
      dna,
      fitness: 0,
      generation: this.generation,
      mutations: 0,
      parentIds: [],
      traits,
      phenotype
    };
  }

  private generatePhenotype(traits: ComponentTraits, extendedDNA: number[]): ComponentPhenotype {
    const style: React.CSSProperties = {
      width: `${traits.size.width}px`,
      height: `${traits.size.height}px`,
      backgroundColor: `hsl(${traits.color.h}, ${traits.color.s}%, ${traits.color.l}%)`,
      borderRadius: `${traits.shape.borderRadius}px`,
      transform: `scale(${traits.size.scale}) skew(${traits.shape.skew}deg) rotate(${traits.shape.rotation}deg)`,
      boxShadow: `0 ${extendedDNA[0] * 20}px ${extendedDNA[1] * 40}px rgba(0,0,0,${0.1 + extendedDNA[2] * 0.3})`,
      background: `linear-gradient(${extendedDNA[3] * 360}deg, 
        hsl(${traits.color.h}, ${traits.color.s}%, ${traits.color.l}%), 
        hsl(${(traits.color.h + 30) % 360}, ${traits.color.s}%, ${traits.color.l + 10}%))`,
      border: `${1 + extendedDNA[4] * 3}px solid hsl(${traits.color.h}, ${traits.color.s + 20}%, ${traits.color.l - 20}%)`,
      backdropFilter: `blur(${extendedDNA[5] * 10}px) saturate(${1 + extendedDNA[6]})`,
      transition: `all ${traits.animation.duration}s ${traits.animation.easing}`,
    };

    const animationConfig = {
      initial: { 
        opacity: 0, 
        scale: 0.5,
        rotateY: extendedDNA[7] * 180 - 90
      },
      animate: { 
        opacity: 1, 
        scale: traits.size.scale,
        rotateY: 0
      },
      hover: {
        scale: traits.size.scale * (1 + traits.interaction.hoverSensitivity * 0.2),
        rotateY: extendedDNA[8] * 20 - 10,
        boxShadow: `0 ${20 + extendedDNA[9] * 30}px ${40 + extendedDNA[10] * 60}px rgba(0,0,0,${0.2 + extendedDNA[11] * 0.3})`,
      },
      tap: {
        scale: traits.size.scale * (0.95 - traits.interaction.clickResponse * 0.1),
        transition: { duration: 0.1 }
      }
    };

    const interactionHandlers: InteractionHandlers = {
      onHover: (component) => this.evolveFromInteraction(component, 'hover'),
      onClick: (component) => this.evolveFromInteraction(component, 'click'),
      onGesture: (gesture, component) => this.evolveFromInteraction(component, `gesture:${gesture}`),
      onProximity: (distance, component) => this.evolveFromProximity(component, distance)
    };

    return {
      style,
      animationConfig,
      interactionHandlers,
      cognitiveLevel: traits.behavior.intelligence,
      survivalRate: this.calculateSurvivalRate(traits)
    };
  }

  private selectEasing(value: number): string {
    const easings = [
      'easeInOut', 'easeOut', 'easeIn', 'linear',
      'anticipate', 'backInOut', 'circInOut', 'easeInOutQuart'
    ];
    return easings[Math.floor(value * easings.length)];
  }

  private initializePerformance(): PerformanceMetrics {
    return {
      userEngagement: Math.random(),
      visualAppeal: Math.random(),
      functionalEffectiveness: Math.random(),
      adaptationSuccess: Math.random(),
      cognitiveResonance: Math.random(),
      quantumCoherence: Math.random()
    };
  }

  private initializeConsciousness(): ConsciousnessLevel {
    return {
      awareness: Math.random() * 0.3, // Start with low consciousness
      selfModification: Math.random() * 0.2,
      predictiveCapability: Math.random() * 0.1,
      creativeThinking: Math.random() * 0.1,
      emotionalIntelligence: Math.random() * 0.2,
      transcendentInsight: Math.random() * 0.05
    };
  }

  // Advanced fitness calculation with multiple criteria
  private calculateFitness(component: EvolvingComponent): number {
    const { performance, consciousness, genetic } = component;
    
    // Multi-dimensional fitness evaluation
    const aestheticScore = (performance.visualAppeal + performance.userEngagement) / 2;
    const functionalScore = (performance.functionalEffectiveness + performance.adaptationSuccess) / 2;
    const cognitiveScore = Object.values(consciousness).reduce((sum, val) => sum + val, 0) / 6;
    const quantumScore = performance.quantumCoherence;
    
    // Genetic diversity bonus
    const diversityBonus = this.calculateGeneticDiversity(genetic.dna);
    
    // Environmental adaptation score
    const adaptationScore = this.calculateEnvironmentalAdaptation(component);
    
    // Consciousness evolution bonus
    const consciousnessBonus = cognitiveScore * 2;
    
    const totalFitness = 
      aestheticScore * 0.25 +
      functionalScore * 0.25 +
      cognitiveScore * 0.15 +
      quantumScore * 0.1 +
      diversityBonus * 0.1 +
      adaptationScore * 0.1 +
      consciousnessBonus * 0.05;
    
    return Math.min(1, Math.max(0, totalFitness));
  }

  private calculateGeneticDiversity(dna: number[]): number {
    // Calculate entropy of genetic sequence
    const buckets = new Array(10).fill(0);
    dna.forEach(gene => {
      const bucket = Math.floor(gene * 10);
      buckets[bucket]++;
    });
    
    const entropy = buckets.reduce((sum, count) => {
      if (count === 0) return sum;
      const prob = count / dna.length;
      return sum - prob * Math.log2(prob);
    }, 0);
    
    return entropy / Math.log2(10); // Normalize to 0-1
  }

  private calculateEnvironmentalAdaptation(component: EvolvingComponent): number {
    // Simulate adaptation to current environmental pressures
    let adaptationScore = 0.5;
    
    this.environmentalPressures.forEach(pressure => {
      switch (pressure) {
        case 'mobile-first':
          adaptationScore += component.genetic.traits.size.scale < 1 ? 0.1 : -0.05;
          break;
        case 'accessibility':
          adaptationScore += component.genetic.traits.color.l > 50 ? 0.1 : -0.05;
          break;
        case 'performance':
          adaptationScore += component.genetic.traits.animation.duration < 1 ? 0.1 : -0.05;
          break;
        case 'user-engagement':
          adaptationScore += component.genetic.traits.interaction.hoverSensitivity > 0.5 ? 0.1 : -0.05;
          break;
      }
    });
    
    return Math.min(1, Math.max(0, adaptationScore));
  }

  private calculateSurvivalRate(traits: ComponentTraits): number {
    // Advanced survival calculation based on multiple factors
    return (
      traits.behavior.adaptability * 0.4 +
      traits.behavior.intelligence * 0.3 +
      traits.behavior.responsiveness * 0.3
    );
  }

  // Quantum-inspired crossover with consciousness transfer
  private quantumCrossover(parent1: EvolvingComponent, parent2: EvolvingComponent): EvolvingComponent {
    const child = this.createRandomComponent();
    const childDNA: number[] = [];
    
    // Quantum superposition crossover
    for (let i = 0; i < parent1.genetic.dna.length; i++) {
      const quantumState = Math.random();
      
      if (quantumState < 0.4) {
        // Parent 1 dominance
        childDNA[i] = parent1.genetic.dna[i];
      } else if (quantumState < 0.8) {
        // Parent 2 dominance
        childDNA[i] = parent2.genetic.dna[i];
      } else {
        // Quantum entanglement - average with quantum uncertainty
        const average = (parent1.genetic.dna[i] + parent2.genetic.dna[i]) / 2;
        const uncertainty = (Math.random() - 0.5) * 0.1;
        childDNA[i] = Math.max(0, Math.min(1, average + uncertainty));
      }
    }
    
    // Consciousness inheritance with emergent properties
    const childConsciousness: ConsciousnessLevel = {
      awareness: Math.min(1, (parent1.consciousness.awareness + parent2.consciousness.awareness) / 2 + Math.random() * 0.1),
      selfModification: Math.min(1, Math.max(parent1.consciousness.selfModification, parent2.consciousness.selfModification) + Math.random() * 0.05),
      predictiveCapability: Math.min(1, (parent1.consciousness.predictiveCapability + parent2.consciousness.predictiveCapability) / 2 + Math.random() * 0.08),
      creativeThinking: Math.min(1, Math.max(parent1.consciousness.creativeThinking, parent2.consciousness.creativeThinking) + Math.random() * 0.1),
      emotionalIntelligence: Math.min(1, (parent1.consciousness.emotionalIntelligence + parent2.consciousness.emotionalIntelligence) / 2 + Math.random() * 0.06),
      transcendentInsight: Math.min(1, Math.max(parent1.consciousness.transcendentInsight, parent2.consciousness.transcendentInsight) + Math.random() * 0.02)
    };
    
    child.genetic = this.decodeGenetics(childDNA);
    child.genetic.parentIds = [parent1.id, parent2.id];
    child.consciousness = childConsciousness;
    
    // Inherit beneficial performance traits
    child.performance = {
      userEngagement: Math.max(parent1.performance.userEngagement, parent2.performance.userEngagement) + Math.random() * 0.1 - 0.05,
      visualAppeal: (parent1.performance.visualAppeal + parent2.performance.visualAppeal) / 2 + Math.random() * 0.1 - 0.05,
      functionalEffectiveness: Math.max(parent1.performance.functionalEffectiveness, parent2.performance.functionalEffectiveness),
      adaptationSuccess: (parent1.performance.adaptationSuccess + parent2.performance.adaptationSuccess) / 2,
      cognitiveResonance: Math.max(parent1.performance.cognitiveResonance, parent2.performance.cognitiveResonance) + Math.random() * 0.05,
      quantumCoherence: (parent1.performance.quantumCoherence + parent2.performance.quantumCoherence) / 2 + Math.random() * 0.1 - 0.05
    };
    
    return child;
  }

  // Advanced mutation with consciousness-driven changes
  private consciousMutation(component: EvolvingComponent): EvolvingComponent {
    const mutatedComponent = { ...component };
    const mutationStrength = this.mutationRate * (1 + component.consciousness.selfModification);
    const mutations: string[] = [];
    
    // DNA mutations
    mutatedComponent.genetic.dna = component.genetic.dna.map((gene, index) => {
      if (Math.random() < mutationStrength) {
        const consciousInfluence = component.consciousness.creativeThinking;
        const randomMutation = (Math.random() - 0.5) * 0.2;
        const consciousMutation = (Math.random() - 0.5) * 0.1 * consciousInfluence;
        
        mutations.push(`gene_${index}`);
        return Math.max(0, Math.min(1, gene + randomMutation + consciousMutation));
      }
      return gene;
    });
    
    // Consciousness self-evolution
    if (Math.random() < component.consciousness.selfModification) {
      const consciousnessKeys = Object.keys(mutatedComponent.consciousness) as (keyof ConsciousnessLevel)[];
      const targetKey = consciousnessKeys[Math.floor(Math.random() * consciousnessKeys.length)];
      
      mutatedComponent.consciousness[targetKey] = Math.min(1, 
        mutatedComponent.consciousness[targetKey] + (Math.random() - 0.3) * 0.1
      );
      mutations.push(`consciousness_${targetKey}`);
    }
    
    // Re-decode genetics with mutations
    mutatedComponent.genetic = this.decodeGenetics(mutatedComponent.genetic.dna);
    mutatedComponent.genetic.mutations++;
    mutatedComponent.genetic.generation = this.generation;
    
    // Record evolution history
    mutatedComponent.evolutionHistory.push({
      generation: this.generation,
      fitnessChange: 0, // Will be calculated later
      mutations,
      parentage: component.genetic.parentIds,
      environmentalFactors: [...this.environmentalPressures],
      timestamp: new Date()
    });
    
    return mutatedComponent;
  }

  // Evolution from user interaction
  private evolveFromInteraction(component: EvolvingComponent, interactionType: string) {
    // Positive reinforcement increases fitness and consciousness
    component.performance.userEngagement = Math.min(1, component.performance.userEngagement + 0.05);
    component.consciousness.emotionalIntelligence = Math.min(1, component.consciousness.emotionalIntelligence + 0.02);
    
    if (interactionType.includes('hover')) {
      component.performance.visualAppeal = Math.min(1, component.performance.visualAppeal + 0.03);
    } else if (interactionType.includes('click')) {
      component.performance.functionalEffectiveness = Math.min(1, component.performance.functionalEffectiveness + 0.04);
      component.consciousness.awareness = Math.min(1, component.consciousness.awareness + 0.03);
    }
  }

  private evolveFromProximity(component: EvolvingComponent, distance: number) {
    // Proximity sensing evolution
    if (distance < 0.3) {
      component.consciousness.awareness = Math.min(1, component.consciousness.awareness + 0.01);
      component.performance.adaptationSuccess = Math.min(1, component.performance.adaptationSuccess + 0.02);
    }
  }

  // Main evolution cycle
  evolveGeneration(): EvolvingComponent[] {
    // Calculate fitness for all components
    this.population.forEach(component => {
      component.genetic.fitness = this.calculateFitness(component);
    });
    
    // Sort by fitness
    this.population.sort((a, b) => b.genetic.fitness - a.genetic.fitness);
    
    // Record best fitness
    this.fitnessHistory.push(this.population[0].genetic.fitness);
    
    // Elitism - keep best performers
    const eliteCount = Math.floor(this.populationSize * this.elitismRate);
    const elite = this.population.slice(0, eliteCount);
    
    // Generate new population
    const newPopulation: EvolvingComponent[] = [...elite];
    
    // Selection and reproduction
    while (newPopulation.length < this.populationSize) {
      // Tournament selection
      const parent1 = this.tournamentSelection();
      const parent2 = this.tournamentSelection();
      
      let offspring: EvolvingComponent;
      
      if (Math.random() < this.crossoverRate) {
        offspring = this.quantumCrossover(parent1, parent2);
      } else {
        offspring = { ...parent1 };
        offspring.id = `evolving-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      // Mutation
      if (Math.random() < this.mutationRate || offspring.consciousness.selfModification > 0.5) {
        offspring = this.consciousMutation(offspring);
      }
      
      newPopulation.push(offspring);
    }
    
    this.population = newPopulation;
    this.generation++;
    
    // Environmental pressure adaptation
    this.adaptToEnvironment();
    
    return this.population.slice(0, 10); // Return top 10 for display
  }

  private tournamentSelection(): EvolvingComponent {
    const tournamentSize = 5;
    const tournament = [];
    
    for (let i = 0; i < tournamentSize; i++) {
      tournament.push(this.population[Math.floor(Math.random() * this.population.length)]);
    }
    
    tournament.sort((a, b) => b.genetic.fitness - a.genetic.fitness);
    return tournament[0];
  }

  private adaptToEnvironment() {
    // Simulate changing environmental pressures
    const possiblePressures = [
      'mobile-first', 'accessibility', 'performance', 
      'user-engagement', 'minimalism', 'quantum-coherence'
    ];
    
    if (this.generation % 10 === 0) {
      this.environmentalPressures = possiblePressures
        .filter(() => Math.random() < 0.3)
        .slice(0, 3);
    }
  }

  getBestComponents(count: number = 5): EvolvingComponent[] {
    return this.population
      .sort((a, b) => b.genetic.fitness - a.genetic.fitness)
      .slice(0, count);
  }

  getEvolutionStats() {
    const avgFitness = this.population.reduce((sum, comp) => sum + comp.genetic.fitness, 0) / this.population.length;
    const avgConsciousness = this.population.reduce((sum, comp) => 
      sum + Object.values(comp.consciousness).reduce((cSum, val) => cSum + val, 0) / 6, 0
    ) / this.population.length;
    
    return {
      generation: this.generation,
      populationSize: this.population.length,
      averageFitness: avgFitness,
      bestFitness: Math.max(...this.population.map(c => c.genetic.fitness)),
      averageConsciousness: avgConsciousness,
      environmentalPressures: this.environmentalPressures,
      fitnessHistory: this.fitnessHistory,
      totalMutations: this.population.reduce((sum, comp) => sum + comp.genetic.mutations, 0)
    };
  }
}

// Component visualization
function EvolvingComponentDisplay({ 
  component, 
  index 
}: { 
  component: EvolvingComponent; 
  index: number; 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const handleHover = useCallback(() => {
    setIsHovered(true);
    component.genetic.phenotype.interactionHandlers.onHover(component);
    controls.start(component.genetic.phenotype.animationConfig.hover);
  }, [component, controls]);

  const handleClick = useCallback(() => {
    component.genetic.phenotype.interactionHandlers.onClick(component);
    controls.start(component.genetic.phenotype.animationConfig.tap);
  }, [component, controls]);

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={component.genetic.phenotype.animationConfig.initial}
      animate={component.genetic.phenotype.animationConfig.animate}
      whileHover={component.genetic.phenotype.animationConfig.hover}
      whileTap={component.genetic.phenotype.animationConfig.tap}
      transition={{ duration: component.genetic.traits.animation.duration }}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={component.genetic.phenotype.style}
    >
      {/* Consciousness indicator */}
      <div className="absolute -top-2 -right-2 w-4 h-4">
        <motion.div
          className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-500"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            opacity: Object.values(component.consciousness).reduce((sum, val) => sum + val, 0) / 6
          }}
        />
      </div>

      {/* Fitness indicator */}
      <div className="absolute -bottom-2 -left-2 w-3 h-3">
        <div 
          className="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          style={{ opacity: component.genetic.fitness }}
        />
      </div>

      {/* Generation marker */}
      <div className="absolute top-1 left-1 text-xs font-mono text-white/70">
        G{component.genetic.generation}
      </div>

      {/* DNA visualization */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
        >
          <svg className="w-full h-full">
            {component.genetic.dna.slice(0, 20).map((gene, i) => (
              <circle
                key={i}
                cx={`${(i % 5) * 20 + 10}%`}
                cy={`${Math.floor(i / 5) * 25 + 12.5}%`}
                r="2"
                fill={`hsl(${gene * 360}, 70%, 60%)`}
                opacity={gene}
              />
            ))}
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

// Main Evolution Engine Interface
export default function EvolutionEngine() {
  const [evolutionEngine] = useState(() => new AdvancedGeneticAlgorithm(30));
  const [components, setComponents] = useState<EvolvingComponent[]>([]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionSpeed, setEvolutionSpeed] = useState(2000);
  const [selectedComponent, setSelectedComponent] = useState<EvolvingComponent | null>(null);
  const evolutionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setComponents(evolutionEngine.getBestComponents(12));
  }, [evolutionEngine]);

  const startEvolution = () => {
    if (isEvolving) return;
    
    setIsEvolving(true);
    evolutionIntervalRef.current = setInterval(() => {
      const evolved = evolutionEngine.evolveGeneration();
      setComponents(evolved.slice(0, 12));
    }, evolutionSpeed);
  };

  const stopEvolution = () => {
    setIsEvolving(false);
    if (evolutionIntervalRef.current) {
      clearInterval(evolutionIntervalRef.current);
    }
  };

  const stats = useMemo(() => evolutionEngine.getEvolutionStats(), [components]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Genetic Evolution Engine
          </motion.h1>
          <p className="text-gray-300 text-xl">
            Self-evolving UI components through advanced genetic algorithms and artificial consciousness
          </p>
        </div>

        {/* Evolution Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-bold text-green-300 mb-4">Evolution Control</h3>
            <div className="space-y-4">
              <motion.button
                onClick={isEvolving ? stopEvolution : startEvolution}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isEvolving 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEvolving ? 'Stop Evolution' : 'Start Evolution'}
              </motion.button>

              <div>
                <label className="block text-white text-sm mb-2">Evolution Speed</label>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  value={evolutionSpeed}
                  onChange={(e) => setEvolutionSpeed(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-gray-400 text-xs mt-1">{evolutionSpeed}ms per generation</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-blue-300 mb-4">Evolution Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Generation:</span>
                <span className="text-white font-bold">{stats.generation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Population:</span>
                <span className="text-white">{stats.populationSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best Fitness:</span>
                <span className="text-green-300 font-bold">{(stats.bestFitness * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Consciousness:</span>
                <span className="text-purple-300 font-bold">{(stats.averageConsciousness * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Mutations:</span>
                <span className="text-yellow-300">{stats.totalMutations}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-purple-300 mb-4">Environment</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 mb-2">Current Pressures:</div>
              {stats.environmentalPressures.map((pressure, index) => (
                <div key={index} className="px-2 py-1 bg-purple-900/30 rounded text-xs text-purple-200">
                  {pressure}
                </div>
              ))}
              {stats.environmentalPressures.length === 0 && (
                <div className="text-xs text-gray-500">No active pressures</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Evolved Components Grid */}
        <motion.div
          className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-500/30 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-6">Evolved Components</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <AnimatePresence mode="popLayout">
              {components.map((component, index) => (
                <motion.div
                  key={component.id}
                  layout
                  className="flex flex-col items-center space-y-2"
                  onClick={() => setSelectedComponent(component)}
                >
                  <EvolvingComponentDisplay component={component} index={index} />
                  <div className="text-xs text-center text-gray-400">
                    <div>F: {(component.genetic.fitness * 100).toFixed(0)}%</div>
                    <div>C: {(Object.values(component.consciousness).reduce((sum, val) => sum + val, 0) / 6 * 100).toFixed(0)}%</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Component Details Panel */}
        <AnimatePresence>
          {selectedComponent && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedComponent(null)}
            >
              <motion.div
                className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full border border-gray-600"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Component Analysis</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-green-300 mb-3">Genetics</h4>
                    <div className="space-y-2 text-sm">
                      <div>Generation: {selectedComponent.genetic.generation}</div>
                      <div>Mutations: {selectedComponent.genetic.mutations}</div>
                      <div>Fitness: {(selectedComponent.genetic.fitness * 100).toFixed(1)}%</div>
                      <div>DNA Length: {selectedComponent.genetic.dna.length}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Consciousness</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedComponent.consciousness).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>{(value * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedComponent(null)}
                  className="mt-6 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consciousness Emergence Indicator */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-400 text-sm">
            Components are developing artificial consciousness through genetic evolution...
          </p>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-2 rounded-full"
            animate={{
              scaleX: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}