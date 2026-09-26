// import React from "react";
// import Layout from "../Layout/Layout";
// import { Container, Card, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const Market = () => {
//   const navigate = useNavigate();

//   return (
//     <Layout>
//       <Container className="py-5 text-center" style={{ maxWidth: "600px" }}>
        
//         <Card className="shadow-lg border-0 p-4 rounded-4">
//           <div style={{ fontSize: "60px" }}>🛒</div>

//           <h2 className="mt-3 fw-bold">Market</h2>

//           <p className="text-muted mt-2">
//             We’re working on bringing you real-time mandi prices, local deals,
//             and marketplace features.
//           </p>

//           <h5 className="mt-3 text-warning">🚧 Coming Soon</h5>

//           <Button
//             variant="outline-primary"
//             className="mt-4"
//             onClick={() => navigate("/")}
//           >
//             Go Back Home
//           </Button>
//         </Card>

//       </Container>
//     </Layout>
//   );
// };

// export default Market;


import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Layout from "../Layout/Layout";
import { Container, Form, InputGroup, Spinner } from "react-bootstrap";
import "../../css/Market.css";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

// Leave empty if the frontend and API share an origin (e.g. CRA "proxy" field
// in package.json, or same Express app). Otherwise set your API host here.
const API_BASE = "";

// Matches your Mandi documents' khetiwadi_id field.
const MANDIS = [
  { key: "ramganj", label: "Ramganj Mandi" },
  { key: "kota", label: "Kota Mandi" },
  { key: "jaipur", label: "Jaipur Mandi" },
];

const buildPricesUrl = (khetiwadiId) =>
  `${API_BASE}/api/market/${encodeURIComponent(khetiwadiId)}`;

// ---------------------------------------------------------------------------
// Helpers — clean up the scraped crop_name shape:
// "चना\nBrown gram\nचार्ट देखें\n→"
// ---------------------------------------------------------------------------

function parseCropName(raw = "") {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/देखें|view chart|^→$|^-+$/i.test(l));
  return {
    primary: lines[0] || raw || "Unknown crop",
    secondary: lines[1] || "",
  };
}

function normalizeCrop(raw) {
  const { primary, secondary } = parseCropName(raw.crop_name);
  return {
    id: `${raw.crop_name}-${raw.date}`,
    nameHi: primary,
    nameEn: secondary,
    priceMin: raw.price_min ?? null,
    priceMax: raw.price_max ?? null,
    priceAvg: raw.price_avg ?? null,
    trend: raw.trend || "stable",
    unit: raw.unit || "quintal",
    date: raw.date || null,
  };
}

function formatUpdated(dateStr) {
  if (!dateStr) return "Not updated yet";
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return "Not updated yet";
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return "Updated just now";
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `Updated ${diffHr} hr ago`;
  const diffDay = Math.round(diffHr / 24);
  return `Updated ${diffDay}d ago`;
}

function trendMeta(trend) {
  if (trend === "up") return { symbol: "▲", word: "Up", cls: "trend-up" };
  if (trend === "down") return { symbol: "▼", word: "Down", cls: "trend-down" };
  return { symbol: "●", word: "Steady", cls: "trend-stable" };
}

// ---------------------------------------------------------------------------

