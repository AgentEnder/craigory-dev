# Database Schema Documentation

This folder contains PlantUML diagrams documenting the Firestore NoSQL database schema for the Tiki Menu application.

## Viewing the Diagrams

### Online Viewer
1. Copy the contents of `firestore-schema.puml`
2. Visit [PlantUML Web Server](http://www.plantuml.com/plantuml/uml)
3. Paste and view the diagram

### VS Code Extension
Install the PlantUML extension:
- Extension ID: `jebbs.plantuml`
- Preview: `Alt+D` or right-click → "Preview Current Diagram"

### Generate Images
```bash
# Install PlantUML (requires Java)
brew install plantuml

# Generate PNG
plantuml -tpng firestore-schema.puml

# Generate SVG
plantuml -tsvg firestore-schema.puml
```

## Schema Overview

The database is designed with the following principles:
- **Public Read Access**: All documents are readable by anyone (menu is public)
- **Admin Write Access**: Only authenticated admin users can modify data
- **Nested Document Structure**: Uses Firestore's subcollections for true hierarchical nesting
- **Flexible Categorization**: Supports arbitrary nesting depth with categories and ingredients

## Collections

### 1. Ingredient Library (Dual Subcollection Structure)
A hierarchical collection where each category has two subcollections: `subcategories` for nested categories and `ingredients` for direct ingredients at that level.

**Document Structure:**
- Categories have both `subcategories` and `ingredients` subcollections
- `hasSubcategories` and `hasIngredients` boolean flags for efficient querying
- Clean separation between categories and ingredients

**Example Hierarchy:**
```
/ingredientLibrary/
├── rum/
│   ├── /subcategories/
│   │   ├── jamaican/
│   │   │   ├── /subcategories/
│   │   │   │   ├── aged/
│   │   │   │   │   └── /ingredients/
│   │   │   │   │       ├── appleton-12
│   │   │   │   │       └── appleton-21
│   │   │   │   └── light/
│   │   │   │       └── /ingredients/
│   │   │   │           └── wray-nephew
│   │   │   └── /ingredients/
│   │   │       └── special-jamaican-blend
│   │   └── barbados/
│   │       └── /ingredients/
│   │           └── plantation-3star
│   └── /ingredients/
│       └── generic-rum
│
└── vodka/
    ├── /subcategories/
    │   ├── neutral/
    │   │   └── /ingredients/
    │   │       ├── titos
    │   │       └── grey-goose
    │   └── flavored/
    │       ├── /subcategories/
    │       │   └── citrus/
    │       │       └── /ingredients/
    │       │           ├── ketel-one-citron
    │       │           └── absolut-citron
    │       └── /ingredients/
    │           └── vanilla-vodka
    └── /ingredients/
        └── house-vodka
```

**Rendering Logic:**
- If a category has both subcategories and ingredients:
  - Show subcategories first
  - Show ingredients under an "Other" section
- If a category has only ingredients:
  - Show ingredients directly without "Other" label

### 2. Recipes
Drink recipes that reference ingredients via paths.

**Key Features:**
- Can specify required category path (e.g., "/rum/jamaican" for any Jamaican rum)
- Can specify preferred specific ingredient path
- Supports optional ingredients

### 3. Inventory
Tracks availability for specific ingredients.
- Uses path-based IDs (e.g., "rum_jamaican_aged_appleton-12")
- References full path to ingredient in library

### 4. Users
User profiles with role-based access control.

## Query Patterns

```javascript
// Get all top-level categories
db.collection('ingredientLibrary')
  .orderBy('order')

// Get all rum subcategories
db.collection('ingredientLibrary')
  .doc('rum')
  .collection('subcategories')
  .orderBy('order')

// Get all ingredients directly under rum
db.collection('ingredientLibrary')
  .doc('rum')
  .collection('ingredients')
  .orderBy('order')

// Get all ingredients in aged Jamaican rum
db.collection('ingredientLibrary')
  .doc('rum')
  .collection('subcategories').doc('jamaican')
  .collection('subcategories').doc('aged')
  .collection('ingredients')
  .orderBy('order')

// Get all ingredients across entire library (using collection group query)
db.collectionGroup('ingredients')
  .orderBy('name')

// Get only available ingredients globally
db.collectionGroup('ingredients')
  .where('available', '==', true)
  .orderBy('order')

// Check ingredient availability
db.collection('inventory')
  .doc('rum_jamaican_aged_appleton-12')
  .get()

// Get all active recipes
db.collection('recipes')
  .where('active', '==', true)
  .orderBy('category')
  .orderBy('order')

// Determine if category needs "Other" section
async function getCategoryDisplay(categoryRef) {
  const [subcategories, ingredients] = await Promise.all([
    categoryRef.collection('subcategories').limit(1).get(),
    categoryRef.collection('ingredients').limit(1).get()
  ]);
  
  const hasSubcategories = !subcategories.empty;
  const hasIngredients = !ingredients.empty;
  
  // Show "Other" section only if both exist
  return { hasSubcategories, hasIngredients, showOther: hasSubcategories && hasIngredients };
}
```

## Security Model

The security rules enforce:
1. **Public read access** for all collections (except user details)
2. **Admin-only write access** via role checking in users collection
3. **User profile protection** - users can only update non-role fields in their own profile

## Indexes

Composite indexes are defined in `firestore.indexes.json` to optimize common query patterns:
- Collection group queries for `ingredients` (to find all ingredients regardless of nesting)
- Availability filtering for ingredients
- Brand and name sorting for ingredients
- Recipe filtering by category and active status

The key index is the **collection group index** on `ingredients` which allows querying all ingredients across the entire hierarchy efficiently.