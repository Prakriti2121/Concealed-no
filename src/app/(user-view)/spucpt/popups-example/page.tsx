import React from "react";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../components/sidebarcontent";
import { Button } from "@/components/ui/button";

export default function PopupsExamplePage() {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <BreadCrumb title1="Spucpt" title2="Popups Example" />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4 sm:mt-6">
          {/* Main Content */}
          <div className="w-full lg:flex-1">
          <article className="bg-card rounded-lg shadow p-4 sm:p-6 flex items-center justify-center min-h-[400px] sm:min-h-[500px]">
            {/* Age Verification Popup */}
            <div className="max-w-md w-full border rounded-lg bg-background p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                Tervetuliaistoivotus!
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground">
                Sivusto on tarkoitettu vain 18-vuotta täyttäneille.
              </p>

              <Button className="w-full font-semibold py-4 sm:py-5 text-sm sm:text-base">
                Olen 18 vuotta tai vanhempi
              </Button>
            </div>
          </article>
        </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
            <SidebarContent />
          </aside>
        </div>
      </div>
    </div>
  );
}
