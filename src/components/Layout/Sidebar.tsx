import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Wrench, 
  Settings,
  BarChart3,
  Archive,
  Smartphone,
  X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t, dir } = useLanguage();

  const menuItems = [
    { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
    { icon: Wrench, label: t('nav.repairs'), path: '/repairs' },
    { icon: Package, label: t('nav.inventory'), path: '/inventory' },
    { icon: Smartphone, label: t('nav.brands'), path: '/brands' },
    { icon: BarChart3, label: t('nav.reports'), path: '/reports' },
    { icon: Archive, label: t('nav.archive'), path: '/archive' },
    { icon: Settings, label: t('nav.settings'), path: '/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed ${dir === 'rtl' ? 'right-0' : 'left-0'} top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`text-${dir === 'rtl' ? 'right' : 'left'}`}>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t('workshop.title')}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {t('workshop.subtitle')}
                </p>
              </div>
              
              {/* Close button for mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <ul className="space-y-1 sm:space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base
                      ${isActive(item.path)
                        ? `bg-blue-50 text-blue-600 ${dir === 'rtl' ? 'border-r-4' : 'border-l-4'} border-blue-600`
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;