import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.announcements.base);
      
      const data = await response.json();
      
      if (data.success) {
        // Format the announcements to match the existing structure
        const formattedAnnouncements = data.announcement1.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          date: new Date(announcement.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          type: announcement.type,
          priority: announcement.priority,
          expires_at: announcement.expires_at
        }));
        
        setAnnouncements(formattedAnnouncements);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch announcements');
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    
    // Refresh announcements every 5 minutes
    const interval = setInterval(fetchAnnouncements, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { announcements, loading, error, refetch: fetchAnnouncements };
};

export default useAnnouncements;