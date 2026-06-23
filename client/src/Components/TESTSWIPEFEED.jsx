import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useLocation as useRouterLocation } from "react-router-dom";
import { FaInstagram } from 'react-icons/fa';
import API from "../../utils/api";
import "../../css/TestSwipe.css";
import { useLocation } from "../context/LocationContext";
import Layout from "../Layout/Layout";

const LIMIT = 8;
const PRELOAD_NEXT = 3;

// City Ads Configuration
const CITY_ADS = {
  kota: [
    { 
      id: 1, 
      title: "📱 Best Laptops for Students", 
      description: "Top-rated laptops under ₹50,000 for coding & exams",
      cta: "Buy Now", 
      affiliateLink: "https://www.amazon.in/acer-Professional-3-7330U-Graphics-TL14-42M/dp/B0FG3C3RQ9?crid=B1XBFZGCJVR2&dib=eyJ2IjoiMSJ9.R_4OxDV9_n-rZr_aKXUZh68N2u_WKN3kNMSoeCC71a9x8_4_fPoe6Ci0K5XGPqplFPUCollvmffT5Nc45gbu14D5LXII8xVQCqRKZCHB8e3H-J7PsCAcU21Nr1_iUrne9dAXeiFSQG23bV493MzZ0L0iJfOUHl3-OEVHtKBDAn64KTBuyPohA2SoNTRz9__Oke3Cj7kXLPtsWd-_Te1TXu8p-gXmeRdsdmUH2OwTFGA.ciLCxEilB6TOYFqAOs7UiPrJMUQFPiMJbLErL1c975Y&dib_tag=se&keywords=laptop&qid=1775920329&sprefix=lapto%2Caps%2C454&sr=8-17&th=1&linkCode=ll2&tag=bhaveshloha0f-21&linkId=d53e9f0f9868558eca64d4f05eb65666&ref_=as_li_ss_tl",
      imageUrl: "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
    },
    { 
      id: 2, 
      title: "🎧 Noise Cancelling Headphones", 
      description: "Perfect for online classes & focused study",
      cta: "Shop Now", 
      affiliateLink: "https://www.amazon.in/boAt-Rockerz-650-Pro-Headphones/dp/B0DV5JTG17?crid=1WA6THXSDQW39&dib=eyJ2IjoiMSJ9.jZg68yaAY05WPf4nTY5lY1pL3QoQreZ07qtPB78Sv932P3K8IShZc_vKXhnj2cdX7Ffl1CTF9B2uIrurhnQIxUzns3sXbKF-SmtvpNsWJNbAd4e9plMvzkIKuU9JlU1GgpVys6VF4B5kxvvzCM7zIsJ8yaTGjoqTlXEMlVfXPf9YTFyFB5jsG10FCjKTNtXsMoqJYedrtk1AI0oVZzwuAztxa2XFtHjktmAyAvIYRyo.pPzv50bWrVmXVx2um0YxXEv7AoCUJeCMQk08x3LeBEY&dib_tag=se&keywords=Noise%2BCancelling%2BHeadphones&qid=1775922702&sprefix=noise%2Bcancelling%2Bheadphones%2Caps%2C660&sr=8-1-spons&aref=j5Bgkk7l7l&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=bhaveshloha0f-21&linkId=0cbba45fa4386e9d30ac6c1898a65e02&ref_=as_li_ss_tl",
      imageUrl: "https://m.media-amazon.com/images/I/61jLgUYSZqL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
    },
    { 
      id: 3, 
      title: "📚 UPSC/JEE Preparation Books", 
      description: "Best-selling guides & practice papers",
      cta: "View Books", 
      affiliateLink: "https://www.amazon.in/s?k=UPSC%2FJEE+Preparation+Books&crid=2B3CJS7OR8K39&sprefix=upsc%2Fjee+preparation+books%2Caps%2C1469&linkCode=ll2&tag=bhaveshloha0f-21&linkId=12f8e2ff6921fdb20877417795316901&ref_=as_li_ss_tl",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81Q1qJqJqJL.jpg",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
    },
    { 
      id: 4, 
      title: "💻 Online Coding Course", 
      description: "Learn Python, Web Dev - Placement Guarantee",
      cta: "Enroll Now", 
      affiliateLink: "https://www.udemy.com/courses/development/?utm_source=aff-campaign&utm_medium=udemyads&LSNPUBID=your-affiliate-id",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" 
    },
    { 
      id: 5, 
      title: "🏠 PG/Hostel Near Kota", 
      description: "Safe & affordable stays for students",
      cta: "Check Prices", 
      affiliateLink: "https://www.magicbricks.com/property-for-rent/residential-real-estate?proptype=Multistorey-Apartment,Builder-Floor-Apartment,Studio-Apartment,Service-Apartment,Residential-House,Villa",
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" 
    }
  ],
  ramganjamndi: [
    { 
      id: 1, 
      title: "🔧 Power Tools for Workshops", 
      description: "Heavy-duty tools at best prices",
      cta: "Shop Now", 
      affiliateLink: "https://www.amazon.in/s?k=Power+Tools+for+Workshops&crid=8MZW92KEUDL5&sprefix=power+tools+for+workshops%2Caps%2C514&linkCode=ll2&tag=bhaveshloha0f-21&linkId=d763f0beefa274d7847420da2fcf9e07&ref_=as_li_ss_tl",
      imageUrl: "https://m.media-amazon.com/images/I/61jLgUYSZqL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" 
    },
    { 
      id: 2, 
      title: "🚜 Tractor & Farming Equipment", 
      description: "EMI options available",
      cta: "View Offers", 
      affiliateLink: "https://www.amazon.in/s?k=Tractor+%26+Farming+Equipment&crid=25QJVXRCMEYCW&sprefix=tractor+%26+farming+equipment%2Caps%2C443&linkCode=ll2&tag=bhaveshloha0f-21&linkId=9c05f4afc1031a3e7269b5920109ed8c&ref_=as_li_ss_tl",
      imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
      bgColor: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)" 
    },
    { 
      id: 3, 
      title: "💻 Learn MS Office & Tally", 
      description: "Get job-ready in 30 days",
      cta: "Join Course", 
      affiliateLink: "https://www.udemy.com/courses/office-productivity/",
      imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
      bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" 
    }
  ],
  snagod: [
    { 
      id: 1, 
      title: "📖 SSC/Bank Exam Mock Tests", 
      description: "5000+ previous year questions",
      cta: "Start Free Trial", 
      affiliateLink: "https://testbook.com/",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      bgColor: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)" 
    },
    { 
      id: 2, 
      title: "💪 Home Gym Equipment", 
      description: "Dumbbells, yoga mats, resistance bands",
      cta: "Buy on Amazon", 
      affiliateLink: "https://www.amazon.in/s?k=gym+equipment+for+home",
      imageUrl: "https://m.media-amazon.com/images/I/71SW6g5z5VL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)" 
    }
  ],
  ladpura: [
    { 
      id: 1, 
      title: "🏦 Business Loan at 9.9%", 
      description: "Instant approval, minimal documentation",
      cta: "Check Eligibility", 
      affiliateLink: "https://www.bajajfinserv.in/business-loan",
      imageUrl: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
      bgColor: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)" 
    },
    { 
      id: 2, 
      title: "🎨 Art Supplies Kit", 
      description: "Paint, brushes, canvases - 30% off",
      cta: "Shop Now", 
      affiliateLink: "https://www.amazon.in/s?k=art+supplies+kit",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      bgColor: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" 
    }
  ]
};

