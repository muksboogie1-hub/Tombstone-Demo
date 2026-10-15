import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
  ImageIcon,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { CategoriesContent, CategoryCardItem } from '../../types/content';
import { DEFAULT_CATEGORY_CARDS, DEFAULT_HERO_IMAGE_URL } from '../../data/defaultContent';
import { uploadCategoryCardImage } from '../../services/contentService';
import { getImageDisplayStyles, ImageDisplaySettings } from '../../utils/imageStyles';

interface HomepageCardsEditorProps {
  categories: CategoriesContent;
  onSaveCategories: (updated: CategoriesContent) => Promise<boolean>;
  onResetToDefault?: () => Promise<boolean>;
  isSavingGlobal?: boolean;
}

export function HomepageCardsEditor({
  categories,
  onSaveCategories,
  onResetToDefault,
  isSavingGlobal = false,
}: HomepageCardsEditorProps) {
  // Ensure we always have all 3 valid cards
  const getInitialCards = (): CategoryCardItem[] => {
    const rawCards = Array.isArray(categories?.cards) ? categories.cards : [];
    return DEFAULT_CATEGORY_CARDS.map((defaultCard) => {
      const existing = (rawCards.find((c: any) => c.id === defaultCard.id) || {}) as Partial<CategoryCardItem>;
      let imageUrl = existing.imageUrl || defaultCard.imageUrl;
      // Auto-fix broken tombstone image if still referring to 404 unsplash URL
      if (imageUrl && imageUrl.includes('photo-1596280459345-42cf6ee2a106')) {
        imageUrl = defaultCard.imageUrl;
      }

      return {
        id: defaultCard.id,
        categoryLabel: existing.categoryLabel || defaultCard.categoryLabel,
        title:
          existing.title ||
          (defaultCard.id === 'tombstones'
            ? categories?.tombstonesHeading
            : defaultCard.id === 'countertops'
            ? categories?.countertopsHeading
            : categories?.windowSillsHeading) ||
          defaultCard.title,
        description:
          existing.description ||
          (defaultCard.id === 'tombstones'
            ? categories?.tombstonesDescription
            : defaultCard.id === 'countertops'
            ? categories?.countertopsDescription
            : categories?.windowSillsDescription) ||
          defaultCard.description,
        imageUrl,
        imageAlt: existing.imageAlt || defaultCard.imageAlt,
        exploreButtonText: existing.exploreButtonText || defaultCard.exploreButtonText,
        exploreLink: existing.exploreLink || defaultCard.exploreLink,
        imageSettings: existing.imageSettings || defaultCard.imageSettings,
      };
    });
  };

  const [cards, setCards] = useState<CategoryCardItem[]>(getInitialCards);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [sectionBadge, setSectionBadge] = useState<string>(categories?.badge || 'Stone Masonry Disciplines');
  const [sectionTitle, setSectionTitle] = useState<string>(categories?.title || 'Featured Categories');
  const [sectionSubtitle, setSectionSubtitle] = useState<string>(
    categories?.subtitle || 'Precision stonework tailored for solemn family remembrance and refined architectural installations.'
  );

  // Per-card file inputs & pending upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<Record<number, File | null>>({});
  const [pendingPreviews, setPendingPreviews] = useState<Record<number, string | null>>({});
  const [isUploading, setIsUploading] = useState<Record<number, boolean>>({});
  const [cardMessages, setCardMessages] = useState<Record<number, { type: 'success' | 'error'; text: string } | null>>({});
  const [globalMessage, setGlobalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSectionMeta, setShowSectionMeta] = useState<boolean>(false);

  // Sync internal state when parent props change
  useEffect(() => {
    setCards(getInitialCards());
    if (categories?.badge) setSectionBadge(categories.badge);
    if (categories?.title) setSectionTitle(categories.title);
    if (categories?.subtitle) setSectionSubtitle(categories.subtitle);
  }, [categories]);

  const activeCard = cards[selectedIdx] || cards[0];
  const pendingFile = pendingFiles[selectedIdx];
  const pendingPreview = pendingPreviews[selectedIdx];
  const activeMessage = cardMessages[selectedIdx];
  const isCardSaving = isUploading[selectedIdx] || false;

  // Handle text field edits
  const handleFieldChange = (field: keyof CategoryCardItem, value: any) => {
    setCards((prev) => {
      const updated = [...prev];
      updated[selectedIdx] = {
        ...updated[selectedIdx],
        [field]: value,
      };
      return updated;
    });
  };

  // Handle local file selection for image upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCardMessages((prev) => ({ ...prev, [selectedIdx]: null }));

    // MIME type check
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext);

    if (!allowedMime.includes(file.type.toLowerCase()) && !isAllowedExt) {
      setCardMessages((prev) => ({
        ...prev,
        [selectedIdx]: {
          type: 'error',
          text: 'Unsupported image format. Please select a JPG, JPEG, PNG, or WebP file.',
        },
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Max 10MB limit
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setCardMessages((prev) => ({
        ...prev,
        [selectedIdx]: {
          type: 'error',
          text: `Selected file is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`,
        },
      }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingPreviews((prev) => ({ ...prev, [selectedIdx]: reader.result as string }));
      setPendingFiles((prev) => ({ ...prev, [selectedIdx]: file }));
    };
    reader.onerror = () => {
      setCardMessages((prev) => ({
        ...prev,
        [selectedIdx]: {
          type: 'error',
          text: 'Failed to read selected image file. Please try another image.',
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Discard pending image selection
  const handleCancelPendingImage = () => {
    setPendingFiles((prev) => ({ ...prev, [selectedIdx]: null }));
    setPendingPreviews((prev) => ({ ...prev, [selectedIdx]: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset current card image to factory default
  const handleResetCardImageToDefault = () => {
    const defaultImg = DEFAULT_CATEGORY_CARDS[selectedIdx]?.imageUrl || DEFAULT_HERO_IMAGE_URL;
    handleFieldChange('imageUrl', defaultImg);
    handleCancelPendingImage();
    setCardMessages((prev) => ({
      ...prev,
      [selectedIdx]: {
        type: 'success',
        text: 'Image reset to factory baseline. Click "Save Card Changes" to persist.',
      },
    }));
  };

  // Save the current card independently
  const handleSaveSingleCard = async () => {
    setIsUploading((prev) => ({ ...prev, [selectedIdx]: true }));
    setCardMessages((prev) => ({ ...prev, [selectedIdx]: null }));

    try {
      let finalImageUrl = activeCard.imageUrl;

      // If user uploaded a new image file, store it persistently
      if (pendingFile) {
        const { url, error } = await uploadCategoryCardImage(pendingFile, activeCard.id);
        if (error && !url) {
          throw new Error(`Image upload failed: ${error.message || 'Storage unavailable'}. Previous image preserved.`);
        }
        if (url) {
          finalImageUrl = url;
        }
      }

      const updatedCard: CategoryCardItem = {
        ...activeCard,
        imageUrl: finalImageUrl,
      };

      const updatedCards = [...cards];
      updatedCards[selectedIdx] = updatedCard;

      const payload: CategoriesContent = {
        badge: sectionBadge,
        title: sectionTitle,
        subtitle: sectionSubtitle,
        cards: updatedCards,
        tombstonesHeading: updatedCards[0]?.title,
        tombstonesDescription: updatedCards[0]?.description,
        countertopsHeading: updatedCards[1]?.title,
        countertopsDescription: updatedCards[1]?.description,
        windowSillsHeading: updatedCards[2]?.title,
        windowSillsDescription: updatedCards[2]?.description,
      };

      const success = await onSaveCategories(payload);

      if (success) {
        setCards(updatedCards);
        setPendingFiles((prev) => ({ ...prev, [selectedIdx]: null }));
        setPendingPreviews((prev) => ({ ...prev, [selectedIdx]: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';

        setCardMessages((prev) => ({
          ...prev,
          [selectedIdx]: {
            type: 'success',
            text: `Card "${updatedCard.title}" and its image have been successfully saved and published!`,
          },
        }));

        setTimeout(() => {
          setCardMessages((prev) => ({ ...prev, [selectedIdx]: null }));
        }, 5000);
      } else {
        throw new Error('Database save could not be confirmed. Edits are preserved in offline cache.');
      }
    } catch (err: any) {
      setCardMessages((prev) => ({
        ...prev,
        [selectedIdx]: {
          type: 'error',
          text: err?.message || 'Error occurred while saving card.',
        },
      }));
    } finally {
      setIsUploading((prev) => ({ ...prev, [selectedIdx]: false }));
    }
  };

  // Discard all unsaved edits on current card
  const handleCancelCurrentCard = () => {
    const originalCard = getInitialCards()[selectedIdx];
    setCards((prev) => {
      const next = [...prev];
      next[selectedIdx] = { ...originalCard };
      return next;
    });
    handleCancelPendingImage();
    setCardMessages((prev) => ({
      ...prev,
      [selectedIdx]: {
        type: 'success',
        text: 'Unsaved edits discarded. Reverted to previously saved version.',
      },
    }));
    setTimeout(() => {
      setCardMessages((prev) => ({ ...prev, [selectedIdx]: null }));
    }, 3000);
  };

  // Reset current card to factory default
  const handleResetCardToFactoryDefault = () => {
    if (
      !window.confirm(
        `Reset "${DEFAULT_CATEGORY_CARDS[selectedIdx].title}" card text and image back to factory baseline?`
      )
    ) {
      return;
    }
    const defaultCard = DEFAULT_CATEGORY_CARDS[selectedIdx];
    setCards((prev) => {
      const next = [...prev];
      next[selectedIdx] = { ...defaultCard };
      return next;
    });
    handleCancelPendingImage();
    setCardMessages((prev) => ({
      ...prev,
      [selectedIdx]: {
        type: 'success',
        text: 'Card reset to default baseline. Click "Save Card Changes" to publish live.',
      },
    }));
  };

  // Save all 3 cards simultaneously
  const handleSaveAllCards = async () => {
    setIsUploading((prev) => ({ ...prev, [selectedIdx]: true }));
    setGlobalMessage(null);

    try {
      const updatedCards = [...cards];

      // Upload any pending files across all 3 cards
      for (let i = 0; i < updatedCards.length; i++) {
        const file = pendingFiles[i];
        if (file) {
          const { url, error } = await uploadCategoryCardImage(file, updatedCards[i].id);
          if (url) {
            updatedCards[i].imageUrl = url;
          } else if (error) {
            console.warn(`Card image upload error on index ${i}:`, error);
          }
        }
      }

      const payload: CategoriesContent = {
        badge: sectionBadge,
        title: sectionTitle,
        subtitle: sectionSubtitle,
        cards: updatedCards,
        tombstonesHeading: updatedCards[0]?.title,
        tombstonesDescription: updatedCards[0]?.description,
        countertopsHeading: updatedCards[1]?.title,
        countertopsDescription: updatedCards[1]?.description,
        windowSillsHeading: updatedCards[2]?.title,
        windowSillsDescription: updatedCards[2]?.description,
      };

      const success = await onSaveCategories(payload);

      if (success) {
        setCards(updatedCards);
        setPendingFiles({});
        setPendingPreviews({});
        if (fileInputRef.current) fileInputRef.current.value = '';

        setGlobalMessage({
          type: 'success',
          text: 'All 3 Homepage Category Cards successfully saved and published live!',
        });
        setTimeout(() => setGlobalMessage(null), 5000);
      } else {
        throw new Error('Save could not be completed. Your edits remain intact locally.');
      }
    } catch (err: any) {
      setGlobalMessage({
        type: 'error',
        text: err?.message || 'Failed to save category cards.',
      });
    } finally {
      setIsUploading((prev) => ({ ...prev, [selectedIdx]: false }));
    }
  };

  // Destination quick chips
  const quickLinks = [
    { label: 'Tombstones Page', url: '/tombstones' },
    { label: 'Countertops Page', url: '/countertops-tables' },
    { label: 'Window Sills Page', url: '/window-sills' },
    { label: 'Complete Gallery', url: '/gallery' },
    { label: 'Request Quote', url: '/request-a-quote' },
  ];

  const previewDisplayUrl = pendingPreview || activeCard.imageUrl || DEFAULT_CATEGORY_CARDS[selectedIdx]?.imageUrl;

  return (
    <div className="space-y-6">
      {/* --- TOP OVERVIEW BAR --- */}
      <div className="bg-[#121415] border border-[#2D3237] rounded-lg p-5 space-y-4 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#B79A68] font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>Homepage Content · Featured Category Cards</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F5F1E8]">
              Homepage Category Cards Management
            </h3>
            <p className="text-xs text-[#8E8B82] max-w-2xl leading-relaxed">
              Edit the three primary discipline cards displayed prominently on the homepage. Change titles, labels,
              descriptions, explore button destinations, and replace card images with instant live previews.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowSectionMeta(!showSectionMeta)}
              className="inline-flex items-center gap-1.5 text-xs text-[#DFD9CB] bg-[#1D2023] hover:bg-[#252A2E] border border-[#2D3237] px-3 py-2 rounded transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-[#B79A68]" />
              <span>{showSectionMeta ? 'Hide Section Header' : 'Edit Section Header'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAllCards}
              disabled={isCardSaving || isSavingGlobal}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] px-4 py-2 rounded transition-colors shadow cursor-pointer disabled:opacity-50"
            >
              {isCardSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving All...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All 3 Cards</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Global Save Alert */}
        {globalMessage && (
          <div
            className={`p-3 rounded text-xs flex items-center gap-2.5 transition-all ${
              globalMessage.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/70 border border-red-500/50 text-red-200'
            }`}
          >
            {globalMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <div className="flex-1">{globalMessage.text}</div>
            <button type="button" onClick={() => setGlobalMessage(null)} className="text-[#8E8B82] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Optional Section Header Settings Drawer */}
        {showSectionMeta && (
          <div className="p-4 bg-[#17191B] border border-[#2D3237] rounded-lg space-y-3 pt-4 mt-2">
            <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold block">
              Section Header & Badge
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Section Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={sectionBadge}
                  onChange={(e) => setSectionBadge(e.target.value)}
                  placeholder="Stone Masonry Disciplines"
                  className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Featured Categories"
                  className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                Section Introduction Subtitle
              </label>
              <input
                type="text"
                value={sectionSubtitle}
                onChange={(e) => setSectionSubtitle(e.target.value)}
                placeholder="Precision stonework tailored for solemn family remembrance and refined architectural installations."
                className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* --- THREE CARD SELECTOR TABS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card, idx) => {
          const isSelected = selectedIdx === idx;
          const hasPendingImg = Boolean(pendingFiles[idx]);
          const cardImg = pendingPreviews[idx] || card.imageUrl || DEFAULT_CATEGORY_CARDS[idx]?.imageUrl;

          return (
            <button
              key={card.id || idx}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-center gap-3 relative ${
                isSelected
                  ? 'bg-[#1D2023] border-[#B79A68] shadow-lg shadow-[#B79A68]/10 ring-1 ring-[#B79A68]'
                  : 'bg-[#17191B] border-[#2D3237] hover:bg-[#1D2023] hover:border-[#3E4348]'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-14 h-12 rounded overflow-hidden bg-[#121415] border border-[#2D3237] shrink-0">
                <img src={cardImg} alt={card.title} className="w-full h-full object-cover" />
                {hasPendingImg && (
                  <div className="absolute inset-0 bg-[#B79A68]/40 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[#17191B]" />
                  </div>
                )}
              </div>

              {/* Title & Badge */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-[#B79A68] truncate">
                    Card {idx + 1} · {card.categoryLabel}
                  </span>
                  {hasPendingImg && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B79A68] animate-pulse" />
                  )}
                </div>
                <h4 className="text-xs font-serif font-bold text-[#F5F1E8] truncate">{card.title}</h4>
                <span className="text-[10px] text-[#8E8B82] font-mono truncate block">{card.exploreLink}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* --- SELECTED CARD WORKSPACE: FORM & PREVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: EDIT FORM (7 COLS) */}
        <div className="lg:col-span-7 bg-[#1D2023] border border-[#2D3237] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D3237] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold">
                  Editing Card {selectedIdx + 1} of 3
                </span>
                <span className="text-xs text-[#8E8B82]">({activeCard.id})</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#F5F1E8]">{activeCard.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelCurrentCard}
                className="inline-flex items-center gap-1 text-xs text-[#8E8B82] hover:text-[#DFD9CB] px-3 py-1.5 rounded border border-[#3E4348] hover:border-[#8E8B82] transition-colors cursor-pointer"
                title="Discard unsaved edits on this card"
              >
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleResetCardToFactoryDefault}
                className="inline-flex items-center gap-1 text-xs text-[#8E8B82] hover:text-[#DFD9CB] px-3 py-1.5 rounded border border-[#3E4348] hover:border-[#8E8B82] transition-colors cursor-pointer"
                title="Reset this card back to factory baseline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Baseline</span>
              </button>
            </div>
          </div>

          {/* Card Status Message */}
          {activeMessage && (
            <div
              className={`p-3 rounded text-xs flex items-center gap-2.5 transition-all ${
                activeMessage.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/70 border border-red-500/50 text-red-200'
              }`}
            >
              {activeMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <div className="flex-1">{activeMessage.text}</div>
              <button
                type="button"
                onClick={() => setCardMessages((prev) => ({ ...prev, [selectedIdx]: null }))}
                className="text-[#8E8B82] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Card Form Fields */}
          <div className="space-y-4">
            {/* 1. Category Label & Card Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Category Label (Gold Eyebrow)
                </label>
                <input
                  type="text"
                  value={activeCard.categoryLabel || ''}
                  onChange={(e) => handleFieldChange('categoryLabel', e.target.value)}
                  placeholder="e.g. Memorial Work"
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                />
                <span className="text-[10px] text-[#8E8B82] mt-1 block">
                  Displayed in uppercase gold lettering above the title.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Card Title
                </label>
                <input
                  type="text"
                  value={activeCard.title || ''}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Tombstones & Memorials"
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none font-serif"
                />
                <span className="text-[10px] text-[#8E8B82] mt-1 block">
                  The prominent headline for this stonework category.
                </span>
              </div>
            </div>

            {/* 2. Description Text */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                Description Text
              </label>
              <textarea
                rows={3}
                value={activeCard.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Detailed craft description..."
                className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none leading-relaxed"
              />
            </div>

            {/* 3. Explore Button Text & Destination URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Explore Button Text
                </label>
                <input
                  type="text"
                  value={activeCard.exploreButtonText || ''}
                  onChange={(e) => handleFieldChange('exploreButtonText', e.target.value)}
                  placeholder="e.g. Explore Tombstones"
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                  Destination Link URL
                </label>
                <input
                  type="text"
                  value={activeCard.exploreLink || ''}
                  onChange={(e) => handleFieldChange('exploreLink', e.target.value)}
                  placeholder="/tombstones"
                  className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Quick Destination Chips */}
            <div>
              <span className="text-[10px] text-[#8E8B82] uppercase tracking-wider font-semibold block mb-1.5">
                Quick Destination Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickLinks.map((ql) => (
                  <button
                    key={ql.url}
                    type="button"
                    onClick={() => handleFieldChange('exploreLink', ql.url)}
                    className={`text-[10px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                      activeCard.exploreLink === ql.url
                        ? 'bg-[#B79A68] text-[#17191B] font-bold border-[#B79A68]'
                        : 'bg-[#17191B] text-[#B9B5AC] hover:text-[#F5F1E8] border-[#2D3237]'
                    }`}
                  >
                    {ql.label} ({ql.url})
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Accessibility Alt Text */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#DFD9CB] mb-1 font-semibold">
                Image Alt Text (Accessibility & SEO)
              </label>
              <input
                type="text"
                value={activeCard.imageAlt || ''}
                onChange={(e) => handleFieldChange('imageAlt', e.target.value)}
                placeholder="Descriptive text for screen readers and SEO"
                className="w-full bg-[#17191B] border border-[#2D3237] text-xs text-[#F5F1E8] p-2.5 rounded focus:border-[#B79A68] focus:outline-none"
              />
            </div>

            {/* 5. IMAGE UPLOAD & REPLACEMENT CONTROL BOX */}
            <div className="bg-[#17191B] border border-[#2D3237] rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-[#252A2E] pb-2.5">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#B79A68]" />
                  <span className="text-xs uppercase tracking-wider text-[#F5F1E8] font-bold">
                    Card Image Upload & Replacement
                  </span>
                </div>

                {activeCard.imageUrl !== DEFAULT_CATEGORY_CARDS[selectedIdx]?.imageUrl && (
                  <button
                    type="button"
                    onClick={handleResetCardImageToDefault}
                    className="text-[11px] text-[#8E8B82] hover:text-[#DFD9CB] underline cursor-pointer"
                  >
                    Reset to Default Image
                  </button>
                )}
              </div>

              {/* Upload Controls Row */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isCardSaving}
                    className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] px-4 py-2.5 rounded transition-colors shadow cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{pendingFile ? 'Choose Different File' : 'Upload & Replace Image'}</span>
                  </button>

                  <div className="text-[11px] text-[#8E8B82] flex-1">
                    Accepts JPG, PNG, WebP (max 10 MB). Stored permanently and persists across page reloads.
                  </div>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#8E8B82] mb-1 font-semibold">
                    Or Enter Direct Image URL
                  </label>
                  <input
                    type="text"
                    value={activeCard.imageUrl || ''}
                    onChange={(e) => {
                      handleFieldChange('imageUrl', e.target.value);
                      handleCancelPendingImage();
                    }}
                    placeholder="https://... or /uploads/categories/..."
                    className="w-full bg-[#121415] border border-[#2D3237] text-xs text-[#F5F1E8] p-2 rounded focus:border-[#B79A68] focus:outline-none font-mono"
                  />
                </div>

                {/* Unsaved Preview Notice */}
                {pendingFile && (
                  <div className="bg-[#1D2023] border border-[#B79A68]/60 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B79A68]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>New Image Selected (Unsaved Preview)</span>
                      </div>
                      <p className="text-[11px] text-[#8E8B82] truncate max-w-sm">
                        File: <span className="text-[#DFD9CB]">{pendingFile.name}</span> (
                        {(pendingFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelPendingImage}
                        className="text-xs text-[#8E8B82] hover:text-white px-2.5 py-1 rounded border border-[#3E4348] hover:border-[#8E8B82]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Row for This Card */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2D3237]">
              <button
                type="button"
                onClick={handleCancelCurrentCard}
                className="text-xs text-[#8E8B82] hover:text-[#DFD9CB] px-3.5 py-2 rounded border border-[#3E4348] hover:border-[#8E8B82] transition-colors cursor-pointer"
              >
                Discard Card Changes
              </button>

              <button
                type="button"
                onClick={handleSaveSingleCard}
                disabled={isCardSaving}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17191B] bg-[#B79A68] hover:bg-[#CBB17F] px-5 py-2.5 rounded transition-colors shadow cursor-pointer disabled:opacity-50"
              >
                {isCardSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Card...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Card {selectedIdx + 1} Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE HOMEPAGE CARD PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 space-y-3 sticky top-6">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-bold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Live Homepage Card Preview
            </span>
            <span className="text-[10px] text-[#8E8B82]">
              {pendingPreview ? 'Showing Unsaved Preview' : 'Active Saved State'}
            </span>
          </div>

          {/* Renders the exact card as seen by public homepage visitors */}
          <div className="group relative bg-[#1D2023] border border-[#2D3237] hover:border-[#B79A68]/60 rounded overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-xl">
            <div className="relative aspect-16/10 overflow-hidden bg-[#121415]">
              <img
                src={previewDisplayUrl}
                alt={activeCard.imageAlt || activeCard.title}
                style={getImageDisplayStyles(activeCard.imageSettings)}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                onError={(e) => {
                  const fallback = DEFAULT_CATEGORY_CARDS[selectedIdx]?.imageUrl || DEFAULT_HERO_IMAGE_URL;
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#1D2023] via-transparent to-transparent pointer-events-none" />

              {pendingPreview && (
                <div className="absolute top-2 right-2 bg-[#B79A68] text-[#17191B] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                  Unsaved Preview
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79A68] font-semibold block mb-1">
                  {activeCard.categoryLabel || 'Category Label'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[#F5F1E8] font-bold group-hover:text-[#B79A68] transition-colors">
                  {activeCard.title || 'Card Title'}
                </h3>
                <p className="text-xs text-[#B9B5AC] mt-2 leading-relaxed">
                  {activeCard.description || 'Description text will appear here...'}
                </p>
              </div>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B79A68] group-hover:text-[#F5F1E8] transition-colors">
                  <span>{activeCard.exploreButtonText || 'Explore'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#17191B] border border-[#2D3237] rounded-lg text-[11px] text-[#8E8B82] space-y-1.5">
            <div className="font-semibold text-[#DFD9CB]">Verification Checklist</div>
            <ul className="space-y-1 list-disc list-inside text-[10px] text-[#8E8B82]">
              <li>Hover over the preview above to verify zoom & gold border hover response.</li>
              <li>Button points to <span className="text-[#B79A68] font-mono">{activeCard.exploreLink}</span>.</li>
              <li>Image persists to persistent storage when you click Save.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
