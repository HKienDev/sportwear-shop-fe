import { Share2, Download, Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InvoiceHeaderProps {
  order?: {
    shortId: string;
  };
  activeSection: string;
  setActiveSection: (section: string) => void;
  handlePrint: () => void;
}

export default function InvoiceHeader({ order, activeSection, setActiveSection, handlePrint }: InvoiceHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 no-print">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700 mr-6"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-xl font-medium text-gray-900">
            {order ? `Hóa đơn #${order.shortId}` : 'Hóa đơn'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={() => setActiveSection('details')} 
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'details' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
            Chi tiết
          </button>
          <button onClick={() => setActiveSection('shipping')} 
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'shipping' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
            Vận chuyển
          </button>
          <button onClick={() => setActiveSection('support')} 
            className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'support' ? 'bg-red-50 text-red-700' : 'text-gray-500 hover:text-gray-700'}`}>
            Hỗ trợ
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Share2 size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Download size={18} />
          </button>
          <button 
            onClick={handlePrint}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>
    </header>
  );
} 