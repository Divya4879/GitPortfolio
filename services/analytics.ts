declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

class GoogleAnalytics {
  trackSignup(userId: string, userInfo: any) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'github',
        user_id: userId,
        custom_parameters: {
          username: userInfo.login,
          user_name: userInfo.name
        }
      });
      console.log('Signup tracked:', userId);
    }
  }

  trackAnalysis(userId: string, targetRole: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'analysis_completed', {
        user_id: userId,
        custom_parameters: {
          target_role: targetRole
        }
      });
      console.log('Analysis tracked:', userId, targetRole);
    }
  }

  trackPageView(pageName: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName
      });
    }
  }
}

export const analytics = new GoogleAnalytics();
