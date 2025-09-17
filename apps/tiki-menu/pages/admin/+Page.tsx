import { useState, useEffect } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';
import { LoginForm } from '../../components/LoginForm';
import { InventoryManagement } from '../../components/InventoryManagement';
import { RecipeManagement } from '../../components/RecipeManagement';
import { ProgressBar } from '../../components/ProgressBar';
import { useAdminStore } from '../../src/stores/adminStore';

export default function AdminPage() {
  const { currentUser, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'recipes'>(
    'inventory'
  );
  
  const { loadIngredientLibrary, loadRecipes } = useAdminStore();

  useEffect(() => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    
    // Load initial data when user is authenticated
    loadIngredientLibrary();
    loadRecipes();
  }, [currentUser, loadIngredientLibrary, loadRecipes]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogin(true);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  if (!currentUser && showLogin) {
    return <LoginForm onClose={() => setShowLogin(false)} />;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-tiki-text mb-4">
            Access Denied
          </h1>
          <p className="text-tiki-text mb-4">
            You must be logged in to access this page.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-tiki-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90"
          >
            Login
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen">
      <div className="tiki-container">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-tiki-text">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-tiki-text">
                Welcome, {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-tiki-surface rounded-lg border border-tiki-carved overflow-hidden">
            <div className="flex border-b border-tiki-carved/30">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'inventory'
                    ? 'bg-tiki-accent text-white'
                    : 'text-tiki-text hover:bg-tiki-surface/50'
                }`}
              >
                Inventory Management
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'recipes'
                    ? 'bg-tiki-accent text-white'
                    : 'text-tiki-text hover:bg-tiki-surface/50'
                }`}
              >
                Recipe Management
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'inventory' && (
                <InventoryManagement />
              )}

              {activeTab === 'recipes' && (
                <RecipeManagement />
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/tiki-menu/"
              className="inline-block bg-tiki-accent text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Back to Menu
            </a>
          </div>
        </div>
      </div>
      
      {/* Progress bar for operations */}
      <ProgressBar />
    </div>
  );
}
