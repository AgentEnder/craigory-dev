import { useState } from 'react';
import { MenuHeader } from '../components/MenuHeader';
import { DrinkCategory } from '../components/DrinkCategory';
import { DrinkCard } from '../components/DrinkCard';
import { InventoryCard } from '../components/InventoryCard';
import { BambooStalk } from '../components/TikiDecorations';

export interface Drink {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  strength?: 'light' | 'medium' | 'strong';
  isSpecial?: boolean;
  isBitter?: boolean;
}

export interface InventoryCategory {
  [subcategory: string]: string[];
}

export interface BarInventory {
  spirits: InventoryCategory;
  liqueurs: InventoryCategory;
  bitters: InventoryCategory;
  syrups: InventoryCategory;
  juices: InventoryCategory;
}

const drinks: Record<string, Drink[]> = {
  'Classic Tiki': [
    {
      id: 'mai-tai',
      name: 'Mai Tai',
      description: 'The king of tiki drinks with aged rum, orgeat, and citrus',
      ingredients: ['Aged Rum', 'Orgeat', 'Orange Curacao', 'Lime'],
      strength: 'strong',
      isSpecial: true,
    },
    {
      id: 'zombie',
      name: 'Zombie',
      description: 'A potent blend of three rums and tropical juices',
      ingredients: [
        'Light Rum',
        'Dark Rum',
        '151 Rum',
        'Pineapple',
        'Grenadine',
        'Angostura Bitters',
      ],
      strength: 'strong',
      isBitter: true,
    },
    {
      id: 'navy-grog',
      name: 'Navy Grog',
      description: "Traditional sailors' refreshment with a modern twist",
      ingredients: [
        'Dark Rum',
        'Light Rum',
        'Grapefruit',
        'Honey',
        'Lime',
        'Allspice Dram',
      ],
      strength: 'medium',
      isBitter: true,
    },
  ],
  'Tropical Paradise': [
    {
      id: 'blue-hawaii',
      name: 'Blue Hawaii',
      description: 'Azure waves of coconut and pineapple bliss',
      ingredients: ['Vodka', 'Blue Curacao', 'Pineapple', 'Coconut Cream'],
      strength: 'medium',
    },
    {
      id: 'pina-colada',
      name: 'Piña Colada',
      description: 'Creamy coconut and pineapple perfection',
      ingredients: ['White Rum', 'Coconut Cream', 'Pineapple', 'Crushed Ice'],
      strength: 'light',
    },
    {
      id: 'painkiller',
      name: 'Painkiller',
      description: 'Smooth sailing with rum, pineapple, and coconut',
      ingredients: ['Dark Rum', 'Pineapple', 'Orange', 'Coconut Cream'],
      strength: 'medium',
    },
  ],
  'House Specials': [
    {
      id: 'volcano-bowl',
      name: 'Volcano Bowl',
      description: 'A flaming spectacle meant for sharing (serves 2-4)',
      ingredients: ['Multiple Rums', 'Tropical Juices', 'Fire', 'Mystery'],
      strength: 'strong',
      isSpecial: true,
    },
    {
      id: 'scorpion-bowl',
      name: 'Scorpion Bowl',
      description: 'Group adventure in a bowl (serves 2-4)',
      ingredients: ['Rum', 'Brandy', 'Orgeat', 'Orange', 'Pineapple'],
      strength: 'strong',
      isSpecial: true,
    },
  ],
  'Zero Proof': [
    {
      id: 'virgin-colada',
      name: 'Virgin Colada',
      description: 'All the tropical flavor, none of the rum',
      ingredients: ['Coconut Cream', 'Pineapple', 'Crushed Ice'],
    },
    {
      id: 'tropical-sunset',
      name: 'Tropical Sunset',
      description: 'Layers of fruit juices creating a sunset in your glass',
      ingredients: ['Orange', 'Pineapple', 'Grenadine', 'Lime'],
    },
  ],
};

