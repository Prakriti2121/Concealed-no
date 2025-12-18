import React from "react";

const Container = ({ children }: React.PropsWithChildren) => {
  return <div className="container mx-auto px-4 max-w-7xl overflow-x-hidden w-full">{children}</div>;
};

export default Container;
