import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Badge, Button, SearchBar } from '../components/ui';
import { departments, tests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft, Clock, Home, Building2, Filter, SortAsc
} from 'lucide-react';

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState('');
  const [homeOnly, setHomeOnly] = useState(false);
  const [fastingOnly, setFastingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  const department = departments.find(d => d.id === parseInt(id));
  const deptTests = useMemo(() => {
    let result = tests.filter(t => t.departmentId === parseInt(id));
    if (search) result = result.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
    if (homeOnly) result = result.filter(t => t.homeCollection);
    if (fastingOnly) result = result.filter(t => t.fasting);
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    return result;
  }, [id, search, homeOnly, fastingOnly, sortBy]);

  if (!department) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-heading font-bold text-text">Department not found</h2>
        <Link to="/departments" className="text-primary mt-4 inline-block">← Back to Departments</Link>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link to="/departments" className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> All Departments
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: department.color + '15' }}>
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-text">{department.name}</h1>
              <p className="text-text-muted">{department.description} • {deptTests.length} tests available</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <SearchBar placeholder="Search tests..." value={search} onChange={setSearch} className="flex-1" />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setHomeOnly(!homeOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                homeOnly ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border hover:border-primary'
              }`}
            >
              <Home className="w-4 h-4" /> Home Collection
            </button>
            <button
              onClick={() => setFastingOnly(!fastingOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                fastingOnly ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border hover:border-primary'
              }`}
            >
              <Filter className="w-4 h-4" /> Fasting Required
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-border bg-white text-text-secondary focus:border-primary transition-all"
              aria-label="Sort tests"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deptTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Badge variant={test.homeCollection ? 'secondary' : 'primary'}>
                      {test.homeCollection ? '🏠 Home' : '🏥 Lab Visit'}
                    </Badge>
                    {test.popular && <Badge variant="accent">⭐ Popular</Badge>}
                  </div>
                  {test.fasting && <Badge variant="warning">Fasting</Badge>}
                </div>

                <h3 className="font-heading font-semibold text-text text-lg mb-2">{test.name}</h3>
                <p className="text-text-muted text-sm mb-4 flex-1">{test.description}</p>

                <div className="flex items-center gap-2 mb-4 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" /> Report in {test.reportTime}
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-border-light">
                  <div>
                    <span className="text-2xl font-heading font-bold text-primary">₹{test.price}</span>
                    <span className="text-sm text-text-muted line-through ml-2">₹{test.originalPrice}</span>
                    <span className="ml-2 text-xs text-secondary-dark font-semibold bg-secondary/10 px-2 py-0.5 rounded">
                      {Math.round((1 - test.price / test.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                  {isAuthenticated && user?.role === 'patient' ? (
                    <Link to="/patient/book">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <Button size="sm" variant="outline">Book Now</Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {deptTests.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">No tests match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
