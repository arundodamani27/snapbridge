import { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group bg-[#111118] border border-[#2a2a38] rounded-2xl p-5 hover:border-[#4fffb0]/40 hover:bg-[#111118]/80 transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-[#4fffb0]/10 flex items-center justify-center mb-4 text-[#4fffb0] group-hover:bg-[#4fffb0]/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <p className="text-[#8884a0] text-xs leading-relaxed">{description}</p>
    </div>
  );
}