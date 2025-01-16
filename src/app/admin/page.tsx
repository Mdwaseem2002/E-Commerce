"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Search, Download } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  category: 'tshirts' | 'jackets' | 'trousers';
}

interface FormData {
  name: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  category: 'tshirts' | 'jackets' | 'trousers';
}

interface User {
  email: string;
  name: string;
  registeredAt: string;
}

interface PurchaseItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Purchase {
  userId: string;
  userName: string;
  items: PurchaseItem[];
  purchaseDate: string;
  total: number;
}

const ProductForm = memo(({ 
  onSubmit, 
  isEdit, 
  initialFormData, 
  onCancel 
}: { 
  onSubmit: (formData: FormData) => void;
  isEdit: boolean;
  initialFormData: FormData;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <input
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input
            type="text"
            value={formData.discount}
            onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'tshirts' | 'jackets' | 'trousers' }))}
            className="w-full p-2 border rounded"
          >
            <option value="tshirts">T-shirts</option>
            <option value="jackets">Jackets</option>
            <option value="trousers">Trousers</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
});

ProductForm.displayName = 'ProductForm';

const Statistics = ({ products, users, purchases }: { 
  products: Product[], 
  users: User[], 
  purchases: Purchase[] 
}) => {
  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = purchases.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm">Total Revenue</h3>
        <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm">Total Products</h3>
        <p className="text-2xl font-bold">{totalProducts}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm">Total Users</h3>
        <p className="text-2xl font-bold">{totalUsers}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-gray-500 text-sm">Total Orders</h3>
        <p className="text-2xl font-bold">{totalOrders}</p>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'tshirts' | 'jackets' | 'trousers'>('tshirts');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormData: FormData = {
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    category: 'tshirts'
  };

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("adminAuth");
      if (!isAuth) {
        router.push("/admin/login");
      } else {
        setIsLoading(false);
        // Load data
        const storedProducts = localStorage.getItem("products");
        const storedUsers = localStorage.getItem("users");
        const storedPurchases = localStorage.getItem("userPurchases");

        if (storedProducts) setProducts(JSON.parse(storedProducts));
        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedPurchases) setPurchases(JSON.parse(storedPurchases));
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const handleAddProduct = (formData: FormData) => {
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      discount: formData.discount,
      image: formData.image,
      category: formData.category
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setShowAddForm(false);
  };

  const handleEditProduct = (formData: FormData) => {
    if (!editingProduct) return;

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id ? {
        ...product,
        name: formData.name,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
        discount: formData.discount,
        image: formData.image,
        category: formData.category
      } : product
    );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const exportToCSV = () => {
    const purchaseData = purchases.map(purchase => ({
      'User Name': purchase.userName,
      'User Email': purchase.userId,
      'Purchase Date': new Date(purchase.purchaseDate).toLocaleDateString(),
      'Items': purchase.items.map(item => `${item.name} (${item.quantity})`).join(', '),
      'Total': purchase.total.toFixed(2)
    }));

    const headers = Object.keys(purchaseData[0]).join(',');
    const rows = purchaseData.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'purchase_history.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTab('dashboard')}
              className={`px-4 py-2 rounded ${
                selectedTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setSelectedTab('products')}
              className={`px-4 py-2 rounded ${
                selectedTab === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setSelectedTab('users')}
              className={`px-4 py-2 rounded ${
                selectedTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Users & Orders
            </button>
          </div>
        </div>

        {selectedTab === 'dashboard' && (
          <Statistics products={products} users={users} purchases={purchases} />
        )}

        {selectedTab === 'products' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} />
                Add New Product
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <div className="mb-6">
                <ProductForm 
                  onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
                  isEdit={!!editingProduct}
                  initialFormData={editingProduct ? {
                    name: editingProduct.name,
                    price: editingProduct.price.toString(),
                    originalPrice: editingProduct.originalPrice.toString(),
                    discount: editingProduct.discount,
                    image: editingProduct.image,
                    category: editingProduct.category
                  } : initialFormData}
                  onCancel={handleCancel}
                />
              </div>
            )}

            <div className="mb-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setSelectedCategory('tshirts')}
                  className={`px-4 py-2 rounded ${selectedCategory === 'tshirts' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  T-shirts
                </button>
                <button
                  onClick={() => setSelectedCategory('jackets')}
                  className={`px-4 py-2 rounded ${selectedCategory === 'jackets' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Jackets
                </button>
                <button
                  onClick={() => setSelectedCategory('trousers')}
                  className={`px-4 py-2 rounded ${selectedCategory === 'trousers' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  Trousers
                </button>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => product.category === selectedCategory)
                  .map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold">${product.price}</span>
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice}
                          </span>
                          <span className="bg-gray-900 text-white px-2 py-1 text-sm rounded">
                            {product.discount}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-blue-700"
                          >
                            <Edit size={20} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-red-700"
                          >
                            <Trash2 size={20} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {selectedTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Users & Purchase History</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                >
                  <Download size={20} />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Registration Date</th>
                    <th className="px-6 py-3 text-left">Purchase History</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    const userPurchases = purchases.filter(purchase => purchase.userId === user.email);
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          {new Date(user.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {userPurchases.map((purchase, pIndex) => (
                              <div key={pIndex} className="bg-gray-50 p-3 rounded">
                                <p className="font-medium text-blue-600">
                                  Purchase on {new Date(purchase.purchaseDate).toLocaleDateString()}
                                </p>
                                <div className="mt-2 space-y-1">
                                  {purchase.items.map((item, iIndex) => (
                                    <p key={iIndex} className="text-sm text-gray-600">
                                      • {item.name} x{item.quantity} (${item.price * item.quantity})
                                    </p>
                                  ))}
                                </div>
                                <p className="mt-2 font-medium">
                                  Total: ${purchase.total.toFixed(2)}
                                </p>
                              </div>
                            ))}
                            {userPurchases.length === 0 && (
                              <span className="text-gray-500">No purchases yet</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;


