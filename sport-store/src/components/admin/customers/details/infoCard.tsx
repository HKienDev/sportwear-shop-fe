interface InfoCardProps {
  title: string;
  value: string;
}

export default function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="p-5 bg-white shadow-md rounded-xl flex flex-col items-center justify-center border border-neutral-100 hover:border-indigo-200 transition-colors duration-200 hover:shadow-lg">
      <p className="text-neutral-500 mb-1">{title}</p>
      <p className="text-xl font-bold text-neutral-800">{value}</p>
    </div>
  );
} 