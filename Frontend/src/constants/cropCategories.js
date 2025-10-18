// Crop Categories - Predefined list for the application
export const CROP_CATEGORIES = [
  'Seeds',
  'Fertilizers', 
  'Pesticides',
  'Equipment',
  'Grains',
  'Vegetables',
  'Fruits',
  'Other'
];

// Default category for new crops
export const DEFAULT_CATEGORY = 'Other';

// Category validation function
export const isValidCategory = (category) => {
  return CROP_CATEGORIES.includes(category);
};

// Get category options for dropdown
export const getCategoryOptions = () => {
  return CROP_CATEGORIES.map(category => ({
    value: category,
    label: category
  }));
};