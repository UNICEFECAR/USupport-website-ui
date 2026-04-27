const dashboardData = {
  usage: {
    label: "Usage",
    title: "The pilot reached young people and showed repeat engagement and continued use.",
    body:
      "Sessions booked outnumber unique clients, which suggests repeat engagement rather than one-off trial use. For an early pilot, this is an encouraging signal of trust and willingness to re-engage with support.",
    note: "Average booked sessions per client = 1.83.",
    max: 140,
    items: [
      {
        label: "Booked sessions",
        value: 126,
        display: "126",
        color: "#f28c28",
        context:
          "This is the total amount of appointment demand captured during the pilot period.",
      },
      {
        label: "Unique clients",
        value: 69,
        display: "69",
        color: "#f4c542",
        context:
          "The platform reached 69 distinct young people, giving the pilot a reasonably broad user base.",
      },
      {
        label: "Valid attended sessions with feedback",
        value: 63,
        display: "63",
        color: "#f6a04d",
        context:
          "These are the sessions supporting the perception, outcome, and safety findings shown elsewhere in the dashboard.",
      },
    ],
  },
  experience: {
    label: "Perception",
    title: "Service experience is strong, and the outcome pattern looks credible.",
    body:
      "Satisfaction and needs-addressed scores are high, while wellbeing and emotional lift remain positive without looking inflated. That balance strengthens confidence in the findings.",
    note: "All values in this view are percentages based on 63 feedback sessions.",
    max: 100,
    items: [
      {
        label: "Satisfied or very satisfied",
        value: 93.7,
        display: "93.7%",
        color: "#f28c28",
        context:
          "This is the clearest signal that users felt the service experience met expectations.",
      },
      {
        label: "Needs addressed (score 8 to 10)",
        value: 88.9,
        display: "88.9%",
        color: "#f4c542",
        context:
          "Young people largely felt the session answered the issue or need that brought them to the platform.",
      },
      {
        label: "Wellbeing improved",
        value: 71.4,
        display: "71.4%",
        color: "#ef9f36",
        context:
          "A strong majority reported an improvement in wellbeing after the session.",
      },
      {
        label: "Immediate positive change in feelings",
        value: 61.9,
        display: "61.9%",
        color: "#ffd166",
        context:
          "Immediate emotional uplift is meaningful, while still leaving room for longer-term support needs.",
      },
      {
        label: "Dissatisfied",
        value: 0,
        display: "0%",
        color: "#d7dee3",
        context:
          "Zero dissatisfied responses is notable and should be monitored over time as the sample grows.",
      },
    ],
  },
  safety: {
    label: "Safety",
    title: "Safety signals are clean, with only a few low-level boundary flags.",
    body:
      "No sessions reported feeling unsafe or identity coercion. The flagged issues were limited to one contact disclosure and two suggestions to meet outside the platform.",
    note: "Safety rates are calculated from 63 valid attended sessions with feedback.",
    max: 8,
    items: [
      {
        label: "Any boundary issue flag",
        value: 4.8,
        display: "4.8%",
        color: "#f28c28",
        context:
          "Three total flags across 63 sessions indicates boundary issues were rare, though still important to monitor closely.",
      },
      {
        label: "Suggestion to meet outside platform",
        value: 3.2,
        display: "3.2%",
        color: "#f4c542",
        context:
          "Two sessions included an off-platform meeting suggestion, which should remain a clear provider compliance watchpoint.",
      },
      {
        label: "Contact disclosure",
        value: 1.6,
        display: "1.6%",
        color: "#ffd166",
        context:
          "One session involved contact disclosure, indicating a boundary breach but still at very low frequency.",
      },
      {
        label: "Unsafe feeling",
        value: 0,
        display: "0%",
        color: "#d7dee3",
        context:
          "No respondent reported feeling unsafe, which is the strongest child protection signal in the dataset.",
      },
      {
        label: "Identity coercion",
        value: 0,
        display: "0%",
        color: "#d7dee3",
        context:
          "There were no identity coercion reports in the pilot sample.",
      },
    ],
  },
};

