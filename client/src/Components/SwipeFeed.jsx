import React, { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import { useParams, useLocation as useRouterLocation } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import API from "../../utils/api";
import "../../css/Swipe.css";
import { useLocation } from "../context/LocationContext";

const LIMIT = 6;
const FALLBACK_IMAGE = "https://ik.imagekit.io/f4dxqg3tf/posts/KOTA.png";

// ---------------------------------------------------------------------------
// Ad configuration per city (unchanged business data — presentation only
// was touched in this pass).
// ---------------------------------------------------------------------------
const CITY_ADS = {
  kota: [
    {
      id: 1,
      title: "📱 Best Laptops for Students",
      description: "Top-rated laptops under ₹50,000 for coding & exams",
      cta: "Buy",
      affiliateLink:
        "https://www.amazon.in/acer-Professional-3-7330U-Graphics-TL14-42M/dp/B0FG3C3RQ9?crid=B1XBFZGCJVR2&dib=eyJ2IjoiMSJ9.R_4OxDV9_n-rZr_aKXUZh68N2u_WKN3kNMSoeCC71a9x8_4_fPoe6Ci0K5XGPqplFPUCollvmffT5Nc45gbu14D5LXII8xVQCqRKZCHB8e3H-J7PsCAcU21Nr1_iUrne9dAXeiFSQG23bV493MzZ0L0iJfOUHl3-OEVHtKBDAn64KTBuyPohA2SoNTRz9__Oke3Cj7kXLPtsWd-_Te1TXu8p-gXmeRdsdmUH2OwTFGA.ciLCxEilB6TOYFqAOs7UiPrJMUQFPiMJbLErL1c975Y&dib_tag=se&keywords=laptop&qid=1775920329&sprefix=lapto%2Caps%2C454&sr=8-17&th=1&linkCode=ll2&tag=bhaveshloha0f-21&linkId=d53e9f0f9868558eca64d4f05eb65666&ref_=as_li_ss_tl",
      imageUrl: "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: 2,
      title: "🎧 Noise Cancelling Headphones",
      description: "Perfect for online classes & focused study",
      cta: "Shop",
      affiliateLink:
        "https://www.amazon.in/boAt-Rockerz-650-Pro-Headphones/dp/B0DV5JTG17?crid=1WA6THXSDQW39&dib=eyJ2IjoiMSJ9.jZg68yaAY05WPf4nTY5lY1pL3QoQreZ07qtPB78Sv932P3K8IShZc_vKXhnj2cdX7Ffl1CTF9B2uIrurhnQIxUzns3sXbKF-SmtvpNsWJNbAd4e9plMvzkIKuU9JlU1GgpVys6VF4B5kxvvzCM7zIsJ8yaTGjoqTlXEMlVfXPf9YTFyFB5jsG10FCjKTNtXsMoqJYedrtk1AI0oVZzwuAztxa2XFtHjktmAyAvIYRyo.pPzv50bWrVmXVx2um0YxXEv7AoCUJeCMQk08x3LeBEY&dib_tag=se&keywords=Noise%2BCancelling%2BHeadphones&qid=1775922702&sprefix=noise%2Bcancelling%2Bheadphones%2Caps%2C660&sr=8-1-spons&aref=j5Bgkk7l7l&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1&linkCode=ll2&tag=bhaveshloha0f-21&linkId=0cbba45fa4386e9d30ac6c1898a65e02&ref_=as_li_ss_tl",
      imageUrl:
        "https://static-01.daraz.com.np/p/0e8b2e7e6b6e6c5e6d4e3f2e1c0b9a8e.jpg",
      bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      id: 3,
      title: "📚 UPSC/JEE Preparation Books",
      description: "Best-selling guides & practice papers",
      cta: "View",
      affiliateLink:
        "https://www.amazon.in/s?k=UPSC%2FJEE+Preparation+Books&crid=2B3CJS7OR8K39&sprefix=upsc%2Fjee+preparation+books%2Caps%2C1469&linkCode=ll2&tag=bhaveshloha0f-21&linkId=12f8e2ff6921fdb20877417795316901&ref_=as_li_ss_tl",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/81Q1qJqJqJL.jpg",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      id: 4,
      title: "💻 Online Coding Course",
      description: "Learn Python, Web Dev - Placement Guarantee",
      cta: "Enroll Now",
      affiliateLink: "YOUR_CODING_COURSE_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      bgColor: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      id: 5,
      title: "🏠 PG/Hostel Near Kota",
      description: "Safe & affordable stays for students",
      cta: "Check Prices",
      affiliateLink: "YOUR_MAGICBRICKS_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ],
  ramganjamndi: [
    {
      id: 1,
      title: "🔧 Power Tools for Workshops",
      description: "Heavy-duty tools at best prices",
      cta: "Shop Now",
      affiliateLink:
        "https://www.amazon.in/s?k=Power+Tools+for+Workshops&crid=8MZW92KEUDL5&sprefix=power+tools+for+workshops%2Caps%2C514&linkCode=ll2&tag=bhaveshloha0f-21&linkId=d763f0beefa274d7847420da2fcf9e07&ref_=as_li_ss_tl",
      imageUrl: "https://m.media-amazon.com/images/I/61jLgUYSZqL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    },
    {
      id: 2,
      title: "🚜 Tractor & Farming Equipment",
      description: "EMI options available",
      cta: "View Offers",
      affiliateLink:
        "https://www.amazon.in/s?k=Tractor+%26+Farming+Equipment&crid=25QJVXRCMEYCW&sprefix=tractor+%26+farming+equipment%2Caps%2C443&linkCode=ll2&tag=bhaveshloha0f-21&linkId=9c05f4afc1031a3e7269b5920109ed8c&ref_=as_li_ss_tl",
      imageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9",
      bgColor: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    },
    {
      id: 3,
      title: "💻 Learn MS Office & Tally",
      description: "Get job-ready in 30 days",
      cta: "Join Course",
      affiliateLink: "YOUR_UDEMY_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd",
      bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
  ],
  snagod: [
    {
      id: 1,
      title: "📖 SSC/Bank Exam Mock Tests",
      description: "5000+ previous year questions",
      cta: "Start Free Trial",
      affiliateLink: "YOUR_TESTBOOK_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
      bgColor: "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)",
    },
    {
      id: 2,
      title: "💪 Home Gym Equipment",
      description: "Dumbbells, yoga mats, resistance bands",
      cta: "Buy on Amazon",
      affiliateLink: "YOUR_AMAZON_GYM_AFFILIATE_LINK",
      imageUrl: "https://m.media-amazon.com/images/I/71SW6g5z5VL._SL1500_.jpg",
      bgColor: "linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)",
    },
  ],
  ladpura: [
    {
      id: 1,
      title: "🏦 Business Loan at 9.9%",
      description: "Instant approval, minimal documentation",
      cta: "Check Eligibility",
      affiliateLink: "YOUR_BAJAJ_FINSERV_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
      bgColor: "linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)",
    },
    {
      id: 2,
      title: "🎨 Art Supplies Kit",
      description: "Paint, brushes, canvases - 30% off",
      cta: "Shop Now",
      affiliateLink: "YOUR_AMAZON_ART_AFFILIATE_LINK",
      imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      bgColor: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    },
  ],
};

const DEFAULT_ADS = [
  {
    id: 1,
    title: "🔥 Special Offer in Your City",
    description: "Limited time discount on services",
    cta: "Claim Offer",
    affiliateLink:
      "https://www.amazon.in/gp/bestsellers?&linkCode=ll2&tag=bhaveshloha0f-21&linkId=315b5523cf1f376de8b016f5bf962b9a&ref_=as_li_ss_tl",
    imageUrl: "https://images.unsplash.com/photo-1556741533-6e6a3bd8e0d1",
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    title: "📱 Best Watch",
    description: "Get exclusive Analog Watches at best prices",
    cta: "Check Now",
    affiliateLink:
      "https://www.amazon.in/Michael-Kors-Lexington-Gold-Tone-MK8286/dp/B00CQGRZAE?pd_rd_w=deQi7&content-id=amzn1.sym.2fa5ef78-d215-4b54-bdb7-fa3d3620b822&pf_rd_p=2fa5ef78-d215-4b54-bdb7-fa3d3620b822&pf_rd_r=Q7J3NRQ0K6SH8MC9GDDE&pd_rd_wg=OANLG&pd_rd_r=4a08453a-769e-4ea8-8485-4142fbdd9294&pd_rd_i=B00CQGRZAE&th=1&linkCode=ll2&tag=bhaveshloha0f-21&linkId=b9a76aa23c36d6d8e910394a0691b169&ref_=as_li_ss_tl",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    bgColor: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
];

// Helper function for time-ago format
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " साल पहले";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " महीने पहले";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " दिन पहले";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " घंटे पहले";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " मिनट पहले";
  return Math.floor(seconds) + " सेकंड पहले";
};

// Turns EditorJS-style block content (or a plain string) into text.
const getPostContent = (content) => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object" && content.blocks) {
    return content.blocks
      .map((block) => {
        if (block.type === "paragraph" || block.type === "header") {
          return block.data?.text || "";
        }
        return "";
      })
      .join(" ");
  }
  return "";
};

// ---------------------------------------------------------------------------
// Ad card — one full "screen" in the feed, styled to look native rather
// than like a banner ad.
// ---------------------------------------------------------------------------
const AdCard = memo(({ ad }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const node = adRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log(`Ad ${ad.id} viewed`);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ad.id]);

  const handleAdClick = () => {
    if (ad.affiliateLink && ad.affiliateLink.startsWith("http")) {
      window.open(ad.affiliateLink, "_blank", "noopener,noreferrer");
    } else {
      console.log("No affiliate link configured for this ad");
    }
  };

  return (
    <div ref={adRef} className="ad-card" onClick={handleAdClick}>
      <div className="ad-wrapper" style={{ background: ad.bgColor }}>
        <div className="ad-badge">Sponsored</div>
        <div className="ad-content">
          <h3 className="ad-title">{ad.title}</h3>
          <p className="ad-description">{ad.description}</p>
          <button className="ad-cta-btn">{ad.cta}</button>
        </div>
        <div className="ad-decoration">
          <div className="ad-icon">📢</div>
        </div>
      </div>
    </div>
  );
});
AdCard.displayName = "AdCard";

// ---------------------------------------------------------------------------
// News card — owns its own image-loading state so a slow/broken image on
// one card never blocks or flashes the rest of the feed. Memoized so it
// only re-renders when its own props actually change, not on every
// currentIndex update in the parent.
// ---------------------------------------------------------------------------
const NewsCard = memo(({ post, index, isActive, cardRef, onShare }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(post.image || FALLBACK_IMAGE);
  const author = post.author;

  return (
    <article
      ref={cardRef}
      className="feed-card"
      data-index={index}
      data-active={isActive}
    >
      <div className="feed-image-wrapper">
        {!imgLoaded && (
          <div className="feed-image-skeleton skeleton-bg" aria-hidden="true" />
        )}
        <img
          src={imgSrc}
          alt={post.title}
          className={`feed-image${imgLoaded ? " is-loaded" : ""}`}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
            else setImgLoaded(true);
          }}
        />
        <div className="image-overlay" />
        <button
          className="share-btn"
          onClick={(e) => onShare(e, post)}
          aria-label="Share this article"
        >
          🔗
        </button>
      </div>

      <div className="feed-content">
        <div className="feed-meta">
          {author && (
            <span className="feed-author">
              ✍️ {author.name || author.username || post.author || "Trendkari Team"}
            </span>
          )}
          <span className="feed-time">🕒 {timeAgo(post.createdAt)}</span>
        </div>

        <h3 className="feed-title">{post.title}</h3>

        <p className="feed-desc">
          {getPostContent(post.content) || "No description available"}
        </p>
      </div>
    </article>
  );
});
NewsCard.displayName = "NewsCard";

