const palette = {
  navy: "#000080",
  blue: "#1084d0",
  teal: "#008080",
  silver: "#c0c0c0",
  light: "#ffffff",
  gray: "#808080",
  dark: "#000000",
  yellow: "#ffff00",
  gold: "#d6b64c",
  red: "#c00000",
  green: "#008000",
};

export default function Win98Icon({ type = "app", size = 32, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    className: `win98-icon ${className}`,
    "aria-hidden": true,
    shapeRendering: "crispEdges",
  };

  if (type === "computer") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="24" height="17" fill={palette.silver} stroke={palette.dark} />
        <rect x="5" y="5" width="20" height="12" fill={palette.navy} />
        <rect x="7" y="7" width="16" height="8" fill={palette.blue} />
        <rect x="11" y="20" width="8" height="3" fill={palette.gray} stroke={palette.dark} />
        <rect x="7" y="23" width="16" height="3" fill={palette.silver} stroke={palette.dark} />
        <rect x="24" y="21" width="5" height="7" fill={palette.silver} stroke={palette.dark} />
        <rect x="25" y="22" width="3" height="1" fill={palette.green} />
      </svg>
    );
  }

  if (type === "book") {
    return (
      <svg {...common}>
        <path d="M3 6h11c3 0 4 2 4 4v16c-1-2-3-3-5-3H3z" fill={palette.light} stroke={palette.dark} />
        <path d="M29 6H18v20c1-2 3-3 5-3h6z" fill="#fff7c2" stroke={palette.dark} />
        <rect x="6" y="9" width="7" height="1" fill={palette.blue} />
        <rect x="6" y="12" width="7" height="1" fill={palette.gray} />
        <rect x="6" y="15" width="6" height="1" fill={palette.gray} />
        <rect x="20" y="9" width="6" height="1" fill={palette.blue} />
        <rect x="20" y="12" width="6" height="1" fill={palette.gray} />
        <rect x="20" y="15" width="6" height="1" fill={palette.gray} />
      </svg>
    );
  }

  if (type === "report") {
    return (
      <svg {...common}>
        <rect x="5" y="2" width="22" height="28" fill={palette.light} stroke={palette.dark} />
        <rect x="8" y="5" width="16" height="3" fill={palette.blue} />
        <rect x="9" y="21" width="3" height="5" fill={palette.green} />
        <rect x="14" y="16" width="3" height="10" fill={palette.gold} />
        <rect x="19" y="11" width="3" height="15" fill={palette.red} />
        <rect x="8" y="26" width="16" height="1" fill={palette.dark} />
      </svg>
    );
  }

  if (type === "models") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="24" height="24" fill={palette.silver} stroke={palette.dark} />
        <rect x="8" y="8" width="16" height="16" fill={palette.navy} stroke={palette.light} />
        <rect x="11" y="11" width="4" height="4" fill={palette.yellow} />
        <rect x="17" y="11" width="4" height="4" fill={palette.green} />
        <rect x="11" y="17" width="4" height="4" fill={palette.red} />
        <rect x="17" y="17" width="4" height="4" fill={palette.blue} />
        {[6,10,14,18,22,26].map((x) => <rect key={`t${x}`} x={x} y="1" width="1" height="3" fill={palette.dark} />)}
        {[6,10,14,18,22,26].map((x) => <rect key={`b${x}`} x={x} y="28" width="1" height="3" fill={palette.dark} />)}
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="24" height="27" fill={palette.light} stroke={palette.dark} />
        <rect x="6" y="5" width="20" height="4" fill={palette.navy} />
        <circle cx="11" cy="15" r="4" fill="#e8b58b" stroke={palette.dark} />
        <path d="M6 25c0-4 2-6 5-6s5 2 5 6" fill={palette.blue} stroke={palette.dark} />
        <rect x="18" y="13" width="6" height="1" fill={palette.gray} />
        <rect x="18" y="16" width="6" height="1" fill={palette.gray} />
        <rect x="18" y="19" width="5" height="1" fill={palette.gray} />
      </svg>
    );
  }

  if (type === "key") {
    return (
      <svg {...common}>
        <circle cx="10" cy="11" r="6" fill={palette.gold} stroke={palette.dark} />
        <circle cx="10" cy="11" r="2" fill={palette.light} stroke={palette.dark} />
        <path d="M14 15l13 13h-5l-2-2-2 2-3-3 2-2-5-5z" fill={palette.gold} stroke={palette.dark} />
      </svg>
    );
  }

  if (type === "logout") {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="15" height="26" fill="#a65f2d" stroke={palette.dark} />
        <rect x="8" y="6" width="9" height="20" fill="#7b3f1d" />
        <circle cx="15" cy="16" r="1" fill={palette.yellow} />
        <path d="M18 12h10v-4l4 8-4 8v-4H18z" fill={palette.blue} stroke={palette.dark} />
      </svg>
    );
  }

  if (type === "folder") {
    return (
      <svg {...common}>
        <path d="M2 8h11l3 3h14v17H2z" fill={palette.gold} stroke={palette.dark} />
        <path d="M2 11h28v4H2z" fill="#ffe680" stroke={palette.dark} />
      </svg>
    );
  }

  if (type === "history") {
    return (
      <svg {...common}>
        <rect x="5" y="3" width="22" height="26" fill={palette.light} stroke={palette.dark} />
        <rect x="8" y="7" width="16" height="1" fill={palette.navy} />
        <rect x="8" y="11" width="16" height="1" fill={palette.gray} />
        <rect x="8" y="15" width="16" height="1" fill={palette.gray} />
        <rect x="8" y="19" width="16" height="1" fill={palette.gray} />
        <rect x="8" y="23" width="11" height="1" fill={palette.gray} />
      </svg>
    );
  }

  if (type === "info") {
    return (
      <svg {...common}>
        <circle cx="16" cy="16" r="13" fill={palette.blue} stroke={palette.dark} />
        <rect x="15" y="13" width="3" height="10" fill={palette.light} />
        <rect x="15" y="8" width="3" height="3" fill={palette.light} />
      </svg>
    );
  }

  if (type === "warning") {
    return (
      <svg {...common}>
        <path d="M16 3L30 28H2z" fill={palette.yellow} stroke={palette.dark} />
        <rect x="15" y="11" width="3" height="9" fill={palette.dark} />
        <rect x="15" y="23" width="3" height="3" fill={palette.dark} />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="4" y="4" width="24" height="24" fill={palette.silver} stroke={palette.dark} />
      <rect x="8" y="8" width="16" height="16" fill={palette.blue} />
    </svg>
  );
}