// Default ads for cities without specific ads
const DEFAULT_ADS = [
  { 
    id: 1, 
    title: "🔥 Special Offer in Your City", 
    description: "Limited time discount on services",
    cta: "Claim Offer", 
    affiliateLink: "https://www.amazon.in/gp/bestsellers?&linkCode=ll2&tag=bhaveshloha0f-21&linkId=315b5523cf1f376de8b016f5bf962b9a&ref_=as_li_ss_tl",
    imageUrl: "https://images.unsplash.com/photo-1556741533-6e6a3bd8e0d1",
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
  },
  { 
    id: 2, 
    title: "⌚ Best Smart Watches", 
    description: "Get exclusive smartwatches at best prices",
    cta: "Check Now", 
    affiliateLink: "https://www.amazon.in/s?k=smart+watches",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
  },
  { 
    id: 3, 
    title: "📱 Mobile Accessories", 
    description: "Cases, chargers, and more at 40% off",
    cta: "Shop Deals", 
    affiliateLink: "https://www.amazon.in/s?k=mobile+accessories",
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07",
    bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
  }
];

// Time ago formatter
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "साल पहले", seconds: 31536000 },
    { label: "महीने पहले", seconds: 2592000 },
    { label: "दिन पहले", seconds: 86400 },
    { label: "घंटे पहले", seconds: 3600 },
    { label: "मिनट पहले", seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 1) return `${count} ${interval.label}`;
    if (count === 1) return `1 ${interval.label.slice(0, -1)} पहले`;
  }
  return `${Math.floor(seconds)} सेकंड पहले`;
};

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-meta">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
      <div className="skeleton-line title"></div>
      <div className="skeleton-text">
        <div className="skeleton-line long"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  </div>
);

