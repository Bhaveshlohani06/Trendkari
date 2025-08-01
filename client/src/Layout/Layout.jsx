import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

// Capitalize component name
const Layout = ({ children, title = "My App", description = "", keywords = "", author = "" }) => {

     const today = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options); // Example: Thursday, Aug 1, 2025

    return (
        <>
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
                <meta name="author" content={author} />
                <title>{title}</title>
            </Helmet>


        <div className="bg-danger text-white text-center py-2 small fw-medium">
      📅 {formattedDate} -- 🚀 Trending Now: Meta AI announces Llama 3! | Elon teases X OS | Zomato hits 50M orders 🚨
    </div>

            <Header />

            <main style={{  }}>
                <Toaster />
                {children}
            </main>

            <Footer />
        </>
    );
};

export default Layout;
