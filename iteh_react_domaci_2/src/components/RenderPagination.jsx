import React from 'react'

const RenderPagination = ({pagination, currentPage, setCurrentPage}) => {
    const { lastPage } = pagination;
    const pageGroupSize = 7;

    const start = Math.floor((currentPage - 1) / pageGroupSize) * pageGroupSize + 1;
    const end = Math.min(start + pageGroupSize - 1, lastPage);
  
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{ fontWeight: currentPage === i ? 'bold' : 'normal',
            margin: '0 .5em',
            padding: '.5em 1em',
            border: currentPage === i ? 'none' : '.12em solid #8c8c8c',
            borderRadius: '.5em',
            backgroundColor: currentPage === i ? '#007bff' : '#fff',
            color: currentPage === i ? '#fff' : '#007bff',
            cursor: 'pointer',
            fontSize: currentPage === i ? '1.4em' : '1.2em',
            transition: 'all .4s' }}
        >
          {i}
        </button>
      );
    }
  
    return (
      <div style={{width: '80vw', height: 'auto', margin: '2em auto', display: 'flex', justifyContent: 'center', alignItems : 'center', flexWrap: 'wrap', flexDirection: 'row' }}>
        <div>{pages}</div>
      </div>
    );
}

export default RenderPagination
