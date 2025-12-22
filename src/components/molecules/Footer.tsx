"use client";
import Image from "next/image";
import Link from "next/link";

const PhoneIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const EmailIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LocationIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Footer = () => {
  const countries = [
    {
      name: "SWEDEN",
      company: "Concealed Wines AB (556770-1585)",
      address: "Bo Bergmans gata 14, 115 50 Stockholm",
      phone: "+46 8-410 244 34",
      email: "info@concealedwines.com",
      flag: "/images/country/sweden.png",
      url: "https://concealedwines.com",
    },
    {
      name: "NORWAY",
      company: "Concealed Wines NUF (996 166 651)",
      address: "Ulvenveien 88 c/o Krogsvold Smith, 0581 Oslo",
      phone: "+46 8-410 244 34",
      email: "info@concealedwines.no",
      flag: "/images/country/norway.png",
      url: "https://concealedwines.no",
    },

    {
      name: "FINLAND",
      company: "Concealed Wines OY (2506194-2)",
      address: "Närpesvägen 25 c/o Best bokföring, 64200 Närpes",
      phone: "+46 8-410 244 34",
      email: "info@concealedwines.fi",
      flag: "/images/country/finland.png",
      url: "https://concealedwines.fi",
    },
  ];

  return (
    <footer className="bg-white text-gray-800 shadow-md mt-24 sm:mt-32 md:mt-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Countries Section */}
        <div className="py-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-between lg:gap-12">
            {countries.map((country) => (
              <div key={country.name} className="w-full md:w-auto lg:w-64">
                {/* Country Header */}
                <div className="mb-4 flex gap-3">
                  <Link
                    href={country.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group shrink-0"
                  >
                    <div className="h-6 w-6 overflow-hidden rounded-full shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                      <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="flex-1">
                    <h3 className="text-lg leading-tight font-bold text-gray-900">
                      {country.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-600">
                      {country.company}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  {country.name === "SWEDEN" && (
                    <div className="space-y-2">
                      <div className="pl-6 text-sm text-gray-700">
                        Hovedkontor
                      </div>
                      <div className="flex items-start gap-2">
                        <LocationIcon className="text-[#e0944e] mt-0.5 h-4 w-4 shrink-0" />
                        <div className="text-sm text-gray-600">
                          {country.address}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <PhoneIcon className="text-[#e0944e] h-4 w-4 shrink-0" />
                    <Link
                      href={`tel:${country.phone}`}
                      className="hover:text-[#e0944e] text-sm text-gray-600 transition-colors duration-300"
                    >
                      {country.phone}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <EmailIcon className="text-[#e0944e] h-4 w-4 shrink-0" />
                    <Link
                      href={`mailto:${country.email}`}
                      className="hover:text-[#e0944e] text-sm break-all text-gray-600 transition-colors duration-300"
                    >
                      {country.email}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row sm:gap-4 md:gap-4">
            <div className="order-2 flex items-center gap-3 sm:order-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Stolt eier av</span>
                <Link
                  href="https://www.winetourism.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#e0944e] text-xs font-medium transition-colors duration-300 hover:text-[#c27e3e] hover:underline"
                >
                  WineTourism.com
                </Link>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <Image
                src="/images/logo/winetourismlogo.svg"
                alt="Wine Tourism"
                width={120}
                height={36}
                className="transition-transform duration-300 hover:scale-105"
                style={{ width: "auto", height: "36px" }}
              />
            </div>

            <div className="order-1 sm:order-2">
              <p className="text-center text-sm text-gray-600">
                © 2025 concealedwines.com - All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
