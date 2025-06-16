import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const paths: string[] = pathname.split('/').filter(p => p);
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb m-3">
        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
        {paths.map((p: string, idx: number) => {
          const url = '/' + paths.slice(0, idx + 1).join('/');
          return (
            <li key={idx} className="breadcrumb-item">
              <Link to={url}>{p}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
