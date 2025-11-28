export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Order {
  id: string;
  customer: string;
  total: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  items: string[];
}
