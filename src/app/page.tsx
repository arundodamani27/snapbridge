import Link from "next/link";
import { Upload, Download, ArrowRight, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#4fffb0]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#4fffb0]/20 bg-[#4fffb0]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4fffb0] animate-pulse" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-[#4fffb0]">
            secure file transfer
          </span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.05]">
          Bridge your devices.{" "}
          <span className="text-[#4fffb0]">Instantly.</span>
        </h1>

        <p className="text-[#8884a0] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Upload from mobile, access on any PC — no account, no cloud storage,
          no traces left behind.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
          <Link
            href="/upload"
            className="group inline-flex items-center justify-center gap-2 bg-[#4fffb0] text-[#0a0a0f] px-7 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#3aefa0] transition-all duration-150 hover:-translate-y-0.5"
          >
            <Upload size={16} strokeWidth={2.5} />
            Upload a file
            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/receive"
            className="inline-flex items-center justify-center gap-2 border border-[#2a2a38] text-white px-7 py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:border-[#4fffb0] hover:text-[#4fffb0] transition-all duration-150"
          >
            <Download size={16} strokeWidth={2} />
            Enter code to receive
          </Link>
        </div>

        {/* How it works */}
        <div className="text-left max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[.12em] uppercase text-[#8884a0] mb-4">
            how it works
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { num: "01", title: "Upload your file", desc: "Drop any doc, image, or archive up to 50 MB" },
              { num: "02", title: "Get a 6-digit code", desc: "A temporary code is generated instantly" },
              { num: "03", title: "Receive anywhere", desc: "Enter the code on any device to download" },
            ].map((step) => (
              <div
                key={step.num}
                className="flex-1 bg-[#111118] border border-[#2a2a38] rounded-xl p-4 hover:border-[#4fffb0]/30 transition-colors"
              >
                <span className="font-mono text-[11px] text-[#4fffb0] mb-2 block">{step.num}</span>
                <p className="text-white text-sm font-semibold mb-1">{step.title}</p>
                <p className="text-[#8884a0] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-6 pb-24">
        <FeatureCard
          icon={<Upload size={22} strokeWidth={1.5} />}
          title="Quick Upload"
          description="Upload documents and images instantly from any device."
        />
        <FeatureCard
          icon={<Download size={22} strokeWidth={1.5} />}
          title="Easy Access"
          description="Enter a secure code on another device to get your file."
        />
        <FeatureCard
          icon={<Shield size={22} strokeWidth={1.5} />}
          title="Secure Transfer"
          description="Files are temporary and accessed through protected links."
        />
        <FeatureCard
          icon={<Clock size={22} strokeWidth={1.5} />}
          title="Auto Expiry"
          description="Files expire automatically after a limited time."
        />
      </section>

      {/* Footer strip */}
      <div className="border-t border-[#2a2a38] py-6 text-center">
        <p className="font-mono text-[11px] text-[#8884a0] tracking-widest uppercase">
          no login · no storage · auto-expires
        </p>
      </div>
    </main>
  );
}