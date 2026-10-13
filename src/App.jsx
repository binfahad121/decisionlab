
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  LayoutDashboard,
  SlidersHorizontal,
  TrendingUp,
  DollarSign,
  RotateCcw,
  GitCompare,
  Lightbulb,
} from "lucide-react";
import "./index.css";

const initial = {
  price: 250,
  unitCost: 100,
  fixedCost: 20000,
  units: 400,
};

function calculate(data) {
  const revenue = data.price * data.units;
  const variableCost = data.unitCost * data.units;
  const totalCost = data.fixedCost + variableCost;
  const profit = revenue - totalCost;
  const contribution = data.price - data.unitCost;

  return {
    revenue,
    variableCost,
    totalCost,
    profit,
    margin: revenue > 0 ? (profit / revenue) * 100 : 0,
    breakEven:
      contribution > 0
        ? Math.ceil(data.fixedCost / contribution)
        : null,
  };
}

const money = (value) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [data, setData] = useState({ ...initial });
  const [baseline, setBaseline] = useState({ ...initial });
  const [activeTab, setActiveTab] = useState("overview");

  const results = calculate(data);
  const baseResults = calculate(baseline);

  function update(field, value) {
    setData((current) => ({
      ...current,
      [field]: Math.max(
        0,
        Math.min(10000000, Number(value) || 0)
      ),
    }));
  }

  function navigateTo(tab, sectionId) {
    setActiveTab(tab);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function reset() {
    setData({ ...initial });
    setBaseline({ ...initial });
    navigateTo("overview", "overview-section");
  }

  const chartData = [
    { name: "Revenue", amount: results.revenue },
    { name: "Total cost", amount: results.totalCost },
    { name: "Profit", amount: Math.max(0, results.profit) },
  ];

  let insight = "";

  if (data.price <= data.unitCost) {
    insight =
      "Your selling price does not exceed your unit cost. Change your price or unit cost to create a positive contribution per sale.";
  } else if (results.profit < 0) {
    const moreSales = Math.max(
      0,
      results.breakEven - data.units
    );

    insight =
      `Your business is below break-even. You need approximately ${moreSales.toLocaleString()} more sales at the current assumptions to break even.`;
  } else if (results.profit === 0) {
    insight = "Your business is exactly at break-even.";
  } else {
    insight =
      `Your business is profitable under these assumptions, with a ${results.margin.toFixed(1)}% profit margin.`;
  }

  const fields = [
    {
      key: "price",
      label: "Selling price per unit",
      min: 0,
      max: 10000,
      step: 10,
    },
    {
      key: "unitCost",
      label: "Cost per unit",
      min: 0,
      max: 10000,
      step: 10,
    },
    {
      key: "fixedCost",
      label: "Monthly fixed costs",
      min: 0,
      max: 1000000,
      step: 1000,
    },
    {
      key: "units",
      label: "Expected units sold",
      min: 0,
      max: 100000,
      step: 10,
    },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <h2>DecisionLab</h2>
            <span>BUSINESS SIMULATOR</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          <button
            type="button"
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() =>
              navigateTo("overview", "overview-section")
            }
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === "simulator" ? "active" : ""}`}
            onClick={() =>
              navigateTo("simulator", "simulator-section")
            }
          >
            <SlidersHorizontal size={18} />
            Simulator
          </button>

          <button
            type="button"
            className={`nav-item ${activeTab === "scenarios" ? "active" : ""}`}
            onClick={() =>
              navigateTo("scenarios", "scenario-section")
            }
          >
            <GitCompare size={18} />
            Scenarios
          </button>
        </nav>

        <div className="sidebar-bottom">
          <p>Built for better business decisions.</p>
          <span />
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar" id="overview-section">
          <div>
            <p className="eyebrow">BUSINESS INTELLIGENCE</p>
            <h1>Business overview</h1>
            <p className="subtitle">
              Explore how business decisions affect your results.
            </p>
          </div>

          <button
            type="button"
            className="button secondary"
            onClick={reset}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </header>

        <section className="metrics-grid">
          <Metric
            title="Monthly revenue"
            value={money(results.revenue)}
            icon={<DollarSign size={19} />}
            color="blue"
          />

          <Metric
            title="Monthly profit"
            value={money(results.profit)}
            icon={<TrendingUp size={19} />}
            color={results.profit >= 0 ? "green" : "red"}
          />

          <Metric
            title="Profit margin"
            value={`${results.margin.toFixed(1)}%`}
            icon={<LayoutDashboard size={19} />}
            color="purple"
          />

          <Metric
            title="Break-even units"
            value={
              results.breakEven === null
                ? "Not reachable"
                : results.breakEven.toLocaleString()
            }
            icon={<GitCompare size={19} />}
            color="orange"
          />
        </section>

        <section
          className="content-grid"
          id="simulator-section"
        >
          <div className="panel simulator-panel">
            <div className="panel-heading">
              <div>
                <h2>Business simulator</h2>
                <p>Adjust your assumptions below.</p>
              </div>
              <SlidersHorizontal size={21} />
            </div>

            {fields.map((field) => (
              <div className="field" key={field.key}>
                <div className="field-heading">
                  <label htmlFor={field.key}>
                    {field.label}
                  </label>
                  <strong>
                    {data[field.key].toLocaleString()}
                  </strong>
                </div>

                <input
                  id={field.key}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={data[field.key]}
                  onChange={(event) =>
                    update(field.key, event.target.value)
                  }
                />

                <input
                  className="number-input"
                  type="number"
                  min="0"
                  max="10000000"
                  value={data[field.key]}
                  onChange={(event) =>
                    update(field.key, event.target.value)
                  }
                />
              </div>
            ))}

            <div className="assumption-note">
              <strong>Assumption</strong>
              <p>
                Sales volume stays constant when you change price.
                Real demand may behave differently.
              </p>
            </div>
          </div>

          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h2>Financial overview</h2>
                <p>Monthly figures in BDT</p>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 15,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E8ECF3"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#667085" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 10, fill: "#667085" }}
                    axisLine={false}
                    tickLine={false}
                    width={55}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `${Math.round(value / 1000)}k`
                        : value
                    }
                  />

                  <Tooltip
                    formatter={(value) => money(value)}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E4E7EC",
                    }}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#6657e8"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="result-list">
              <div>
                <span>Variable costs</span>
                <strong>{money(results.variableCost)}</strong>
              </div>

              <div>
                <span>Total costs</span>
                <strong>{money(results.totalCost)}</strong>
              </div>

              <div>
                <span>Profit / loss</span>
                <strong
                  className={
                    results.profit < 0 ? "negative" : "positive"
                  }
                >
                  {money(results.profit)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="bottom-grid"
          id="scenario-section"
        >
          <div className="panel insight-panel">
            <div className="insight-icon">
              <Lightbulb size={22} />
            </div>

            <div>
              <h2>Decision insight</h2>
              <p>{insight}</p>
            </div>
          </div>

          <div className="panel scenario-panel">
            <div className="panel-heading">
              <div>
                <h2>Scenario comparison</h2>
                <p>
                  Save your current assumptions as the baseline.
                </p>
              </div>
            </div>

            <div className="scenario-values">
              <div>
                <span>Baseline profit</span>
                <strong>{money(baseResults.profit)}</strong>
              </div>

              <div>
                <span>Current profit</span>
                <strong>{money(results.profit)}</strong>
              </div>
            </div>

            <p className="scenario-change">
              Difference:{" "}
              {money(results.profit - baseResults.profit)}
            </p>

            <button
              type="button"
              className="button primary full-button"
              onClick={() => setBaseline({ ...data })}
            >
              <GitCompare size={16} />
              Save current as baseline
            </button>
          </div>
        </section>

        <footer>
          <span>
            DecisionLab · Business simulation for learning
          </span>
          <span>
            Results depend on the assumptions entered.
          </span>
        </footer>
      </main>
    </div>
  );
}

function Metric({ title, value, icon, color }) {
  return (
    <div className="panel metric-card">
      <div className={`metric-icon ${color}`}>{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default App;
