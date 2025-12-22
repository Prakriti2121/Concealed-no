import Link from "next/link";
import React from "react";

interface LinkElementProps {
  title?: string;
  link?: string;
}

const LinkElement: React.FC<LinkElementProps> = ({ title, link }) => {
  if (title && link) {
    return (
      <>
        &raquo;&nbsp;
        <Link href={`${link}/`} className="text-blue-600">
          <span>{title}</span>
        </Link>
      </>
    );
  } else if (title) {
    return <p className="text-black">&raquo;&nbsp; {title}</p>;
  } else {
    return null;
  }
};

interface BreadCrumbProps {
  title1?: string;
  link1?: string;
  title2?: string;
  link2?: string;
  title3?: string;
  link3?: string;
  title4?: string;
  link4?: string;
}

const BreadCrumb: React.FC<BreadCrumbProps> = ({
  title1,
  link1,
  title2,
  link2,
  title3,
  link3,
  title4,
  link4,
}) => {
  const breadcrumb = [
    { title: title1, link: link1 },
    { title: title2, link: link2 },
    { title: title3, link: link3 },
    { title: title4, link: link4 },
  ];

  return (
    <div className="text-[0.5rem] sm:text-xs md:text-sm my-1 lg:my-4 flex gap-1">
      <Link href="/" className="text-orange-600">
        Hjem
      </Link>
      {breadcrumb.map((crumb, index) => (
        <LinkElement key={index} title={crumb.title} link={crumb.link} />
      ))}
    </div>
  );
};

export default BreadCrumb;
