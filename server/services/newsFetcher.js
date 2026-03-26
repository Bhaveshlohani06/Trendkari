// import Parser from "rss-parser";

// const parser = new Parser();

// export const fetchKotaNews = async () => {
//   const feed = await parser.parseURL(
//     "https://news.google.com/rss/search?q=Kota+Rajasthan&hl=hi&gl=IN&ceid=IN:hi"
//   );

//   return feed.items.map(item => ({
//     title: item.title,
//     link: item.link,
//     content: item.contentSnippet,
//     pubDate: item.pubDate
//   }));
// };



// import Parser from "rss-parser";

// const parser = new Parser({
//   timeout: 15000,
//   headers: {
//     'User-Agent': 'Mozilla/5.0 (compatible; Trendkari/1.0)'
//   }
// });

// // Define multiple news sources
// const NEWS_SOURCES = [
//   {
//     url: "https://news.google.com/rss/search?q=Kota+Rajasthan&hl=hi&gl=IN&ceid=IN:hi",
//     name: "Google News - Kota",
//     priority: 1
//   },
//   {
//     url: "https://www.patrika.com/rss/rajasthan/kota",
//     name: "Rajasthan Patrika - Kota",
//     priority: 2
//   },
//   {
//     url: "https://www.bhaskar.com/rss-v1--category-1740.xml",
//     name: "Dainik Bhaskar - Rajasthan",
//     priority: 2
//   },
//   {
//     url: "https://timesofindia.indiatimes.com/rssfeeds/4719153.cms",
//     name: "Times of India - Rajasthan",
//     priority: 2
//   }
// ];

// // Extract image from RSS item
// const extractImageFromItem = (item) => {
//   // Try enclosure
//   if (item.enclosure?.url) return item.enclosure.url;
  
//   // Try media:content
//   if (item['media:content']?.$?.url) return item['media:content'].$.url;
  
//   // Try content for img tag
//   const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
//   if (imgMatch) return imgMatch[1];
  
//   // Try description for img tag
//   const descMatch = item.description?.match(/<img[^>]+src="([^">]+)"/);
//   if (descMatch) return descMatch[1];
  
//   return null;
// };

// // Fetch from a single source
// const fetchFromSource = async (source) => {
//   try {
//     console.log(`📡 Fetching from ${source.name}...`);
//     const feed = await parser.parseURL(source.url);
    
//     if (!feed?.items || !Array.isArray(feed.items)) {
//       console.log(`⚠️ No items found in ${source.name}`);
//       return [];
//     }
    
//     return feed.items.map(item => ({
//       title: item.title || '',
//       link: item.link || '',
//       content: item.contentSnippet || item.description || item.content || '',
//       fullContent: item.content || item.description || '',
//       pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
//       source: source.name,
//       imageUrl: extractImageFromItem(item),
//       author: item.author || source.name
//     }));
    
//   } catch (error) {
//     console.error(`❌ Error fetching from ${source.name}:`, error.message);
//     return [];
//   }
// };

// // Fetch from all sources
// export const fetchKotaNews = async () => {
//   console.log(`🚀 Fetching from ${NEWS_SOURCES.length} sources...`);
  
//   // Fetch all sources in parallel
//   const results = await Promise.all(
//     NEWS_SOURCES.map(source => fetchFromSource(source))
//   );
  
//   // Combine all articles
//   let allArticles = results.flat();
  
//   // Remove duplicates by title and link
//   const uniqueArticles = [];
//   const seen = new Set();
  
//   for (const article of allArticles) {
//     const key = `${article.title.toLowerCase().trim()}|${article.link}`;
//     if (!seen.has(key)) {
//       seen.add(key);
//       uniqueArticles.push(article);
//     }
//   }
  
//   console.log(`✅ Fetched ${uniqueArticles.length} unique articles from ${NEWS_SOURCES.length} sources`);
  
//   // Sort by date (newest first)
//   uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
//   return uniqueArticles;
// };

// // Fetch from a specific source only
// export const fetchFromSpecificSource = async (sourceName) => {
//   const source = NEWS_SOURCES.find(s => s.name === sourceName);
//   if (!source) throw new Error(`Source ${sourceName} not found`);
//   return fetchFromSource(source);
// };







import Parser from "rss-parser";

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Trendkari/1.0)'
  }
});

// Define multiple news sources with categories
const NEWS_SOURCES = [
  {
    url: "https://news.google.com/rss/search?q=Kota+Rajasthan&hl=hi&gl=IN&ceid=IN:hi",
    name: "Google News - Kota",
    category: "local",
    priority: 1
  },
  {
    url: "https://news.google.com/rss/search?q=Rajasthan+education+exam+result&hl=hi&gl=IN&ceid=IN:hi",
    name: "Google News - Education",
    category: "education",
    priority: 1
  },
  {
    url: "https://www.patrika.com/rss/rajasthan/kota",
    name: "Rajasthan Patrika - Kota",
    category: "local",
    priority: 2
  },
  {
    url: "https://www.bhaskar.com/rss-v1--category-1740.xml",
    name: "Dainik Bhaskar - Rajasthan",
    category: "state",
    priority: 2
  },
  {
    url: "https://timesofindia.indiatimes.com/rssfeeds/4719153.cms",
    name: "Times of India - Rajasthan",
    category: "state",
    priority: 2
  }
];