// ---------------------------------------------------------------------------
// SwipeFeed
// ---------------------------------------------------------------------------
const SwipeFeed = () => {
  const { location: locationParam, slug } = useParams();
  const routerLocation = useRouterLocation();
  const { location: contextLocation } = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetPostId, setTargetPostId] = useState(null);

  const containerRef = useRef(null);
  const observer = useRef();
  const isScrolling = useRef(false);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const scrollAttempted = useRef(false);

  // Priority: URL param > location context > default
  const effectiveLocation =
    locationParam && locationParam !== "feed"
      ? locationParam
      : contextLocation || "kota";

  const getCityAds = useCallback(() => {
    const cityAds = CITY_ADS[(effectiveLocation || "").toLowerCase()];
    return cityAds && cityAds.length > 0 ? cityAds : DEFAULT_ADS;
  }, [effectiveLocation]);

  // Interleave ads into the post list (every ~3rd, 6th, 9th slot).
  const insertAdsIntoPosts = useCallback((originalPosts, currentAds) => {
    if (!originalPosts.length) return [];

    const adPositions = [2, 5, 8, 11, 14, 17, 20];
    const result = [];
    let adIndex = 0;

    for (let i = 0; i < originalPosts.length; i++) {
      const currentPosition = result.length;

      if (adIndex < currentAds.length && adPositions.includes(currentPosition)) {
        result.push({
          type: "ad",
          data: currentAds[adIndex % currentAds.length],
          adId: `${currentAds[adIndex % currentAds.length].id}-${currentPosition}`,
        });
        adIndex++;
      }

      result.push({ type: "post", data: originalPosts[i], originalIndex: i });
    }

    return result;
  }, []);

  // Combined (posts + ads) list — a pure derivation of posts/city, so this
  // is a useMemo rather than state-synced-via-useEffect. That pattern was
  // costing an extra render on every fetch for no benefit.
  const combinedItems = useMemo(
    () => (posts.length > 0 ? insertAdsIntoPosts(posts, getCityAds()) : []),
    [posts, insertAdsIntoPosts, getCityAds]
  );

  // Smooth scroll to a given index in combinedItems.
