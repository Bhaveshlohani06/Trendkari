// services/marketService.js
// import axios from "axios";
// import CropPrice from "../models/Cropmodel.js";

// export const fetchMandiRates = async (mandi) => {
//   try {
//     const url = `https://api.khetiwadi.com/mandi/${mandi.khetiwadi_id}`;
//     const res = await axios.get(url);
//     const data = res.data;

//     for (const crop of data.crops) {
//       await CropPrice.findOneAndUpdate(
//         { mandi: mandi._id, crop_name: crop.name },
//         { price_per_kg: crop.price, date: new Date() },
//         { upsert: true, new: true }
//       );
//     }
//     console.log(`✅ Rates updated for ${mandi.name}`);
//   } catch (err) {
//     console.error("Error fetching rates:", err.message);
//   }
// };



// services/marketService.js
// import axios from "axios";
// import * as cheerio from "cheerio"; 
// import CropPrice from "../models/Cropmodel.js";

// export const fetchMandiRates = async (mandi) => {
//   try {
//     const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;

//     console.log("🌐 Fetching:", url);

//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const rows = $("table tr"); // 👈 main table

//     const crops = [];

//     rows.each((index, row) => {
//       const cols = $(row).find("td");

//       if (cols.length === 3) {
//         const crop_name = $(cols[0]).text().trim();
//         const min = $(cols[1]).text().replace("₹", "").trim();
//         const max = $(cols[2]).text().replace("₹", "").trim();

//         if (crop_name && min && max) {
//           crops.push({
//             crop_name,
//             price_per_kg: Number(max) / 100, // since data is per 100kg
//           });
//         }
//       }
//     });

//     console.log("🌾 Extracted crops:", crops.length);

//     // Save to DB
//     for (const crop of crops) {
//       await CropPrice.findOneAndUpdate(
//         { mandi: mandi._id, crop_name: crop.crop_name },
//         {
//           price_per_kg: crop.price_per_kg,
//           date: new Date(),
//         },
//         { upsert: true, new: true }
//       );
//     }

//     console.log(`✅ Rates updated for ${mandi.name}`);
//   } catch (err) {
//     console.error("❌ Scraping error:", err.message);
//   }
// };


// import axios from "axios";
// import { load } from "cheerio";
// import CropPrice from "../models/Cropmodel.js";

// export const fetchMandiRates = async (mandi) => {
//   try {
//     const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;

//     console.log("🌐 Fetching:", url);

//     const { data } = await axios.get(url);
//     const $ = load(data);

//     const crops = [];

//     $("table tbody tr").each((i, row) => {
//       const cols = $(row).find("td");

//       if (cols.length >= 3) {
//         const crop_name = $(cols[0]).text().trim();
//         const max = $(cols[2]).text().replace(/[₹,]/g, "").trim();

//         if (crop_name && max) {
//           crops.push({
//             crop_name,
//             price_per_kg: Number(max) / 100,
//           });
//         }
//       }
//     });

//     console.log("🌾 Extracted crops:", crops.length);

//     for (const crop of crops) {
//       await CropPrice.findOneAndUpdate(
//         { mandi: mandi._id, crop_name: crop.crop_name },
//         { price_per_kg: crop.price_per_kg, date: new Date() },
//         { upsert: true }
//       );
//     }

//     console.log(`✅ Rates updated for ${mandi.name}`);

//   } catch (err) {
//     console.error("❌ Scraping error:", err.message);
//   }
// };











// import puppeteer from "puppeteer";
// import CropPrice from "../models/Cropmodel.js";

// let browser;

// export const initBrowser = async () => {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     console.log("🚀 Puppeteer browser started");
//   }
//   return browser;
// };

// export const fetchMandiRates = async (mandi) => {
//   try {
//     if (!mandi?.khetiwadi_id) {
//       console.log(`❌ Invalid mandi: ${mandi?.name}`);
//       return;
//     }

//     const browser = await initBrowser();
//     const page = await browser.newPage();

//     const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;
//     console.log("🌐 Fetching:", url);

//     await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

//     // 🔥 Wait for ANY content (not strict selector)
//     await page.waitForSelector("body");

//     const crops = await page.evaluate(() => {
//       const data = [];

//       // Get ALL rows (not assuming table structure)
//       const rows = document.querySelectorAll("tr");

//       rows.forEach((row) => {
//         const text = row.innerText;