// Enhanced image extraction function
// const extractImageFromItem = (item) => {
//   // Try different image sources in order
  
//   // 1. enclosure (common in RSS)
//   if (item.enclosure?.url) {
//     return item.enclosure.url;
//   }
  
//   // 2. media:content (common in Google News)
//   if (item['media:content']?.$?.url) {
//     return item['media:content'].$.url;
//   }
  
//   // 3. media:thumbnail
//   if (item['media:thumbnail']?.$?.url) {
//     return item['media:thumbnail'].$.url;
//   }
  
//   // 4. Extract from content (HTML img tag)
//   const contentImgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
//   if (contentImgMatch) {
//     return contentImgMatch[1];
//   }
  
//   // 5. Extract from description
//   const descImgMatch = item.description?.match(/<img[^>]+src="([^">]+)"/);
//   if (descImgMatch) {
//     return descImgMatch[1];
//   }
  
//   // 6. Check for any image in the item object
//   const possibleImageFields = ['image', 'thumbnail', 'thumb', 'img'];
//   for (const field of possibleImageFields) {
//     if (item[field] && typeof item[field] === 'string') {
//       return item[field];
//     }
//     if (item[field]?.url) {
//       return item[field].url;
//     }
//   }
  
//   return null;
// };


const extractImageFromItem = (item) => {
  // 1. enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }

  // 2. media content
  if (item["media:content"]?.$?.url) {
    return item["media:content"].$.url;
  }

  // 3. thumbnail
  if (item["media:thumbnail"]?.$?.url) {
    return item["media:thumbnail"].$.url;
  }

  // 4. content HTML
  const html = item.content || item.description || "";
  const match = html.match(/<img[^>]+src="([^">]+)"/);
  if (match && match[1].startsWith("http")) {
    return match[1];
  }

  return null;
};




// Category-specific default images
const getCategoryDefaultImage = (category) => {
  const defaultImages = {
    local: "https://ik.imagekit.io/trendkari/kota-local-news.jpg",
    education: "https://ik.imagekit.io/trendkari/kota-education-news.jpg",
    state: "https://ik.imagekit.io/trendkari/rajasthan-news.jpg",
    national: "https://ik.imagekit.io/trendkari/national-news.jpg",
    default: "https://ik.imagekit.io/trendkari/trendkari-news-default.jpg"
  };
  return defaultImages[category] || defaultImages.default;
};

// Fetch from a single source
const fetchFromSource = async (source) => {
  try {
    console.log(`📡 Fetching from ${source.name} (${source.category})...`);
    const feed = await parser.parseURL(source.url);
    
    if (!feed?.items || !Array.isArray(feed.items)) {
      console.log(`⚠️ No items found in ${source.name}`);
      return [];
    }
    
    return feed.items.map(item => {
      const extractedImage = extractImageFromItem(item);
      
      return {
        title: item.title || '',
        link: item.link || '',
        content: item.contentSnippet || item.description || item.content || '',
        fullContent: item.content || item.description || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        source: source.name,
        category: source.category,
        imageUrl: extractedImage || getCategoryDefaultImage(source.category),
        author: item.author || source.name
      };
    });
    
  } catch (error) {
    console.error(`❌ Error fetching from ${source.name}:`, error.message);
    return [];
  }
};

// Fetch all news
export const fetchKotaNews = async () => {
  console.log(`🚀 Fetching from ${NEWS_SOURCES.length} sources...`);
  
  const results = await Promise.all(
    NEWS_SOURCES.map(source => fetchFromSource(source))
  );
  
  let allArticles = results.flat();
  
  // Remove duplicates by title and link
  const uniqueArticles = [];
  const seen = new Set();
  
  for (const article of allArticles) {
    const key = `${article.title.toLowerCase().trim()}|${article.link}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueArticles.push(article);
    }
  }
  
  console.log(`✅ Fetched ${uniqueArticles.length} unique articles`);
  
  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  return uniqueArticles;
};

// Fetch news by specific category
export const fetchNewsByCategory = async (category) => {
  const allNews = await fetchKotaNews();
  const filteredNews = allNews.filter(news => news.category === category);
  console.log(`📂 Category "${category}": ${filteredNews.length} articles`);
  return filteredNews;
};

// Fetch only news with images
export const fetchNewsWithImages = async () => {
  const allNews = await fetchKotaNews();
  const newsWithImages = allNews.filter(news => news.imageUrl);
  console.log(`🖼️ News with images: ${newsWithImages.length}/${allNews.length}`);
  return newsWithImages;
};