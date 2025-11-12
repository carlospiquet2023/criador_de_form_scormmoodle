import React, { useState, useEffect } from 'react';
import SCORMEditor from './components/SCORMEditor';
import StudentView from './components/StudentView';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import TermsModal from './components/TermsModal';
import LicenseModal from './components/LicenseModal';
import { Layout, BookOpen, Users, Settings } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('editor'); // 'editor', 'student', 'admin'
  const [evaluations, setEvaluations] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [showLicense, setShowLicense] = useState(false);

  useEffect(() => {
    // Carregar avaliações do localStorage
    const saved = localStorage.getItem('scorm-evaluations');
    if (saved) {
      setEvaluations(JSON.parse(saved));
    }
  }, []);

  const saveEvaluation = (evaluation) => {
    const updated = [...evaluations];
    const index = updated.findIndex(e => e.id === evaluation.id);
    if (index >= 0) {
      updated[index] = evaluation;
    } else {
      updated.push(evaluation);
    }
    setEvaluations(updated);
    localStorage.setItem('scorm-evaluations', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Sistema SCORM - Moodle
              </span>
            </div>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setActiveView('editor')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'editor'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <BookOpen size={20} />
                Editor
              </button>
              <button
                onClick={() => setActiveView('student')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users size={20} />
                Visão do Aluno
              </button>
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                Administração
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 min-h-[calc(100vh-300px)]">
        {activeView === 'editor' && (
          <SCORMEditor 
            onSave={saveEvaluation}
            evaluations={evaluations}
          />
        )}
        {activeView === 'student' && (
          <StudentView evaluations={evaluations} />
        )}
        {activeView === 'admin' && (
          <AdminPanel evaluations={evaluations} />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onShowTerms={() => setShowTerms(true)}
        onShowLicense={() => setShowLicense(true)}
      />

      {/* Modals */}
      <TermsModal 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
      <LicenseModal 
        isOpen={showLicense}
        onClose={() => setShowLicense(false)}
      />
    </div>
  );
}

export default App;
