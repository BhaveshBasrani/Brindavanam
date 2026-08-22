'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, RefreshCw, Package, Search, Lock, 
  DollarSign, Users, BarChart3, Database, Printer, Clock,
  Tag, Plus, Trash2, ToggleLeft, ToggleRight, Phone, Mail, Edit3, Save,
  ShoppingCart, Leaf, Star, MessageSquare, Megaphone, RotateCcw,
  AlertCircle, ArrowRight, FolderOpen
} from 'lucide-react';
import { Order, Product, ProductVariant, ShippingAddress } from '@/types/store';
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
    products, addProduct, updateProduct, deleteProduct,
    promoCodes, addPromoCode, togglePromoCode, deletePromoCode,
    announcements, addAnnouncement, editAnnouncement, deleteAnnouncement, resetAnnouncements, syncAnnouncementsToCloud,
    updateOrderDetails, deleteOrder 
  } = useStore();

  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'promos' | 'offers' | 'reviews' | 'crm' | 'analytics' | 'gas'>('orders');
  const [gasOrders, setGasOrders] = useState<Order[]>([]);
  const [gasReviews, setGasReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Announcement Cloud Sync States
  const [isSyncingOffers, setIsSyncingOffers] = useState(false);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);
  const [offerSyncFeedback, setOfferSyncFeedback] = useState('');

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

  // Product Editor Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdSubtitle, setEditProdSubtitle] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs'>('ghee');
  const [editProdVariants, setEditProdVariants] = useState<ProductVariant[]>([]);
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdBadge, setEditProdBadge] = useState('');

  // Announcement Ticker Editor Modal State
  const [editingAnnouncementIdx, setEditingAnnouncementIdx] = useState<number | null>(null);
  const [editAnnouncementText, setEditAnnouncementText] = useState('');

  // New Promo Code Form Inputs
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(15);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // New Offer Ticker Input
  const [newOfferText, setNewOfferText] = useState('');

  // New Product Form Inputs
  const [newProdName, setNewProdName] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<'ghee' | 'oil' | 'paneer' | 'milk' | 'eggs'>('ghee');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdVariants, setNewProdVariants] = useState<ProductVariant[]>([
    { id: 'var-1', weight: '500 ml Glass Jar', price: 950, originalPrice: 1100, inStock: true }
  ]);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('100% Organic Farm Fresh');

  // New Admin Review Form
  const [adminRevAuthor, setAdminRevAuthor] = useState('');
  const [adminRevLocation, setAdminRevLocation] = useState('Hyderabad');
  const [adminRevRating, setAdminRevRating] = useState(5);
  const [adminRevProduceTag, setAdminRevProduceTag] = useState('ghee');
  const [adminRevHeadline, setAdminRevHeadline] = useState('');
  const [adminRevComment, setAdminRevComment] = useState('');

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Lfpvm4tAAAAAC_wsr8Cg2-OCEyhOwzqPb5gtfmr';
  const gasUrl = process.env.NEXT_PUBLIC_GAS_WEB_APP_URL || 'https://script.google.com/macros/s/AKfycbxwcmwfICPKEBKgREmobTj69fhqenkej1qGagtfh9kXSoZSTP16gUw8mkMGYtDmE4Gwag/exec';

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

  const fetchReviewsFromGAS = async () => {
    try {
      const response = await fetch(`${gasUrl}?action=getReviews`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.reviews)) {
        setGasReviews(data.reviews);
      }
    } catch (err) {
      console.warn('Reviews fetch error:', err);
    }
  };

  useEffect(() => {
    if (isOpen && authenticated) {
      fetchOrdersFromGAS();
      fetchReviewsFromGAS();
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
      fetchReviewsFromGAS();
    } else {
      setAuthError('Invalid Admin Security Passcode. Default is: admin123');
    }
  };

  // Open Product Editor for any product (default or custom)
  const openProductEditor = (p: Product) => {
    setEditingProduct(p);
    setEditProdName(p.name);
    setEditProdSubtitle(p.subtitle || '');
    setEditProdCategory(p.category);
    setEditProdImage(p.images[0] || '');
    setEditProdBadge(p.badge || '100% Certified Organic');
    setEditProdVariants(
      p.variants && p.variants.length > 0
        ? JSON.parse(JSON.stringify(p.variants))
        : [{ id: `var-${Date.now()}`, weight: '1 Litre', price: 500, originalPrice: 600, inStock: true }]
    );
  };

  const handleSaveEditedProduct = () => {
    if (!editingProduct) return;

    const validVariants = editProdVariants.length > 0 
      ? editProdVariants 
      : [{ id: `var-${Date.now()}`, weight: 'Standard Pack', price: 500, originalPrice: 600, inStock: true }];

    const updatedProd: Product = {
      ...editingProduct,
      name: editProdName,
      subtitle: editProdSubtitle,
      category: editProdCategory,
      badge: editProdBadge,
      images: [editProdImage || editingProduct.images[0]],
      variants: validVariants.map((v, i) => ({
        id: v.id || `var-${i}-${Date.now()}`,
        weight: v.weight || 'Standard Pack',
        price: Number(v.price) || 0,
        originalPrice: v.originalPrice || Math.round((Number(v.price) || 0) * 1.15),
        inStock: v.inStock !== undefined ? v.inStock : true,
      })),
    };

    updateProduct(updatedProd);
    setEditingProduct(null);
  };

  // Open Offer Announcement Editor for any item (default or custom)
  const openAnnouncementEditor = (index: number, currentText: string) => {
    setEditingAnnouncementIdx(index);
    setEditAnnouncementText(currentText);
  };

  const handleSaveEditedAnnouncement = async () => {
    if (editingAnnouncementIdx === null) return;
    setIsUpdatingOffer(true);
    await editAnnouncement(editingAnnouncementIdx, editAnnouncementText);
    setIsUpdatingOffer(false);
    setEditingAnnouncementIdx(null);
    setOfferSyncFeedback('✓ Announcement updated and live on ticker!');
    setTimeout(() => setOfferSyncFeedback(''), 4000);
  };

  const handleManualCloudSync = async () => {
    setIsSyncingOffers(true);
    const success = await syncAnnouncementsToCloud();
    setIsSyncingOffers(false);
    setOfferSyncFeedback(success ? '✓ Synced & Uploaded to Google Apps Script!' : '✓ Saved to Local Storage & Active Live!');
    setTimeout(() => setOfferSyncFeedback(''), 4000);
  };

  // High-Resolution Standalone Print Window Trigger
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
          <title>Official Invoice #${order.id} - Brindavanam Nature Centre</title>
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
              <div class="brand">Brindavanam Nature Centre</div>
              <div class="subbrand">Hyderabad, Telangana, India</div>
              <div style="font-size: 11px; color: #555; margin-top: 4px;">Official Contact: brundavanamteam@gmail.com</div>
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
            <div>Brindavanam Nature Centre • Hyderabad</div>
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

  const handleDeleteReviewClick = async (reviewId: string) => {
    if (!window.confirm(`Are you sure you want to delete Review #${reviewId}?`)) return;
    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteReview', reviewId }),
      });
      setGasReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.warn('Delete review err:', err);
    }
  };

  const handleAddAdminReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRevAuthor.trim() || !adminRevComment.trim()) return;

    const newRev = {
      name: adminRevAuthor,
      location: adminRevLocation || 'Hyderabad',
      rating: adminRevRating,
      produceTag: adminRevProduceTag,
      produceName: adminRevProduceTag === 'ghee' ? 'A2 Desi Cow Bilona Ghee' : adminRevProduceTag === 'oil' ? 'Wood-Pressed Oils' : 'Fresh Paneer',
      headline: adminRevHeadline || 'Authentic Farm Fresh Quality!',
      review: adminRevComment,
    };

    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'submitReview', review: newRev }),
      });
      fetchReviewsFromGAS();
      setAdminRevAuthor('');
      setAdminRevHeadline('');
      setAdminRevComment('');
    } catch (err) {
      console.warn('Admin review submit err:', err);
    }
  };

  const handleCreatePromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    addPromoCode(newPromoCode, newPromoDiscount, newPromoDesc);
    setNewPromoCode('');
    setNewPromoDesc('');
  };

  const handleAddOfferTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferText.trim()) return;
    setIsAddingOffer(true);
    await addAnnouncement(newOfferText);
    setNewOfferText('');
    setIsAddingOffer(false);
    setOfferSyncFeedback('✓ New offer added and live on ticker!');
    setTimeout(() => setOfferSyncFeedback(''), 4000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const validVariants = newProdVariants.length > 0 
      ? newProdVariants 
      : [{ id: `var-${Date.now()}`, weight: 'Standard Pack', price: 950, originalPrice: 1100, inStock: true }];

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: newProdName,
      subtitle: newProdSubtitle || 'Fresh Organic Farm Harvest',
      category: newProdCategory,
      description: newProdDescription || 'Handcrafted at Brindavanam Nature Centre with traditional Vedic methods.',
      healthBenefits: ['100% Pure Organic', 'Zero Preservatives', 'Rich in essential nutrients'],
      extractionMethod: 'Traditional Marachekku Wood Pressed / Hand-Churned Bilona',
      badge: newProdBadge,
      rating: 5.0,
      reviewsCount: 0,
      images: [
        newProdImage || 'https://images.pexels.com/photos/20689447/pexels-photo-20689447.jpeg'
      ],
      variants: validVariants.map((v, i) => ({
        id: v.id || `var-${i}-${Date.now()}`,
        weight: v.weight || 'Standard Pack',
        price: Number(v.price) || 0,
        originalPrice: v.originalPrice || Math.round((Number(v.price) || 0) * 1.15),
        inStock: v.inStock !== undefined ? v.inStock : true,
      })),
      nutritionalInfo: [
        { label: 'Purity', value: '100% Certified Organic' }
      ],
      reviews: [],
    };

    addProduct(newProd);
    setNewProdName('');
    setNewProdSubtitle('');
    setNewProdDescription('');
    setNewProdVariants([{ id: `var-${Date.now()}`, weight: '500 ml Glass Jar', price: 950, originalPrice: 1100, inStock: true }]);
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 font-sans">
      
      {/* Floating Executive Control Station Container */}
      <div className="bg-stone-100 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden relative border border-stone-300 animate-in fade-in duration-200 h-[92vh] flex flex-col my-auto text-stone-900">
        
        {/* 1. TOP EXECUTIVE CONTROL STATION HEADER */}
        <div className="bg-[#0e160a] text-white px-5 sm:px-7 py-4 flex justify-between items-center border-b border-stone-800 shrink-0 shadow-lg">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#3A5303] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-[#94C000]/50 shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#94C000]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#94C000] font-bold block">
                  BRINDAVANAM // CONTROL STATION
                </span>
                <span className="flex items-center space-x-1 bg-[#3A5303]/40 px-2 py-0.5 rounded-full border border-[#94C000]/30 text-[9px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SECURE SESSION</span>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono uppercase mt-0.5">
                Master Operations Desk
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {authenticated && (
              <button
                onClick={() => {
                  fetchOrdersFromGAS();
                  fetchReviewsFromGAS();
                }}
                disabled={loading}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-stone-200 border border-white/15 transition-all cursor-pointer"
                title="Sync stream with Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#94C000] ${loading ? 'animate-spin' : ''}`} />
                <span>SYNC DATABASE</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Control Station"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* STEP 1: Admin Authentication Gate (VSHN Security Decryption Style) */}
        {!authenticated ? (
          <div className="p-6 sm:p-12 max-w-md mx-auto text-center space-y-6 overflow-y-auto my-auto w-full">
            <div className="w-20 h-20 bg-[#1c260b] text-[#94C000] rounded-3xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-[#94C000]/30 relative">
              <Lock className="w-9 h-9" />
              <div className="absolute inset-0 rounded-3xl bg-[#94C000]/20 blur-lg -z-10" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#3A5303] font-bold block">
                SECURITY SHIELD ACTIVATED
              </span>
              <h3 className="text-2xl font-bold font-mono tracking-tight text-stone-900 uppercase">
                DECRYPT SYSTEM ACCESS
              </h3>
              <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-xs mx-auto">
                Authenticate master security key to decrypt operational metrics, live dispatch stream, and customer orders.
              </p>
            </div>

            {authError && (
              <div className="text-xs text-red-700 font-bold bg-red-50 p-3 rounded-2xl border border-red-200 font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>ACCESS DENIED: {authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminAuth} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest mb-1.5">
                  SECURITY PASSCODE
                </label>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-stone-300 rounded-2xl text-sm font-mono font-bold tracking-widest bg-white text-stone-900 focus:outline-none focus:border-[#3A5303] shadow-xs"
                  placeholder="••••••••"
                  autoFocus
                />
                <span className="text-[10px] text-stone-400 font-mono mt-1 block">
                  Developer key: Use password <strong className="text-stone-700">admin123</strong>
                </span>
              </div>

              <div className="flex flex-col items-center justify-center py-1 scale-95">
                <SafeRecaptcha siteKey={siteKey} onVerify={setRecaptchaToken} />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-98 cursor-pointer flex items-center justify-center space-x-2 font-mono"
              >
                <span>DECRYPT & UNLOCK DESK</span>
                <ArrowRight className="w-4 h-4 text-[#94C000]" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: Main Enterprise Operations Desk Dashboard */
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1 bg-stone-100">
            
            {/* Top Navigation Control Tabs (VSHN Segmented Control Style) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'orders'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#94C000]" />
                  <span>ORDERS [{combinedOrders.length}]</span>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'offers'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-amber-400" />
                  <span>OFFER TICKER [{announcements.length}]</span>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'products'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-[#94C000]" />
                  <span>CATALOG [{products.length}]</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'reviews'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>REVIEWS [{gasReviews.length}]</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('promos')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'promos'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Tag className="w-4 h-4 text-[#94C000]" />
                  <span>PROMOS [{promoCodes.length}]</span>
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'crm'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>CRM [{customerList.length}]</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'analytics'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>ANALYTICS</span>
                </button>

                <button
                  onClick={() => setActiveTab('gas')}
                  className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer font-mono ${
                    activeTab === 'gas'
                      ? 'bg-[#3A5303] text-white shadow-md font-bold ring-1 ring-[#94C000]/40'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Database className="w-4 h-4 text-[#94C000]" />
                  <span>DATABASE</span>
                </button>
              </div>

              <button
                onClick={() => {
                  fetchOrdersFromGAS();
                  fetchReviewsFromGAS();
                }}
                disabled={loading}
                className="sm:hidden w-full px-4 py-2.5 bg-stone-900 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#94C000] ${loading ? 'animate-spin' : ''}`} />
                <span>SYNC DATABASE</span>
              </button>
            </div>

            {/* Metrics Executive KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1 relative overflow-hidden group">
                <div className="w-1.5 h-full bg-[#3A5303] absolute left-0 top-0 bottom-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block pl-1">
                  GROSS REVENUE SECURED
                </span>
                <p className="text-2xl font-bold font-mono text-[#3A5303] tracking-tight pl-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block ml-1">
                  ✓ Verified Stream
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1 relative overflow-hidden">
                <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0 bottom-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block pl-1">
                  PROCESSING QUEUE
                </span>
                <p className="text-2xl font-bold font-mono text-amber-700 tracking-tight pl-1">
                  {processingCount}
                </p>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block ml-1">
                  Awaiting Dispatch
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1 relative overflow-hidden">
                <div className="w-1.5 h-full bg-blue-500 absolute left-0 top-0 bottom-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block pl-1">
                  SHIPPED IN-TRANSIT
                </span>
                <p className="text-2xl font-bold font-mono text-blue-700 tracking-tight pl-1">
                  {shippedCount}
                </p>
                <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-block ml-1">
                  En-route ETA Active
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1 relative overflow-hidden">
                <div className="w-1.5 h-full bg-[#94C000] absolute left-0 top-0 bottom-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block pl-1">
                  OFFER TICKERS
                </span>
                <p className="text-2xl font-bold font-mono text-stone-900 tracking-tight pl-1">
                  {announcements.length}
                </p>
                <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md inline-block ml-1">
                  Live Marquee Lines
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1 relative overflow-hidden col-span-2 lg:col-span-1">
                <div className="w-1.5 h-full bg-stone-800 absolute left-0 top-0 bottom-0" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 block pl-1">
                  STORE CATALOG
                </span>
                <p className="text-2xl font-bold font-mono text-stone-900 tracking-tight pl-1">
                  {products.length}
                </p>
                <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md inline-block ml-1">
                  Produce Lineup
                </span>
              </div>
            </div>

            {/* TAB 1: Live Orders Manager */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search Order ID, Customer Name, Email, Address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-stone-300 rounded-xl bg-stone-50 text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] focus:bg-white transition-all placeholder:text-stone-400"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-xl text-xs bg-stone-50 text-stone-900 font-bold font-mono focus:outline-none cursor-pointer"
                    >
                      <option value="all">ALL STATUSES ({combinedOrders.length})</option>
                      <option value="processing">PROCESSING ({processingCount})</option>
                      <option value="shipped">SHIPPED ({shippedCount})</option>
                      <option value="delivered">DELIVERED ({deliveredCount})</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Orders Data Table */}
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                  <div className="hidden sm:block max-h-[420px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-stone-900 text-stone-200 font-mono font-bold uppercase tracking-wider text-[11px] sticky top-0 z-10">
                        <tr>
                          <th className="p-4 border-b border-stone-800">Order ID & Date</th>
                          <th className="p-4 border-b border-stone-800">Customer Profile</th>
                          <th className="p-4 border-b border-stone-800">Produce Items</th>
                          <th className="p-4 border-b border-stone-800">Amount</th>
                          <th className="p-4 border-b border-stone-800">Status</th>
                          <th className="p-4 border-b border-stone-800 text-right">Actions & Inspector</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-16 text-stone-400 font-mono">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <FolderOpen className="w-6 h-6 text-stone-400" />
                                <span>NO MATCHING ORDERS FOUND</span>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                              <td className="p-4">
                                <span className="font-mono font-bold text-[#3A5303] bg-[#3A5303]/10 px-2.5 py-1 rounded-md text-xs border border-[#3A5303]/20 inline-block">
                                  {ord.id}
                                </span>
                                <span className="text-[10px] text-stone-400 block font-mono mt-1">
                                  {ord.date && ord.date.length > 25 ? `${ord.date.substring(0, 16)} IST` : ord.date}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="font-bold text-stone-900 block text-xs">
                                  {ord.shippingAddress?.fullName || ord.customerName || 'Valued Customer'}
                                </span>
                                <span className="text-[10px] text-stone-500 font-mono block">
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
                                  className="px-2.5 py-1.5 bg-[#3A5303] text-white font-bold rounded-lg text-[10px] hover:bg-[#2b3e02] shadow-xs inline-flex items-center space-x-1 cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Inspect & Edit</span>
                                </button>
                                <button
                                  onClick={() => triggerDirectPrint(ord)}
                                  className="p-1.5 text-stone-600 hover:text-[#3A5303] rounded-lg border border-stone-200 hover:bg-stone-100 cursor-pointer"
                                  title="Print Invoice"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOrderClick(ord.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 cursor-pointer"
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
                </div>
              </div>
            )}

            {/* TAB 2: Offer Ticker Announcement Manager (With Cloud Save & Round Loader) */}
            {activeTab === 'offers' && (
              <div className="space-y-4">
                
                {/* Cloud Sync & Action Header Bar */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Megaphone className="w-4 h-4 text-[#3A5303]" />
                      <h3 className="text-sm font-bold font-mono uppercase text-stone-900">
                        Live Top Marquee Ticker [{announcements.length} Active]
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Edits update immediately across all storefront headers and synchronize to Database.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleManualCloudSync}
                      disabled={isSyncingOffers}
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-75 ring-1 ring-[#94C000]/30 font-mono"
                      title="Upload and sync ticker text to Database"
                    >
                      {isSyncingOffers ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-[#94C000] animate-spin" />
                          <span>UPLOADING TO DATABASE...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-[#94C000]" />
                          <span>SAVE & UPLOAD TO DATABASE</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsSyncingOffers(true);
                        await resetAnnouncements();
                        setIsSyncingOffers(false);
                        setOfferSyncFeedback('✓ Reset to factory default offers!');
                        setTimeout(() => setOfferSyncFeedback(''), 4000);
                      }}
                      disabled={isSyncingOffers}
                      className="px-3 py-2.5 bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 rounded-xl font-bold text-xs flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Reset back to default offers"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                      <span className="hidden sm:inline">Reset Defaults</span>
                    </button>
                  </div>
                </div>

                {/* Feedback Banner */}
                {offerSyncFeedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold font-mono flex items-center space-x-2 animate-in fade-in duration-150">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{offerSyncFeedback}</span>
                  </div>
                )}

                {/* Add New Offer Form */}
                <form onSubmit={handleAddOfferTicker} className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                    Add New Offer Ticker Line
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newOfferText}
                      onChange={(e) => setNewOfferText(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303] placeholder:text-stone-400"
                      placeholder="e.g. FESTIVE HARVEST SALE: FREE SHIPPING ON ALL ORDERS ABOVE ₹2000"
                    />

                    <button
                      type="submit"
                      disabled={isAddingOffer}
                      className="px-5 py-2 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-sm flex items-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-75 font-mono"
                    >
                      {isAddingOffer ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 text-[#94C000] animate-spin" />
                          <span>ADDING...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD OFFER</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* List of active announcement ticker items (Supports Editing Any Item) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                      Active Ticker Queue
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Changes appear instantly on the top banner
                    </span>
                  </div>

                  {announcements.map((text, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs space-x-3 shadow-xs">
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <span className="w-2 h-2 rounded-full bg-[#94C000] shrink-0" />
                        <span className="font-semibold text-stone-900 truncate">{text}</span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => openAnnouncementEditor(idx, text)}
                          className="p-1.5 text-stone-600 hover:text-[#3A5303] hover:bg-stone-100 rounded-lg cursor-pointer"
                          title="Edit Announcement Message"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            await deleteAnnouncement(idx);
                            setOfferSyncFeedback('✓ Announcement deleted from ticker queue.');
                            setTimeout(() => setOfferSyncFeedback(''), 3000);
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Delete Offer Announcement"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Dynamic Product Catalog Manager (Allows Editing Default & Custom Products) */}
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
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. Wild Forest Honey"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Category *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                      >
                        <option value="milk">Pure Desi Cow Milk</option>
                        <option value="ghee">A2 Bilona Ghee</option>
                        <option value="oil">Wood-Pressed Oil</option>
                        <option value="paneer">Fresh Paneer</option>
                        <option value="eggs">Farm Fresh Eggs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={newProdSubtitle}
                        onChange={(e) => setNewProdSubtitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="Raw & Unfiltered 100% Pure"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Badge / Tag</label>
                      <input
                        type="text"
                        value={newProdBadge}
                        onChange={(e) => setNewProdBadge(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="100% Organic Farm Fresh"
                      />
                    </div>
                  </div>

                  {/* Dynamic Multi-Variant List */}
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono font-bold text-stone-800 uppercase tracking-wider">
                        Weights / Measurement Units & Pricing ({newProdVariants.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setNewProdVariants([
                            ...newProdVariants,
                            { id: `var-${Date.now()}`, weight: '1 Litre', price: 950, originalPrice: 1100, inStock: true }
                          ]);
                        }}
                        className="px-2.5 py-1 bg-[#3A5303]/10 hover:bg-[#3A5303]/20 text-[#3A5303] text-[10px] font-bold uppercase rounded-lg flex items-center space-x-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Another Weight / Unit</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {newProdVariants.map((v, vIdx) => (
                        <div key={vIdx} className="flex items-center gap-2 bg-[#F7F6F2] p-2 rounded-xl border border-stone-200">
                          <div className="flex-1">
                            <input
                              type="text"
                              required
                              value={v.weight}
                              onChange={(e) => {
                                const copy = [...newProdVariants];
                                copy[vIdx].weight = e.target.value;
                                setNewProdVariants(copy);
                              }}
                              placeholder="e.g. 500 ml / 1 Litre / 5 Litres / 1 KG"
                              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                            />
                          </div>

                          <div className="w-32">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1.5 text-stone-400 font-bold text-xs">₹</span>
                              <input
                                type="number"
                                required
                                value={v.price}
                                onChange={(e) => {
                                  const copy = [...newProdVariants];
                                  copy[vIdx].price = parseInt(e.target.value) || 0;
                                  setNewProdVariants(copy);
                                }}
                                placeholder="Price"
                                className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-stone-300 rounded-lg text-stone-900 font-bold focus:outline-none focus:border-[#3A5303]"
                              />
                            </div>
                          </div>

                          {newProdVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setNewProdVariants(newProdVariants.filter((_, i) => i !== vIdx));
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                              title="Delete measurement variant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#3A5303] hover:bg-[#2b3e02] text-white font-bold text-xs uppercase rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer font-mono"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Produce to Store Catalog</span>
                  </button>
                </form>

                {/* Catalog Grid With Edit Support for Default & Custom Produce */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs space-x-3 shadow-xs">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0 bg-white" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-stone-900 truncate">{p.name}</h4>
                        <p className="text-[10px] text-stone-500">{p.variants[0]?.weight}</p>
                        <p className="font-bold text-[#3A5303] mt-0.5">₹{p.variants[0]?.price}</p>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => openProductEditor(p)}
                          className="p-1.5 text-stone-600 hover:text-[#3A5303] hover:bg-stone-100 rounded-lg cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Reviews Manager */}
            {activeTab === 'reviews' && (
              <div className="space-y-5">
                <form onSubmit={handleAddAdminReview} className="bg-[#F7F6F2] p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
                  <h3 className="text-xs font-serif font-bold text-stone-900 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-[#3A5303]" />
                    <span>Add Official Verified Patron Review</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Author Name *</label>
                      <input
                        type="text"
                        required
                        value={adminRevAuthor}
                        onChange={(e) => setAdminRevAuthor(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. Dr. Rajesh Reddy"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        value={adminRevLocation}
                        onChange={(e) => setAdminRevLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="Jubilee Hills, Hyderabad"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Produce Tag</label>
                      <select
                        value={adminRevProduceTag}
                        onChange={(e) => setAdminRevProduceTag(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                      >
                        <option value="ghee">A2 Desi Cow Bilona Ghee</option>
                        <option value="oil">Wood-Pressed Oil</option>
                        <option value="paneer">Fresh Desi Paneer</option>
                        <option value="milk">Pure A2 Desi Milk</option>
                        <option value="eggs">Farm Eggs</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Headline Quote</label>
                      <input
                        type="text"
                        value={adminRevHeadline}
                        onChange={(e) => setAdminRevHeadline(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="e.g. Authentic Danedar Ghee!"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Review Body *</label>
                      <input
                        type="text"
                        required
                        value={adminRevComment}
                        onChange={(e) => setAdminRevComment(e.target.value)}
                        className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="Detailed customer review..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save & Publish Review</span>
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-2">
                  {gasReviews.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
                      No customer reviews saved in Apps Script yet.
                    </div>
                  ) : (
                    gasReviews.map((r) => (
                      <div key={r.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex justify-between items-start text-xs space-x-3 shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-stone-900">{r.name}</span>
                            <span className="text-[10px] text-stone-400">({r.location})</span>
                            <span className="text-amber-600 font-bold flex items-center">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-400 inline mr-0.5" />
                              <span>{r.rating}</span>
                            </span>
                          </div>
                          <p className="font-bold text-[#3A5303]">{r.headline}</p>
                          <p className="text-stone-600 text-[11px] font-light">{r.review}</p>
                          <span className="text-[9px] text-stone-400 block">{r.date}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReviewClick(r.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: Promo Codes Manager */}
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
                        className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-stone-300 rounded-xl bg-white text-stone-900 focus:outline-none focus:border-[#3A5303]"
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
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Description</label>
                      <input
                        type="text"
                        value={newPromoDesc}
                        onChange={(e) => setNewPromoDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white text-stone-900 font-medium focus:outline-none focus:border-[#3A5303]"
                        placeholder="25% Off Harvest Sale"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Coupon Code</span>
                  </button>
                </form>

                <div className="space-y-2">
                  {promoCodes.map((p) => (
                    <div key={p.code} className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between text-xs shadow-xs">
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
                        <button onClick={() => togglePromoCode(p.code)} title="Toggle Active" className="cursor-pointer">
                          {p.active ? <ToggleRight className="w-7 h-7 text-[#3A5303]" /> : <ToggleLeft className="w-7 h-7 text-stone-400" />}
                        </button>
                        <button onClick={() => deletePromoCode(p.code)} className="p-1 text-stone-400 hover:text-red-600 cursor-pointer" title="Delete Coupon">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: Customer CRM */}
            {activeTab === 'crm' && (
              <div className="space-y-3">
                {customerList.map((c, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-1 text-xs shadow-xs">
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

            {/* TAB 7: Sales Analytics */}
            {activeTab === 'analytics' && (
              <div className="bg-[#F7F6F2] p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <h3 className="text-sm font-serif font-bold text-stone-900">Store Financial Overview</h3>
                <p className="text-stone-600">Total Live Gross Revenue: <strong className="text-[#3A5303] text-lg font-serif">₹{totalRevenue}</strong></p>
                <p className="text-stone-500 text-[11px]">Orders Processed: {combinedOrders.length} orders across Hyderabad and pan-India.</p>
              </div>
            )}

            {/* TAB 8: Database Sync Monitor */}
            {activeTab === 'gas' && (
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
                <p className="font-bold text-stone-900">Database Live Endpoint URL:</p>
                <p className="font-mono text-stone-600 text-[10px] break-all bg-white p-3 rounded-xl border border-stone-200 select-all">
                  {gasUrl}
                </p>
              </div>
            )}

          </div>
        )}

        {/* MODAL A: Product Editor Modal (For Default & Custom Items) */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-stone-200 space-y-4 shadow-2xl">
              
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-[#3A5303]" />
                  <span>Edit Produce: {editingProduct.name}</span>
                </h3>
                <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Category</label>
                    <select
                      value={editProdCategory}
                      onChange={(e) => setEditProdCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                    >
                      <option value="milk">Pure Desi Cow Milk</option>
                      <option value="ghee">A2 Bilona Ghee</option>
                      <option value="oil">Wood-Pressed Oil</option>
                      <option value="paneer">Fresh Paneer</option>
                      <option value="eggs">Farm Fresh Eggs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Badge</label>
                    <input
                      type="text"
                      value={editProdBadge}
                      onChange={(e) => setEditProdBadge(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editProdImage}
                    onChange={(e) => setEditProdImage(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                  />
                </div>

                {/* Dynamic Variants Editor */}
                <div className="bg-[#F7F6F2] p-3.5 rounded-2xl border border-stone-200 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono font-bold text-stone-800 uppercase tracking-wider">
                      Weights / Pack Sizes & Prices ({editProdVariants.length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditProdVariants([
                          ...editProdVariants,
                          { id: `var-${Date.now()}`, weight: '1 Litre', price: 500, originalPrice: 600, inStock: true }
                        ]);
                      }}
                      className="px-2.5 py-1 bg-[#3A5303] text-white hover:bg-[#2b3e02] text-[10px] font-bold uppercase rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Weight / Size</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {editProdVariants.map((v, vIdx) => (
                      <div key={vIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200">
                        <div className="flex-1">
                          <input
                            type="text"
                            required
                            value={v.weight}
                            onChange={(e) => {
                              const copy = [...editProdVariants];
                              copy[vIdx].weight = e.target.value;
                              setEditProdVariants(copy);
                            }}
                            placeholder="e.g. 500 ml / 1 Litre / 5 Litres"
                            className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                          />
                        </div>

                        <div className="w-28">
                          <div className="relative">
                            <span className="absolute left-2 top-1.5 text-stone-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              required
                              value={v.price}
                              onChange={(e) => {
                                const copy = [...editProdVariants];
                                copy[vIdx].price = parseInt(e.target.value) || 0;
                                setEditProdVariants(copy);
                              }}
                              placeholder="Price"
                              className="w-full pl-5 pr-1.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-bold focus:outline-none focus:border-[#3A5303]"
                            />
                          </div>
                        </div>

                        {editProdVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditProdVariants(editProdVariants.filter((_, i) => i !== vIdx));
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer"
                            title="Remove variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedProduct}
                  className="px-5 py-2 bg-[#3A5303] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#2b3e02] flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Product Changes</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL B: Announcement Ticker Editor Modal */}
        {editingAnnouncementIdx !== null && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-stone-200 space-y-4 shadow-2xl">
              
              <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                <h3 className="font-serif font-bold text-stone-900 text-lg flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-[#3A5303]" />
                  <span>Edit Offer Announcement Text</span>
                </h3>
                <button onClick={() => setEditingAnnouncementIdx(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Announcement Message *</label>
                  <textarea
                    rows={3}
                    value={editAnnouncementText}
                    onChange={(e) => setEditAnnouncementText(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-stone-200">
                <button
                  onClick={() => setEditingAnnouncementIdx(null)}
                  disabled={isUpdatingOffer}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEditedAnnouncement}
                  disabled={isUpdatingOffer}
                  className="px-5 py-2 bg-[#3A5303] text-white rounded-xl text-xs font-bold uppercase hover:bg-[#2b3e02] flex items-center space-x-1.5 cursor-pointer disabled:opacity-75"
                >
                  {isUpdatingOffer ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 text-[#94C000] animate-spin" />
                      <span>Saving & Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Announcement</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODAL C: Detailed Order Inspector Modal (Crisp High-Contrast Text) */}
        {inspectingOrder && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-2xl w-full rounded-3xl p-6 border border-stone-200 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3A5303]">Order Inspector & Control Desk</span>
                  <h2 className="text-xl font-serif font-bold text-stone-900">{inspectingOrder.id}</h2>
                  <p className="text-xs text-stone-400">Placed on {inspectingOrder.date}</p>
                </div>
                <button onClick={() => setInspectingOrder(null)} className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer">
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
                  <p className="text-stone-700 font-mono text-[11px] font-bold">{inspectingOrder.itemsSummary}</p>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-300">
                  <span>Grand Total:</span>
                  <span className="text-[#3A5303]">₹{inspectingOrder.total}</span>
                </div>
              </div>

              {/* Editable Fields With High Contrast Visible Dark Text */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Customer Mobile Phone</label>
                    <input
                      type="text"
                      value={editCustomerPhone}
                      onChange={(e) => setEditCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Fulfillment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as Order['status'])}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-bold focus:outline-none focus:border-[#3A5303] shadow-xs"
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
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] shadow-xs"
                      placeholder="https://track.bluedart.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Approx Date of Arrival (ETA)</label>
                    <input
                      type="text"
                      value={editETA}
                      onChange={(e) => setEditETA(e.target.value)}
                      className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] shadow-xs"
                      placeholder="3-5 Business Days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 uppercase mb-1">Admin Private Notes (Internal Store Notes)</label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-xl bg-white text-stone-900 font-semibold focus:outline-none focus:border-[#3A5303] shadow-xs"
                    placeholder="e.g. Hand-churned morning batch. Packed in double bubble-wrap glass jar."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-between items-center border-t border-stone-200">
                <button
                  onClick={() => handleDeleteOrderClick(inspectingOrder.id)}
                  className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => triggerDirectPrint(inspectingOrder)}
                    className="px-4 py-2.5 bg-stone-100 border border-stone-300 text-stone-800 rounded-xl font-bold text-xs flex items-center space-x-1 hover:bg-stone-200 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-[#3A5303]" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={() => setInspectingOrder(null)}
                    className="px-4 py-2.5 border border-stone-300 text-stone-700 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSaveOrderDetails}
                    disabled={isSavingDetails}
                    className="px-6 py-2.5 bg-[#3A5303] text-white font-bold text-xs uppercase rounded-xl hover:bg-[#2b3e02] shadow-md flex items-center space-x-1.5 cursor-pointer"
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
