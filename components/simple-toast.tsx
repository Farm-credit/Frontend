// Lightweight DOM-based toast helper for client components
export function showToast(message: string, type: 'error' | 'success' = 'error', ttl = 4000) {
  if (typeof window === 'undefined') return;

  try {
    const id = 'simple-toast-root';
    let root = document.getElementById(id);
    if (!root) {
      root = document.createElement('div');
      root.id = id;
      root.style.position = 'fixed';
      root.style.right = '16px';
      root.style.top = '16px';
      root.style.zIndex = '9999';
      document.body.appendChild(root);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.marginTop = '8px';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
    toast.style.color = '#fff';
    toast.style.fontSize = '14px';
    toast.style.maxWidth = '320px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    toast.style.transform = 'translateY(-6px)';
    if (type === 'error') {
      toast.style.background = 'linear-gradient(90deg,#ef4444,#dc2626)';
    } else {
      toast.style.background = 'linear-gradient(90deg,#10b981,#059669)';
    }

    root.appendChild(toast);

    // force reflow then show
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        try { root?.removeChild(toast); } catch (e) {}
      }, 200);
    }, ttl);
  } catch (e) {
    // fallback
    try { alert(message); } catch (_) {}
  }
}

export default showToast;
