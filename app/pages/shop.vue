<template>
  <main class="min-h-screen bg-slate-50 py-6 md:py-10">
    <section
      class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:px-6"
      aria-label="Attack shop"
    >
      <ShopHeader :player="player" />

      <ShopOwnedAttacks :owned-attacks="ownedAttacks" />

      <ShopAvailableAttacks
        :attacks="availableAttacks"
        :player-gold="player?.gold ?? 0"
        @buy="buyAttack"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Player, Attack, Difficulty } from "~/types/user-types";
import { navigateTo } from "#app";

// Load player from localStorage
const player = ref<Player | undefined>(undefined);

onBeforeMount(() => {
  if (!import.meta.client) return;
  const raw = localStorage.getItem("player");

  if (!raw) {
    navigateTo("/login");
    return;
  }

  const storedPlayer: Player = JSON.parse(raw);

  if (!storedPlayer.username || storedPlayer.username === "") {
    navigateTo("/login");
    return;
  }

  player.value = storedPlayer;
});

// Base attack catalog (without baseExpGain)
const baseAttacks = ref<Attack[]>([
  {
    title: "4-7-8 Breathing",
    desc: "A deep breathing method that activates the parasympathetic nervous system by extending the exhale longer than the inhale, rapidly lowering heart rate and cortisol.",
    time: 60000,
    damage: 10,
    level: 1,
    exp: 0,
    steps: [
      "Sit or stand comfortably with one hand on your belly.",
      "Inhale quietly through your nose for a count of 4 seconds.",
      "Hold your breath for a count of 7 seconds.",
      "Exhale completely through your mouth for 8 seconds, making a soft 'whoosh' sound.",
      "Repeat this cycle 4 times for immediate calming effect.",
    ],
    timer: 60000,
    difficulty: "easy",
  },
  {
    title: "Progressive Muscle Relaxation",
    desc: "Systematically tense and release major muscle groups to reduce physical tension and interrupt the anxiety-tension feedback loop.",
    time: 600000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Lie down or sit in a quiet space.",
      "Start with your feet: curl toes tightly for 5 seconds, then release slowly for 10 seconds.",
      "Move upward: calves (tense → release), thighs, glutes, abdomen, chest, arms, hands, neck, face.",
      "Breathe deeply throughout; notice the contrast between tension and relaxation.",
      "Complete full body scan in 10 minutes.",
    ],
    timer: 600000,
    difficulty: "medium",
  },
  {
    title: "Thought Record",
    desc: "Cognitive Behavioral Therapy tool to identify, challenge, and reframe distorted anxious thoughts using structured evidence-based questioning.",
    time: 900000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Write the triggering situation (e.g., 'Upcoming presentation').",
      "Record the automatic negative thought (e.g., 'I'll freeze and be judged').",
      "Rate belief in the thought (0–100%).",
      "List evidence supporting AND contradicting the thought.",
      "Generate a balanced alternative thought.",
      "Re-rate belief in original thought after reframing.",
    ],
    timer: 900000,
    difficulty: "medium",
  },
  {
    title: "5-4-3-2-1 Grounding",
    desc: "Sensory awareness exercise that pulls attention from anxious thoughts into the present environment, interrupting rumination and panic escalation.",
    time: 180000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Pause and look around. Name 5 things you can see (colors, shapes, objects).",
      "Reach out and touch 4 different textures (clothes, table, skin, air).",
      "Listen carefully: identify 3 distinct sounds (hum, breath, distant noise).",
      "Notice 2 smells (air, coffee, fabric).",
      "Identify 1 taste (gum, lip balm, or just your mouth).",
      "Stay present with your senses until calm.",
    ],
    timer: 180000,
    difficulty: "easy",
  },
  {
    title: "Box Breathing",
    desc: "Equal-ratio breathing used by elite performers and military to regulate autonomic nervous system and maintain composure under stress.",
    time: 240000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Sit upright, feet flat, hands relaxed.",
      "Inhale through nose for 4 seconds (belly expands).",
      "Hold breath for 4 seconds (lungs full, no strain).",
      "Exhale through nose or mouth for 4 seconds.",
      "Hold empty for 4 seconds.",
      "Repeat for 10 cycles (4 minutes total).",
    ],
    timer: 240000,
    difficulty: "easy",
  },
  {
    title: "Scheduled Worry Time",
    desc: "Contain rumination by postponing all worries to a designated 15-minute daily window, training the brain to reduce intrusive thinking.",
    time: 900000,
    damage: 50,
    level: 1,
    exp: 0,
    steps: [
      "When a worry arises, write it down immediately in a 'worry log' app or notebook.",
      "Tell yourself: 'I’ll think about this during worry time at 7 PM.'",
      "At scheduled time, set a 15-minute timer.",
      "Review and write freely about all logged worries.",
      "When timer ends, close the log and resume your day.",
      "Repeat daily to build mental discipline.",
    ],
    timer: 900000,
    difficulty: "hard",
  },
  {
    title: "Behavioral Activation",
    desc: "Counteract avoidance and low mood by scheduling one small meaningful activity, restoring dopamine and breaking inertia cycles.",
    time: 600000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Identify a core value (e.g., health, creativity, connection).",
      "Choose a 10-minute action aligned with that value (e.g., walk, draw, call friend).",
      "Commit to doing it even if mood is low.",
      "Set a specific time and remove barriers (e.g., shoes by door).",
      "After completion, note any mood or energy shift.",
    ],
    timer: 600000,
    difficulty: "medium",
  },
  {
    title: "Cold Face Dunk",
    desc: "Trigger the mammalian dive reflex by submerging face in cold water, rapidly lowering heart rate and calming acute anxiety.",
    time: 30000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Fill a bowl with cold water and ice cubes (≤10°C).",
      "Take a deep breath and hold it.",
      "Submerge your face (eyes closed) up to temples for 30 seconds.",
      "Keep body still; focus on the cooling sensation.",
      "Remove face slowly and exhale through mouth.",
      "Repeat if needed after 1-minute rest.",
    ],
    timer: 30000,
    difficulty: "medium",
  },
  {
    title: "Labeling Emotions",
    desc: "Neuroscience-backed method: naming emotions reduces amygdala activation and increases prefrontal control over anxiety.",
    time: 60000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Pause and notice physical sensations (tight chest, racing heart).",
      "Say aloud: 'I am feeling anxiety because [specific trigger].'",
      "Add: 'This is a normal body signal, not danger.'",
      "Place hand on chest or belly and breathe into the sensation.",
      "Repeat label 2–3 times until intensity drops.",
    ],
    timer: 60000,
    difficulty: "easy",
  },
  {
    title: "Body Scan Meditation",
    desc: "Mindfulness practice that cultivates non-judgmental awareness of bodily sensations, reducing tension and emotional reactivity.",
    time: 600000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Lie down in a quiet space, eyes closed, arms at sides.",
      "Bring attention to your toes: notice temperature, tingling, or tension.",
      "Slowly move attention upward: feet → ankles → calves → knees → thighs → pelvis → abdomen → chest → back → shoulders → arms → hands → neck → face → scalp.",
      "If tension is found, breathe into it and imagine it softening.",
      "Complete full scan in 10 minutes.",
    ],
    timer: 600000,
    difficulty: "medium",
  },
  {
    title: "Butterfly Hug",
    desc: "Self-administered bilateral stimulation (from EMDR) that calms the nervous system through rhythmic cross-body touch.",
    time: 60000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Cross your arms over your chest (hands on opposite upper arms).",
      "Alternate tapping left → right shoulder at a comfortable pace (1 tap per second).",
      "Breathe slowly and deeply while tapping.",
      "Continue for 30–60 seconds or until you feel a shift.",
      "Optional: think of a calming word ('peace') with each tap.",
    ],
    timer: 60000,
    difficulty: "easy",
  },
  {
    title: "Values-Based Exposure",
    desc: "Acceptance and Commitment Therapy technique: take action aligned with personal values despite fear to build psychological flexibility.",
    time: 300000,
    damage: 50,
    level: 1,
    exp: 0,
    steps: [
      "Write one core value (e.g., authenticity, growth, connection).",
      "Identify a feared but valued action (e.g., speaking up in meeting).",
      "Break it into a 5-minute micro-step (e.g., prepare one sentence).",
      "Accept anxiety as a passenger, not a driver.",
      "Take the action while noticing fear without fighting it.",
      "Reflect: 'I lived my value even with discomfort.'",
    ],
    timer: 300000,
    difficulty: "hard",
  },
  {
    title: "Aromatic Anchoring",
    desc: "Classical conditioning: pair a scent with deep relaxation to create an instant calm trigger for future anxiety moments.",
    time: 180000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Choose a distinct scent (lavender oil, peppermint, citrus).",
      "During deep 4-7-8 breathing, inhale the scent with each breath.",
      "Repeat pairing 2–3 times daily for 3 days during calm states.",
      "Carry scent (on wrist, tissue, or inhaler).",
      "In anxiety moment: inhale scent deeply to trigger conditioned calm.",
    ],
    timer: 180000,
    difficulty: "medium",
  },
  {
    title: "Decatastrophizing Script",
    desc: "Cognitive tool to reduce catastrophic thinking by logically walking through worst-case scenarios and coping ability.",
    time: 420000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Write: 'What is the worst possible outcome?'",
      "Ask: 'And then what would happen?' (repeat 3 times).",
      "Ask: 'Realistically, how likely is this? (0–100%)'",
      "Ask: 'If it happened, how would I cope? Who could help?'",
      "Write a concrete survival plan.",
      "End with: 'I’ve survived 100% of my worst days so far.'",
    ],
    timer: 420000,
    difficulty: "medium",
  },
  {
    title: "Havening Touch",
    desc: "Self-soothing sensory technique that increases delta brain waves and oxytocin via deliberate touch and distraction.",
    time: 300000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Rub palms together to warm hands.",
      "Stroke downward on arms from shoulders to elbows (10 strokes per side).",
      "Stroke face from forehead to chin, then across cheeks.",
      "Stroke palms and fingers gently.",
      "While stroking, hum a tune, count backward from 100 by 3s, or visualize a walk.",
      "Continue for 5 minutes.",
    ],
    timer: 300000,
    difficulty: "easy",
  },
  {
    title: "Third-Person Self-Talk",
    desc: "Use your name to create psychological distance from anxious thoughts, reducing emotional fusion and increasing objectivity.",
    time: 60000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Say aloud: '[Your Name], you’ve handled tough moments before.'",
      "Recall one past success (e.g., 'You passed that exam despite nerves').",
      "Add: '[Name], this feeling will pass. You’re safe.'",
      "Breathe slowly while repeating your name with compassion.",
      "Use in mirror for stronger effect.",
    ],
    timer: 60000,
    difficulty: "easy",
  },
  {
    title: "Safe Place Imagery",
    desc: "Guided visualization to a personalized calming environment, engaging all senses to activate relaxation response.",
    time: 300000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Close eyes and take 3 deep breaths.",
      "Picture a real or imagined safe place (beach, forest, childhood room).",
      "Add vivid details: colors, sounds (waves, birds), smells (salt air, pine), textures (sand, blanket).",
      "Imagine walking through the space slowly.",
      "Stay immersed for 3–5 minutes, breathing deeply.",
      "Return by wiggling fingers and opening eyes.",
    ],
    timer: 300000,
    difficulty: "medium",
  },
  {
    title: "Gratitude Reversal",
    desc: "Reframe anxiety trigger as a growth opportunity by finding hidden benefits, shifting from threat to challenge mindset.",
    time: 180000,
    damage: 50,
    level: 1,
    exp: 0,
    steps: [
      "Write the anxiety trigger (e.g., 'job interview').",
      'List 3 ways this situation helps you grow (e.g., "builds confidence", "sharpens skills", "aligns with career goals").',
      "For each, write: 'I’m grateful this is pushing me because ___.'",
      "Sit with gratitude feeling for 30 seconds per item.",
      "Carry one gratitude statement into the situation.",
    ],
    timer: 180000,
    difficulty: "hard",
  },
  {
    title: "2-Minute Movement",
    desc: "Overcome inertia with a micro-commitment to movement, triggering endorphin release and breaking rumination cycles.",
    time: 120000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Choose a 2-minute high-energy move (jumping jacks, wall push-ups, stair sprints).",
      "Set phone timer for exactly 2:00.",
      "Tell yourself: 'I only have to do 2 minutes.'",
      "Start immediately—no warm-up needed.",
      "Notice how momentum often extends beyond 2 minutes.",
      "End with one deep breath and a win statement.",
    ],
    timer: 120000,
    difficulty: "easy",
  },
  {
    title: "Worry Outcome Tracking",
    desc: "Long-term behavioral experiment: log anxious predictions and compare to reality to reduce future worry credibility.",
    time: 1209600000,
    damage: 100,
    level: 1,
    exp: 0,
    steps: [
      "Create a 'Worry Log' with columns: Date | Feared Outcome | Likelihood % | Actual Outcome | Date Checked.",
      "Every time you have a strong worry, log it immediately.",
      "Set calendar reminder to review each entry after 1 week.",
      "Mark: 'Happened / Didn’t Happen / Partial'.",
      "After 14 days, calculate % of worries that came true (typically <15%).",
      "Use data to challenge future anxious thoughts.",
    ],
    timer: 1209600000,
    difficulty: "very_hard",
  },
  {
    title: "Paradoxical Intention",
    desc: "Intentionally try to increase anxiety to remove the fear of fear, collapsing the panic cycle through acceptance.",
    time: 60000,
    damage: 50,
    level: 1,
    exp: 0,
    steps: [
      "When anxiety rises, say: 'Okay, anxiety—come on, get worse! I want more!'",
      "Exaggerate physical symptoms on purpose (e.g., 'Heart, beat faster! Hands, shake more!').",
      "Maintain for 60 seconds without resistance.",
      "Notice how the system often self-corrects and calms.",
      "End with: 'I can tolerate this—it’s not dangerous.'",
    ],
    timer: 60000,
    difficulty: "hard",
  },
  {
    title: "Walking + Binaural Beats",
    desc: "Combine rhythmic walking with bilateral audio stimulation to synchronize brain hemispheres and reduce anxiety.",
    time: 600000,
    damage: 30,
    level: 1,
    exp: 0,
    steps: [
      "Download a binaural beats track (4–7 Hz theta range) or metronome app (60–80 BPM).",
      "Put on headphones and start walking at a steady, comfortable pace.",
      "Sync left-right footfalls with the alternating beats.",
      "Swing arms naturally to enhance bilateral input.",
      "Focus on rhythm, not thoughts, for 10 minutes.",
      "End with 3 deep breaths.",
    ],
    timer: 600000,
    difficulty: "medium",
  },
  {
    title: "Physiological Sigh",
    desc: "Stanford-discovered breathing pattern that rapidly resets CO₂ receptors and vagal tone to reduce acute stress in under 1 minute.",
    time: 30000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Sit or stand with good posture.",
      "Inhale sharply through nose (quick sniff).",
      "Immediately follow with a second, deeper inhale to full lung capacity.",
      "Exhale slowly and fully through mouth (like fogging a mirror).",
      "Pause briefly, then repeat 2–3 cycles.",
      "Use during anxiety spikes for instant down-regulation.",
    ],
    timer: 30000,
    difficulty: "easy",
  },
  {
    title: "Sing the Thought",
    desc: "Cognitive defusion (ACT): reduce thought believability by singing anxious cognition to a silly melody, breaking emotional fusion.",
    time: 60000,
    damage: 20,
    level: 1,
    exp: 0,
    steps: [
      "Identify the anxious thought (e.g., 'I’m going to fail').",
      "Choose a ridiculous tune ('Happy Birthday', 'Jingle Bells', or cartoon theme).",
      "Sing the thought aloud in full character voice.",
      "Exaggerate tone and facial expression.",
      "Laugh at the absurdity—notice how the thought loses power.",
      "End with: 'It’s just a thought, not truth.'",
    ],
    timer: 60000,
    difficulty: "easy",
  },
  {
    title: "TIPP Skills",
    desc: "DBT distress tolerance crisis toolkit: Temperature, Intense exercise, Paced breathing, Progressive relaxation—designed for panic-level distress.",
    time: 180000,
    damage: 200,
    level: 1,
    exp: 0,
    steps: [
      "T: Hold ice or splash cold water on face for 30 seconds (dive reflex).",
      "I: Do 20–30 seconds of intense movement (squats, sprint in place).",
      "P: Begin paced breathing (box or 4-7-8).",
      "P: Progressive muscle relaxation on shoulders, jaw, fists.",
      "Cycle through T-I-P-P as needed until crisis passes.",
    ],
    timer: 180000,
    difficulty: "panic",
  },
]);

// Normalize attacks to full Attack type (adds baseExpGain)
const allAttacks = computed<Attack[]>(() =>
  baseAttacks.value.map((a) => ({
    ...a,
  }))
);

const ownedAttacks = computed<Attack[]>(() => {
  if (!player.value || !player.value.attacks) return [];
  return player.value.attacks;
});

const availableAttacks = computed<Attack[]>(() => {
  const ownedTitles = new Set(ownedAttacks.value.map((a) => a.title));
  return allAttacks.value.filter((a) => !ownedTitles.has(a.title));
});

function attackCost(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 50;
    case "medium":
      return 100;
    case "hard":
      return 150;
    case "very_hard":
      return 200;
    case "panic":
      return 250;
  }
}

function buyAttack(attack: Attack) {
  if (!player.value) return;

  const cost = attackCost(attack.difficulty as Difficulty);
  if (player.value.gold < cost) return;

  const alreadyOwned = player.value.attacks?.some(
    (a) => a.title === attack.title
  );
  if (alreadyOwned) return;

  player.value.gold -= cost;
  if (!player.value.attacks) player.value.attacks = [];
  player.value.attacks.push(attack);

  localStorage.setItem("player", JSON.stringify(player.value));
}
</script>
