import Link from "next/link";
import { MotionDiv, MotionH1 } from "@/components/motion";
import { HeroVisual } from "@/components/HeroVisual";
import { ArrowRight, BookOpen, Eye, MousePointerClick, Trophy } from "lucide-react";
import { dataStructures, algorithms } from "@/lib/data";

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <MotionDiv initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="eyebrow">
                <span className="register" /> interactive learning tool
              </p>
            </MotionDiv>
            <MotionH1
              className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              See how <span className="text-primary">data structures</span> &{" "}
              <span className="text-secondary">algorithms</span> actually work.
            </MotionH1>
            <MotionDiv
              className="mt-6 text-lg text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              Learn the concept. Watch it happen. Interact with it.
            </MotionDiv>
            <MotionDiv
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/data-structures" className="btn-primary inline-flex items-center justify-center gap-2">
                Explore Data Structures <ArrowRight size={18} />
              </Link>
              <Link href="/algorithms" className="btn-secondary inline-flex items-center justify-center gap-2">
                Explore Algorithms
              </Link>
            </MotionDiv>
            <MotionDiv
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-faint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              fig. 01 · {dataStructures.length} structures / {algorithms.length} algorithms / step-by-step playback
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <HeroVisual />
          </MotionDiv>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-rule bg-plate/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-12">
            <p className="eyebrow">
              <span className="register" /> process · a real sequence
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold">How it works</h2>
            <p className="mt-3 text-lg text-muted">A simple 4-step path to truly understanding DSA</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: "01", title: "Learn", icon: BookOpen, desc: "Read a simple explanation of the concept." },
              { num: "02", title: "Visualize", icon: Eye, desc: "Watch the data structure or algorithm operate." },
              { num: "03", title: "Interact", icon: MousePointerClick, desc: "Change values and control the simulation." },
              { num: "04", title: "Practice", icon: Trophy, desc: "Run the algorithms yourself and test what you learned." },
            ].map((step, i) => (
              <MotionDiv
                key={step.num}
                className="card p-6 relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="w-10 h-10 rounded-md flex items-center justify-center border border-rule bg-ink/[0.02]">
                    <step.icon size={18} className="text-primary" />
                  </span>
                  <span className="font-mono text-xs text-faint">{step.num} / 04</span>
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-muted mt-2">{step.desc}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule rounded-lg overflow-hidden border border-rule">
          {[
            { count: dataStructures.length, label: "Data structures" },
            { count: algorithms.length, label: "Algorithms" },
            { count: "50+", label: "Visualizations" },
            { count: "3", label: "Difficulty levels" },
          ].map((stat) => (
            <div key={stat.label} className="bg-plate p-8 text-center">
              <div className="font-display text-4xl font-bold text-ink">{stat.count}</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-faint">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;