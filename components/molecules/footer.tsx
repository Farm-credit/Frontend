import { MessageCircle, Send, Video } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-black">
      <footer className="w-full bg-[#121212] rounded-t-xl px-4 py-6 flex items-center justify-between text-gray-400 text-sm font-sans">
        <div className="flex items-center space-x-2">
          <span>© 2025 — Copyright</span>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="WhatsApp" className="text-gray-400 hover:text-white focus:outline-none">
            <MessageCircle size={20} />
          </button>
          <button aria-label="Telegram" className="text-gray-400 hover:text-white focus:outline-none">
            <Send size={20} />
          </button>
          <button aria-label="YouTube" className="text-gray-400 hover:text-white focus:outline-none">
            <Video size={20} />
          </button>
        </div>
        <div>
          <a href="#" className="text-gray-400 hover:text-white text-sm font-sans">
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}
