/**
 * AUTHENTICATION CONTEXT - USAGE EXAMPLES
 * 
 * The AuthContext provides authentication state and methods throughout the app.
 * It persists user data to localStorage and simulates API calls.
 */

// Example 1: Using useAuth hook in a component
// ============================================
/*
'use client';

import { useAuth } from '@/contexts/auth-context';

export function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>{user?.fullName}</h1>
      <p>{user?.email}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
*/

// Example 2: Handle login with loading and error states
// =====================================================
/*
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

export function LoginForm() {
  const { login, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect happens automatically
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
*/

// Example 3: Protected route wrapper
// ==================================
/*
import { ProtectedRoute } from '@/contexts/protected-route';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
*/

// Example 4: Public route (login/register pages)
// ==============================================
/*
import { PublicRoute } from '@/contexts/protected-route';

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}
*/

// Example 5: Update user profile
// ==============================
/*
'use client';

import { useAuth } from '@/contexts/auth-context';

export function EditProfile() {
  const { user, updateProfile } = useAuth();

  const handleUpdate = () => {
    if (user) {
      updateProfile({
        fullName: 'New Name',
        bio: 'Updated bio'
      });
    }
  };

  return (
    <button onClick={handleUpdate}>
      Update Profile
    </button>
  );
}
*/

// Example 6: Access auth state in multiple components
// ===================================================
/*
'use client';

import { useAuth } from '@/contexts/auth-context';

export function UserHeader() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <div>Welcome, {user?.fullName}</div>
      ) : (
        <div>Please log in</div>
      )}
    </header>
  );
}

export function UserMenu() {
  const { logout } = useAuth();

  return (
    <button onClick={() => logout()}>
      Logout
    </button>
  );
}
*/

export {};
