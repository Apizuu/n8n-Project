import React from 'react';
import { Plus, MessageSquare, Sun, Moon, X } from 'lucide-react';

/**
 * Komponen sidebar untuk riwayat obrolan dan opsi tema.
 * @param {object} props
 * @param {boolean} props.isSidebarOpen - Status apakah sidebar terbuka.
 * @param {string} props.theme - Tema saat ini ('light' atau 'dark').
 * @param {function} props.toggleSidebar - Fungsi untuk menutup sidebar.
 * @param {function} props.toggleTheme - Fungsi untuk mengganti tema.
 * @returns {JSX.Element} Komponen sidebar.
 */
const Sidebar = ({ isSidebarOpen, theme, toggleSidebar, toggleTheme }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn">
          <Plus size={16} />
          <span>Obrolan baru</span>
        </button>
        <button onClick={toggleSidebar} className="sidebar-toggle-btn">
          <X size={20} />
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#" className="active">
              <MessageSquare size={16} />
              <span>Contoh obrolan 1</span>
            </a>
          </li>
          <li>
            <a href="#">
              <MessageSquare size={16} />
              <span>Contoh obrolan 2</span>
            </a>
          </li>
          <li>
            <a href="#">
              <MessageSquare size={16} />
              <span>Pengembangan Aplikasi</span>
            </a>
          </li>
          <li>
            <a href="#">
              <MessageSquare size={16} />
              <span>Ide Proyek</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          <span>Ganti Tema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;