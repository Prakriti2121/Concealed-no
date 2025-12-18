export const navSchema = {
  "@context": "http://schema.org",
  "@type": "SiteNavigationElement",
  name: "Navigation Menu",
  hasPart: [
    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/#about",
      name: "Home",
      url: "https://www.concealed-wines.fi/#about",
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/yrityksen-profiili/",
      name: "Company Profile",
      url: "https://www.concealed-wines.fi/yrityksen-profiili/",
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/tiimimme/",
      name: "Our Teams",
      url: "https://www.concealed-wines.fi/tiimimme/",
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/viinit-luettelo/",
      name: "Wines",
      url: "https://www.concealed-wines.fi/viinit-luettelo/",
    },

    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/ota-yhteytta/",
      name: "Contact Us",
      url: "https://www.concealed-wines.fi/ota-yhteytta/",
    },
    {
      "@type": "SiteNavigationElement",
      "@id": "https://www.concealed-wines.fi/in-english/",
      name: "In English",
      url: "https://www.concealed-wines.fi/in-english/",
    },
  ],
};

export const menu = [
  {
    id: "home",
    label: "Home",
    uri: "/#about",
    parentId: null,
  },
  {
    id: "about-us",
    label: "About Us",
    uri: "#about",
    parentId: null,
    childItems: {
      nodes: [
        {
          id: "company-profile",
          label: "Company Profile",
          uri: "/yrityksen-profiili",
        },
        {
          id: "our-team",
          label: "Our Teams",
          uri: "/tiimimme",
        },
      ],
    },
  },
  {
    id: "wines",
    label: "Wines",
    uri: "/viinit-luettelo",
    parentId: null,
  },

  {
    id: "contact-us",
    label: "Contact Us",
    uri: "/ota-yhteytta",
    parentId: null,
  },
  {
    id: "in-english",
    label: "In English",
    uri: "/in-english",
    parentId: null,
  },
];

export const footerMenu = [
  {
    id: "privacy-policy",
    label: "Tietosuojaseloste",
    uri: "/tietosuojaseloste",
  },
  {
    id: "contact",
    label: "Yhteystiedot",
    uri: "/ota-yhteytta",
  },
];

export const companyInfo = {
  name: "Concealed Wines",
  tagline: "Ainutlaatuisia viinejä suurilta tuottajilta",
  description:
    "Concealed Wines on vakiintunut viinien ja väkevien alkoholijuomien tuoja Ruotsin markkinoilla. Tuonnin ja jakelun lisäksi Ruotsissa, pyöritämme liiketoimintaa myös Norjassa ja Suomessa.",
  foundedYear: 2010,
  locations: {
    sweden: {
      name: "Sweden",
      company: "Concealed Wines AB (556770-1585)",
      address: "Bo Bergmans gata 14, 115 50",
      city: "Stockholm, Sweden",
      phone: "+46 8-410 244 34",
    },
    norway: {
      name: "Norway",
      company: "Concealed Wines NUF (996 166 651)",
      address: "Ulvenveien 88 c/o Krogsvold Smith",
      city: "0581 Oslo, Norway",
      phone: "+46 8-410 244 34",
    },
    finland: {
      name: "Finland",
      company: "Concealed Wines OY (2506194-2)",
      address: "Närpesvägen 25 c/o Best bokföring",
      city: "64200 Närpes, Finland",
      phone: "+46 8-410 244 34",
    },
  },
};

export const teamMembers = [
  {
    id: "calle-nilsson",
    name: "Calle Nilsson",
    position: "Markkinointi ja liiketoiminnan hallinto",
    image: "/team/calle-nilsson.webp",
    description:
      "Koulutukseltaan markkinoinnin ja johtamisen maisteri Skotlannin St Andrewsin yliopistosta vuodelta 2007. Callella on aiempaa kokemusta IT- ja markkinointisektorilta, mutta hän on myös työskennellyt osa-aikaisesti hotelli- ja ravintola-alalla 8 vuoden ajan. Calle on erittäin innokas yrittäjä, joka tuo intoa Concealed Wines -tiimiin. Calle pitää yhteydenpidosta Concealed Wines -työn tukijoihin.",
    education: "Maisterin tutkinto, St Andrewsin yliopisto, Skotlanti (2007)",
    expertise: ["Markkinointi", "Johtaminen", "Liiketoiminnan hallinto"],
  },
];