//         // Example row: "चना ₹5000 ₹5300"
//         if (text.includes("₹")) {
//           const parts = text.split("\n").map(t => t.trim()).filter(Boolean);

//           if (parts.length >= 3) {
//             const crop_name = parts[0];
//             const max = parts[2].replace(/[₹,]/g, "");

//             if (!isNaN(max)) {
//               data.push({
//                 crop_name,
//                 price_per_kg: Number(max) / 100,
//               });
//             }
//           }
//         }
//       });

//       return data;
//     });

//     console.log(`🌾 Extracted crops: ${crops.length}`);

//     if (crops.length === 0) {
//       console.log("⚠️ No crops found — structure may have changed");
//       await page.close();
//       return;
//     }

//     // ✅ Save to DB
//     for (const crop of crops) {
//       await CropPrice.findOneAndUpdate(
//         { mandi: mandi._id, crop_name: crop.crop_name },
//         {
//           price_per_kg: crop.price_per_kg,
//           date: new Date(),
//         },
//         { upsert: true, new: true }
//       );
//     }

//     console.log(`✅ Rates updated for ${mandi.name}`);

//     await page.close();

//   } catch (err) {
//     console.error(`❌ Error for ${mandi.name}:`, err.message);
//   }
// };




// import puppeteer from "puppeteer";
// import CropPrice from "../models/Cropmodel.js";

// let browser;

// export const initBrowser = async () => {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//   }
//   return browser;
// };

// export const fetchMandiRates = async (mandi) => {
//   const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;

//   const browser = await initBrowser();
//   const page = await browser.newPage();

//   try {
//     console.log("🌐 Fetching:", url);

//     let apiData = null;

//     // 🎯 Intercept network responses
//     page.on("response", async (response) => {
//       const reqUrl = response.url();

//       // 🔥 Look for API calls (IMPORTANT)
//       if (reqUrl.includes("wp-json") || reqUrl.includes("ajax")) {
//         try {
//           const data = await response.json();
//           apiData = data;
//         } catch (e) {}
//       }
//     });

//     await page.goto(url, { waitUntil: "networkidle2" });

//    // await page.waitForTimeout(5000); // give time for API calls

//     if (!apiData) {
//       console.log("❌ No API data captured");
//       await page.close();
//       return;
//     }

//     console.log("✅ API data received");

//     // 🔥 You must inspect structure here
//     console.log(JSON.stringify(apiData).slice(0, 500));

//     // Example parsing (adjust after seeing structure)
//     const crops = [];

//     if (apiData?.data) {
//       for (const item of apiData.data) {
//         crops.push({
//           crop_name: item.crop_name,
//           price_per_kg: Number(item.price) / 100,
//         });
//       }
//     }

//     console.log("🌾 Extracted crops:", crops.length);

//     for (const crop of crops) {
//       await CropPrice.findOneAndUpdate(
//         { mandi: mandi._id, crop_name: crop.crop_name },
//         {
//           price_per_kg: crop.price_per_kg,
//           date: new Date(),
//         },
//         { upsert: true }
//       );
//     }

//     console.log(`✅ Rates updated for ${mandi.name}`);

//     await page.close();

//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     await page.close();
//   }
// };



// services/khetiwadiScraper.js
// import puppeteer from "puppeteer";
// import CropPrice from "../models/Cropmodel.js";
// import Mandi from "../models/Mandimodel.js";

// let browser;
// let browserInstance = null;

// // Initialize browser with retry logic
// export const initBrowser = async (retries = 3) => {
//   if (browserInstance && browserInstance.isConnected()) {
//     return browserInstance;
//   }

//   for (let i = 0; i < retries; i++) {
//     try {
//       browserInstance = await puppeteer.launch({
//         headless: "new",
//         args: [
//           "--no-sandbox",
//           "--disable-setuid-sandbox",
//           "--disable-dev-shm-usage",
//           "--disable-accelerated-2d-canvas",
//           "--disable-gpu",
//           "--window-size=1920,1080"
//         ],
//         timeout: 30000
//       });
//       console.log("✅ Browser launched successfully");
//       return browserInstance;
//     } catch (error) {
//       console.log(`⚠️ Browser launch attempt ${i + 1} failed:`, error.message);
//       if (i === retries - 1) throw error;
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     }
//   }
// };

// // Extract prices from HTML (fallback method)
// const extractPricesFromHTML = async (page, mandiName) => {
//   console.log("📄 Extracting prices from HTML...");
  
