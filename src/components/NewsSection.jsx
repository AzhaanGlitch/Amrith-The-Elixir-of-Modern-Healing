import { useState, useEffect } from 'react';
import { Card, Badge, Button } from './ui';
import { Clock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const fallbackImages = [
  '/news/p1.jpeg',
  '/news/p2.jpeg',
  '/news/p3.jpeg',
  '/news/p4.jpeg',
  '/news/p5.jpeg'
];

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const fetchNewsAndEmergencies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsRes, emergencyRes] = await Promise.all([
        fetch('https://dev.to/api/articles?tag=health&per_page=4'),
        fetch('https://dev.to/api/articles?tag=medical&per_page=4')
      ]);

      if (!newsRes.ok || !emergencyRes.ok) throw new Error('Failed to fetch data');
      
      const newsData = await newsRes.json();
      const emergencyData = await emergencyRes.json();
      
      const formatData = (data, defaultCategory) => data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.description || 'Exploring new frontiers in digital healthcare and remote medical services...',
        category: post.tag_list && post.tag_list.length > 0 ? post.tag_list[0].toUpperCase() : defaultCategory,
        readTime: `${post.reading_time_minutes || 5} min read`,
        date: new Date(post.published_timestamp).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        image: post.cover_image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
        url: post.url,
        author: post.user.name
      }));

      setNews(formatData(newsData, 'MED-TECH'));
      setEmergencies(formatData(emergencyData, 'ALERT'));
    } catch (err) {
      setError('Could not load latest updates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsAndEmergencies();
  }, []);

  const NewsCard = ({ item, isAlert = false }) => (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full group outline-none">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border-light bg-white">
        <div className="h-48 relative overflow-hidden shrink-0">
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
           <img 
            src={item.image} 
            alt={item.title} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute top-3 right-3 z-20">
            <Badge variant={isAlert ? 'error' : 'primary'} className={`${isAlert ? 'bg-red-500 text-white' : 'bg-primary/90 text-white'} border-0 font-bold px-2.5 py-0.5 text-xs shadow-md`}>
              {item.category}
            </Badge>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative">
          <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium mb-3">
            <Clock className="w-3.5 h-3.5" />{item.readTime}
          </div>
          <h3 className="font-heading font-extrabold text-text text-lg mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">{item.title}</h3>
          <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed flex-1">{item.excerpt}</p>
          <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium truncate pr-4">{item.author}</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
          </div>
        </div>
      </Card>
    </a>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-background to-white relative border-y border-border-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-text mb-4">{t('news.title')}</h2>
            <p className="text-text-muted text-lg">{t('news.subtitle')}</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all group flex items-center gap-2 whitespace-nowrap bg-white">
              {t('news.viewAll')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-text-secondary">{t('news.loading')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50/50 rounded-3xl border border-red-100 max-w-7xl mx-auto">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchNewsAndEmergencies} variant="outline" size="sm" className="gap-2 mx-auto bg-white">
              <RefreshCw className="w-4 h-4" /> {t('news.tryAgain')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            
            {/* Latest News Column */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-text mb-6">{t('news.latestUpdates')}</h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {news.map((item) => (
                  <NewsCard key={`news-${item.id}`} item={item} />
                ))}
              </div>
            </div>

            <hr className="border-border-light border-t-2" />

            {/* Latest Emergencies Column */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-text mb-6">{t('news.emergenciesTitle')}</h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {emergencies.map((item) => (
                  <NewsCard key={`emergency-${item.id}`} item={item} isAlert={true} />
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