const barInventory: BarInventory = {
  spirits: {
    Rum: [
      'Aged Rum (Appleton Estate 12yr)',
      'Light Rum (Plantation 3 Stars)',
      "Dark Rum (Myers's)",
      'Overproof Rum (Wray & Nephew)',
      'Spiced Rum (Kraken)',
    ],
    Whiskey: ['Bourbon (Buffalo Trace)', 'Rye Whiskey (Rittenhouse)'],
    Agave: ['Tequila Blanco (Espolòn)', 'Mezcal (Del Maguey Vida)'],
    Other: ['Vodka (Titos)', 'Gin (Hendricks)'],
  },
  liqueurs: {
    Orange: ['Orange Curacao (Pierre Ferrand)', 'Blue Curacao'],
    'Tiki Specialty': ['Falernum', 'Allspice Dram'],
  },
  bitters: {
    Aromatic: ['Angostura Bitters', "Peychaud's Bitters"],
    Citrus: ['Orange Bitters'],
  },
  syrups: {
    Sweeteners: ['Simple Syrup', 'Orgeat Syrup'],
    Flavored: ['Grenadine (Homemade)', 'Coconut Cream'],
  },
  juices: {
    Citrus: [
      'Lime Juice (Fresh)',
      'Lemon Juice (Fresh)',
      'Orange Juice',
      'Grapefruit Juice',
    ],
    Tropical: ['Pineapple Juice'],
  },
};

export default function Page() {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(['Bar Inventory'])
  );

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (collapsedCategories.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  return (
    <div className="min-h-screen">
      <div className="tiki-container">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
          <MenuHeader />

          <div className="space-y-8">
            {Object.entries(drinks).map(([category, categoryDrinks]) => (
              <div key={category} className="space-y-4">
                <DrinkCategory
                  name={category}
                  isOpen={!collapsedCategories.has(category)}
                  onClick={() => toggleCategory(category)}
                />

                {!collapsedCategories.has(category) && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
                    {categoryDrinks.map((drink) => (
                      <DrinkCard key={drink.id} drink={drink} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Bar Inventory Section */}
            <div className="space-y-4">
              <DrinkCategory
                name="Bar Inventory"
                isOpen={!collapsedCategories.has('Bar Inventory')}
                onClick={() => toggleCategory('Bar Inventory')}
              />

              {!collapsedCategories.has('Bar Inventory') && (
                <div className="transition-all duration-300">
                  <InventoryCard inventory={barInventory} />
                </div>
              )}
            </div>
          </div>

          <footer className="mt-16 text-center text-sm border-t border-tiki-carved/30 pt-8 relative">
            {/* Footer decorations */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '15%',
                opacity: '0.5',
              }}
            >
              <BambooStalk size={14} height={40} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '15%',
                opacity: '0.5',
              }}
            >
              <BambooStalk size={14} height={40} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '15px',
                left: '8%',
                opacity: '0.4',
                transform: 'rotate(-5deg)',
              }}
            >
              <BambooStalk size={12} height={35} />
            </div>
            <div
              style={{
                position: 'absolute',
                top: '15px',
                right: '8%',
                opacity: '0.4',
                transform: 'rotate(5deg)',
              }}
            >
              <BambooStalk size={12} height={35} />
            </div>

            <div className="bamboo-divider mb-6"></div>

            {/* Legend */}
            <div className="mb-6 text-readable text-xs">
              <h4 className="font-semibold mb-3 text-sm">Legend</h4>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-tiki-accent">•</span>
                  <span>Light</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tiki-accent">••</span>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tiki-accent">•••</span>
                  <span>Strong</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">⚠</span>
                  <span>Contains Bitters</span>
                </div>
              </div>
            </div>

            <p className="mb-2 text-readable">
              All cocktails crafted with premium spirits and fresh ingredients
            </p>
            <p className="text-readable mb-4">
              Please enjoy responsibly • Must be 21+ for alcoholic beverages
            </p>

            <div className="text-center">
              <a
                href="/tiki-menu/admin"
                className="inline-flex items-center gap-2 bg-tiki-surface/80 border border-tiki-carved/30 px-4 py-2 rounded-lg text-xs text-tiki-text hover:bg-tiki-accent hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span>🗝️</span>
                Admin Login
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
