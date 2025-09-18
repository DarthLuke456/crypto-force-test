// Script para agregar botón de feedback a todas las sidebars
const fs = require('fs');
const path = require('path');

const sidebars = [
  'app/dashboard/warrior/SidebarWarrior.tsx',
  'app/dashboard/darth/SidebarDarth.tsx', 
  'app/dashboard/lord/SidebarLord.tsx'
];

sidebars.forEach(sidebarPath => {
  let content = fs.readFileSync(sidebarPath, 'utf8');
  
  // Agregar MessageSquare al import
  content = content.replace(
    /} from 'lucide-react';/,
    ', MessageSquare } from \'lucide-react\';'
  );
  
  // Agregar import de FeedbackModal
  content = content.replace(
    /import DashboardSelectorModal from '@\/components\/DashboardSelectorModal';/,
    `import DashboardSelectorModal from '@/components/DashboardSelectorModal';
import FeedbackModal from '@/components/FeedbackModal';`
  );
  
  // Agregar estado para feedback modal
  content = content.replace(
    /const \[showDashboardSelector, setShowDashboardSelector\] = useState\(false\);/,
    `const [showDashboardSelector, setShowDashboardSelector] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);`
  );
  
  // Agregar botón de feedback a navigationItems
  content = content.replace(
    /{ name: 'Configuración', href: '\/dashboard\/[^']+', icon: Settings },/,
    `{ name: 'Feedback', href: '#', icon: MessageSquare, isFeedback: true },
    { name: 'Configuración', href: '/dashboard/${sidebarPath.split('/')[2]}', icon: Settings },`
  );
  
  // Agregar handler para feedback
  content = content.replace(
    /const handleCompassClick = \(\) => \{[\s\S]*?\};/,
    `const handleCompassClick = () => {
    setShowDashboardSelector(true);
  };

  const handleFeedbackClick = () => {
    setIsFeedbackModalOpen(true);
  };`
  );
  
  // Agregar lógica de renderizado para feedback
  content = content.replace(
    /const isCompassItem = item\.isCompass;/,
    `const isCompassItem = item.isCompass;
              const isFeedbackItem = item.isFeedback;`
  );
  
  // Agregar botón de feedback en el renderizado
  content = content.replace(
    /\) : \(/,
    `) : isFeedbackItem ? (
                    <button
                      onClick={handleFeedbackClick}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#FFD447]/10 hover:text-[#FFD447] hover:border-l-2 hover:border-l-[#FFD447]/50 rounded-md transition-colors"
                      title="Enviar Feedback"
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  ) : (`
  );
  
  // Agregar modal de feedback al final
  content = content.replace(
    /<\/>[\s\S]*?\);\s*}$/,
    `</>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}`
  );
  
  fs.writeFileSync(sidebarPath, content);
  console.log(`✅ Updated ${sidebarPath}`);
});

console.log('🎉 All sidebars updated with feedback functionality!');
