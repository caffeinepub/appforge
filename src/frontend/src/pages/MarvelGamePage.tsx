import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type HeroId =
  | "spider-man"
  | "iron-man"
  | "captain-america"
  | "thor"
  | "black-panther";
type GamePhase = "hero-select" | "customize" | "battle" | "result";

interface Ability {
  id: string;
  name: string;
  desc: string;
  minDmg: number;
  maxDmg: number;
  isDefensive?: boolean;
  defBonus?: number;
}

interface CostumeVariant {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
}

interface HeroConfig {
  id: HeroId;
  name: string;
  emoji: string;
  tagline: string;
  abilities: Ability[];
  costumes: CostumeVariant[];
}

interface BattleLogEntry {
  id: string;
  text: string;
  type: "hero" | "enemy" | "system";
  damage?: number;
}

interface EnemyAttack {
  name: string;
  minDmg: number;
  maxDmg: number;
  flavor: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const GOBLIN_ATTACKS: EnemyAttack[] = [
  {
    name: "Pumpkin Bomb",
    minDmg: 15,
    maxDmg: 25,
    flavor: "hurls a glowing pumpkin bomb at you!",
  },
  {
    name: "Glider Strike",
    minDmg: 20,
    maxDmg: 30,
    flavor: "swoops down on his glider!",
  },
  {
    name: "Toxic Gas",
    minDmg: 10,
    maxDmg: 20,
    flavor: "sprays toxic green gas!",
  },
];

const HEROES: HeroConfig[] = [
  {
    id: "spider-man",
    name: "Spider-Man",
    emoji: "🕷️",
    tagline: "Friendly neighborhood hero",
    abilities: [
      {
        id: "web-shoot",
        name: "Web Shoot",
        desc: "Ensnare the Goblin in webs",
        minDmg: 15,
        maxDmg: 25,
      },
      {
        id: "spider-sense",
        name: "Spider-Sense",
        desc: "Dodge the next attack entirely",
        minDmg: 0,
        maxDmg: 0,
        isDefensive: true,
        defBonus: 999,
      },
      {
        id: "venom-blast",
        name: "Venom Blast",
        desc: "Channel electricity through webs",
        minDmg: 30,
        maxDmg: 40,
      },
    ],
    costumes: [
      {
        id: "classic",
        name: "Classic Red",
        primary: "#dc2626",
        secondary: "#1d4ed8",
        glow: "rgba(220,38,38,0.6)",
      },
      {
        id: "black-suit",
        name: "Black Suit",
        primary: "#1a1a1a",
        secondary: "#ffffff",
        glow: "rgba(30,30,30,0.8)",
      },
      {
        id: "miles",
        name: "Miles Morales",
        primary: "#1d4ed8",
        secondary: "#1a1a1a",
        glow: "rgba(29,78,216,0.6)",
      },
      {
        id: "iron-spider",
        name: "Iron Spider",
        primary: "#b45309",
        secondary: "#dc2626",
        glow: "rgba(180,83,9,0.6)",
      },
    ],
  },
  {
    id: "iron-man",
    name: "Iron Man",
    emoji: "🦾",
    tagline: "Genius, billionaire, hero",
    abilities: [
      {
        id: "repulsor",
        name: "Repulsor Blast",
        desc: "Fire palm repulsors",
        minDmg: 20,
        maxDmg: 30,
      },
      {
        id: "missiles",
        name: "Missile Barrage",
        desc: "Unleash a volley of missiles",
        minDmg: 35,
        maxDmg: 45,
      },
      {
        id: "jarvis",
        name: "JARVIS Shield",
        desc: "Block the next attack completely",
        minDmg: 0,
        maxDmg: 0,
        isDefensive: true,
        defBonus: 999,
      },
    ],
    costumes: [
      {
        id: "mark3",
        name: "Mark III",
        primary: "#dc2626",
        secondary: "#ca8a04",
        glow: "rgba(220,38,38,0.6)",
      },
      {
        id: "stealth",
        name: "Stealth Mode",
        primary: "#1a1a1a",
        secondary: "#374151",
        glow: "rgba(30,30,30,0.5)",
      },
      {
        id: "gold",
        name: "Gold Armor",
        primary: "#ca8a04",
        secondary: "#b45309",
        glow: "rgba(202,138,4,0.7)",
      },
      {
        id: "space",
        name: "Space Armor",
        primary: "#1e40af",
        secondary: "#7c3aed",
        glow: "rgba(30,64,175,0.6)",
      },
    ],
  },
  {
    id: "captain-america",
    name: "Captain America",
    emoji: "🛡️",
    tagline: "First Avenger",
    abilities: [
      {
        id: "shield-throw",
        name: "Shield Throw",
        desc: "Ricochet the vibranium shield",
        minDmg: 20,
        maxDmg: 30,
      },
      {
        id: "deflect",
        name: "Vibranium Deflect",
        desc: "Block & counter for double damage",
        minDmg: 25,
        maxDmg: 35,
        isDefensive: true,
        defBonus: 15,
      },
      {
        id: "freedom",
        name: "Freedom Strike",
        desc: "A powerful combo of punches",
        minDmg: 25,
        maxDmg: 35,
      },
    ],
    costumes: [
      {
        id: "classic",
        name: "Classic Blue",
        primary: "#1d4ed8",
        secondary: "#dc2626",
        glow: "rgba(29,78,216,0.6)",
      },
      {
        id: "stealth",
        name: "Stealth Suit",
        primary: "#374151",
        secondary: "#1f2937",
        glow: "rgba(55,65,81,0.5)",
      },
      {
        id: "endgame",
        name: "Endgame White",
        primary: "#e5e7eb",
        secondary: "#1d4ed8",
        glow: "rgba(229,231,235,0.4)",
      },
      {
        id: "nomad",
        name: "Nomad Black",
        primary: "#1a1a1a",
        secondary: "#dc2626",
        glow: "rgba(30,30,30,0.6)",
      },
    ],
  },
  {
    id: "thor",
    name: "Thor",
    emoji: "⚡",
    tagline: "God of Thunder",
    abilities: [
      {
        id: "lightning",
        name: "Lightning Strike",
        desc: "Call down a bolt of lightning",
        minDmg: 25,
        maxDmg: 35,
      },
      {
        id: "mjolnir",
        name: "Mjolnir Throw",
        desc: "Hurl the enchanted hammer",
        minDmg: 30,
        maxDmg: 40,
      },
      {
        id: "thunder",
        name: "God's Thunder",
        desc: "Summon the full power of Asgard",
        minDmg: 40,
        maxDmg: 50,
      },
    ],
    costumes: [
      {
        id: "classic",
        name: "Classic Asgard",
        primary: "#6d28d9",
        secondary: "#ca8a04",
        glow: "rgba(109,40,217,0.6)",
      },
      {
        id: "ragnarok",
        name: "Ragnarok Arena",
        primary: "#dc2626",
        secondary: "#1d4ed8",
        glow: "rgba(220,38,38,0.6)",
      },
      {
        id: "endgame",
        name: "Fat Thor",
        primary: "#1e40af",
        secondary: "#7c3aed",
        glow: "rgba(30,64,175,0.5)",
      },
      {
        id: "storm",
        name: "Storm Breaker",
        primary: "#0891b2",
        secondary: "#6d28d9",
        glow: "rgba(8,145,178,0.6)",
      },
    ],
  },
  {
    id: "black-panther",
    name: "Black Panther",
    emoji: "🐾",
    tagline: "King of Wakanda",
    abilities: [
      {
        id: "slash",
        name: "Vibranium Slash",
        desc: "Claw through vibranium suit",
        minDmg: 20,
        maxDmg: 30,
      },
      {
        id: "pounce",
        name: "Panther Pounce",
        desc: "Leap and pin down the Goblin",
        minDmg: 25,
        maxDmg: 35,
      },
      {
        id: "kinetic",
        name: "Kinetic Release",
        desc: "Discharge stored kinetic energy",
        minDmg: 40,
        maxDmg: 55,
      },
    ],
    costumes: [
      {
        id: "classic",
        name: "Classic Black",
        primary: "#1a1a1a",
        secondary: "#7c3aed",
        glow: "rgba(30,30,30,0.8)",
      },
      {
        id: "golden",
        name: "Golden Jaguar",
        primary: "#ca8a04",
        secondary: "#1a1a1a",
        glow: "rgba(202,138,4,0.7)",
      },
      {
        id: "white",
        name: "White Wolf",
        primary: "#e5e7eb",
        secondary: "#6b7280",
        glow: "rgba(229,231,235,0.4)",
      },
      {
        id: "purple",
        name: "Vibranium Purple",
        primary: "#7c3aed",
        secondary: "#1a1a1a",
        glow: "rgba(124,58,237,0.7)",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hpColor(hp: number, maxHp: number): string {
  const ratio = hp / maxHp;
  if (ratio > 0.6) return "#22c55e";
  if (ratio > 0.3) return "#eab308";
  return "#ef4444";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HpBar({
  current,
  max,
  label,
  color,
}: { current: number; max: number; label: string; color: string }) {
  const pct = Math.max(0, (current / max) * 100);
  const barColor = hpColor(current, max);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          {label}
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {current} / {max}
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <motion.div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: barColor,
            boxShadow: `0 0 8px ${barColor}`,
          }}
          layout
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function DamageNumber({ dmg, isHero }: { dmg: number; isHero: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1.4 }}
      animate={{ opacity: 0, y: -60, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="absolute pointer-events-none font-display font-black text-3xl select-none"
      style={{
        color: isHero ? "#ef4444" : "#22c55e",
        textShadow: `0 0 20px ${isHero ? "#ef4444" : "#22c55e"}`,
        right: isHero ? "20%" : "20%",
        top: "50%",
        zIndex: 50,
      }}
    >
      {isHero ? `-${dmg}` : `+${dmg}`}
    </motion.div>
  );
}

// ── Hero Select Screen ────────────────────────────────────────────────────────

function HeroSelectScreen({
  onSelect,
}: { onSelect: (hero: HeroConfig) => void }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="text-5xl mb-4">👺</div>
        <h1
          className="font-display text-4xl sm:text-5xl font-black mb-3"
          style={{
            color: "#fef2f2",
            textShadow: "0 0 40px rgba(239,68,68,0.5)",
          }}
        >
          Choose Your Hero
        </h1>
        <p className="text-base" style={{ color: "rgba(254,226,226,0.6)" }}>
          The Green Goblin terrorizes the city — who will stop him?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEROES.map((hero, i) => (
          <motion.button
            key={hero.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(hero)}
            className="relative group rounded-2xl p-6 text-left focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}
            data-ocid={`hero.item.${i + 1}`}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${hero.costumes[0].glow} 0%, transparent 70%)`,
              }}
            />

            <div className="relative">
              <div className="text-5xl mb-3">{hero.emoji}</div>
              <h3
                className="font-display text-xl font-black mb-1"
                style={{ color: "#fef2f2" }}
              >
                {hero.name}
              </h3>
              <p
                className="text-xs mb-4"
                style={{ color: "rgba(254,226,226,0.5)" }}
              >
                {hero.tagline}
              </p>

              <div className="space-y-1">
                {hero.abilities.map((ab) => (
                  <div key={ab.id} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: hero.costumes[0].primary }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "rgba(254,226,226,0.7)" }}
                    >
                      {ab.name}
                    </span>
                    {!ab.isDefensive && (
                      <span
                        className="ml-auto text-xs font-bold tabular-nums"
                        style={{ color: hero.costumes[0].primary }}
                      >
                        {ab.minDmg}-{ab.maxDmg}
                      </span>
                    )}
                    {ab.isDefensive && (
                      <span
                        className="ml-auto text-xs font-bold"
                        style={{ color: "#22c55e" }}
                      >
                        DEF
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Customize Screen ──────────────────────────────────────────────────────────

function CustomizeScreen({
  hero,
  onConfirm,
  onBack,
}: {
  hero: HeroConfig;
  onConfirm: (costume: CostumeVariant, ability: Ability) => void;
  onBack: () => void;
}) {
  const [selectedCostume, setSelectedCostume] = useState(hero.costumes[0]);
  const [selectedAbility, setSelectedAbility] = useState(hero.abilities[0]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "rgba(254,226,226,0.5)" }}
            data-ocid="customize.cancel_button"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{hero.emoji}</span>
            <div>
              <h2
                className="font-display text-2xl font-black"
                style={{ color: "#fef2f2" }}
              >
                {hero.name}
              </h2>
              <p className="text-xs" style={{ color: "rgba(254,226,226,0.5)" }}>
                Customize your hero
              </p>
            </div>
          </div>
        </div>

        {/* Costume Selection */}
        <div className="mb-8">
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "rgba(239,68,68,0.8)" }}
          >
            Choose Costume
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {hero.costumes.map((costume) => (
              <button
                key={costume.id}
                type="button"
                onClick={() => setSelectedCostume(costume)}
                className="relative rounded-xl p-4 text-center focus:outline-none transition-transform hover:scale-105"
                style={{
                  background:
                    selectedCostume.id === costume.id
                      ? `linear-gradient(135deg, ${costume.primary}33, ${costume.secondary}22)`
                      : "rgba(255,255,255,0.04)",
                  border:
                    selectedCostume.id === costume.id
                      ? `2px solid ${costume.primary}`
                      : "2px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    selectedCostume.id === costume.id
                      ? `0 0 16px ${costume.glow}`
                      : "none",
                }}
                data-ocid="customize.radio"
              >
                <div className="flex gap-2 justify-center mb-2">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: costume.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ background: costume.secondary }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color:
                      selectedCostume.id === costume.id
                        ? "#fef2f2"
                        : "rgba(254,226,226,0.5)",
                  }}
                >
                  {costume.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ability Selection */}
        <div className="mb-10">
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "rgba(239,68,68,0.8)" }}
          >
            Choose Special Ability
          </h3>
          <div className="space-y-3">
            {hero.abilities.map((ability) => (
              <button
                key={ability.id}
                type="button"
                onClick={() => setSelectedAbility(ability)}
                className="w-full rounded-xl p-4 text-left focus:outline-none transition-all hover:scale-[1.01]"
                style={{
                  background:
                    selectedAbility.id === ability.id
                      ? `linear-gradient(135deg, ${selectedCostume.primary}22, transparent)`
                      : "rgba(255,255,255,0.04)",
                  border:
                    selectedAbility.id === ability.id
                      ? `2px solid ${selectedCostume.primary}`
                      : "2px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    selectedAbility.id === ability.id
                      ? `0 0 16px ${selectedCostume.glow}`
                      : "none",
                }}
                data-ocid="customize.radio"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="font-bold text-sm mb-0.5"
                      style={{ color: "#fef2f2" }}
                    >
                      {ability.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "rgba(254,226,226,0.55)" }}
                    >
                      {ability.desc}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {ability.isDefensive ? (
                      <span
                        className="text-xs font-black px-2 py-1 rounded-lg"
                        style={{
                          background: "rgba(34,197,94,0.2)",
                          color: "#22c55e",
                        }}
                      >
                        DEF
                      </span>
                    ) : (
                      <span
                        className="text-xs font-black px-2 py-1 rounded-lg tabular-nums"
                        style={{
                          background: "rgba(239,68,68,0.2)",
                          color: "#ef4444",
                        }}
                      >
                        {ability.minDmg}–{ability.maxDmg}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Preview */}
        <div
          className="rounded-2xl p-6 mb-8 text-center"
          style={{
            background: `linear-gradient(135deg, ${selectedCostume.primary}15, ${selectedCostume.secondary}10)`,
            border: `1px solid ${selectedCostume.primary}33`,
            boxShadow: `0 0 30px ${selectedCostume.glow}`,
          }}
        >
          <div className="text-6xl mb-2">{hero.emoji}</div>
          <p
            className="font-display font-black text-xl mb-1"
            style={{ color: "#fef2f2" }}
          >
            {hero.name}
          </p>
          <p
            className="text-xs mb-2"
            style={{ color: "rgba(254,226,226,0.5)" }}
          >
            {selectedCostume.name} · {selectedAbility.name}
          </p>
          <div className="flex justify-center gap-3 mt-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: selectedCostume.primary,
                boxShadow: `0 0 8px ${selectedCostume.primary}`,
              }}
            />
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: selectedCostume.secondary,
                boxShadow: `0 0 8px ${selectedCostume.secondary}`,
              }}
            />
          </div>
        </div>

        <Button
          size="lg"
          className="w-full h-13 rounded-2xl font-black text-base tracking-wide"
          style={{
            background: `linear-gradient(135deg, ${selectedCostume.primary}, ${selectedCostume.secondary})`,
            color: "white",
            boxShadow: `0 4px 20px ${selectedCostume.glow}`,
          }}
          onClick={() => onConfirm(selectedCostume, selectedAbility)}
          data-ocid="customize.primary_button"
        >
          ⚔️ Enter Battle
        </Button>
      </motion.div>
    </div>
  );
}

// ── Battle Screen ─────────────────────────────────────────────────────────────

const HERO_HP = 100;
const GOBLIN_HP = 120;

function BattleScreen({
  hero,
  costume,
  ability,
  onResult,
}: {
  hero: HeroConfig;
  costume: CostumeVariant;
  ability: Ability;
  onResult: (won: boolean) => void;
}) {
  const [heroHp, setHeroHp] = useState(HERO_HP);
  const [goblinHp, setGoblinHp] = useState(GOBLIN_HP);
  const [isHeroTurn, setIsHeroTurn] = useState(true);
  const [log, setLog] = useState<BattleLogEntry[]>([
    {
      id: "start",
      text: `The Green Goblin appears! Defeat him with ${ability.name}!`,
      type: "system",
    },
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroShake, setHeroShake] = useState(false);
  const [goblinShake, setGoblinShake] = useState(false);
  const [dmgDisplay, setDmgDisplay] = useState<{
    value: number;
    isHero: boolean;
    key: number;
  } | null>(null);
  const [shieldActive, setShieldActive] = useState(false);

  const addLog = useCallback(
    (text: string, type: BattleLogEntry["type"], damage?: number) => {
      setLog((prev) => [
        ...prev.slice(-4),
        { id: crypto.randomUUID(), text, type, damage },
      ]);
    },
    [],
  );

  const handleHeroAttack = useCallback(async () => {
    if (!isHeroTurn || isAnimating) return;
    setIsAnimating(true);

    if (ability.isDefensive) {
      // Defensive ability
      setShieldActive(true);
      addLog(
        `${hero.name} activates ${ability.name}! Next attack blocked.`,
        "hero",
      );
      setDmgDisplay({ value: 0, isHero: false, key: Date.now() });
      await new Promise((r) => setTimeout(r, 600));

      // Still deal counter damage if Cap's deflect
      if (ability.defBonus && ability.defBonus < 999) {
        const counterDmg = randInt(ability.minDmg, ability.maxDmg);
        const newGoblinHp = Math.max(0, goblinHp - counterDmg);
        setGoblinHp(newGoblinHp);
        setGoblinShake(true);
        setDmgDisplay({
          value: counterDmg,
          isHero: false,
          key: Date.now() + 1,
        });
        addLog(
          `Counter-attack deals ${counterDmg} to Green Goblin!`,
          "hero",
          counterDmg,
        );
        await new Promise((r) => setTimeout(r, 200));
        setGoblinShake(false);
        if (newGoblinHp <= 0) {
          setIsAnimating(false);
          onResult(true);
          return;
        }
      }

      setIsHeroTurn(false);
      await goblinTurn(true);
    } else {
      // Offensive ability
      const dmg = randInt(ability.minDmg, ability.maxDmg);
      const newGoblinHp = Math.max(0, goblinHp - dmg);
      setGoblinHp(newGoblinHp);
      setGoblinShake(true);
      setDmgDisplay({ value: dmg, isHero: false, key: Date.now() });
      addLog(
        `${hero.name} uses ${ability.name} for ${dmg} damage!`,
        "hero",
        dmg,
      );
      await new Promise((r) => setTimeout(r, 200));
      setGoblinShake(false);

      if (newGoblinHp <= 0) {
        setIsAnimating(false);
        onResult(true);
        return;
      }

      setIsHeroTurn(false);
      await goblinTurn(false, dmg, newGoblinHp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHeroTurn, isAnimating, ability, hero, goblinHp, addLog, onResult]);

  const goblinTurn = useCallback(
    async (
      shieldBlocked: boolean,
      _heroAttackDmg?: number,
      _currentGoblinHp?: number,
    ) => {
      await new Promise((r) => setTimeout(r, 900));
      const attack = GOBLIN_ATTACKS[randInt(0, GOBLIN_ATTACKS.length - 1)];

      if (shieldBlocked && shieldActive) {
        setShieldActive(false);
        addLog(
          `Green Goblin ${attack.flavor} — but ${hero.name}'s ${ability.name} blocked it!`,
          "system",
        );
        setIsHeroTurn(true);
        setIsAnimating(false);
        return;
      }

      const dmg = randInt(attack.minDmg, attack.maxDmg);
      setHeroHp((prev) => {
        const next = Math.max(0, prev - dmg);
        if (next <= 0) {
          setTimeout(() => onResult(false), 400);
        }
        return next;
      });
      setHeroShake(true);
      setDmgDisplay({ value: dmg, isHero: true, key: Date.now() + 2 });
      addLog(
        `Green Goblin ${attack.flavor} Deals ${dmg} damage!`,
        "enemy",
        dmg,
      );
      await new Promise((r) => setTimeout(r, 200));
      setHeroShake(false);
      setIsHeroTurn(true);
      setIsAnimating(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [hero, ability, shieldActive, onResult, addLog],
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      {/* HP Bars */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <motion.div
          animate={heroShake ? { x: [-6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <HpBar
            current={heroHp}
            max={HERO_HP}
            label={hero.name}
            color={costume.primary}
          />
        </motion.div>
        <motion.div
          animate={goblinShake ? { x: [6, -6, 4, -4, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <HpBar
            current={goblinHp}
            max={GOBLIN_HP}
            label="Green Goblin"
            color="#4ade80"
          />
        </motion.div>
      </div>

      {/* Battle Arena */}
      <div
        className="relative rounded-3xl mb-6 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0d0d1a 0%, #1a0a0a 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: "200px",
        }}
      >
        {/* Atmospheric effect */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(239,68,68,0.1) 0%, transparent 60%)",
          }}
        />

        {/* Damage number */}
        <AnimatePresence>
          {dmgDisplay && (
            <DamageNumber
              key={dmgDisplay.key}
              dmg={dmgDisplay.value}
              isHero={dmgDisplay.isHero}
            />
          )}
        </AnimatePresence>

        <div className="relative flex items-center justify-between px-10 py-8">
          {/* Hero */}
          <motion.div
            animate={heroShake ? { rotate: [-5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className="text-7xl mb-2 drop-shadow-lg"
              style={{ filter: `drop-shadow(0 0 20px ${costume.glow})` }}
            >
              {hero.emoji}
            </div>
            <div
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: `${costume.primary}22`,
                color: costume.primary,
                border: `1px solid ${costume.primary}44`,
              }}
            >
              {costume.name}
            </div>
          </motion.div>

          {/* VS */}
          <div className="text-center">
            <div
              className="font-display text-2xl font-black"
              style={{ color: "rgba(239,68,68,0.6)" }}
            >
              ⚔️
            </div>
            <div
              className="text-xs font-bold uppercase tracking-widest mt-1"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              {isHeroTurn ? "Your Turn" : "Enemy Turn"}
            </div>
          </div>

          {/* Goblin */}
          <motion.div
            animate={goblinShake ? { rotate: [5, -5, 3, -3, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className="text-7xl mb-2"
              style={{ filter: "drop-shadow(0 0 20px rgba(239,68,68,0.6))" }}
            >
              👺
            </div>
            <div
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(239,68,68,0.15)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              Green Goblin
            </div>
          </motion.div>
        </div>
      </div>

      {/* Battle Log */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "rgba(239,68,68,0.6)" }}
        >
          Battle Log
        </p>
        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {log.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs leading-relaxed"
                style={{
                  color:
                    entry.type === "hero"
                      ? "#86efac"
                      : entry.type === "enemy"
                        ? "#fca5a5"
                        : "rgba(255,255,255,0.5)",
                }}
              >
                {entry.type === "hero" && "▶ "}
                {entry.type === "enemy" && "◀ "}
                {entry.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Attack Button */}
      <motion.div whileTap={{ scale: 0.96 }}>
        <Button
          size="lg"
          className="w-full h-14 rounded-2xl font-black text-lg tracking-wide"
          style={{
            background:
              isHeroTurn && !isAnimating
                ? `linear-gradient(135deg, ${costume.primary}, ${costume.secondary})`
                : "rgba(255,255,255,0.06)",
            color: "white",
            boxShadow:
              isHeroTurn && !isAnimating
                ? `0 4px 24px ${costume.glow}`
                : "none",
            cursor: isHeroTurn && !isAnimating ? "pointer" : "not-allowed",
          }}
          onClick={handleHeroAttack}
          disabled={!isHeroTurn || isAnimating}
          data-ocid="battle.primary_button"
        >
          {isAnimating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              {isHeroTurn ? "Attacking…" : "Enemy attacking…"}
            </span>
          ) : isHeroTurn ? (
            `⚔️ Use ${ability.name}`
          ) : (
            "⏳ Enemy's turn…"
          )}
        </Button>
      </motion.div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────

function ResultScreen({
  won,
  hero,
  costume,
  onPlayAgain,
  onChangeHero,
}: {
  won: boolean;
  hero: HeroConfig;
  costume: CostumeVariant;
  onPlayAgain: () => void;
  onChangeHero: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-lg mx-auto px-4 py-12 text-center"
      data-ocid="result.panel"
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: won
            ? "radial-gradient(ellipse at 50% 30%, rgba(34,197,94,0.15) 0%, transparent 60%)"
            : "radial-gradient(ellipse at 50% 30%, rgba(239,68,68,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: [0.5, 1.3, 1] }}
          transition={{ duration: 0.6, times: [0, 0.5, 1] }}
          className="text-8xl mb-6"
        >
          {won ? hero.emoji : "👺"}
        </motion.div>

        <h2
          className="font-display text-4xl sm:text-5xl font-black mb-3"
          style={{
            color: won ? "#4ade80" : "#ef4444",
            textShadow: `0 0 40px ${won ? "rgba(74,222,128,0.6)" : "rgba(239,68,68,0.6)"}`,
          }}
        >
          {won ? "Victory!" : "Defeated!"}
        </h2>

        <p
          className="text-base mb-2"
          style={{ color: "rgba(254,226,226,0.7)" }}
        >
          {won
            ? `${hero.name} has defeated the Green Goblin! The city is saved.`
            : "The Green Goblin wins this round. Rise again, hero."}
        </p>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-10 mt-4"
          style={{
            background: `${costume.primary}22`,
            border: `1px solid ${costume.primary}44`,
            color: costume.primary,
          }}
        >
          <span>{hero.emoji}</span>
          <span className="text-sm font-bold">
            {hero.name} — {costume.name}
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            size="lg"
            className="flex-1 h-12 rounded-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${costume.primary}, ${costume.secondary})`,
              color: "white",
              boxShadow: `0 4px 20px ${costume.glow}`,
            }}
            onClick={onPlayAgain}
            data-ocid="result.primary_button"
          >
            🔄 Play Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-12 rounded-2xl font-bold"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              color: "rgba(254,226,226,0.7)",
            }}
            onClick={onChangeHero}
            data-ocid="result.secondary_button"
          >
            🦸 Change Hero
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Marvel Game Page ──────────────────────────────────────────────────────

export function MarvelGamePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<GamePhase>("hero-select");
  const [selectedHero, setSelectedHero] = useState<HeroConfig | null>(null);
  const [selectedCostume, setSelectedCostume] = useState<CostumeVariant | null>(
    null,
  );
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  const [won, setWon] = useState<boolean | null>(null);

  const handleHeroSelect = (hero: HeroConfig) => {
    setSelectedHero(hero);
    setPhase("customize");
  };

  const handleConfirmCustomize = (
    costume: CostumeVariant,
    ability: Ability,
  ) => {
    setSelectedCostume(costume);
    setSelectedAbility(ability);
    setPhase("battle");
  };

  const handleResult = (victory: boolean) => {
    setWon(victory);
    setPhase("result");
  };

  const handlePlayAgain = () => {
    setPhase("battle");
    setWon(null);
  };

  const handleChangeHero = () => {
    setSelectedHero(null);
    setSelectedCostume(null);
    setSelectedAbility(null);
    setWon(null);
    setPhase("hero-select");
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #0d0505 0%, #130010 40%, #0a0a1a 100%)",
      }}
      data-ocid="marvel.page"
    >
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(109,40,217,0.06) 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, rgba(234,179,8,0.05) 0%, transparent 40%)",
        }}
      />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "150px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-sm font-medium transition-opacity hover:opacity-70 flex items-center gap-2"
          style={{ color: "rgba(254,226,226,0.4)" }}
          data-ocid="marvel.link"
        >
          ← Back to AppStore
        </button>

        {phase !== "hero-select" && (
          <button
            type="button"
            onClick={handleChangeHero}
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "rgba(254,226,226,0.4)" }}
            data-ocid="marvel.secondary_button"
          >
            Change Hero
          </button>
        )}
      </div>

      {/* Phase indicator */}
      <div className="relative z-10 flex justify-center gap-4 mt-2 mb-4">
        {(["hero-select", "customize", "battle"] as const).map((p, i) => (
          <div key={p} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background:
                  phase === p || (phase === "result" && p === "battle")
                    ? "#ef4444"
                    : (
                          [
                            "hero-select",
                            "customize",
                            "battle",
                            "result",
                          ] as const
                        ).indexOf(phase) > i
                      ? "rgba(239,68,68,0.4)"
                      : "rgba(255,255,255,0.15)",
                boxShadow: phase === p ? "0 0 8px rgba(239,68,68,0.8)" : "none",
              }}
            />
            <span
              className="text-xs font-medium uppercase tracking-widest hidden sm:block"
              style={{
                color:
                  phase === p ? "rgba(239,68,68,0.8)" : "rgba(255,255,255,0.2)",
              }}
            >
              {p === "hero-select"
                ? "Pick"
                : p === "customize"
                  ? "Customize"
                  : "Battle"}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === "hero-select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSelectScreen onSelect={handleHeroSelect} />
            </motion.div>
          )}

          {phase === "customize" && selectedHero && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <CustomizeScreen
                hero={selectedHero}
                onConfirm={handleConfirmCustomize}
                onBack={() => setPhase("hero-select")}
              />
            </motion.div>
          )}

          {phase === "battle" &&
            selectedHero &&
            selectedCostume &&
            selectedAbility && (
              <motion.div
                key="battle"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <BattleScreen
                  hero={selectedHero}
                  costume={selectedCostume}
                  ability={selectedAbility}
                  onResult={handleResult}
                />
              </motion.div>
            )}

          {phase === "result" &&
            selectedHero &&
            selectedCostume &&
            won !== null && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <ResultScreen
                  won={won}
                  hero={selectedHero}
                  costume={selectedCostume}
                  onPlayAgain={handlePlayAgain}
                  onChangeHero={handleChangeHero}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
