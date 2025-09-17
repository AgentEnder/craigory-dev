import type { BarInventory } from '../pages/+Page';

interface InventoryCardProps {
  inventory: BarInventory;
}

export function InventoryCard({ inventory }: InventoryCardProps) {
  const renderCategory = (categoryName: string, categoryData: any, showFooter: boolean = false) => (
    <div className="tiki-card p-6">
      <div className="relative z-10">
        <h3 className="drink-name text-lg mb-3">{categoryName}</h3>
        <div className="space-y-3">
          {Object.entries(categoryData).map(([subcategory, items]) => (
            <div key={subcategory}>
              <h4 className="drink-name text-sm mb-2 text-tiki-accent">{subcategory}</h4>
              <div className="flex flex-wrap gap-2">
                {(items as string[]).map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-tiki-wood/20 rounded text-xs text-tiki-carved border border-tiki-bamboo/30"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {showFooter && (
          <p className="text-tiki-carved/80 text-xs mt-3 italic">
            Feel free to request custom cocktails using any of these ingredients!
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {renderCategory("Spirits", inventory.spirits)}
      {renderCategory("Liqueurs", inventory.liqueurs)}
      
      <div className="tiki-card p-6">
        <div className="relative z-10">
          <h3 className="drink-name text-lg mb-3">Bitters & Syrups</h3>
          <div className="space-y-4">
            <div>
              <h4 className="drink-name text-sm mb-2 text-tiki-accent">Bitters</h4>
              <div className="space-y-3">
                {Object.entries(inventory.bitters).map(([subcategory, items]) => (
                  <div key={subcategory}>
                    <h5 className="text-xs mb-1 text-tiki-carved/70">{subcategory}</h5>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-tiki-wood/20 rounded text-xs text-tiki-carved border border-tiki-bamboo/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="drink-name text-sm mb-2 text-tiki-accent">Syrups</h4>
              <div className="space-y-3">
                {Object.entries(inventory.syrups).map(([subcategory, items]) => (
                  <div key={subcategory}>
                    <h5 className="text-xs mb-1 text-tiki-carved/70">{subcategory}</h5>
                    <div className="flex flex-wrap gap-2">
                      {(items as string[]).map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-tiki-wood/20 rounded text-xs text-tiki-carved border border-tiki-bamboo/30"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderCategory("Fresh Juices", inventory.juices, true)}
    </div>
  );
}