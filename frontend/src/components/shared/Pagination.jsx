const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-4 mt-10">
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 sm:px-4 py-2 rounded-xl bg-slate-50 border border-blue-100 text-gray-600
                     hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all text-sm flex items-center justify-center gap-1"
        >
          <span>&larr;</span> <span className="hidden sm:inline">Prev</span>
        </button>

        {}
        <span className="sm:hidden text-sm text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>

        {}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="sm:hidden px-3 py-2 rounded-xl bg-slate-50 border border-blue-100 text-gray-600
                     hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all text-sm flex items-center justify-center gap-1"
        >
          <span>&rarr;</span>
        </button>
      </div>

      {}
      <div className="hidden sm:flex items-center gap-2">
        {getPageNumbers().map((p, idx) => (
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-9 text-center text-gray-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all
                ${page === p
                  ? 'bg-primary-500 text-white border border-primary-500 shadow-sm shadow-primary-500/20'
                  : 'bg-slate-50 border border-blue-100 text-gray-600 hover:bg-blue-50'
                }`}
            >
              {p}
            </button>
          )
        ))}
      </div>

      {}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-50 border border-blue-100 text-gray-600
                   hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all text-sm items-center justify-center gap-1"
      >
        <span>Next</span> <span>&rarr;</span>
      </button>
    </div>
  );
};

export default Pagination;