// Optimized Ad Card Component
const AdCard = React.memo(({ ad }) => {
  const [isVisible, setIsVisible] = useState(false);
  const adRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (adRef.current) observer.observe(adRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAdClick = () => {
    if (ad.affiliateLink) {
      window.open(ad.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div ref={adRef} className="ad-card" onClick={handleAdClick}>
      <div className="ad-wrapper" style={{ background: ad.bgColor }}>
        <div className="ad-badge">✨ Sponsored</div>
        <div className="ad-content">
          <h3 className="ad-title">{ad.title}</h3>
          <p className="ad-description">{ad.description}</p>
          <button className="ad-cta-btn">{ad.cta} →</button>
        </div>
      </div>
    </div>
  );
});

// Optimized Post Card Component
const PostCard = React.memo(({ post, index, isActive, onShare }) => {
  const imageRef = useRef(null);
  
  useEffect(() => {
    if (imageRef.current && isActive) {
      const img = imageRef.current;
      if (img.dataset.src && !img.src) {
        img.src = img.dataset.src;
      }
    }
  }, [isActive]);

  const getPostContent = (content) => {
    if (!content) return "कोई सामग्री नहीं";
    if (typeof content === "string") return content.substring(0, 150) + (content.length > 150 ? "..." : "");
    if (typeof content === "object" && content.blocks) {
      return content.blocks
        .map(block => block.data?.text || "")
        .join(" ")
        .substring(0, 150);
    }
    return "कोई सामग्री नहीं";
  };

  const author = post.author;

  return (
    <div className="feed-card" data-index={index} data-active={isActive}>
      <div className="feed-image-wrapper">
        <img
          ref={imageRef}
          data-src={post.image || "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png"}
          alt={post.title}
          className="feed-image"
          loading={index < 2 ? "eager" : "lazy"}
          onError={(e) => {
            e.target.src = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";
          }}
        />
        <div className="image-overlay" />
        <button 
          className="share-btn" 
          onClick={(e) => onShare(e, post)} 
          aria-label="Share"
        >
          🔗
        </button>
      </div>
      <div className="feed-content">
        <div className="feed-meta">
          {author && (
            <span className="feed-author">
              ✍️ {author.name || author.username || "Trendkari Team"}
            </span>
          )}
          <span className="feed-time">🕒 {timeAgo(post.createdAt)}</span>
        </div>
        <h3 className="feed-title">{post.title}</h3>
        <div className="feed-desc">{getPostContent(post.content)}</div>
      </div>
    </div>
  );
});

// Main Component
const TestSwipeFeed = () => {
  const { location: locationParam, slug } = useParams();
  const routerLocation = useRouterLocation();
  const { location: contextLocation } = useLocation();
  
  // State
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [combinedItems, setCombinedItems] = useState([]);
  const [targetPostId, setTargetPostId] = useState(null);
  const [preloadedImages, setPreloadedImages] = useState(new Set());
  
  // Refs
  const containerRef = useRef(null);
  const isScrolling = useRef(false);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const scrollAttempted = useRef(false);

  // Get effective location
  const effectiveLocation = useMemo(() => 
    locationParam && locationParam !== "feed" ? locationParam : contextLocation || "kota",
    [locationParam, contextLocation]
  );
  
  // Get city ads
  const getCityAds = useCallback(() => {
    const cityAds = CITY_ADS[effectiveLocation.toLowerCase()];
    return cityAds && cityAds.length > 0 ? cityAds : DEFAULT_ADS;
  }, [effectiveLocation]);
  
  // Preload images
  const preloadImage = useCallback((src) => {
    if (!src || preloadedImages.has(src)) return;
    const img = new Image();
    img.src = src;
    setPreloadedImages(prev => new Set(prev).add(src));
  }, [preloadedImages]);
  
  // Insert ads into posts
  const insertAdsIntoPosts = useCallback((originalPosts, currentAds) => {
    if (!originalPosts.length) return [];
    
    const adPositions = [2, 5, 8, 11, 14, 17, 20];
    const result = [];
    let adIndex = 0;
    
    for (let i = 0; i < originalPosts.length; i++) {
      const currentPosition = result.length;
      
      if (adIndex < currentAds.length && adPositions.includes(currentPosition)) {
        result.push({ 
          type: 'ad', 
          data: currentAds[adIndex % currentAds.length],
          id: `ad-${currentAds[adIndex % currentAds.length].id}-${currentPosition}`
        });
        adIndex++;
      }
      
      result.push({ 
        type: 'post', 
        data: originalPosts[i], 
        id: originalPosts[i]._id,
        originalIndex: i 
      });
    }
    
    return result;
  }, []);
  
  // Update combined items
  useEffect(() => {
    if (posts.length > 0) {
      const cityAds = getCityAds();
      const itemsWithAds = insertAdsIntoPosts(posts, cityAds);
      setCombinedItems(itemsWithAds);
      
      // Preload next few images
      const nextItems = itemsWithAds.slice(currentIndex + 1, currentIndex + PRELOAD_NEXT + 1);
      nextItems.forEach(item => {
        if (item.type === 'post' && item.data.image) {
          preloadImage(item.data.image);
        }
      });
    } else {
      setCombinedItems([]);
    }
  }, [posts, getCityAds, insertAdsIntoPosts, currentIndex, preloadImage]);
  
  // Fetch posts
  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore || initializing || !initialLoadDone.current) return;
    
    try {
      setLoading(true);
      let feedUrl = `/post/get-posts?status=approved&page=${page}&limit=${LIMIT}`;
      if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
        feedUrl += `&location=${effectiveLocation}`;
      }
      
      const { data } = await API.get(feedUrl);
      if (!isMounted.current) return;
      
      if (!data?.posts?.length) {
        setHasMore(false);
        return;
      }
      
      setPosts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const newPosts = data.posts.filter(p => !existingIds.has(p._id));
        return [...prev, ...newPosts];
      });
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [loading, hasMore, page, initializing, effectiveLocation]);
  
  // Scroll to index
  const goToIndex = useCallback((index, shouldScroll = true) => {
    if (!containerRef.current || index < 0 || index >= combinedItems.length) return;
    
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    if (shouldScroll) {
      isScrolling.current = true;
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
    setCurrentIndex(index);
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  }, [combinedItems.length]);
  
  // Handle scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (isScrolling.current) return;
      
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < combinedItems.length) {
        setCurrentIndex(newIndex);
        
        // Load more when near bottom
        if (newIndex >= combinedItems.length - 3 && hasMore && !loading && initialLoadDone.current) {
          fetchMorePosts();
        }
        
        // Preload upcoming images
        const upcomingItems = combinedItems.slice(newIndex + 1, newIndex + PRELOAD_NEXT + 1);
        upcomingItems.forEach(item => {
          if (item.type === 'post' && item.data.image) {
            preloadImage(item.data.image);
          }
        });
      }
    };
    
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, combinedItems, hasMore, loading, fetchMorePosts, preloadImage]);
  
  // Initialize feed
  useEffect(() => {
    initialLoadDone.current = false;
    scrollAttempted.current = false;
    setTargetPostId(null);
    
    const initializeFeed = async () => {
      if (!isMounted.current) return;
      setInitializing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setCurrentIndex(0);
      setCombinedItems([]);
      
      try {
        let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
        if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
          feedUrl += `&location=${effectiveLocation}`;
        }
        
        const feedResponse = await API.get(feedUrl);
        let feedPosts = feedResponse?.data?.posts || [];
        
        // Handle slug if present
        if (slug) {
          try {
            const singleResponse = await API.get(`/post/get-post/${slug}`);
            const singlePost = singleResponse?.data?.post;
            if (singlePost) {
              const existingIndex = feedPosts.findIndex(p => p._id === singlePost._id);
              if (existingIndex === -1) {
                feedPosts = [singlePost, ...feedPosts];
                setTargetPostId(singlePost._id);
              } else {
                setTargetPostId(singlePost._id);
              }
            }
          } catch (err) {
            console.error("Error fetching single post:", err);
          }
        }
        
        if (isMounted.current) {
          setPosts(feedPosts);
          setPage(2);
          initialLoadDone.current = true;
        }
      } catch (err) {
        console.error("Error initializing feed:", err);
      } finally {
        if (isMounted.current) setInitializing(false);
      }
    };
    
    initializeFeed();
  }, [effectiveLocation, slug, routerLocation.key]);
  
  // Scroll to target post
  useEffect(() => {
    if (!targetPostId || !containerRef.current || scrollAttempted.current || combinedItems.length === 0) return;
    
    let actualIndex = combinedItems.findIndex(
      item => item.type === 'post' && item.data._id === targetPostId
    );
    
    if (actualIndex !== -1 && !scrollAttempted.current) {
      scrollAttempted.current = true;
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: actualIndex * window.innerHeight,
            behavior: "smooth"
          });
          setCurrentIndex(actualIndex);
        }
      }, 150);
    }
  }, [combinedItems, targetPostId]);
  
  // Share handler
  const handleShare = async (e, post) => {
    e.stopPropagation();
    const url = `https://www.trendkari.in/feed/${effectiveLocation}/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: `📰 ${post.title}\n\n👉 पूरी खबर पढ़ें`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("लिंक कॉपी हो गया!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };
  
  // Loading skeleton
  if (initializing && posts.length === 0) {
    return (
      <div className="feed-container loading-container">
        <div className="premium-loader">
          <div className="premium-spinner"></div>
          <p className="loader-text">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!initializing && posts.length === 0) {
    return (
      <div className="feed-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>कोई पोस्ट नहीं मिली</p>
        </div>
      </div>
    );
  }
  
  return (
    <Layout>
    <div className="feed-container" ref={containerRef}>
      {combinedItems.map((item, index) => {
        if (item.type === 'ad') {
          return <AdCard key={item.id} ad={item.data} />;
        }
        return (
          <PostCard
            key={item.id}
            post={item.data}
            index={index}
            isActive={currentIndex === index}
            onShare={handleShare}
          />
        );
      })}
      
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
          <div className="premium-spinner" style={{ width: 32, height: 32 }}></div>
        </div>
      )}
      
      {/* Social Icons */}
      <div className="social-icons-container">
        <a 
          href="https://www.instagram.com/trendkari.in/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon instagram-icon"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>
    </div>
    </Layout>
  );
};

export default TestSwipeFeed;