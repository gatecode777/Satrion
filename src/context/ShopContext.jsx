"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ShopContext = createContext();
const API_URL = '/api';

export const ShopProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync token to LocalStorage in browser environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('satrion_token');
      if (savedToken) {
        setToken(savedToken);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('satrion_token', token);
      } else {
        localStorage.removeItem('satrion_token');
      }
    }
  }, [token]);

  // Load profile and orders in parallel when token is present
  useEffect(() => {
    const loadUserData = async () => {
      if (!token) {
        setUser(null);
        setCart([]);
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fire both requests at the same time — cuts wait time in half
        const [profileRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${API_URL}/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!profileRes.ok) {
          throw new Error('Failed to load profile');
        }

        const [userData, ordersData] = await Promise.all([
          profileRes.json(),
          ordersRes.ok ? ordersRes.json() : Promise.resolve([])
        ]);

        // Convert old addresses object layout to array for defensive compatibility
        let sanitizedAddresses = [];
        if (Array.isArray(userData.addresses)) {
          sanitizedAddresses = userData.addresses;
        } else if (userData.addresses && typeof userData.addresses === 'object') {
          const billing = userData.addresses.billing;
          const shipping = userData.addresses.shipping;
          if (billing && billing.fullName) sanitizedAddresses.push({ ...billing, _id: 'old-billing' });
          if (shipping && shipping.fullName) sanitizedAddresses.push({ ...shipping, _id: 'old-shipping' });
        }

        setUser({ 
          ...userData, 
          addresses: sanitizedAddresses, 
          orders: ordersData 
        });
        setCart(userData.cart || []);
        setWishlist(userData.wishlist || []);
      } catch (error) {
        console.error('Error loading user session:', error);
        setToken(null);
        setUser(null);
        setCart([]);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [token]);

  // Cart actions
  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      toast.warning(`Please login to add ${product.name} to Cart!`);
      setIsLoginModalOpen(true);
      return;
    }

    let updatedCart = [];
    const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingItemIndex > -1) {
      updatedCart = cart.map((item, idx) => 
        idx === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
      toast.success(`Updated ${product.name} quantity in Cart!`);
    } else {
      updatedCart = [...cart, { product, quantity }];
      toast.success(`Added ${product.name} to Cart!`);
    }

    setCart(updatedCart);

    // Sync with backend
    try {
      await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: updatedCart })
      });
    } catch (err) {
      console.error('Failed to sync cart:', err);
    }
  };

  const removeFromCart = async (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    const updatedCart = cart.filter((i) => i.product.id !== productId);
    setCart(updatedCart);
    toast.info(`Removed ${item.product.name} from Cart`);

    try {
      await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: updatedCart })
      });
    } catch (err) {
      console.error('Failed to sync cart removal:', err);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    try {
      await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: updatedCart })
      });
    } catch (err) {
      console.error('Failed to sync cart quantity:', err);
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await fetch(`${API_URL}/user/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cart: [] })
      });
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  // Wishlist actions
  const toggleWishlist = async (product) => {
    if (!user) {
      toast.warning(`Please login to add ${product.name} to Wishlist!`);
      setIsLoginModalOpen(true);
      return;
    }

    const isWishlisted = wishlist.some((item) => item.id === product.id);
    let updatedWishlist = [];
    if (isWishlisted) {
      updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      toast.info(`Removed ${product.name} from Wishlist`);
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success(`Added ${product.name} to Wishlist!`);
    }

    setWishlist(updatedWishlist);

    try {
      await fetch(`${API_URL}/user/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ wishlist: updatedWishlist })
      });
    } catch (err) {
      console.error('Failed to sync wishlist:', err);
    }
  };

  const moveWishlistToCart = async (product) => {
    if (!user) {
      toast.warning(`Please login to add ${product.name} to Cart!`);
      setIsLoginModalOpen(true);
      return;
    }

    // 1. Add to cart logic (silent/no toast from addToCart)
    let updatedCart = [];
    const existingItemIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingItemIndex > -1) {
      updatedCart = cart.map((item, idx) => 
        idx === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { product, quantity: 1 }];
    }
    setCart(updatedCart);

    // 2. Remove from wishlist logic
    const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
    setWishlist(updatedWishlist);

    // 3. Show one unified success toast
    toast.success(`Moved ${product.name} to Cart!`);

    // 4. Sync both to database in parallel
    try {
      await Promise.all([
        fetch(`${API_URL}/user/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ cart: updatedCart })
        }),
        fetch(`${API_URL}/user/wishlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ wishlist: updatedWishlist })
        })
      ]);
    } catch (err) {
      console.error('Failed to sync move to cart:', err);
    }
  };

  // Auth actions
  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setToken(data.token);
      toast.success('Logged in successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const signupUser = async (username, email, password, phone) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setToken(data.token);
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    toast.info('Logged out successfully');
  };

  // Update user profile data
  const updateProfile = async (updatedUsername, updatedPhone) => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: updatedUsername, phone: updatedPhone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setUser((prevUser) => ({
        ...prevUser,
        username: data.username,
        email: data.email,
        phone: data.phone
      }));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Change user password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      toast.success('Password updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      logoutUser();
      toast.success('Account deleted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Add user address
  const addAddress = async (addressData) => {
    try {
      const res = await fetch(`${API_URL}/auth/address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ addressData })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add address');
      }

      setUser((prevUser) => ({
        ...prevUser,
        addresses: data
      }));
      toast.success('Address added successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Update user address
  const updateAddress = async (id, addressData) => {
    try {
      const res = await fetch(`${API_URL}/auth/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, addressData })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      setUser((prevUser) => ({
        ...prevUser,
        addresses: data
      }));
      toast.success('Address updated successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Delete user address
  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`${API_URL}/auth/address`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete address');
      }

      setUser((prevUser) => ({
        ...prevUser,
        addresses: data
      }));
      toast.success('Address deleted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  // Order Placement (checkout)
  const addOrder = async (shippingInfo, paymentMethod, paymentDetails) => {
    if (!user) {
      toast.error('You must be logged in to checkout');
      return false;
    }

    const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toISOString().split('T')[0];
    
    // Calculate total price from cart
    const totalRaw = cart.reduce((sum, item) => {
      const priceNum = typeof item.product.price === 'number'
        ? item.product.price
        : parseFloat(item.product.price?.toString().replace(/[^\d.]/g, '')) || 0;
      return sum + (priceNum * item.quantity);
    }, 0);
    const shipping = totalRaw > 10000 ? 0 : (cart.length > 0 ? 150 : 0);
    const tax = totalRaw * 0.18;
    const finalTotal = totalRaw + shipping + tax;
    const formattedTotal = '₹' + finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 });

    const orderItems = cart.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.image,
      price: item.product.price
    }));

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          date: orderDate,
          total: formattedTotal,
          items: orderItems,
          shippingInfo,
          paymentMethod,
          paymentDetails
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setUser((prevUser) => ({
        ...prevUser,
        orders: [data, ...(prevUser.orders || [])]
      }));

      setCart([]);
      toast.success('Order placed successfully!');
      return orderId;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const requestReturn = async (orderId, upiId, reason) => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, action: 'return', upiId, reason })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit return request');
      }

      setUser((prevUser) => ({
        ...prevUser,
        orders: prevUser.orders.map((o) => o.orderId === orderId ? data : o)
      }));

      toast.success('Return request submitted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const requestExchange = async (orderId, reason) => {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId, action: 'exchange', reason })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit exchange request');
      }

      setUser((prevUser) => ({
        ...prevUser,
        orders: prevUser.orders.map((o) => o.orderId === orderId ? data : o)
      }));

      toast.success('Exchange request submitted successfully!');
      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        isLoginModalOpen,
        setIsLoginModalOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        moveWishlistToCart,
        loginUser,
        signupUser,
        logoutUser,
        updateProfile,
        changePassword,
        deleteAccount,
        addAddress,
        updateAddress,
        deleteAddress,
        addOrder,
        requestReturn,
        requestExchange,
        token,
        loading
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContext;

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
