import { MessageCircle, Bell, Expand, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import AnimatedSection from "./AnimatedSection";
import AnimatedCard from "./AnimatedCard";
import NetworkNodeMotif from "./NetworkNodeMotif";

const capabilities = [
  {
    icon: MessageCircle,
    title: "Ask anything",
    desc: '"What\'s the current stock of 200 GSM polyester?" "Did Ramesh\'s dyeing job ship?" "Show me pending challans for Unit 3." — natural language, instant answers.',
  },
  {
    icon: Bell,
    title: "Proactive alerts",
    desc: "Low stock warnings, overdue job orders, quality threshold breaches, unusual patterns — the agent flags issues before they become problems.",
  },
  {
    icon: Expand,
    title: "Grows with your departments",
    desc: "When you onboard production, the COO Agent starts monitoring production. When you add quality, it starts tracking quality. It automatically expands its scope as your Binder OS usage expands.",
  },
  {
    icon: Send,
    title: "Works via Telegram",
    desc: "No separate app. No login portal. Your team is already on Telegram — the COO Agent just joins the conversation as a team member.",
  },
];

type ChatMsg = { type: "user" | "agent"; text: string };

interface Scenario {
  label: string;
  messages: ChatMsg[];
}

const scenarios: Scenario[] = [
  {
    label: "Inventory Visibility",
    messages: [
      { type: "user", text: "What's the current stock of 200 GSM cotton fabric?" },
      { type: "agent", text: "📦 Stock Summary — 200 GSM Cotton Fabric\n\nWarehouse Unit 1: 1,240 meters (3 rolls)\nWarehouse Unit 2: 680 meters (2 rolls)\nDyeing Return (pending QC): 450 meters (1 roll)\n\nTotal Available: 1,920 meters\nTotal Pending QC: 450 meters\n\n⚠️ Heads up: Current stock covers approximately 6 days at your average consumption of 320 meters/day. Your reorder level is set at 2,000 meters — you're below that now." },
      { type: "user", text: "Has Deepak in procurement been told about this?" },
      { type: "agent", text: "Checking... No. Deepak hasn't been notified about the low stock on this item. The reorder level was breached 2 days ago but no VPO has been initiated yet." },
      { type: "user", text: "Tell Deepak that 200 GSM cotton is below reorder level and he needs to raise a VPO. Ask him to confirm by end of day." },
      { type: "agent", text: "📨 Message sent to Deepak (Procurement):\n\n\"Deepak — 200 GSM cotton fabric stock is at 1,920 meters, below the 2,000 meter reorder level. This needs a VPO raised. Please confirm by end of day that you've initiated it.\"\n\nI'll follow up with him if he doesn't respond by 5 PM." },
      { type: "agent", text: "🔔 Follow-up: Deepak hasn't responded to the VPO request for 200 GSM cotton fabric. Sending him a reminder now.\n\n📨 Reminder sent to Deepak:\n\n\"Deepak — Following up on the 200 GSM cotton VPO request from earlier today. Stock is below reorder level and no confirmation received yet. Please update.\"" },
      { type: "agent", text: "✅ Deepak responded:\n\n\"Done. VPO raised for 3,000 meters to Greenfield Textiles. Dispatch expected in 3-4 days.\"\n\nNoted. You're in the loop now." },
    ],
  },
  {
    label: "Internal Follow-Up",
    messages: [
      { type: "user", text: "What's the status on IPO-2026-0094? We're supposed to ship on the 28th." },
      { type: "agent", text: "📋 IPO-2026-0094 — Status Summary\n\nBuyer: 101A\nProduct: Cotton cushion covers, embroidered\nTotal order: 4,000 pieces\nDeadline: 28 March\n\nProgress:\n— Cutting: ✅ Completed (4,200 pieces cut, includes buffer)\n— Embroidery: 🟡 2,600 / 4,000 pieces done\n— Stitching: 🟡 1,800 / 4,000 pieces done (waiting on embroidery output)\n— QC Final: Not started\n— Packing: Not started\n\nEmbroidery is the bottleneck. At current pace, embroidery finishes on 26th, stitching on 28th. That leaves no buffer for QC and packing." },
      { type: "user", text: "Who's running embroidery right now?" },
      { type: "agent", text: "Suresh is the supervisor on the embroidery floor. He hasn't posted a shift update today. Last update was yesterday at 6 PM — he reported 2,400 pieces done at that point." },
      { type: "user", text: "Ask Suresh what's holding things up and whether he can increase output. I need his answer within the hour." },
      { type: "agent", text: "📨 Message sent to Suresh (Embroidery Supervisor):\n\n\"Suresh — IPO-0094 embroidery is at 2,600 pieces with deadline on the 28th. We're running tight. What's the current situation on your floor, and is there a way to increase daily output? Please respond within the hour — the owner needs an update.\"\n\nI'll let you know as soon as he replies." },
      { type: "agent", text: "💬 Suresh responded:\n\n\"Two machines were down yesterday for needle plate change. Both running again since morning. We're doing 450/day right now. If I pull the night shift from the other order, I can push to 600/day. Need approval for the overtime.\"" },
      { type: "user", text: "Tell him overtime is approved. Push to 600/day. And tell Meena on the stitching line that embroidery output is going to increase from tomorrow so she should plan her line accordingly." },
      { type: "agent", text: "📨 Message sent to Suresh:\n\n\"Suresh — Overtime approved. Push to 600 pieces/day starting tomorrow. Keep me updated with daily counts.\"\n\n📨 Message sent to Meena (Stitching Line Supervisor):\n\n\"Meena — Embroidery output on IPO-0094 is increasing to 600 pieces/day from tomorrow. Plan your stitching line to handle the higher incoming volume. Deadline for the full order is 28 March.\"\n\nBoth notified. I'll track daily updates from Suresh and Meena and flag if output drops below target." },
    ],
  },
  {
    label: "Quality Issue Coordination",
    messages: [
      { type: "agent", text: "⚠️ Quality Flag — Incoming Inspection\n\nUIN-2026-00891 has been marked REJECTED by your QC team.\n\nMaterial: 30Ne Combed Cotton Yarn, 12 bales (600 kg)\nVendor: Sterling Yarn Mills\nVPO: VPO-2026-0231\n\nFailed parameters:\n— Count CV%: 4.2% (your limit: 3.5%)\n— TPI variation: ±6% (your limit: ±4%)\n— 2 bales with visible contamination\n\nThis is the second rejection from this vendor in 45 days. The UQR report is in the system.\n\nThe lot is tagged REJECTED but I noticed no one has been informed yet — neither procurement nor the warehouse team." },
      { type: "user", text: "Who did the inspection?" },
      { type: "agent", text: "The inspection was done by Ravi (QC Inspector, Unit 1). He submitted the UQR at 11:20 AM today." },
      { type: "user", text: "Tell Ravi to keep the lot segregated in the rejected bay and make sure nothing from this lot moves anywhere. Also tell Deepak in procurement that this is the second failure from Sterling and he needs to deal with it." },
      { type: "agent", text: "📨 Message sent to Ravi (QC Inspector):\n\n\"Ravi — UIN-2026-00891 (Sterling Yarn, 30Ne Cotton) is rejected. Make sure all 12 bales are segregated in the rejected bay at Unit 1. Nothing from this lot should move to production or anywhere else until further notice. Confirm once done.\"\n\n📨 Message sent to Deepak (Procurement):\n\n\"Deepak — The yarn lot from Sterling Yarn Mills (VPO-2026-0231) has been rejected by QC. This is their second rejection in 45 days — first was UIN-00814 on 8 Feb for shade variation. UQR report is in the system. Please coordinate the return or replacement with Sterling and flag if we need to find an alternate vendor for this spec.\"\n\nI'll follow up with Ravi for his confirmation on segregation." },
      { type: "agent", text: "✅ Ravi confirmed:\n\n\"All 12 bales moved to rejected bay. Marked and separated. Nothing will go out.\"\n\nDeepak hasn't responded yet. Want me to give him time or follow up now?" },
      { type: "user", text: "Give him till 2 PM." },
      { type: "agent", text: "Noted. I'll follow up with Deepak at 2 PM if he hasn't responded by then." },
      { type: "agent", text: "🔔 Deepak hasn't responded. Sending follow-up now.\n\n📨 Reminder sent to Deepak:\n\n\"Deepak — Following up on the Sterling Yarn rejection from this morning. 12 bales rejected, second time in 45 days. Need your plan on this — return, replacement, or alternate vendor. Please update.\"" },
      { type: "agent", text: "✅ Deepak responded:\n\n\"Noted. I'll call Sterling today and push for replacement within 5 days. Also checking with Patel Spinners as backup in case Sterling can't deliver. Will update by tomorrow morning.\"\n\nEveryone is in the loop. I'll check in with Deepak tomorrow morning for his update." },
    ],
  },
];
/* ── Single chat card with realistic typing simulation ── */
const ChatCard = ({ scenario, isVisible }: { scenario: Scenario; isVisible: boolean }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingUser, setIsTypingUser] = useState(false);
  const [isTypingAgent, setIsTypingAgent] = useState(false);
  const [inputText, setInputText] = useState("");
  const hasPlayedRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const addTimer = (fn: () => void, delay: number) => {
    timersRef.current.push(setTimeout(fn, delay));
  };

  // Auto-scroll to bottom as messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount, isTypingUser, isTypingAgent, inputText]);

  useEffect(() => {
    // Don't start until visible
    if (!isVisible) return;

    // If already played through, show all messages immediately
    if (hasPlayedRef.current) {
      setVisibleCount(scenario.messages.length);
      setIsTypingUser(false);
      setIsTypingAgent(false);
      setInputText("");
      return;
    }

    const msgs = scenario.messages;
    setVisibleCount(0);
    setIsTypingUser(false);
    setIsTypingAgent(false);
    setInputText("");

    let cumDelay = 600;

    msgs.forEach((msg, i) => {
      const showMsgDelay = cumDelay;

      if (msg.type === "user") {
        // 1. Show user typing in input bar (text appears char by char)
        const typeStartDelay = cumDelay;
        const fullText = msg.text;
        const charsPerTick = Math.max(2, Math.floor(fullText.length / 12)); // type in ~12 ticks
        const tickDuration = 50;
        const totalTypeTicks = Math.ceil(fullText.length / charsPerTick);

        addTimer(() => {
          setIsTypingUser(true);
          setInputText("");
        }, typeStartDelay);

        for (let t = 1; t <= totalTypeTicks; t++) {
          const charEnd = Math.min(t * charsPerTick, fullText.length);
          addTimer(() => {
            setInputText(fullText.slice(0, charEnd));
          }, typeStartDelay + t * tickDuration);
        }

        const typingDuration = totalTypeTicks * tickDuration + 200;
        cumDelay += typingDuration;

        // 2. "Send" — clear input and show the message bubble
        addTimer(() => {
          setIsTypingUser(false);
          setInputText("");
          setVisibleCount(i + 1);
        }, cumDelay);

        cumDelay += 400; // brief pause after user sends
      } else {
        // Agent: show typing dots, then reveal message
        addTimer(() => {
          setIsTypingAgent(true);
        }, cumDelay);

        const agentThinkTime = 1400 + Math.random() * 800;
        cumDelay += agentThinkTime;

        addTimer(() => {
          setIsTypingAgent(false);
          setVisibleCount(i + 1);
        }, cumDelay);

        cumDelay += 500; // pause between messages
      }
    });

    addTimer(() => {
      hasPlayedRef.current = true;
    }, cumDelay + 200);

    return clearTimers;
  }, [isVisible, scenario, clearTimers]);

  const isComplete = visibleCount >= scenario.messages.length && !isTypingUser && !isTypingAgent;

  return (
    <div className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl p-5 shadow-xl shadow-foreground/[0.03] relative flex flex-col">
      {/* Chat header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/40">
        <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-accent">CO</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">COO Agent</p>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-muted-foreground">Always online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="space-y-3 min-h-[280px] max-h-[420px] overflow-y-auto pr-1 scrollbar-thin flex-1">
        <AnimatePresence mode="popLayout">
          {scenario.messages.slice(0, visibleCount).map((msg, i) => (
            <motion.div
              key={`msg-${i}`}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`max-w-[88%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.type === "user"
                    ? "bg-foreground/10 text-foreground rounded-br-sm"
                    : "bg-accent/10 text-foreground rounded-bl-sm border border-accent/10"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Agent typing indicator */}
        <AnimatePresence>
          {isTypingAgent && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-accent/10 border border-accent/10 rounded-xl rounded-bl-sm px-4 py-3 flex gap-1">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-accent/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-accent/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                <motion.span className="w-1.5 h-1.5 rounded-full bg-accent/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="mt-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-4 py-2.5">
          <AnimatePresence mode="wait">
            {isTypingUser && inputText ? (
              <motion.span
                key="typing"
                className="text-sm text-foreground flex-1 truncate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {inputText}
                <motion.span
                  className="inline-block w-0.5 h-4 bg-foreground/60 ml-0.5 align-text-bottom"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.span>
            ) : (
              <motion.span
                key="placeholder"
                className="text-sm text-muted-foreground/50 flex-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isComplete ? "Conversation ended" : "Type a message..."}
              </motion.span>
            )}
          </AnimatePresence>
          <Send className={`w-4 h-4 shrink-0 transition-colors ${isTypingUser && inputText ? "text-accent" : "text-muted-foreground/30"}`} />
        </div>
      </div>
    </div>
  );
};
const CooAgentSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="coo-agent" className="py-28 md:py-40 relative overflow-hidden">
      {/* Gradient background shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <AnimatedSection className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent mb-4">
                AI-Powered
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-8 leading-[1.1]">
                Your AI Operations Manager — Always On
              </h2>
              <p className="text-lg text-muted-foreground leading-[1.7] mb-5">
                The COO Agent is not a feature bolted onto one module. It is an AI assistant that lives across your entire Binder OS — inventory, job orders, production, quality, every department you onboard. It reads data, relays information, follows up with your team, and makes sure nothing falls through the cracks.
              </p>
              <p className="text-base text-muted-foreground leading-[1.7]">
                It lives inside your team's existing Telegram groups. No new app to install. No training sessions. Your team messages naturally, and the COO Agent bridges the gap between your people and your data — internally, always.
              </p>
            </AnimatedSection>
          </div>

          {/* Tabbed chat simulation */}
          <AnimatedSection delay={0.3} direction="right">
            <div className="space-y-4">
              {/* Scenario tabs */}
              <div className="flex flex-wrap gap-2">
                {scenarios.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeTab === i
                        ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* All chat cards rendered, only active one visible */}
              {scenarios.map((s, i) => (
                <div
                  key={s.label}
                  className={activeTab === i ? "block" : "hidden"}
                >
                  <ChatCard scenario={s} isVisible={activeTab === i} />
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Capability cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {capabilities.map((c, i) => (
            <AnimatedCard
              key={c.title}
              index={i}
              className="relative rounded-2xl border border-border/40 bg-background/60 backdrop-blur-sm p-7 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/[0.05] transition-all duration-500 overflow-hidden"
            >
              <NetworkNodeMotif className="absolute bottom-2 right-2 opacity-30" size={24} />
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <c.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CooAgentSection;
