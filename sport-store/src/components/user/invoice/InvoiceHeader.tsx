import { Share2, Download, Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InvoiceHeaderProps {
  handlePrint: () => void;
}

export default function InvoiceHeader({ handlePrint }: InvoiceHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700 mr-3 sm:mr-6 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft size={16} className="sm:size-18 mr-1" />
            <span className="hidden sm:inline">Quay lại</span>
            <span className="sm:hidden">Trở về</span>
          </button>
        </div>
        
        <div className="flex space-x-1 sm:space-x-2">
          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={16} className="sm:size-18" />
          </button>
          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Download size={16} className="sm:size-18" />
          </button>
          <button 
            onClick={handlePrint}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Printer size={16} className="sm:size-18" />
          </button>
        </div>
      </div>
    </header>
  );
} 