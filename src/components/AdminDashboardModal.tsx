'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, RefreshCw, Package, Search, Lock, 
  DollarSign, Users, BarChart3, Database, Printer, Clock,
  Tag, Plus, Trash2, ToggleLeft, ToggleRight, Phone, Mail, Edit3, Save,
  ShoppingCart, Leaf
} from 'lucide-react';
import { Order, Product, ShippingAddress } from '@/types/store';
import { useStore } from '@/context/StoreContext';
import { SafeRecaptcha } from '@/components/SafeRecaptcha';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  localOrders: Order[];
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  localOrders,
}) => {
  const { 
    products, addProduct, deleteProduct,
    promoCodes, addPromoCode, togglePromoCode, deletePromoCode,
    updateOrderDetails, deleteOrder 
  } = useStore();

  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'promos' | 'crm' | 'analytics' | 'gas'>('orders');
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Order Inspector Drawer State
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editTrackingUrl, setEditTrackingUrl] = useState('');
  const [editETA, setEditETA] = useState('');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [editStatus, setEditStatus] = useState<Order['status']>('Processing');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Print Invoice Modal State
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // New Promo Code Form Inputs
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // New Product Form Inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'ghee' | 'oil' | 'paneer'>('ghee');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(950);
  const [newProdWeight, setNewProdWeight] = useState('500 ml Glass Jar');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('100% Organic Farm Fresh');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LcpqGstAAAAAMBOybBtJPFQ2aMtBfLmsUT9AAtB';
  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbwqHEdFL5zR_cCPSUkvb91nudf72H9K1CdFYPEyHgP_XInRSaHQU0TiZEtadcYHpQPS/exec';

  const fetchOrdersFromGAS = async () => {
    setLoading(true);
    try {
      const response = await fetch(gasUrl);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.orders) && data.orders.length > 0) {
        setGasOrders(data.orders);
      } else {
        setGasOrders(localOrders);
      }
    } catch {
      setGasOrders(localOrders);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchOrdersFromGAS();
    } else {
      setGasOrders(localOrders);
    }
  }, [isOpen, authenticated, localOrders]);

  if (!isOpen) return null;

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setAuthError('Please verify the security checkbox.');
      return;
    }
    if (passcode === 'admin123' || passcode === 'brindavanam') {
      setAuthenticated(true);
      setAuthError('');
      fetchOrdersFromGAS();
    } else {
      setAuthError('Invalid Admin Security Passcode. Default is: admin123');
    }
  };

  // High-Resolution Standalone Print Window Trigger (100% Reliable across browsers)
  const triggerDirectPrint = (order: Order) => {
    const printWin = window.open('', '_blank', 'width=800,height=950');
    if (!printWin) {
      window.print();
      return;
    }

    const itemsRows = order.items && order.items.length > 0
      ? order.items.map((it, idx) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${it.product?.name || ''}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${it.selectedVariant?.weight || ''}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${it.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${(it.selectedVariant?.price || 0) * it.quantity}</td>
          </tr>
        `).join('')
      : `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">1</td>
            <td colspan="3" style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${order.itemsSummary || 'Organic Produce Basket'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${order.total}</td>
          </tr>
        `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Invoice #${order.id} - Brindavanam Organic Farms</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1c260b; margin: 0; padding: 24px; background: #ffffff; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #3A5303; padding-bottom: 16px; margin-bottom: 20px; }
            .brand { font-size: 26px; font-weight: bold; color: #3A5303; font-family: Georgia, serif; }
            .subbrand { font-size: 11px; color: #94C000; text-transform: uppercase; font-weight: bold; margin-top: 2px; }
            .badge { background: #3A5303; color: white; padding: 5px 14px; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 4px; display: inline-block; }
            .box-grid { display: flex; gap: 16px; margin-bottom: 24px; }
            .box { flex: 1; background: #F7F6F2; border: 1px solid #e0ddd5; padding: 16px; border-radius: 12px; font-size: 12px; line-height: 1.6; }
            .box-title { font-weight: bold; color: #3A5303; text-transform: uppercase; font-size: 10px; margin-bottom: 8px; border-bottom: 1px solid #d4cfc5; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
            th { background: #3A5303; color: white; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
            .totals { text-align: right; font-size: 12px; line-height: 1.8; }
            .grand-total { font-size: 18px; font-weight: bold; color: #3A5303; border-top: 2px solid #3A5303; padding-top: 8px; margin-top: 8px; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; font-size: 10px; color: #666; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">Brindavanam Organic Farms</div>
              <div class="subbrand">Brindavan Farm Hyd • Hyderabad, Telangana, India</div>
              <div style="font-size: 11px; color: #555; margin-top: 4px;">Official Contact: brindavanam1902@gmail.com</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">OFFICIAL TAX INVOICE</span>
              <div style="font-weight: bold; font-family: monospace; font-size: 15px; margin-top: 6px; color: #3A5303;">${order.id}</div>
              <div style="font-size: 11px; color: #666;">${order.date}</div>
            </div>
          </div>

          <div class="box-grid">
            <div class="box">
              <div class="box-title">CUSTOMER / SHIP TO ADDRESS</div>
              <div style="font-weight: bold; font-size: 14px; color: #111;">${order.shippingAddress?.fullName || order.customerName || 'Valued Customer'}</div>
              <div>${order.shippingAddress?.addressLine1 || order.shippingAddress || ''}</div>
              <div>${order.shippingAddress?.city || order.city || ''} - ${order.shippingAddress?.pincode || ''}</div>
              <div style="margin-top: 6px; font-family: monospace;">Mobile: ${order.shippingAddress?.phone || order.customerPhone || 'N/A'}</div>
              <div style="color: #555;">Email: ${order.shippingAddress?.email || order.customerEmail || ''}</div>
            </div>

            <div class="box">
              <div class="box-title">DISPATCH & FULFILLMENT SUMMARY</div>
              <div><strong>Payment Status:</strong> Paid (100% Tax Inclusive)</div>
              <div><strong>Payment Method:</strong> ${order.paymentMethod || 'Razorpay Online'}</div>
              <div><strong>Ref ID:</strong> ${order.paymentId || 'PAY-ONLINE'}</div>
              <div style="margin-top: 4px;"><strong>Estimated Arrival (ETA):</strong> <span style="color: #3A5303; font-weight: bold;">${order.estimatedArrival || '3-5 Business Days'}</span></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Produce Item Description</th>
                <th>Variant / Weight</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Total Price (INR)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: ₹${order.subtotal || order.total}</div>
            ${order.discount ? `<div style="color: #2b3e02; font-weight: bold;">Coupon Discount: -₹${order.discount}</div>` : ''}
            <div>Express Farm Courier Shipping: <span style="color: #2b3e02; font-weight: bold;">FREE</span></div>
            <div class="grand-total">Grand Total Amount Paid: ₹${order.total}</div>
          </div>

          <div class="footer">
            <div>Brindavanam Organic Farms • Brindavan Farm Hyd</div>
            <div style="font-weight: bold; color: #94C000;">Powered By Rendervoid</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
  };

  const openOrderInspector = (order: Order) => {
    setInspectingOrder(order);
    setEditCustomerName(order.shippingAddress?.fullName || order.customerName || '');
    setEditCustomerPhone(order.shippingAddress?.phone || order.customerPhone || '');
    setEditAddress(order.shippingAddress?.addressLine1 || (order.shippingAddress ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}` : ''));
    setEditTrackingUrl(order.trackingUrl || '');
    setEditETA(order.estimatedArrival || '3-5 Business Days');
    setEditAdminNotes(order.adminNotes || '');
    setEditStatus(order.status);
  };

  const handleSaveOrderDetails = async () => {
    if (!inspectingOrder) return;
    setIsSavingDetails(true);

    const updatedAddress: ShippingAddress = {
      fullName: editCustomerName,
      email: inspectingOrder.shippingAddress?.email || inspectingOrder.customerEmail || '',
      phone: editCustomerPhone,
      addressLine1: editAddress,
      city: inspectingOrder.shippingAddress?.city || inspectingOrder.city || '',
      state: inspectingOrder.shippingAddress?.state || 'Telangana',
      pincode: inspectingOrder.shippingAddress?.pincode || '',
    };

    const updatedData = {
      customerName: editCustomerName,
      customerPhone: editCustomerPhone,
      shippingAddress: updatedAddress,
      trackingUrl: editTrackingUrl,
      estimatedArrival: editETA,
      adminNotes: editAdminNotes,
      status: editStatus,
    };

    await updateOrderDetails(inspectingOrder.id, updatedData);

    setGasOrders((prev) =>
      prev.map((o) => (o.id === inspectingOrder.id ? { ...o, ...updatedData } : o))
    );

    setIsSavingDetails(false);
    setInspectingOrder(null);
  };

  const handleDeleteOrderClick = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${orderId}?`)) return;
    await deleteOrder(orderId);
    setGasOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (inspectingOrder?.id === orderId) setInspectingOrder(null);
  };

  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    addPromoCode(newPromoCode, newPromoDiscount, newPromoDesc);
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newProdName,
      subtitle: newProdSubtitle || 'Fresh Organic Farm Harvest',
      category: newProdCategory,
      description: newProdDescription || 'Handcrafted at Brindavan Farm Hyd with traditional Vedic methods.',
      healthBenefits: ['100% Pure Organic', 'Zero Preservatives', 'Rich in essential nutrients'],
      extractionMethod: 'Traditional Marachekku Wood Pressed / Hand-Churned Bilona',
      badge: newProdBadge,
      rating: 5.0,
      reviewsCount: 12,
      images: [
        newProdImage || 'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg'
      ],
      variants: [
        {
          id: `var-${Date.now()}`,
          weight: newProdWeight,
          price: newProdPrice,
          originalPrice: Math.round(newProdPrice * 1.15),
          inStock: true,
        }
      ],
      nutritionalInfo: [
        { label: 'Purity', value: '100% Certified Organic' }
      ],
      reviews: [],
    };

    addProduct(newProd);
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdDescription('');
    setNewProdPrice(950);
    setNewProdImage('');
  };

  const combinedOrders = gasOrders.length > 0 ? gasOrders : localOrders;
  const filteredOrders = combinedOrders.filter((o) => {
    const matchesFilter = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(searchLower) ||
      (o.shippingAddress?.fullName || o.customerName || '').toLowerCase().includes(searchLower) ||
      (o.shippingAddress?.email || o.customerEmail || '').toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = combinedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const processingCount = combinedOrders.filter((o) => o.status === 'Processing').length;
  const shippedCount = combinedOrders.filter((o) => o.status === 'Shipped').length;
  const deliveredCount = combinedOrders.filter((o) => o.status === 'Delivered').length;

  const customerMap = new Map<string, { name: string; email: string; phone: string; count: number; totalSpent: number }>();
  combinedOrders.forEach((o) => {
    const email = (o.shippingAddress?.email || o.customerEmail || '').toLowerCase();
    if (!email) return;
    const name = o.shippingAddress?.fullName || o.customerName || 'Valued Patron';
    const phone = o.shippingAddress?.phone || o.customerPhone || 'N/A';
    const spent = o.total || 0;

    if (customerMap.has(email)) {
      const existing = customerMap.get(email)!;
      existing.count += 1;
      existing.totalSpent += spent;
    } else {
      customerMap.set(email, { name, email, phone, count: 1, totalSpent: spent });
    }
  });
  const customerList = Array.from(customerMap.values());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      
      {/* Sleek Floating Enterprise Window Container */}
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-200 animate-in fade-in duration-200 h-[92vh] flex flex-col my-auto">
        
        {/* Top Header */}
        <div className="bg-[#1c260b] text-white px-4 sm:px-6 py-4 flex justify-between items-center border-b border-stone-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3A5303] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-[#94C000] shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#94C000] font-bold block">
                  Brindavan Farm Operations
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight truncate">Master Operations Desk</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* STEP 1: Admin Authentication Screen */}
        {!authenticated ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto text-center space-y-5 overflow-y-auto my-auto">
            <div className="w-16 h-16 bg-[#F7F6F2] rounded-full flex items-center justify-center mx-auto text-[#3A5303] shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-serif text-stone-900">Admin Authentication</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">
                Enter your master passcode to access live order fulfillments, product manager, and CRM database.
              </p>
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
                {authError}
              </p>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl text-xs text-center font-bold tracking-widest bg-[#F7F6F2] focus:outline-none focus:border-[#3A5303]"
                placeholder="Passcode (default: admin123)"
              />

              <div className="flex flex-col items-center justify-center py-1 scale-90 sm:scale-100">
                <SafeRecaptcha siteKey={siteKey} onVerify={setRecaptchaToken} />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-98"
              >
                Authenticate Access
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Main Enterprise Operations Desk Dashboard */
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Top Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none bg-[#F7F6F2] p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'orders' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Orders ({combinedOrders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'products' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#94C000]" />
                  <span>Catalog Products ({products.length})</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('promos')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'promos' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-[#94C000]" />
                  <span>Promos ({promoCodes.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'crm' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>CRM ({customerList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'analytics' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('gas')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
                    activeTab === 'gas' ? 'bg-[#3A5303] text-white shadow-md font-bold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-[#94C000]" />
                  <span>Sync</span>
                </button>
              </div>

              <button
                onClick={fetchOrdersFromGAS}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-[#F7F6F2] hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#3A5303] ${loading ? 'animate-spin' : ''}`} />
                <span>Sync Order Stream</span>
              </button>
            </div>

            {/* Metrics KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Gross Sales</span>
                <p className="text-2xl font-serif text-[#3A5303] font-bold">₹{totalRevenue}</p>
                <p className="text-[10px] text-emerald-700 font-semibold">Live Revenue</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Processing</span>
                <p className="text-2xl font-serif text-amber-700 font-bold">{processingCount}</p>
                <p className="text-[10px] text-stone-400">Awaiting dispatch</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">In Transit</span>
                <p className="text-2xl font-serif text-[#4E90F5] font-bold">{shippedCount}</p>
                <p className="text-[10px] text-stone-400">Courier transit</p>
              </div>

              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Store Lineup</span>
                <p className="text-2xl font-serif text-stone-900 font-bold">{products.length}</p>
                <p className="text-[10px] text-stone-400">Active produce items</p>
              </div>
            </div>

            {/* TAB 1: Live Orders Manager */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search Order ID, Customer Name, Email, Address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  </div>

                  <div className="w-full sm:w-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs bg-white font-semibold focus:outline-none"
                    >
                      <option value="all">All Statuses ({combinedOrders.length})</option>
                      <option value="processing">Processing ({processingCount})</option>
                      <option value="shipped">Shipped ({shippedCount})</option>
                      <option value="delivered">Delivered ({deliveredCount})</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="hidden sm:block max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#3A5303] text-white font-bold sticky top-0 z-10">
                        <tr>
                          <th className="p-3.5">Order ID & Date</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Items Purchased</th>
                          <th className="p-3.5">Total Paid</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Order Inspector & Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-16 text-stone-400">
                              No matching orders found.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-stone-50 transition-colors">
                              <td className="p-3.5">
                                <span className="font-bold text-[#3A5303] block text-sm">{ord.id}</span>
                                <span className="text-[10px] text-stone-400">{ord.date}</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-semibold text-stone-900 block">
                                  {ord.shippingAddress?.fullName || ord.customerName || 'Valued Customer'}
                                </span>
                                <span className="text-[10px] text-stone-500 block">
                                  {ord.shippingAddress?.email || ord.customerEmail || 'N/A'}
                                </span>
                              </td>
                              <td className="p-3.5 max-w-[200px] truncate text-stone-600">
                                {ord.itemsSummary || ord.items?.map((i) => `${i.product.name} x${i.quantity}`).join(', ')}
                              </td>
                              <td className="p-3.5 font-bold text-stone-900 text-sm">
                                ₹{ord.total}
                              </td>
                              <td className="p-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  ord.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                                  ord.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                  ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-1">
                                <button
                                  onClick={() => openOrderInspector(ord)}
                                  className="px-2.5 py-1.5 bg-[#3A5303] text-white font-bold rounded-lg text-[10px] hover:bg-[#2b3e02] shadow-xs inline-flex items-center space-x-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Inspect & Edit</span>
                                </button>
                                <button
                                  onClick={() => triggerDirectPrint(ord)}
                                  className="p-1.5 text-stone-600 hover:text-[#3A5303] rounded-lg border border-stone-200 hover:bg-stone-100"
                                  title="Print Amazing Invoice"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrderClick(ord.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="block sm:hidden p-3 space-y-3">
                    {filteredOrders.map((ord) => (
                      <div key={ord.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-[#3A5303] text-sm block">{ord.id}</span>
                            <span className="text-[10px] text-stone-400">{ord.date}</span>
                          </div>
                          <span className="font-bold text-stone-900 text-sm">₹{ord.total}</span>
                        </div>
                        <p className="font-bold text-stone-900">{ord.shippingAddress?.fullName || ord.customerName}</p>
                        <p className="text-stone-600 text-[11px] line-clamp-2">{ord.itemsSummary || ord.items?.map((i) => i.product.name).join(', ')}</p>
                        
                        <div className="pt-2 flex items-center justify-between border-t border-stone-200">
                          <button
                            onClick={() => openOrderInspector(ord)}
                            className="px-3 py-1.5 bg-[#3A5303] text-white rounded-lg font-bold text-[10px]"
                          >
                            Inspect & Edit Details
                          </button>
                          <button
                            onClick={() => triggerDirectPrint(ord)}
                            className="p-1.5 text-stone-700 hover:text-[#3A5303]"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrderClick(ord.id)}
                            className="p-1 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Dynamic Product Catalog Manager */}
            {activeTab === 'products' && (
              <div className="space-y-5">
                <form onSubmit={handleCreateProduct} className="bg-[#F7F6F2] p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-[#3A5303]" />
                    <span>Add New Farm Produce to Store Catalog</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. Wild Forest Honey"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Category *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                      >
                        <option value="ghee">A2 Bilona Ghee</option>
                        <option value="oil">Wood-Pressed Oil</option>
                        <option value="paneer">Fresh Paneer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={newProdSubtitle}
                        onChange={(e) => setNewProdSubtitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="Raw & Unfiltered 100% Pure"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Weight / Unit *</label>
                      <input
                        type="text"
                        required
                        value={newProdWeight}
                        onChange={(e) => setNewProdWeight(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="500g Glass Jar"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase rounded-xl shadow-md flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Produce to Store Catalog</span>
                  </button>
                </form>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div key={p.id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs space-x-3">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0 bg-white" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-stone-900 truncate">{p.name}</h4>
                        <p className="text-[10px] text-stone-500">{p.variants[0]?.weight}</p>
                        <p className="font-bold text-[#3A5303] mt-0.5">₹{p.variants[0]?.price}</p>
                      </div>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Promo Codes Manager */}
            {activeTab === 'promos' && (
              <div className="space-y-4">
                <form onSubmit={handleCreatePromoCode} className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-serif font-bold text-stone-900 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-[#3A5303]" />
                    <span>Create Storefront Promo Coupon</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Code *</label>
                      <input
                        type="text"
                        required
                        value={newPromoCode}
                        onChange={(e) => setNewPromoCode(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. FESTIVE25"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Discount % *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={newPromoDiscount}
                        onChange={(e) => setNewPromoDiscount(parseInt(e.target.value) || 10)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Description</label>
                      <input
                        type="text"
                        value={newPromoDesc}
                        onChange={(e) => setNewPromoDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#3A5303]"
                        placeholder="25% Off Harvest Sale"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Coupon Code</span>
                  </button>
                </form>

                <div className="space-y-2">
                  {promoCodes.map((p) => (
                    <div key={p.code} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#3A5303] text-sm">{p.code}</span>
                          <span className="bg-[#3A5303]/10 text-[#3A5303] font-bold px-2 py-0.5 rounded text-[10px]">
                            {p.discountPercent}% OFF
                          </span>
                          {!p.active && <span className="bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded">DISABLED</span>}
                        </div>
                        <span className="text-stone-500 text-[11px] block mt-0.5">{p.description}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => togglePromoCode(p.code)} title="Toggle Active">
                          {p.active ? <ToggleRight className="w-7 h-7 text-[#3A5303]" /> : <ToggleLeft className="w-7 h-7 text-stone-400" />}
                        </button>
                        <button onClick={() => deletePromoCode(p.code)} className="p-1 text-stone-400 hover:text-red-600" title="Delete Coupon">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Customer CRM */}
            {activeTab === 'crm' && (
              <div className="space-y-3">
                {customerList.map((c, i) => (
                  <div key={i} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900 text-sm">{c.name}</span>
                      <span className="font-bold text-[#3A5303] bg-[#3A5303]/10 px-2.5 py-0.5 rounded-full text-[11px]">₹{c.totalSpent}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-stone-500 text-[11px]">
                      <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {c.email}</span>
                      <span className="flex items-center font-mono"><Phone className="w-3 h-3 mr-1" /> {c.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Sales Analytics */}
            {activeTab === 'analytics' && (
              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <h3 className="text-sm font-serif font-bold text-stone-900">Store Financial Overview</h3>
                <p className="text-stone-600">Total Live Gross Revenue: <strong className="text-[#3A5303] text-lg font-serif">₹{totalRevenue}</strong></p>
                <p className="text-stone-500 text-[11px]">Orders Processed: {combinedOrders.length} orders across Hyderabad and pan-India.</p>
              </div>
            )}

            {/* TAB 6: Sync Monitor */}
            {activeTab === 'gas' && (
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <p className="font-bold text-stone-900">Apps Script Live Endpoint URL:</p>
                <p className="font-mono text-stone-600 text-[10px] break-all bg-white p-3 rounded-xl border border-stone-200 select-all">
                  {gasUrl}
                </p>
              </div>
            )}

          </div>
        )}

        {/* MODAL A: Detailed Order Inspector Modal */}
        {inspectingOrder && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl p-6 border border-stone-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3A5303]">Order Inspector & Control Desk</span>
                  <h2 className="text-xl font-serif font-bold text-stone-900">{inspectingOrder.id}</h2>
                  <p className="text-xs text-stone-400">Placed on {inspectingOrder.date}</p>
                </div>
                <button onClick={() => setInspectingOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Itemized Purchased Produce */}
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <h4 className="font-bold text-stone-900 border-b border-stone-300 pb-1 font-serif">Purchased Produce Items</h4>
                {inspectingOrder.items && inspectingOrder.items.length > 0 ? (
                  inspectingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center space-x-3 py-1 border-b border-stone-200/50 last:border-0">
                      {it.product?.images?.[0] && (
                        <img src={it.product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-white border border-stone-300 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-stone-900 truncate block">{it.product?.name}</span>
                        <span className="text-stone-500 text-[10px]">{it.selectedVariant?.weight} x{it.quantity}</span>
                      </div>
                      <span className="font-bold text-[#3A5303]">₹{(it.selectedVariant?.price || 0) * (it.quantity || 1)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-600 font-mono text-[11px]">{inspectingOrder.itemsSummary}</p>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-300">
                  <span>Grand Total:</span>
                  <span className="text-[#3A5303]">₹{inspectingOrder.total}</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-[#3A5303]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Customer Mobile Phone</label>
                    <input
                      type="text"
                      value={editCustomerPhone}
                      onChange={(e) => setEditCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-[#3A5303]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Fulfillment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 font-bold focus:outline-none focus:border-[#3A5303]"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Live Parcel Tracking Link (BlueDart / Delhivery)</label>
                    <input
                      type="url"
                      value={editTrackingUrl}
                      onChange={(e) => setEditTrackingUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-[#3A5303]"
                      placeholder="https://track.bluedart.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Approx Date of Arrival (ETA)</label>
                    <input
                      type="text"
                      value={editETA}
                      onChange={(e) => setEditETA(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-[#3A5303]"
                      placeholder="3-5 Business Days (e.g. Aug 2, 2026)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Admin Private Notes (Internal Store Notes)</label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:border-[#3A5303]"
                    placeholder="e.g. Hand-churned morning batch. Packed in double bubble-wrap glass jar."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  onClick={() => handleDeleteOrderClick(inspectingOrder.id)}
                  className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 font-bold text-xs flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => triggerDirectPrint(inspectingOrder)}
                    className="px-4 py-2.5 bg-stone-100 border border-stone-300 text-stone-800 rounded-xl font-bold text-xs flex items-center space-x-1 hover:bg-stone-200"
                  >
                    <Printer className="w-4 h-4 text-[#3A5303]" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={() => setInspectingOrder(null)}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSaveOrderDetails}
                    disabled={isSavingDetails}
                    className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-md flex items-center space-x-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingDetails ? 'Saving...' : 'Save Order Details & Update ETA'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