//   const crops = await page.evaluate(() => {
//     const results = [];
    
//     // Method 1: Look for crop tables
//     const tables = document.querySelectorAll('table');
//     tables.forEach(table => {
//       const rows = table.querySelectorAll('tr');
//       rows.forEach(row => {
//         const cells = row.querySelectorAll('td');
//         if (cells.length >= 2) {
//           const cropName = cells[0]?.innerText?.trim();
//           const priceText = cells[1]?.innerText?.trim();
          
//           if (cropName && priceText && priceText.match(/[\d,]+/)) {
//             const prices = priceText.match(/[\d,]+/g);
//             if (prices) {
//               const priceValues = prices.map(p => parseInt(p.replace(/,/g, '')));
//               results.push({
//                 crop_name: cropName,
//                 price_min: priceValues[0],
//                 price_max: priceValues[priceValues.length - 1],
//                 price_avg: priceValues.length === 1 ? priceValues[0] : 
//                           (priceValues[0] + priceValues[priceValues.length - 1]) / 2
//               });
//             }
//           }
//         }
//       });
//     });
    
//     // Method 2: Look for crop cards/items
//     const cropItems = document.querySelectorAll('.crop-item, .mandi-crop, .price-item');
//     cropItems.forEach(item => {
//       const cropName = item.querySelector('.crop-name, .title')?.innerText?.trim();
//       const priceElem = item.querySelector('.price, .rate, .amount');
//       const priceText = priceElem?.innerText?.trim();
      
//       if (cropName && priceText && priceText.match(/[\d,]+/)) {
//         const prices = priceText.match(/[\d,]+/g);
//         if (prices) {
//           const priceValues = prices.map(p => parseInt(p.replace(/,/g, '')));
//           results.push({
//             crop_name: cropName,
//             price_min: priceValues[0],
//             price_max: priceValues[priceValues.length - 1],
//             price_avg: priceValues.length === 1 ? priceValues[0] : 
//                       (priceValues[0] + priceValues[priceValues.length - 1]) / 2
//           });
//         }
//       }
//     });
    
//     // Method 3: Look for specific Mandi patterns (Ramganj Mandi)
//     const mandiContent = document.querySelector('.mandi-content, .market-report, .price-list');
//     if (mandiContent) {
//       const text = mandiContent.innerText;
//       const cropMatches = text.match(/([^।\n]+?)\s*[:\-]\s*([\d,]+)\s*[-–]\s*([\d,]+)/g);
//       if (cropMatches) {
//         cropMatches.forEach(match => {
//           const [cropName, price1, price2] = match.split(/[:\-]/);
//           if (cropName && price1) {
//             results.push({
//               crop_name: cropName.trim(),
//               price_min: parseInt(price1.replace(/,/g, '')),
//               price_max: price2 ? parseInt(price2.replace(/,/g, '')) : parseInt(price1.replace(/,/g, '')),
//               price_avg: price2 ? (parseInt(price1.replace(/,/g, '')) + parseInt(price2.replace(/,/g, ''))) / 2 : parseInt(price1.replace(/,/g, ''))
//             });
//           }
//         });
//       }
//     }
    
//     return results;
//   });
  
//   // Remove duplicates by crop name
//   const uniqueCrops = [];
//   const seen = new Set();
//   for (const crop of crops) {
//     if (!seen.has(crop.crop_name.toLowerCase())) {
//       seen.add(crop.crop_name.toLowerCase());
//       uniqueCrops.push(crop);
//     }
//   }
  
//   return uniqueCrops;
// };

// // Try to capture API responses
// const captureAPIResponse = async (page, timeout = 10000) => {
//   return new Promise((resolve) => {
//     let apiData = null;
//     let timeoutId;
    
//     const responseHandler = async (response) => {
//       const url = response.url();
//       if (url.includes('wp-json') || url.includes('api') || url.includes('ajax')) {
//         try {
//           const data = await response.json();
//           if (data && (data.data || data.crops || data.prices)) {
//             apiData = data;
//             cleanup();
//             resolve(apiData);
//           }
//         } catch (e) {}
//       }
//     };
    
//     const cleanup = () => {
//       page.off('response', responseHandler);
//       if (timeoutId) clearTimeout(timeoutId);
//     };
    
