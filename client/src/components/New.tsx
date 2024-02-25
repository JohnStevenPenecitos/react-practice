// import React from 'react'

import { useEffect } from "react";

interface Props {
  title: string;
}

function New({title}: Props) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "Default Title";
    };
  }, [title]);
  return <div>New</div>;
}

export default New;
