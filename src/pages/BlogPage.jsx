import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '../components/ui';
import { Clock, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const fallbackImages = [
  '/news/p1.jpeg',
  '/news/p2.jpeg',
  '/news/p3.jpeg',
  '/news/p4.jpeg',
  '/news/p5.jpeg'
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch health tech & medical related articles
      const res = await fetch('https://dev.to/api/articles?tag=health&per_page=12');
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      
      const mappedPosts = data.map(post => {
        return {
          id: post.id,
          title: post.title,
          excerpt: post.description || 'Discover insights into the latest health tech advancements and how they transform care...',
          category: post.tag_list && post.tag_list.length > 0 ? post.tag_list[0].toUpperCase() : 'HEALTH',
          readTime: `${post.reading_time_minutes || 5} min read`,
          date: new Date(post.published_timestamp).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          image: post.cover_image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
          url: post.url,
          author: post.user.name
        }
      });

      setPosts(mappedPosts);
      const cats = ['All', ...new Set(mappedPosts.map(p => p.category))];
      setCategories(cats);
    } catch (err) {
      setError('Could not load articles. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="pt-24 min-h-screen bg-bg">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-6 drop-shadow-lg">
            Med-Tech & Health Innovations
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            Stay up-to-date with the latest breakthroughs in digital health, AI tools, and medical tech.
          </motion.p>
        </div>
      </section>

      <section className="py-20 relative bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
              <p className="text-text-secondary text-lg">Fetching latest health articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-red-500 mb-6 text-lg">{error}</p>
              <Button onClick={fetchArticles} variant="outline" className="gap-2 mx-auto shadow-sm">
                <RefreshCw className="w-4 h-4" /> Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Categories */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-3 mb-16 justify-center"
              >
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm ${
                      activeCategory === cat
                        ? 'bg-primary text-white shadow-md scale-105'
                        : 'bg-white text-text-secondary border border-border hover:border-primary hover:text-primary hover:shadow'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>

              {/* Articles Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className="h-full"
                  >
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className="block h-full group">
                      <Card className="h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 border border-border-light bg-white">
                        <div className="h-56 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                            }}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <div className="p-8 flex flex-col flex-1 relative bg-white">
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="primary" className="bg-primary/10 text-primary border-0 font-semibold">{post.category}</Badge>
                            <span className="text-text-muted text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                          </div>
                          <h3 className="font-heading font-bold text-text text-xl mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">{post.title}</h3>
                          <p className="text-text-secondary text-base flex-1 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-5 border-t border-border-light/50">
                            <span className="text-sm text-text-muted font-medium">{post.author}</span>
                            <span className="text-primary text-sm font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                              Read Post <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>
              
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-text-muted text-lg">No articles found in this category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