//     timeoutId = setTimeout(() => {
//       cleanup();
//       resolve(null);
//     }, timeout);
    
//     page.on('response', responseHandler);
//   });
// };

// // Main scraper function
// export const fetchMandiRates = async (mandi) => {
//   const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;
//   let page = null;
  
//   try {
//     console.log(`\n${'='.repeat(60)}`);
//     console.log(`🌾 Fetching: ${mandi.name}`);
//     console.log(`🔗 URL: ${url}`);
//     console.log(`${'='.repeat(60)}`);
    
//     const browser = await initBrowser();
//     page = await browser.newPage();
    
//     // Set timeout
//     await page.setDefaultTimeout(30000);
    
//     // Set user agent
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
//     let crops = [];
    
//     // Try to capture API response first
//     console.log("🔍 Listening for API calls...");
//     const apiData = await captureAPIResponse(page, 8000);
    
//     // Navigate to page
//     await page.goto(url, { 
//       waitUntil: 'networkidle2',
//       timeout: 30000 
//     });
    
//     // Wait for content to load
//     await page.waitForSelector('body', { timeout: 10000 });
//     await page.waitForTimeout(3000); // Additional wait for dynamic content
    
//     // If API data captured, parse it
//     if (apiData) {
//       console.log("✅ API data captured successfully");
//       console.log(`📊 API structure: ${Object.keys(apiData).join(', ')}`);
      
//       // Parse API response based on structure
//       const dataSource = apiData.data || apiData.crops || apiData.prices || apiData;
      
//       if (Array.isArray(dataSource)) {
//         crops = dataSource.map(item => ({
//           crop_name: item.crop_name || item.name || item.title,
//           price_min: item.price_min || item.min_price || item.price,
//           price_max: item.price_max || item.max_price || item.price,
//           price_avg: item.price_avg || item.avg_price || item.price,
//           quality: item.quality || item.grade
//         }));
//       } else if (dataSource && typeof dataSource === 'object') {
//         for (const [key, value] of Object.entries(dataSource)) {
//           if (value && typeof value === 'object' && (value.price || value.rate)) {
//             crops.push({
//               crop_name: key,
//               price_min: value.price_min || value.min || value.price,
//               price_max: value.price_max || value.max || value.price,
//               price_avg: value.price_avg || value.avg || value.price
//             });
//           }
//         }
//       }
//     }
    
//     // If no API data or no crops extracted, try HTML extraction
//     if (crops.length === 0) {
//       console.log("⚠️ No API data, falling back to HTML extraction...");
//       crops = await extractPricesFromHTML(page, mandi.name);
//     }
    
//     // Validate extracted crops
//     const validCrops = crops.filter(crop => 
//       crop.crop_name && 
//       crop.crop_name.length > 2 &&
//       (crop.price_avg || crop.price_min || crop.price_max)
//     );
    
//     console.log(`🌾 Extracted ${validCrops.length} valid crops`);
    
//     if (validCrops.length === 0) {
//       console.log("❌ No crops extracted. Saving page HTML for debugging...");
//       const html = await page.content();
//       console.log(`📄 HTML length: ${html.length} chars`);
//       console.log(`📄 First 500 chars: ${html.substring(0, 500)}`);
//       await page.close();
//       return { success: false, cropsCount: 0, error: "No crops extracted" };
//     }
    
//     // Display sample of extracted crops
//     console.log("\n📋 Sample of extracted crops:");
//     validCrops.slice(0, 5).forEach(crop => {
//       console.log(`   - ${crop.crop_name}: ₹${crop.price_avg || crop.price_min || 'N/A'}/quintal`);
//     });
    
//     // Save to database
//     let savedCount = 0;
//     let updateCount = 0;
    
//     for (const crop of validCrops) {
//       try {
//         const priceAvg = crop.price_avg || crop.price_min || (crop.price_min && crop.price_max ? (crop.price_min + crop.price_max) / 2 : null);
        
//         if (!priceAvg) {
//           console.log(`⚠️ Skipping ${crop.crop_name}: No valid price`);
//           continue;
//         }
        
//         // Get yesterday's price for trend
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);
//         yesterday.setHours(0, 0, 0, 0);
        
//         const yesterdayPrice = await CropPrice.findOne({
//           mandi: mandi._id,
//           crop_name: crop.crop_name,
//           date: { $gte: yesterday }
//         }).sort({ date: -1 });
        
