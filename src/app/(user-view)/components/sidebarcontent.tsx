"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SidebarContent() {
  return (
    <div className="w-full h-fit bg-background dark:bg-sidebar-background rounded-lg shadow-sm">
      <div className=" px-4 md:px-8">
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-medium mb-3 text-[#1D2939]">Meistä</h3>
          <div className="text-sm text-[#282828]">
            <p>
              Concealed Wines on viinintoimittaja Pohjoisen markkinoilla. Meidän
              tavoite on toimittaa loistoviinejä kuluttajilla. Tällä hetkellä
              myymme muutamia loistoviinejä Suomen markkinoilla ja samaan aikaan
              tuomme uusia viinejä markkinoille.
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Contact Information Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-base md:text-lg font-medium text-[#1D2939]">
              Concealed Wines Norway
            </h3>
          </div>

          <div className="space-y-5 text-sm text-[#282828]">
            <p className="font-medium text-[#1D2939]">Concealed Wines NUF (996 166 651)</p>

            <div className="flex items-start gap-2 text-[#282828]">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-[#282828]" />
              <div>
                <p>Ulvenveien 88 c/o Krogsvold Smith,</p>
                <p>0581 Oslo, Norway</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#282828]">
              <Phone className="h-4 w-4 flex-shrink-0 text-[#282828]" />
              <a
                href="tel:+4684102434"
                className="text-[#282828] hover:text-[#1D2939] transition-colors"
              >
                +46 8-410 244 34
              </a>
            </div>

            <div className="flex items-center gap-2 text-[#282828]">
              <Mail className="h-4 w-4 flex-shrink-0 text-[#282828]" />
              <a
                href="mailto:info@concealedwines.no"
                className="text-[#282828] hover:text-[#1D2939] transition-colors"
              >
                info@concealedwines.no
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
