import { Helmet } from "react-helmet";

<Helmet>
  {/* Primary SEO */}
  <title>{post.title} | Trendkari</title>
  <meta name="description" content={post.excerpt} />

  {/* Canonical */}
  <link
    rel="canonical"
    href={`https://trendkari.in/${post.location}/article/${post.slug}`}
  />

  {/* Open Graph (WhatsApp / Facebook) */}
  <meta property="og:type" content="article" />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:image" content={post.image} />
  <meta
    property="og:url"
    content={`https://trendkari.in/${post.location}/article/${post.slug}`}
  />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.excerpt} />
  <meta name="twitter:image" content={post.image} />

  {/* Hindi language hint */}
  <meta httpEquiv="content-language" content="hi-IN" />

  {/* Google Discover */}
  <meta name="robots" content="max-image-preview:large" />
</Helmet>
    