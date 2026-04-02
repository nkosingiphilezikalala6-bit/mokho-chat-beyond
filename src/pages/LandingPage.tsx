import { MessageCircle, Shield, Zap, Users, Video, Lock, ArrowRight, Wifi } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Wifi, title: "Free Mode — 35 MB", desc: "Get 35 MB free data daily to view videos, statuses, and chat — no data plan needed!", highlight: true },
  { icon: Zap, title: "Lightning Fast", desc: "Messages delivered instantly with zero lag." },
  { icon: Shield, title: "End-to-End Encrypted", desc: "Your conversations stay private, always." },
  { icon: Users, title: "Group Chats", desc: "Create groups with unlimited members." },
  { icon: Video, title: "HD Video Calls", desc: "Crystal clear video & voice calls." },
  { icon: Lock, title: "Disappearing Messages", desc: "Set messages to auto-delete after reading." },
  { icon: MessageCircle, title: "Smart Replies", desc: "AI-powered quick replies save your time." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg mokho-gradient flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">MOKHO</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
          </div>
          <Button
            onClick={() => navigate("/home")}
            className="mokho-gradient text-primary-foreground border-0 hover:opacity-90 transition-opacity"
          >
            Open Chat
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 animate-slide-up">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
              Chat Smarter<br />
              <span className="text-destructive">
                with MOKHO
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              The next generation messaging platform. Faster, safer, and more fun than anything you've used before.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/chat")}
                className="mokho-gradient text-primary-foreground border-0 hover:opacity-90 transition-opacity mokho-glow text-base px-8"
              >
                Start Chatting <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
              >
                Learn More
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-semibold">
                <Wifi className="w-4 h-4" />
                <span>35 MB Free Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-mokho-online" />
                <span>12K+ Online Now</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Encrypted</span>
              </div>
            </div>
          </div>
          <div className="flex-1 animate-fade-in">
            <img
              src={heroImage}
              alt="MOKHO chat illustration"
              width={1024}
              height={768}
              className="w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose <span className="text-destructive">MOKHO</span>?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Built from the ground up with features that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`bg-card rounded-xl p-6 border hover:shadow-lg transition-all duration-300 group ${
                  (f as any).highlight
                    ? "border-destructive/40 ring-2 ring-destructive/20 md:col-span-2 lg:col-span-1"
                    : "border-border hover:border-primary/30"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:mokho-glow transition-shadow ${
                  (f as any).highlight ? "bg-destructive" : "mokho-gradient"
                }`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${(f as any).highlight ? "text-destructive" : "text-foreground"}`}>{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                {(f as any).highlight && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                    <Wifi className="w-3 h-3" /> No Data Plan Required
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md mokho-gradient flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MOKHO</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MOKHO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