const Market = () => {
  const [activeMandi, setActiveMandi] = useState(MANDIS[0].key);
  const [crops, setCrops] = useState([]);
  const [lastFetched, setLastFetched] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error | empty
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name | price | trend

  const load = useCallback(async (khetiwadiId) => {
    setStatus("loading");
    try {
      const res = await axios.get(buildPricesUrl(khetiwadiId));
      const list = res.data?.crops || [];
      const normalized = list.map(normalizeCrop);

      setCrops(normalized);
      const newest =
        res.data?.mandi?.lastUpdated ||
        normalized.reduce(
          (latest, c) =>
            c.date && (!latest || new Date(c.date) > new Date(latest))
              ? c.date
              : latest,
          null
        );
      setLastFetched(newest);
      setStatus(normalized.length ? "ready" : "empty");
    } catch (err) {
      console.error("Failed to load mandi prices:", err.message);
      setCrops([]);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load(activeMandi);
  }, [activeMandi, load]);

  const visibleCrops = useMemo(() => {
    let list = crops;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.nameHi.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q)
      );
    }
    const sorted = [...list].sort((a, b) => {
      if (sortBy === "price") return (b.priceAvg || 0) - (a.priceAvg || 0);
      if (sortBy === "trend") return a.trend.localeCompare(b.trend);
      return a.nameHi.localeCompare(b.nameHi, "hi");
    });
    return sorted;
  }, [crops, search, sortBy]);

  const activeMandiLabel = MANDIS.find((m) => m.key === activeMandi)?.label;

  return (
    <Layout>
      <div className="mandi-page">
        <Container className="mandi-shell">
          {/* Masthead */}
          <header className="mandi-masthead">
            <div>
              <h1 className="mandi-title">
                मंडी भाव <span className="mandi-title-en">Mandi Bhav</span>
              </h1>
              <p className="mandi-subtitle">
                Today's crop rates from {activeMandiLabel}, pulled straight
                from the mandi.
              </p>
            </div>
            <div className="mandi-updated">{formatUpdated(lastFetched)}</div>
          </header>

          {/* Mandi selector */}
          <nav className="mandi-tabs" aria-label="Choose mandi">
            {MANDIS.map((m) => (
              <button
                key={m.key}
                type="button"
                className={
                  "mandi-tab" + (activeMandi === m.key ? " is-active" : "")
                }
                onClick={() => setActiveMandi(m.key)}
                aria-pressed={activeMandi === m.key}
              >
                {m.label}
              </button>
            ))}
          </nav>

          {/* Controls */}
          <div className="mandi-controls">
            <InputGroup className="mandi-search">
              <InputGroup.Text className="mandi-search-icon">
                ⌕
              </InputGroup.Text>
              <Form.Control
                placeholder="Search a crop — गेहूं, चना, सरसों…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search crop"
              />
            </InputGroup>
            <Form.Select
              className="mandi-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort crops"
            >
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price (high to low)</option>
              <option value="trend">Sort: Trend</option>
            </Form.Select>
          </div>

          {/* Board */}
          <section className="mandi-board" aria-live="polite">
            {status === "loading" && (
              <div className="mandi-board-state">
                <Spinner animation="border" size="sm" className="me-2" />
                Reading today's board…
              </div>
            )}

            {status === "error" && (
              <div className="mandi-board-state is-error">
                <p>We couldn't reach the price board for {activeMandiLabel}.</p>
                <button
                  type="button"
                  className="mandi-retry"
                  onClick={() => load(activeMandi)}
                >
                  Try again
                </button>
              </div>
            )}

            {status === "empty" && (
              <div className="mandi-board-state">
                No rates posted for {activeMandiLabel} yet. Check back after
                the next update.
              </div>
            )}

            {status === "ready" && visibleCrops.length === 0 && (
              <div className="mandi-board-state">
                No crop matches "{search}" in {activeMandiLabel}.
              </div>
            )}

            {status === "ready" && visibleCrops.length > 0 && (
              <ul className="mandi-rows">
                {visibleCrops.map((crop) => {
                  const t = trendMeta(crop.trend);
                  return (
                    <li key={crop.id} className="mandi-row">
                      <div className="mandi-row-name">
                        <span className="mandi-row-hi">{crop.nameHi}</span>
                        {crop.nameEn && (
                          <span className="mandi-row-en">{crop.nameEn}</span>
                        )}
                      </div>

                      <div className="mandi-row-range">
                        {crop.priceMin && crop.priceMax
                          ? `₹${crop.priceMin.toLocaleString(
                              "en-IN"
                            )} – ₹${crop.priceMax.toLocaleString("en-IN")}`
                          : "Range unavailable"}
                      </div>

                      <div className="mandi-row-avg">
                        {crop.priceAvg
                          ? `₹${crop.priceAvg.toLocaleString("en-IN")}`
                          : "—"}
                        <span className="mandi-row-unit">/{crop.unit}</span>
                      </div>

                      <div className={"mandi-row-trend " + t.cls}>
                        <span aria-hidden="true">{t.symbol}</span> {t.word}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <p className="mandi-footnote">
            Prices are per quintal and update automatically from local mandi
            reports. Treat them as a guide — confirm the final rate at the
            mandi before you sell.
          </p>
        </Container>
      </div>
    </Layout>
  );
};

export default Market;