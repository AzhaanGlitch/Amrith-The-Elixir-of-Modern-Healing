import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card } from '../components/ui';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const { addToast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast(t('contact.successMsg'), 'success');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="pt-24 min-h-screen bg-bg">
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-24 relative overflow-hidden">
        {/* Animated Background Elements for consistency */}
        <motion.div 
          className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl lg:text-6xl font-heading font-bold mb-6 drop-shadow-lg">
            {t('contact.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/90 max-w-2xl mx-auto font-light">
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: Phone, title: t('contact.tollFree'), value: '1800-123-AMRITH', subtitle: t('contact.tollFreeTime') },
                { icon: Mail, title: t('contact.email'), value: 'hello@amrith.health', subtitle: t('contact.emailReply') },
                { icon: MapPin, title: t('contact.headOffice'), value: 'Bangalore, India', subtitle: t('contact.headOfficeAddr') },
                { icon: Clock, title: t('contact.workingHours'), value: t('contact.workingHoursVal'), subtitle: t('contact.workingHoursTime') },
              ].map(({ icon: Icon, title, value, subtitle }, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">{title}</p>
                      <p className="font-semibold text-text">{value}</p>
                      <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl font-heading font-bold text-text mb-6">{t('contact.sendMessage')}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{t('contact.name')}</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder={t('contact.namePlaceholder')}
                        className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-1.5">{t('contact.emailLabel')}</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder={t('contact.emailPlaceholder')}
                        className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t('contact.subject')}</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      placeholder={t('contact.subjectPlaceholder')}
                      className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">{t('contact.message')}</label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder={t('contact.messagePlaceholder')}
                      className="w-full py-3 px-4 bg-background border border-border rounded-xl text-text placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" size="lg">
                    <Send className="w-4 h-4" /> {t('contact.sendBtn')}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