const safetyFlags = [
  { label: "Identity coercion", count: 0, percent: 0 },
  { label: "Unsafe feeling", count: 0, percent: 0 },
  { label: "Contact disclosure", count: 1, percent: 1.6 },
  { label: "Suggestion to meet outside platform", count: 2, percent: 3.2 },
];

function formatNumber(value, decimals = 0) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function animateMetric(element) {
  const target = Number(element.dataset.target || 0);
  const decimals = Number(element.dataset.decimals || 0);
  const suffix = decimals > 0 || target % 1 !== 0 ? "%" : "";
  if (element.classList.contains("score-number")) {
    element.textContent = formatNumber(target, decimals);
    return;
  }

  element.dataset.suffix = suffix;
  const duration = 1100;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    element.textContent = formatNumber(current, decimals);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = formatNumber(target, decimals);
    }
  }

  requestAnimationFrame(frame);
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-target]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        animateMetric(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function updateContext(view, item) {
  const config = dashboardData[view];
  const kicker = document.getElementById("contextKicker");
  const title = document.getElementById("contextTitle");
  const body = document.getElementById("contextBody");
  const note = document.getElementById("contextNote");

  kicker.textContent = config.label;
  title.textContent = item ? item.label : config.title;
  body.textContent = item ? item.context : config.body;
  note.textContent = config.note;
}

function renderChart(view) {
  const config = dashboardData[view];
  const chart = document.getElementById("mainChart");
  chart.innerHTML = "";

  config.items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const header = document.createElement("div");
    header.className = "bar-header";
    header.innerHTML = `
      <span class="bar-label">${item.label}</span>
      <span class="bar-value">${item.display}</span>
    `;

    const track = document.createElement("div");
    track.className = "bar-track";

    const fill = document.createElement("button");
    fill.type = "button";
    fill.className = "bar-fill";
    fill.style.background = `linear-gradient(90deg, ${item.color}, ${item.color}cc)`;
    fill.setAttribute("aria-label", `${item.label}: ${item.display}`);

    const width = Math.max((item.value / config.max) * 100, item.value === 0 ? 2 : 0);
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = `${Math.min(width, 100)}%`;
      }, index * 80);
    });

    ["mouseenter", "focus", "click"].forEach((eventName) => {
      fill.addEventListener(eventName, () => updateContext(view, item));
    });

    track.appendChild(fill);

    const subtext = document.createElement("p");
    subtext.className = "bar-subtext";
    subtext.textContent = item.context;

    row.appendChild(header);
    row.appendChild(track);
    row.appendChild(subtext);
    chart.appendChild(row);
  });

  updateContext(view, null);
}

function setupViewSwitcher() {
  const buttons = document.querySelectorAll(".segmented-button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((candidate) => {
        candidate.classList.remove("is-active");
        candidate.setAttribute("aria-pressed", "false");
      });
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      renderChart(button.dataset.view);
    });
  });
}

function setupDonuts() {
  const donuts = document.querySelectorAll(".donut");
  donuts.forEach((donut) => {
    const percent = Number(donut.dataset.percent || 0);
    const color = donut.dataset.color || "#1cabe2";
    donut.style.setProperty("--percent", percent);
    donut.style.setProperty("--color", color);
    donut.dataset.display = `${formatNumber(percent, 1)}%`;
  });
}

function renderSafetyList() {
  const list = document.getElementById("safetyList");
  list.innerHTML = "";

  safetyFlags.forEach((flag, index) => {
    const item = document.createElement("div");
    item.className = "safety-item";

    item.innerHTML = `
      <div class="safety-item-header">
        <span>${flag.label}</span>
        <span>${flag.count} flag${flag.count === 1 ? "" : "s"} | ${formatNumber(flag.percent, 1)}%</span>
      </div>
      <div class="safety-item-track">
        <div class="safety-item-fill"></div>
      </div>
    `;

    list.appendChild(item);

    const fill = item.querySelector(".safety-item-fill");
    const width = Math.max(flag.percent * 12, flag.percent === 0 ? 0 : 10);
    requestAnimationFrame(() => {
      setTimeout(() => {
        fill.style.width = `${Math.min(width, 100)}%`;
      }, index * 90);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCounters();
  setupViewSwitcher();
  setupDonuts();
  renderChart("usage");
  renderSafetyList();
});
