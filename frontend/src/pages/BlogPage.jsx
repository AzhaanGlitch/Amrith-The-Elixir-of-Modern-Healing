import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { Clock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const fallbackImages = [
  '/news/p1.jpeg',
  '/news/p2.jpeg',
  '/news/p3.jpeg',
  '/news/p4.jpeg',
  '/news/p5.jpeg'
];

export default function BlogPage() {
  const [news, setNews] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsRes, emergencyRes] = await Promise.all([
        fetch('https://dev.to/api/articles?tag=health&per_page=8'),
        fetch('https://dev.to/api/articles?tag=medical&per_page=8')
      ]);

      if (!newsRes.ok || !emergencyRes.ok) throw new Error('Failed to fetch articles');
      
      const newsData = await newsRes.json();
      const emergencyData = await emergencyRes.json();
      
      const formatData = (data, defaultCategory) => data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.description || 'Discover insights into the latest health tech advancements and how they transform care...',
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
      setError('Could not load articles. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const ArticleCard = ({ item, isAlert = false, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="h-full"
    >
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border-light bg-white">
          <div className="h-56 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img 
              src={item.image} 
              alt={item.title} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
              }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute top-4 right-4 z-20">
              <Badge variant={isAlert ? 'error' : 'primary'} className={`${isAlert ? 'bg-red-500 text-white' : 'bg-primary/90 text-white'} border-0 font-bold px-3 py-1 shadow-md`}>
                {item.category}
              </Badge>
            </div>
          </div>
          <div className="p-8 flex flex-col flex-1 relative bg-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-text-muted text-xs flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" /> {item.readTime}
              </span>
              <span className="text-text-muted text-xs flex items-center gap-1.5 font-medium border-l border-border pl-3">
                {item.date}
              </span>
            </div>
            <h3 className="font-heading font-bold text-text text-xl mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">{item.title}</h3>
            <p className="text-text-secondary text-base flex-1 mb-6 line-clamp-3 leading-relaxed">{item.excerpt}</p>
            <div className="flex items-center justify-between pt-5 border-t border-border-light/50">
              <span className="text-sm text-text-muted font-medium truncate max-w-[150px]">{item.author}</span>
              <span className="text-primary text-sm font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform shrink-0">
                {t('blog.readPost')} <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Card>
      </a>
    </motion.div>
  );

  return (
    <div className="pt-24 min-h-screen bg-bg">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/navbar_pages/blog.jpg" alt="Background" className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/80" />
        </div>

        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl z-0"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-6 drop-shadow-lg">
            {t('blog.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            {t('blog.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-20 relative bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
              <p className="text-text-secondary text-lg">{t('blog.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-red-500 mb-6 text-lg">{error}</p>
              <Button onClick={fetchArticles} variant="outline" className="gap-2 mx-auto shadow-sm bg-white">
                <RefreshCw className="w-4 h-4" /> {t('blog.tryAgain')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              
              {/* Latest Med-Tech News */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-text mb-6">{t('news.latestUpdates')}</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {news.map((post, i) => (
                    <ArticleCard key={post.id} item={post} index={i} />
                  ))}
                </div>
              </div>

              <hr className="border-border-light border-t-2" />

              {/* Global Health Alerts (Emergencies) */}
              <div>
                <h2 className="text-3xl font-heading font-bold text-text mb-6">{t('news.emergenciesTitle')}</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {emergencies.map((post, i) => (
                    <ArticleCard key={post.id} item={post} isAlert={true} index={i} />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
}
