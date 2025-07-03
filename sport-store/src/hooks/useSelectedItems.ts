import { useState, useEffect } from 'react';

export function useSelectedItems() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load selectedItems từ localStorage khi component mount
  useEffect(() => {
    const savedSelectedItems = localStorage.getItem('cart_selected_items');
    if (savedSelectedItems) {
      try {
        const parsed = JSON.parse(savedSelectedItems);
        if (Array.isArray(parsed)) {
          setSelectedItems(parsed);
        }
      } catch (error) {
        console.error('Failed to parse saved selected items:', error);
      }
    }
  }, []);

  // Save selectedItems vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('cart_selected_items', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const toggleSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAll = (itemIds: string[]) => {
    setSelectedItems(itemIds);
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const toggleSelectAll = (itemIds: string[]) => {
    if (selectedItems.length === itemIds.length) {
      deselectAll();
    } else {
      selectAll(itemIds);
    }
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(id => id !== itemId));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return {
    selectedItems,
    toggleSelect,
    selectAll,
    deselectAll,
    toggleSelectAll,
    removeItem,
    clearSelection,
    setSelectedItems
  };
} 