//         // Calculate trend
//         let trend = "stable";
//         if (yesterdayPrice && yesterdayPrice.price_avg) {
//           const percentChange = ((priceAvg - yesterdayPrice.price_avg) / yesterdayPrice.price_avg) * 100;
//           if (percentChange > 2) trend = "up";
//           else if (percentChange < -2) trend = "down";
//         }
        
//         const result = await CropPrice.findOneAndUpdate(
//           {
//             mandi: mandi._id,
//             crop_name: crop.crop_name,
//             date: { $gte: new Date().setHours(0, 0, 0, 0) }
//           },
//           {
//             mandi: mandi._id,
//             crop_name: crop.crop_name,
//             price_min: crop.price_min,
//             price_max: crop.price_max,
//             price_avg: priceAvg,
//             price_yesterday: yesterdayPrice?.price_avg,
//             trend,
//             unit: "quintal",
//             quality: crop.quality,
//             date: new Date()
//           },
//           { upsert: true, new: true }
//         );
        
//         if (result.isNew) savedCount++;
//         else updateCount++;
        
//       } catch (dbError) {
//         console.error(`❌ DB error for ${crop.crop_name}:`, dbError.message);
//       }
//     }
    
//     // Update mandi lastUpdated timestamp
//     await Mandi.findByIdAndUpdate(mandi._id, { 
//       lastUpdated: new Date(),
//       lastFetchStatus: "success"
//     });
    
//     console.log(`\n📊 Summary for ${mandi.name}:`);
//     console.log(`   ✅ New crops saved: ${savedCount}`);
//     console.log(`   🔄 Existing crops updated: ${updateCount}`);
//     console.log(`   🌾 Total processed: ${validCrops.length}`);
    
//     await page.close();
//     return { success: true, savedCount, updateCount, totalCrops: validCrops.length };
    
//   } catch (error) {
//     console.error(`❌ Error fetching ${mandi.name}:`, error.message);
    
//     if (page) {
//       try {
//         // Save error screenshot for debugging
//         await page.screenshot({ path: `error-${mandi.name}-${Date.now()}.png` });
//         console.log("📸 Error screenshot saved");
//       } catch (e) {}
//       await page.close();
//     }
    
//     // Update mandi with error status
//     await Mandi.findByIdAndUpdate(mandi._id, { 
//       lastFetchStatus: "error",
//       lastError: error.message
//     }).catch(e => console.error("Failed to update mandi status:", e.message));
    
//     return { success: false, error: error.message };
//   }
// };

// // Cleanup browser on process exit
// export const closeBrowser = async () => {
//   if (browserInstance && browserInstance.isConnected()) {
//     await browserInstance.close();
//     browserInstance = null;
//     console.log("🔒 Browser closed");
//   }
// };

// // Handle process termination
// process.on('SIGINT', async () => {
//   await closeBrowser();
//   process.exit();
// });

// process.on('SIGTERM', async () => {
//   await closeBrowser();
//   process.exit();
// });









// services/khetiwadiScraper.js
import puppeteer from "puppeteer";
import CropPrice from "../models/Cropmodel.js";
import Mandi from "../models/Mandimodel.js";

let browserInstance = null;

