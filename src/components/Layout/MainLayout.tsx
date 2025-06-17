import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dir } = useLanguage();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={dir}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className={`flex-1 ${dir === 'rtl' ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <Header onMenuToggle={toggleSidebar} />
        <main className="p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;