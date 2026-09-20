type LogoProps = { className?: string };

const Logo: React.FC<LogoProps> = ({ className = "" }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img
      src="/favicon.svg"
      alt=""
      className="h-8 w-8 rounded-lg shadow-[0_0_20px_-4px_rgba(99,102,241,0.8)]"
    />
    <span className="text-lg font-bold tracking-tight text-white">
      API
      <span className="bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
        RRA
      </span>
    </span>
  </div>
);

export default Logo;