const goToIndex = useCallback(
  (index, shouldScroll = true) => {
    if (!containerRef.current) return;
    if (index < 0 || index >= combinedItems.length) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    const container = containerRef.current;

    // Get the actual feed cards
    const cards = container.querySelectorAll(
      ".feed-card, .feed-card-wrapper"
    );

    const targetCard = cards[index];

    if (!targetCard) return;

    if (shouldScroll) {
      isScrolling.current = true;

      // Scroll to the actual card position instead of assuming
      // every card has the same height.
      targetCard.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setCurrentIndex(index);

    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 700);
  },
  [combinedItems.length]
);

  // Once combinedItems is ready, scroll to a shared-link target post.
  // Uses goToIndex (real DOM position via scrollIntoView) rather than
  // assuming a fixed card height — a shared link to a post with a long
  // description, sitting after other variable-height cards, would land
  // in the wrong place with index * clientHeight math.
  useEffect(() => {
    if (
      !targetPostId ||
      !containerRef.current ||
      scrollAttempted.current ||
      combinedItems.length === 0
    ) {
      return;
    }

    const actualIndex = combinedItems.findIndex(
      (item) => item.type === "post" && item.data._id === targetPostId
    );

    if (actualIndex !== -1) {
      scrollAttempted.current = true;
      // Give the newly-rendered cards a tick to get their real DOM
      // height before asking the browser to scroll to one of them.
      const t = setTimeout(() => goToIndex(actualIndex, true), 50);
      return () => clearTimeout(t);
    }
  }, [combinedItems, targetPostId, goToIndex]);

  // Paginate.
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

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = data.posts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newPosts];
      });
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Error fetching more posts:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [loading, hasMore, page, initializing, effectiveLocation]);

  // Track the active card via IntersectionObserver rather than a
  // scrollTop/clientHeight calculation — cards have variable height
  // (min-height, not height), so "index = scrollTop / clientHeight" gives
  // the wrong answer the moment any earlier card is taller than one
  // screen. Instead we watch every card's real intersection ratio and
  // pick whichever one is currently most visible.
  //
  // Pagination is NOT triggered from here — the lastPostRef sentinel
  // below already does that off the real last DOM node, independent of
  // any height math, so doing it twice would be redundant.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || combinedItems.length === 0) return;

    const cards = container.querySelectorAll(".feed-card, .feed-card-wrapper");
    const ratios = new Map();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.dataset.index);
          ratios.set(idx, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestIndex = null;
        let bestRatio = 0;
        ratios.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = idx;
          }
        });

        if (bestIndex !== null && bestRatio >= 0.5) {
          setCurrentIndex((prev) => (prev === bestIndex ? prev : bestIndex));
        }
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, [combinedItems.length]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (observer.current) observer.current.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Initial load — resets on route/location change.
  useEffect(() => {
    initialLoadDone.current = false;
    isScrolling.current = false;
    scrollAttempted.current = false;
    setTargetPostId(null);

    const initializeFeed = async () => {
      if (!isMounted.current) return;
      setInitializing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      setCurrentIndex(0);

      try {
        let feedPosts = [];

        let feedUrl = `/post/get-posts?status=approved&page=1&limit=${LIMIT}`;
        if (effectiveLocation && effectiveLocation !== "feed" && effectiveLocation !== "all") {
          feedUrl += `&location=${effectiveLocation}`;
        }

        const feedResponse = await API.get(feedUrl);
        feedPosts = feedResponse?.data?.posts || [];

        if (slug) {
          try {
            const singleResponse = await API.get(`/post/get-post/${slug}`);
            const singlePost = singleResponse?.data?.post;
            if (singlePost) {
              const existingIndex = feedPosts.findIndex((p) => p._id === singlePost._id);
              if (existingIndex === -1) {
                feedPosts = [singlePost, ...feedPosts];
              }
              setTargetPostId(singlePost._id);
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

  // Touch/swipe navigation is handled entirely natively by CSS
  // scroll-snap on .feed-container (see Swipe.css) — no JS needed, and
  // nothing here calls preventDefault(), so normal in-card scrolling
  // (e.g. a tall card with a long description) is never blocked.

  // Desktop keyboard support (Up/Down).
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling.current) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex - 1 >= 0) goToIndex(currentIndex - 1, true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (currentIndex + 1 < combinedItems.length) goToIndex(currentIndex + 1, true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, combinedItems.length, goToIndex]);

  // Infinite scroll sentinel on the last item.
  const lastPostRef = useCallback(
    (node) => {
      if (loading || !hasMore || initializing) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading && !initializing && initialLoadDone.current) {
            fetchMorePosts();
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchMorePosts, initializing]
  );

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

  if (initializing && posts.length === 0) {
    return (
      <div className="feed-container loading-container">
        <div className="loader">
          <div className="spinner"></div>
          <p>लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!initializing && posts.length === 0) {
    return (
      <div className="feed-container empty-container">
        <div className="empty-state">
          <p>कोई पोस्ट नहीं मिली</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="feed-container" ref={containerRef}>
        {combinedItems.map((item, index) => {
          const isLast = index === combinedItems.length - 1;

          if (item.type === "ad") {
            return (
              <div
                key={`ad-${item.adId}`}
                ref={isLast ? lastPostRef : null}
                className="feed-card-wrapper"
                data-index={index}
                data-active={currentIndex === index}
              >
                <AdCard ad={item.data} />
              </div>
            );
          }

          const post = item.data;

          return (
            <NewsCard
              key={`${post._id}-${index}`}
              post={post}
              index={index}
              isActive={currentIndex === index}
              cardRef={isLast ? lastPostRef : null}
              onShare={handleShare}
            />
          );
        })}

        {loading && (
          <div className="loader-wrapper">
            <div className="spinner-small"></div>
            <p>लोड हो रहा है...</p>
          </div>
        )}
      </div>

      {/* Rendered once for the whole feed — not per card. */}
      <div className="feed-social-float">
        <a
          href="https://www.instagram.com/trendkari.in/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Trendkari on Instagram"
        >
          <FaInstagram />
        </a>
      </div>
    </>
  );
};

export default SwipeFeed;
