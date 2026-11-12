import React, { useState } from 'react';
import { galleryItems, GalleryItem } from '../data/galleryData';
import { X, ZoomIn, Eye } from 'lucide-react';

export const EnvironmentGallery: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'classroom' | 'nature' | 'practical' | 'arts'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filtered = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-beige-100/40 dark:bg-forest-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-sage-200 bg-sage-100 dark:bg-forest-900 px-3.5 py-1.5 rounded-full border border-sage-200 dark:border-forest-700">
            The Third Teacher
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest-900 dark:text-cream mt-4 mb-4">
            Our Prepared Learning Environment
          </h2>
          <p className="text-forest-700 dark:text-beige-200 text-sm sm:text-base leading-relaxed">
            Every shelf, floor rug, botanical specimen, and wooden tray is curated to promote independent exploration, beauty, and emotional tranquility.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Spaces' },
              { id: 'classroom', label: 'Classroom & Works' },
              { id: 'nature', label: 'Forest & Garden' },
              { id: 'practical', label: 'Practical Life' },
              { id: 'arts', label: 'Art Studio' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-forest-700 dark:bg-sage-500 text-cream dark:text-forest-950 shadow-soft'
                    : 'bg-white dark:bg-forest-900 text-forest-700 dark:text-beige-200 hover:bg-beige-200 dark:hover:bg-forest-800 border border-beige-300 dark:border-forest-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-white dark:bg-forest-900 border border-beige-300 dark:border-forest-700 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-beige-100 dark:bg-forest-800">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-forest-950/35 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                  <div className="p-3 rounded-full bg-white/90 text-forest-900 shadow-soft">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cream/90 dark:bg-forest-900/90 text-forest-800 dark:text-cream border border-beige-200 dark:border-forest-700 backdrop-blur-sm">
                    {item.tag}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-serif font-bold text-sm text-forest-900 dark:text-cream group-hover:text-forest-700 dark:group-hover:text-sage-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-forest-600 dark:text-beige-200/80 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-cream dark:bg-forest-900 rounded-3xl overflow-hidden shadow-soft-xl border border-beige-300 dark:border-forest-700"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 rounded-full bg-white/80 text-forest-800 hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="w-full max-h-[65vh] object-contain object-center bg-beige-100 dark:bg-forest-950"
            />
            <div className="p-6">
              <span className="text-xs font-bold text-terracotta dark:text-terracotta-300">{selectedPhoto.tag}</span>
              <h3 className="font-serif text-2xl font-bold text-forest-900 dark:text-cream mt-1 mb-2">
                {selectedPhoto.title}
              </h3>
              <p className="text-forest-700 dark:text-beige-200 text-sm leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

