import { useState, useEffect } from 'react';
import { Card, Badge, Button } from './ui';
import { Clock, ArrowRight, Loader2, RefreshCw, Rss } from 'lucide-react';
import { Link } from 'react-router-dom';

const fallbackImages = [
  '/news/p1.jpeg',
  '/news/p2.jpeg',
  '/news/p3.jpeg',
  '/news/p4.jpeg',
  '/news/p5.jpeg'
];

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch 8 health tech & medical news items for continuous strip scrolling
      const res = await fetch('https://dev.to/api/articles?tag=health&per_page=8');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      
      const formattedNews = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.description || 'Exploring new frontiers in digital healthcare and remote medical services...',
        category: post.tag_list && post.tag_list.length > 0 ? post.tag_list[0].toUpperCase() : 'MED-TECH',
        readTime: `${post.reading_time_minutes || 5} min read`,
        date: new Date(post.published_timestamp).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }),
        image: post.cover_image || fallbackImages[Math.floor(Math.random() * fallbackImages.length)],
        url: post.url,
        author: post.user.name
      }));

      setNews(formattedNews);
    } catch (err) {
      setError('Could not load latest news.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-white relative border-y border-border-light overflow-hidden">
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% - 1.5rem)); } /* -100% minus the 1.5rem gap (gap-6) */
          }
          .animate-marquee {
            animation: scroll-left 40s linear infinite;
          }
          .pause-on-hover:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider text-sm uppercase mb-3">
              <Rss className="w-5 h-5 text-accent" /> Latest Updates
            </div>
            <h2 className="text-4xl lg:text-5xl font-heading font-black text-text mb-4">Health & Med-Tech News</h2>
            <p className="text-text-muted text-lg">Stay informed about the latest advancements in AI healthcare, online medical services, and remote diagnostics.</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="shadow-sm hover:shadow-md transition-all group flex items-center gap-2 whitespace-nowrap bg-white">
              View All News <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 relative z-10">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-text-secondary">Loading latest news...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50/50 rounded-3xl border border-red-100 max-w-7xl mx-auto relative z-10">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchNews} variant="outline" size="sm" className="gap-2 mx-auto bg-white">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
        </div>
      ) : (
        <div className="flex overflow-hidden pause-on-hover relative group w-full pt-4 pb-12">
          {/* First Strip */}
          <div className="flex animate-marquee gap-8 shrink-0 pr-8">
            {news.map((item) => (
              <a key={`${item.id}-1`} href={item.url} target="_blank" rel="noopener noreferrer" className="block w-[600px] shrink-0 outline-none">
                <Card className="h-56 flex overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-border-light bg-white cursor-pointer group/card p-3">
                  <div className="w-2/5 h-full rounded-2xl overflow-hidden relative shrink-0">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 z-10" />
                     <img 
                      src={item.image} 
                      alt={item.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                    />
                  </div>
                  <div className="w-3/5 pl-6 pr-3 py-2 flex flex-col justify-center h-full relative">
                    <div className="flex items-center justify-between mb-3 absolute top-2 right-3 left-6">
                      <Badge variant="primary" className="bg-primary/10 text-primary border-0 font-bold px-2.5 py-0.5 text-xs uppercase tracking-wide shadow-none">
                        {item.category}
                      </Badge>
                      <span className="text-text-muted text-xs flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-accent" />{item.readTime}</span>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-heading font-extrabold text-text text-lg mb-2 group-hover/card:text-primary transition-colors leading-snug line-clamp-2 whitespace-normal">{item.title}</h3>
                      <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed whitespace-normal mb-1">{item.excerpt}</p>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>

          {/* Second Strip (Duplicate for infinite seamless scroll) */}
          <div className="flex animate-marquee gap-8 shrink-0 pr-8" aria-hidden="true">
            {news.map((item) => (
              <a key={`${item.id}-2`} href={item.url} target="_blank" rel="noopener noreferrer" className="block w-[600px] shrink-0 outline-none">
                <Card className="h-56 flex overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-border-light bg-white cursor-pointer group/card p-3">
                  <div className="w-2/5 h-full rounded-2xl overflow-hidden relative shrink-0">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 z-10" />
                     <img 
                      src={item.image} 
                      alt={item.title} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                    />
                  </div>
                  <div className="w-3/5 pl-6 pr-3 py-2 flex flex-col justify-center h-full relative">
                    <div className="flex items-center justify-between mb-3 absolute top-2 right-3 left-6">
                      <Badge variant="primary" className="bg-primary/10 text-primary border-0 font-bold px-2.5 py-0.5 text-xs uppercase tracking-wide shadow-none">
                        {item.category}
                      </Badge>
                      <span className="text-text-muted text-xs flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5 text-accent" />{item.readTime}</span>
                    </div>
                    <div className="mt-8">
                      <h3 className="font-heading font-extrabold text-text text-lg mb-2 group-hover/card:text-primary transition-colors leading-snug line-clamp-2 whitespace-normal">{item.title}</h3>
                      <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed whitespace-normal mb-1">{item.excerpt}</p>
                    </div>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