export const aboutItems = [
  {
    id: 1,
    title: "Meidän visiomme",
    description:
      "Olla johtava viinin jakelija kaikkialla Pohjoismaissa, tunnettu poikkeuksellisesta laadusta ja palvelusta.",
    icon: "/icons/vision.webp",
  },
  {
    id: 2,
    title: "Meidän tehtävämme",
    description:
      "Yhdistää viinintuottajat pohjoismaisiin markkinoihin innovatiivisten ja kestävien tuontiratkaisujen kautta.",
    icon: "/icons/mission.webp",
  },
  {
    id: 3,
    title: "Arvomme",
    description:
      "Laatu, läpinäkyvyys ja kumppanuus kaikessa mitä teemme tarjotaksemme poikkeuksellisia viinikokemuksia.",
    icon: "/icons/values.webp",
  },
];

export const GLOBAL_BLUR_DATA_URL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.concealed-wines.fi/#organization",
      name: "Concealed Wines",
      url: "https://www.concealed-wines.fi",
      sameAs: ["https://www.linkedin.com/company/concealed-wines/"],
      logo: {
        "@type": "ImageObject",
        "@id": "https://www.concealed-wines.fi/#logo",
        url: "https://www.concealed-wines.fi/concealedlogo.webp",
        contentUrl: "https://www.concealed-wines.fi/concealedlogo.webp",
        caption: "Concealed Wines",
        inLanguage: "fi-FI",
      },
      description:
        "Concealed Wines on vakiintunut viinien ja väkevien alkoholijuomien tuoja Ruotsin markkinoilla. Tuonnin ja jakelun lisäksi Ruotsissa, pyöritämme liiketoimintaa myös Norjassa ja Suomessa.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.concealed-wines.fi/#website",
      url: "https://www.concealed-wines.fi",
      name: "Concealed Wines",
      publisher: {
        "@id": "https://www.concealed-wines.fi/#organization",
      },
      inLanguage: "fi-FI",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.concealed-wines.fi/yrityksen-profiili/#webpage",
      url: "https://www.concealed-wines.fi/yrityksen-profiili/",
      name: "Tietoja Concealed Wines | Concealed Wines",
      datePublished: "2010-01-01T12:00:00+01:00",
      dateModified: "2025-05-12T07:00:00+01:00",
      isPartOf: {
        "@id": "https://www.concealed-wines.fi/#website",
      },
      inLanguage: "fi-FI",
    },
    {
      "@type": "Article",
      headline:
        "Tietoja Concealed Wines | Luotettava kumppanisi hienojen viinien tuonnissa ja jakelussa kaikkialla Pohjoismaissa vuodesta 2010",
      keywords: "viini, tuonti, jakelu, pohjoismaat",
      datePublished: "2010-01-01T12:00:00+01:00",
      dateModified: "2025-05-12T07:00:00+01:00",
      author: {
        "@type": "Organization",
        name: "Concealed Wines",
      },
      publisher: {
        "@id": "https://www.concealed-wines.fi/#organization",
      },
      description:
        "Concealed Wines on vakiintunut viinien ja väkevien alkoholijuomien tuoja Ruotsin markkinoilla. Tuonnin ja jakelun lisäksi Ruotsissa, pyöritämme liiketoimintaa myös Norjassa ja Suomessa.",
      name: "Tietoja Concealed Wines | Concealed Wines",
      "@id": "https://www.concealed-wines.fi/yrityksen-profiili/#richSnippet",
      isPartOf: {
        "@id": "https://www.concealed-wines.fi/yrityksen-profiili/#webpage",
      },
      inLanguage: "fi-FI",
      mainEntityOfPage: {
        "@id": "https://www.concealed-wines.fi/yrityksen-profiili/#webpage",
      },
    },
  ],
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.concealed-wines.fi/tiimimme/calle-nilsson/",
  name: "Calle Nilsson",
  jobTitle: "Markkinointi ja liiketoiminnan hallinto",
  description:
    "Koulutukseltaan markkinoinnin ja johtamisen maisteri Skotlannin St Andrewsin yliopistosta vuodelta 2007. Callella on aiempaa kokemusta IT- ja markkinointisektorilta, mutta hän on myös työskennellyt osa-aikaisesti hotelli- ja ravintola-alalla 8 vuoden ajan. Calle on erittäin innokas yrittäjä, joka tuo intoa Concealed Wines -tiimiin. Calle pitää yhteydenpidosta Concealed Wines -työn tukijoihin.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of St Andrews",
    location: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "Scotland",
      },
    },
  },
  image: "https://www.concealed-wines.fi/team/calle-nilsson.webp",
  worksFor: {
    "@type": "Organization",
    name: "Concealed Wines",
    url: "https://www.concealed-wines.fi",
  },
  url: "https://www.concealed-wines.fi/tiimimme/calle-nilsson/",
};
