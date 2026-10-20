// Microsoft Clarity & Comprehensive Live User Action Analytics Engine

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}

export interface AnalyticsData {
  totalVisits: number;
  totalTimeSpentSeconds: number;
  tabViews: Record<string, number>;
  buttonClicks: Record<string, number>;
  formSubmissions: Record<string, number>;
  searchQueries: Array<{ query: string; category?: string; timestamp: string }>;
  recentEvents: Array<{
    timestamp: string;
    type: 'click' | 'pageview' | 'booking' | 'contact' | 'order' | 'search' | 'auth';
    name: string;
    details?: any;
  }>;
}

const STORAGE_KEY = 'shiv_dhara_live_analytics';
const GUEST_ID_KEY = 'shiv_dhara_guest_visitor_id';

export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'guest_server';
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = `guest_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch {
    return `guest_${Date.now()}`;
  }
}

export function getStoredAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') {
    return {
      totalVisits: 1,
      totalTimeSpentSeconds: 0,
      tabViews: {},
      buttonClicks: {},
      formSubmissions: {},
      searchQueries: [],
      recentEvents: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored analytics', e);
  }

  const initial: AnalyticsData = {
    totalVisits: 1,
    totalTimeSpentSeconds: 0,
    tabViews: {
      '/': 1,
      '/numerology': 0,
      '/vastu': 0,
      '/meditation': 0,
      '/workshops': 0,
      '/products': 0,
      '/blog': 0,
      '/contact': 0,
    },
    buttonClicks: {
      'Book Consultation': 0,
      'Explore The Triad': 0,
      'Explore Vastu': 0,
      'Explore Numerology': 0,
      'WhatsApp Team': 0,
      'Add to Sacred Bag': 0,
      'Checkout': 0,
    },
    formSubmissions: {
      consultations: 0,
      orders: 0,
      contactMessages: 0,
      aiHandoffs: 0,
    },
    searchQueries: [],
    recentEvents: [
      {
        timestamp: new Date().toISOString(),
        type: 'pageview',
        name: 'Visited Home Sanctuary',
      },
    ],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {}
  return initial;
}

function saveAnalytics(data: AnalyticsData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save analytics', e);
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem('shivdhara_cookie_consent_v1');
    if (!raw) return true; // Before user chooses, default to permissive or fallback
    const parsed = JSON.parse(raw);
    return parsed.analytics !== false;
  } catch {
    return true;
  }
}

/**
 * Dynamically notify Microsoft Clarity of user consent state
 */
export function updateClarityConsent(allowed: boolean) {
  if (typeof window === 'undefined') return;
  if (window.clarity) {
    try {
      window.clarity('consent', allowed);
      console.log(`[Analytics] Microsoft Clarity consent state set to: ${allowed}`);
    } catch (e) {
      console.warn('[Analytics] Could not pass consent to Clarity', e);
    }
  }
}

/**
 * Initialize Microsoft Clarity Analytics and Session Time Tracking
 */
export function initClarity(projectId?: string) {
  if (typeof window === 'undefined') return;

  // Check consent upfront
  const isAllowed = hasAnalyticsConsent();

  // Increment total visits
  const stats = getStoredAnalytics();
  stats.totalVisits = (stats.totalVisits || 0) + 1;
  saveAnalytics(stats);

  // Interval timer for real-time duration tracking
  setInterval(() => {
    try {
      const live = getStoredAnalytics();
      live.totalTimeSpentSeconds = (live.totalTimeSpentSeconds || 0) + 5;
      saveAnalytics(live);
    } catch {}
  }, 5000);

  const id = projectId || import.meta.env.VITE_CLARITY_PROJECT_ID || 'y8huil1hon';
  if (!id) return;

  // The official Clarity snippet is already present in index.html, which sets
  // window.clarity to a call-queueing proxy. Only inject the async tag loader
  // when it is NOT present, so we never double-load the Clarity script.
  if (!window.clarity) {
    (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);

    console.log(`[Analytics] Microsoft Clarity tracking activated for project ID: ${id}`);
  }

  // Pass current consent state immediately
  updateClarityConsent(isAllowed);

  // Tag initial guest identity + session context if allowed
  if (isAllowed) {
    const guestId = getOrCreateGuestId();
    if (window.clarity) {
      window.clarity('identify', guestId, undefined, undefined, `Guest (${guestId.slice(-6)})`);
      window.clarity('set', 'auth_status', 'guest');
      window.clarity('set', 'visitor_type', 'unauthenticated_seeker');
      window.clarity('set', 'project_id', id);
    }
  }
}

/**
 * Tag session with full User Context (Logged-in vs Guest)
 */
export function identifyUserInClarity(user: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  authProvider?: string;
}) {
  if (typeof window === 'undefined') return;

  const customId = user.email || user.id || getOrCreateGuestId();
  const friendlyName = user.name ? `${user.name} (${user.email || 'User'})` : `Seeker ${customId.slice(-6)}`;

  if (window.clarity) {
    // Official Microsoft Clarity identify API
    window.clarity('identify', customId, undefined, undefined, friendlyName);

    // Set custom searchable tags in Clarity Dashboard
    if (user.name) window.clarity('set', 'user_name', user.name);
    if (user.email) window.clarity('set', 'user_email', user.email);
    if (user.phone) window.clarity('set', 'user_phone', user.phone);
    if (user.authProvider) window.clarity('set', 'auth_provider', user.authProvider);
    window.clarity('set', 'auth_status', user.email ? 'logged_in' : 'guest');
  }

  // Also log to internal analytics
  const stats = getStoredAnalytics();
  stats.recentEvents.unshift({
    timestamp: new Date().toISOString(),
    type: 'auth',
    name: user.email ? `Customer Identified: ${user.name || user.email}` : `Guest Visitor Identified`,
    details: user,
  });
  if (stats.recentEvents.length > 50) stats.recentEvents.pop();
  saveAnalytics(stats);
}

/**
 * Track Search Queries across Store, Blog, and Dhara AI
 */
export function trackSearchQuery(query: string, searchContext: 'products' | 'blog' | 'ai_concierge' | 'global') {
  if (typeof window === 'undefined' || !query.trim()) return;

  const cleanQuery = query.trim();

  // 1. Tag in Microsoft Clarity for session filtering
  if (window.clarity) {
    window.clarity('set', `search_${searchContext}`, cleanQuery);
    window.clarity('set', 'last_search_query', cleanQuery);
    window.clarity('event', `Search [${searchContext}]: ${cleanQuery}`);
  }

  // 2. Track in local analytics
  const stats = getStoredAnalytics();
  stats.searchQueries = stats.searchQueries || [];
  stats.searchQueries.unshift({
    query: cleanQuery,
    category: searchContext,
    timestamp: new Date().toISOString(),
  });
  if (stats.searchQueries.length > 50) stats.searchQueries.pop();

  stats.recentEvents.unshift({
    timestamp: new Date().toISOString(),
    type: 'search',
    name: `Searched for "${cleanQuery}" in ${searchContext}`,
    details: { query: cleanQuery, context: searchContext },
  });
  if (stats.recentEvents.length > 50) stats.recentEvents.pop();

  saveAnalytics(stats);
}

/**
 * Track custom button clicks & interactive actions
 */
export function trackEvent(eventName: string, metadata?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  if (window.clarity && hasAnalyticsConsent()) {
    window.clarity('event', eventName);
    if (metadata) {
      Object.entries(metadata).forEach(([key, val]) => {
        if (typeof val === 'string' || typeof val === 'number') {
          window.clarity?.('set', key, String(val));
        }
      });
    }
  }

  const stats = getStoredAnalytics();
  stats.buttonClicks[eventName] = (stats.buttonClicks[eventName] || 0) + 1;

  stats.recentEvents.unshift({
    timestamp: new Date().toISOString(),
    type: 'click',
    name: eventName,
    details: metadata,
  });

  if (stats.recentEvents.length > 50) {
    stats.recentEvents.pop();
  }

  saveAnalytics(stats);
}

/**
 * Track tab / page view changes
 */
export function trackPageView(pagePath: string) {
  if (typeof window === 'undefined') return;

  if (window.clarity) {
    window.clarity('set', 'page', pagePath);
  }

  const stats = getStoredAnalytics();
  stats.tabViews[pagePath] = (stats.tabViews[pagePath] || 0) + 1;

  stats.recentEvents.unshift({
    timestamp: new Date().toISOString(),
    type: 'pageview',
    name: `Viewed tab ${pagePath}`,
  });

  if (stats.recentEvents.length > 50) {
    stats.recentEvents.pop();
  }

  saveAnalytics(stats);
}

/**
 * Record Form Submissions (Consultations, Orders, Contact)
 */
export function recordFormSubmission(
  formType: 'consultations' | 'orders' | 'contactMessages' | 'aiHandoffs',
  details?: any
) {
  if (typeof window === 'undefined') return;

  // If details contain customer info, immediately upgrade Clarity identification!
  if (details && (details.email || details.name || details.phone)) {
    identifyUserInClarity({
      name: details.name || details.customerName,
      email: details.email,
      phone: details.phone,
    });
  }

  if (window.clarity) {
    window.clarity('event', `Form Submit: ${formType}`);
    window.clarity('set', 'last_submitted_form', formType);
  }

  const stats = getStoredAnalytics();
  stats.formSubmissions[formType] = (stats.formSubmissions[formType] || 0) + 1;

  stats.recentEvents.unshift({
    timestamp: new Date().toISOString(),
    type: formType === 'consultations' ? 'booking' : formType === 'orders' ? 'order' : 'contact',
    name: `Submitted ${formType}`,
    details,
  });

  if (stats.recentEvents.length > 50) {
    stats.recentEvents.pop();
  }

  saveAnalytics(stats);
}

export function identifyUser(userId: string, userAttributes?: Record<string, string>) {
  identifyUserInClarity({ id: userId, ...userAttributes });
}