// Initialize browser with retry logic
export const initBrowser = async (retries = 3) => {
  if (browserInstance && browserInstance.isConnected()) {
    return browserInstance;
  }

  for (let i = 0; i < retries; i++) {
    try {
      browserInstance = await puppeteer.launch({
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
          "--window-size=1920,1080"
        ],
        timeout: 30000
      });
      console.log("✅ Browser launched successfully");
      return browserInstance;
    } catch (error) {
      console.log(`⚠️ Browser launch attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Wait helper (replaces page.waitForTimeout)
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Extract prices from HTML
const extractPricesFromHTML = async (page, mandiName) => {
  console.log("📄 Extracting prices from HTML...");
  
  const crops = await page.evaluate(() => {
    const results = [];
    
    // Look for price tables
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const cropName = cells[0]?.innerText?.trim();
          const priceText = cells[1]?.innerText?.trim();
          
          if (cropName && priceText && priceText.match(/[\d,]+/)) {
            const prices = priceText.match(/[\d,]+/g);
            if (prices) {
              const priceValues = prices.map(p => parseInt(p.replace(/,/g, '')));
              results.push({
                crop_name: cropName,
                price_min: priceValues[0],
                price_max: priceValues[priceValues.length - 1],
                price_avg: priceValues.length === 1 ? priceValues[0] : 
                          Math.round((priceValues[0] + priceValues[priceValues.length - 1]) / 2)
              });
            }
          }
        }
      });
    });
    
    // Look for crop items
    const cropItems = document.querySelectorAll('.crop-item, .mandi-crop, .price-item, .market-crop');
    cropItems.forEach(item => {
      const cropName = item.querySelector('.crop-name, .title, .crop-title')?.innerText?.trim();
      const priceElem = item.querySelector('.price, .rate, .amount, .current-price');
      const priceText = priceElem?.innerText?.trim();
      
      if (cropName && priceText && priceText.match(/[\d,]+/)) {
        const prices = priceText.match(/[\d,]+/g);
        if (prices) {
          const priceValues = prices.map(p => parseInt(p.replace(/,/g, '')));
          results.push({
            crop_name: cropName,
            price_min: priceValues[0],
            price_max: priceValues[priceValues.length - 1],
            price_avg: priceValues.length === 1 ? priceValues[0] : 
                      Math.round((priceValues[0] + priceValues[priceValues.length - 1]) / 2)
          });
        }
      }
    });
    
    return results;
  });
  
  // Remove duplicates
  const uniqueCrops = [];
  const seen = new Set();
  for (const crop of crops) {
    const key = crop.crop_name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCrops.push(crop);
    }
  }
  
  return uniqueCrops;
};

// Try to capture API responses
const captureAPIResponse = async (page, timeoutMs = 8000) => {
  return new Promise((resolve) => {
    let apiData = null;
    let timeoutId;
    
    const responseHandler = async (response) => {
      const url = response.url();
      if (url.includes('wp-json') || url.includes('api') || url.includes('ajax') || url.includes('graphql')) {
        try {
          const data = await response.json();
          if (data && (data.data || data.crops || data.prices || Array.isArray(data))) {
            apiData = data;
            cleanup();
            resolve(apiData);
          }
        } catch (e) {
          // Not JSON or parse error
        }
      }
    };
    
    const cleanup = () => {
      page.off('response', responseHandler);
      if (timeoutId) clearTimeout(timeoutId);
    };
    
    timeoutId = setTimeout(() => {
      cleanup();
      resolve(null);
    }, timeoutMs);
    
    page.on('response', responseHandler);
  });
};

// Main scraper function
export const fetchMandiRates = async (mandi) => {
  const url = `https://khetiwadi.com/mandi/${mandi.khetiwadi_id}-mandi-bhav`;
  let page = null;
  
  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌾 Fetching: ${mandi.name}`);
    console.log(`🔗 URL: ${url}`);
    console.log(`${'='.repeat(60)}`);
    
    const browser = await initBrowser();
    page = await browser.newPage();
    
    // Set timeout
    await page.setDefaultTimeout(30000);
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    let crops = [];
    
    // Try to capture API response first
    console.log("🔍 Listening for API calls...");
    const apiDataPromise = captureAPIResponse(page, 8000);
    
    // Navigate to page
    console.log("📡 Navigating to page...");
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for content using correct method (setTimeout instead of waitForTimeout)
    console.log("⏳ Waiting for content to load...");
    await wait(5000); // 5 second wait
    
    // Check if API data was captured
    const apiData = await apiDataPromise;
    
    // If API data captured, parse it
    if (apiData) {
      console.log("✅ API data captured successfully");
      
      // Try to extract crops from API response
      let dataSource = apiData;
      if (apiData.data) dataSource = apiData.data;
      if (apiData.crops) dataSource = apiData.crops;
      if (apiData.prices) dataSource = apiData.prices;
      
      if (Array.isArray(dataSource)) {
        crops = dataSource.map(item => ({
          crop_name: item.crop_name || item.name || item.title,
          price_min: item.price_min || item.min_price || item.price,
          price_max: item.price_max || item.max_price || item.price,
          price_avg: item.price_avg || item.avg_price || item.price,
          quality: item.quality || item.grade
        })).filter(c => c.crop_name && (c.price_avg || c.price_min));
      } else if (dataSource && typeof dataSource === 'object') {
        for (const [key, value] of Object.entries(dataSource)) {
          if (value && typeof value === 'object' && (value.price || value.rate)) {
            crops.push({
              crop_name: key,
              price_min: value.price_min || value.min || value.price,
              price_max: value.price_max || value.max || value.price,
              price_avg: value.price_avg || value.avg || value.price
            });
          }
        }
      }
    }
    
    // If no API data or no crops, try HTML extraction
    if (crops.length === 0) {
      console.log("⚠️ No API data, falling back to HTML extraction...");
      crops = await extractPricesFromHTML(page, mandi.name);
    }
    
    // Filter valid crops
    const validCrops = crops.filter(crop => 
      crop.crop_name && 
      crop.crop_name.length > 2 &&
      (crop.price_avg || crop.price_min)
    );
    
    console.log(`🌾 Extracted ${validCrops.length} valid crops`);
    
    if (validCrops.length === 0) {
      console.log("❌ No crops extracted. Saving page HTML for debugging...");
      const html = await page.content();
      console.log(`📄 HTML length: ${html.length} chars`);
      if (html.length > 100) {
        console.log(`📄 First 500 chars: ${html.substring(0, 500)}`);
      }
      await page.close();
      return { success: false, cropsCount: 0, error: "No crops extracted" };
    }
    
    // Display sample
    console.log("\n📋 Sample of extracted crops:");
    validCrops.slice(0, 5).forEach(crop => {
      const price = crop.price_avg || crop.price_min || 'N/A';
      console.log(`   - ${crop.crop_name}: ₹${price}/quintal`);
    });
    
    // Save to database
    let savedCount = 0;
    let updateCount = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const crop of validCrops) {
      try {
        const priceAvg = crop.price_avg || crop.price_min;
        
        if (!priceAvg || isNaN(priceAvg)) {
          console.log(`⚠️ Skipping ${crop.crop_name}: Invalid price`);
          continue;
        }
        
        // Get yesterday's price
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const yesterdayPrice = await CropPrice.findOne({
          mandi: mandi._id,
          crop_name: crop.crop_name,
          date: { $gte: yesterday }
        }).sort({ date: -1 });
        
        // Calculate trend
        let trend = "stable";
        if (yesterdayPrice && yesterdayPrice.price_avg) {
          const percentChange = ((priceAvg - yesterdayPrice.price_avg) / yesterdayPrice.price_avg) * 100;
          if (percentChange > 2) trend = "up";
          else if (percentChange < -2) trend = "down";
        }
        
        const result = await CropPrice.findOneAndUpdate(
          {
            mandi: mandi._id,
            crop_name: crop.crop_name,
            date: { $gte: today }
          },
          {
            mandi: mandi._id,
            crop_name: crop.crop_name,
            price_min: crop.price_min,
            price_max: crop.price_max,
            price_avg: priceAvg,
            price_yesterday: yesterdayPrice?.price_avg,
            trend,
            unit: "quintal",
            quality: crop.quality,
            date: new Date()
          },
          { upsert: true, new: true }
        );
        
        if (result.isNew) savedCount++;
        else updateCount++;
        
      } catch (dbError) {
        console.error(`❌ DB error for ${crop.crop_name}:`, dbError.message);
      }
    }
    
    // Update mandi
    await Mandi.findByIdAndUpdate(mandi._id, { 
      lastUpdated: new Date(),
      lastFetchStatus: "success"
    });
    
    console.log(`\n📊 Summary for ${mandi.name}:`);
    console.log(`   ✅ New: ${savedCount} | 🔄 Updated: ${updateCount} | 🌾 Total: ${validCrops.length}`);
    
    await page.close();
    return { success: true, savedCount, updateCount, totalCrops: validCrops.length };
    
  } catch (error) {
    console.error(`❌ Error fetching ${mandi.name}:`, error.message);
    
    if (page) {
      try {
        const screenshotPath = `error-${mandi.name}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`📸 Error screenshot saved: ${screenshotPath}`);
      } catch (e) {
        console.log("⚠️ Could not save screenshot:", e.message);
      }
      await page.close();
    }
    
    await Mandi.findByIdAndUpdate(mandi._id, { 
      lastFetchStatus: "error",
      lastError: error.message
    }).catch(e => console.error("Failed to update mandi status:", e.message));
    
    return { success: false, error: error.message };
  }
};

// Cleanup
export const closeBrowser = async () => {
  if (browserInstance && browserInstance.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
    console.log("🔒 Browser closed");
  }
};

// Handle cleanup on exit
process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit();
});
process.on('SIGTERM', async () => {
  await closeBrowser();
  process.exit();
});